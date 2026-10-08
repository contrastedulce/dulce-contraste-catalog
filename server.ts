import express from "express"; // Server restart forced: cake de manzana y subrecetas sync v2
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { GoogleGenAI } from "@google/genai";
import { exec, execSync } from "child_process";
import dotenv from "dotenv";
import os from "os";



dotenv.config({ override: true });

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const localIP = getLocalIP();
const getGeminiKeys = () => {
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return [];
    const content = fs.readFileSync(envPath, "utf-8");
    const line = content.split("\n").find(l => l.trim().startsWith("GEMINI_API_KEY="));
    if (!line) return [];
    return line.split("=")[1].trim().replace(/^["']|["']$/g, '').split(",").map(k => k.trim()).filter(k => k);
  } catch (e) {
    console.error("Error reading GEMINI_API_KEY from .env:", e);
    return [];
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants for prompt optimization
const CONVERSION_TABLE = `
TABLA DE CONVERSIÓN DE MEDIDAS (Estándar Dulce Contraste):
- Aceite vegetal: 1 taza = 250 ml
- Leche fresca / UHT: 1 taza = 250 ml
- Crema de leche: 1 taza = 250 ml
- Agua / Caldo / Café: 1 taza = 250 ml
- Vino / Licores: 1 onza = 30 ml
- Vinagre blanco: 1 cdta = 5 ml
- Esencia de Vainilla: 1 cdta = 5 ml
- Harina (sin preparar/todo uso): 1 taza = 125 g
- Azúcar blanca: 1 taza = 200 g
- Azúcar rubia: 1 taza = 220 g
- Cocoa / Cacao: 1 taza = 100 g
- Azúcar en polvo: 1 taza = 120 g
- Maicena: 1 cda = 8 g
- Polvo de hornear: 1 cdta = 5 g
- Bicarbonato: 1 cdta = 5 g
- Sal: 1 cdta = 5 g
- Canela molida: 1 cda = 8 g
- Leche Condensada: 1 lata = 393 g
- Leche Evaporada Gloria: 1 lata = 390 g
- Mantequilla: 1 cda = 15 g
- Ajo molido / Ají amarillo: 1 cda = 15 g
- Queso rallado: 1 taza = 100 g
- Pecanas picadas: 1 taza = 100 g
`;

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000");

  app.use(express.json({ limit: '10mb' }));
  
  // Debugging middleware
  app.use((req, res, next) => {
    if (req.url.startsWith('/api/ai')) {
      console.log(`[V8] ${new Date().toISOString()} - AI Request: ${req.url}`);
    } else {
      console.log(`[V8] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    }
    next();
  });

  const DB_FILE = path.join(process.cwd(), "db.json");

  // Load database from file or initialize
  let db = {
    supplies: [],
    equipment: [],
    recipes: [],
    products: [],
    orders: [],
    finances: [],
    purchases: [],
    mappings: [],
    settings: null
  };

  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    } catch (e) {
      console.error("Error loading DB file, using defaults", e);
    }
  }

  const getGitCommand = (): string => {
    try {
      execSync("git --version", { stdio: 'ignore' });
      return "git";
    } catch (e) {
      const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
      const githubDesktopPath = path.join(localAppData, 'GitHubDesktop');
      if (fs.existsSync(githubDesktopPath)) {
        try {
          const apps = fs.readdirSync(githubDesktopPath).filter(f => f.startsWith('app-'));
          apps.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
          if (apps.length > 0) {
            const gitPath = path.join(githubDesktopPath, apps[0], 'resources', 'app', 'git', 'cmd', 'git.exe');
            if (fs.existsSync(gitPath)) {
              return `"${gitPath}"`;
            }
          }
        } catch (err) {
          console.error("Error detecting GitHub Desktop git:", err);
        }
      }
    }
    return "git";
  };

  // ============================================================
  //  PUBLICACIÓN DEL CATÁLOGO EN GITHUB (silenciosa)
  //  - NUNCA abre ventanas de Git Credential Manager ni pide usuario/contraseña
  //  - Solo publica el archivo generado del catálogo, no todo el proyecto
  //  - Espera un tiempo mínimo entre publicaciones para no saturar el historial
  //  Se puede desactivar por completo con la variable DISABLE_GIT_SYNC=1
  // ============================================================
  const CATALOGO_ARCHIVO = path.join('src', 'constants', 'initialData.ts');
  const INTERVALO_MINIMO_PUBLICACION = 2 * 60 * 1000; // 2 minutos
  const PUBLICACION_ACTIVA = process.env.DISABLE_GIT_SYNC !== '1';

  const ENV_GIT_SILENCIOSO: NodeJS.ProcessEnv = {
    ...process.env,
    GIT_TERMINAL_PROMPT: '0',   // Jamás pedir credenciales por consola
    GCM_INTERACTIVE: 'never',   // Jamás abrir la ventana de Git Credential Manager
    GCM_GUI_PROMPT: 'false',
    GIT_ASKPASS: 'echo',
    SSH_ASKPASS: 'echo',
    VS_GIT_CREDENTIAL_PROMPT: 'never'
  };

  let publicando = false;
  let publicacionPendiente = false;
  let ultimaPublicacion = 0;
  let temporizadorPublicacion: NodeJS.Timeout | null = null;

  const publicarCatalogo = () => {
    if (!PUBLICACION_ACTIVA) return;

    if (publicando) {
      publicacionPendiente = true; // se reintenta al terminar la actual
      return;
    }

    const desdeUltima = Date.now() - ultimaPublicacion;
    if (desdeUltima < INTERVALO_MINIMO_PUBLICACION) {
      // Todavía es muy pronto: se agenda para el final del intervalo
      if (!temporizadorPublicacion) {
        temporizadorPublicacion = setTimeout(() => {
          temporizadorPublicacion = null;
          publicarCatalogo();
        }, INTERVALO_MINIMO_PUBLICACION - desdeUltima);
      }
      return;
    }

    publicando = true;
    ultimaPublicacion = Date.now();
    const gitCmd = getGitCommand();

    exec('node sync-data.cjs', { env: ENV_GIT_SILENCIOSO, windowsHide: true }, (syncErr) => {
      if (syncErr) {
        console.error(`⚠️ No se pudo generar el catálogo: ${syncErr.message}`);
        publicando = false;
        return;
      }

      // Solo se revisa el archivo del catálogo, no todo el proyecto
      exec(`${gitCmd} status --porcelain -- "${CATALOGO_ARCHIVO}"`, { env: ENV_GIT_SILENCIOSO, windowsHide: true }, (statusErr, stdout) => {
        if (statusErr || !stdout.trim()) {
          console.log('ℹ️ Catálogo sin cambios: no hay nada que publicar.');
          publicando = false;
          return;
        }

        const commitYpush =
          `${gitCmd} add "${CATALOGO_ARCHIVO}" && ` +
          `${gitCmd} commit -m "Auto-update catalog data" && ` +
          `${gitCmd} push`;

        exec(commitYpush, { env: ENV_GIT_SILENCIOSO, windowsHide: true, timeout: 120000 }, (error, _stdout, stderr) => {
          if (error) {
            // Falla en silencio: NO se abre ninguna ventana ni se interrumpe la app.
            console.warn(`⚠️ Catálogo no publicado (revisa las credenciales de GitHub): ${(stderr || error.message || '').toString().split('\n')[0]}`);
          } else {
            console.log('✅ Catálogo publicado en GitHub correctamente.');
          }
          publicando = false;
          if (publicacionPendiente) {
            publicacionPendiente = false;
            publicarCatalogo();
          }
        });
      });
    });
  };

  const saveDb = () => {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    publicarCatalogo();
  };

// Unified AI Configuration & Rotation
let currentKeyIndex = 0;
const MODELS_TO_TRY = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-1.5-flash", "gemini-pro"];
const SYSTEM_INSTRUCTION = "Eres un experto en extracción de datos de pastelería. Genera ÚNICAMENTE la respuesta solicitada. IMPORTANTE: Sé conciso y directo. Si se pide JSON, genera ÚNICAMENTE un JSON válido.";

async function callUnifiedAI(prompt: string, schema?: any, image?: string) {
  const keys = getGeminiKeys();
  if (keys.length === 0) throw new Error("No hay llaves de Gemini disponibles");

  let attempts = 0;
  while (attempts < keys.length) {
    const apiKey = keys[currentKeyIndex % keys.length];
    
    for (const modelName of MODELS_TO_TRY) {
      try {
        const client = new GoogleGenAI({ apiKey });
        const config: any = {};
        if (schema) {
          config.responseMimeType = "application/json";
          config.responseSchema = schema;
        }

        const parts: any[] = [{ text: `${SYSTEM_INSTRUCTION}\n\n${prompt}` }];
        if (image) {
          parts.push({
            inlineData: {
              mimeType: "image/jpeg",
              data: image
            }
          });
        }

        const result = await client.models.generateContent({
          model: modelName,
          contents: [{ role: "user" as const, parts }],
          config
        });

        const text = result.text || "";
        console.log(`[AI Response Raw] ${text.substring(0, 150)}...`);
        if (schema) {
          try {
            JSON.parse(text);
          } catch (e) {
            console.warn(`[AI] JSON malformado de ${modelName}. Reintentando...`);
            continue;
          }
        }

        console.log(`[AI OK] Key ${currentKeyIndex % keys.length} | Model: ${modelName}`);
        return { text, model: modelName, keyIndex: currentKeyIndex % keys.length };

      } catch (error: any) {
        const errorMsg = error.message || "Unknown error";
        const errorStatus = error.status || error.code || 0;
        const errorDetails = JSON.stringify(error);
        
        const isRetryable = errorStatus === 429 ||
                          errorStatus === 503 ||
                          errorStatus === 500 ||
                          errorStatus === 404 ||
                          errorStatus === 'RESOURCE_EXHAUSTED' ||
                          errorMsg.includes('429') ||
                          errorMsg.includes('503') ||
                          errorMsg.includes('404') ||
                          errorDetails.toLowerCase().includes('quota');

        console.error(`[AI Error] Key ${currentKeyIndex % keys.length} | Model: ${modelName} | Status: ${errorStatus}`);

        if (isRetryable) {
          if (modelName !== MODELS_TO_TRY[MODELS_TO_TRY.length - 1]) continue;
          break; // Next key
        }
        
        // Non-retryable error for this request
        throw error;
      }
    }

    console.warn(`[AI Rotate] Key ${currentKeyIndex % keys.length} exhausted. Waiting 2s...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    currentKeyIndex = (currentKeyIndex + 1) % keys.length;
    attempts++;
  }
  throw new Error(`Todas las llaves (${keys.length}) han agotado su cuota.`);
}

  // Connectivity test
  app.get("/api/ping", (req, res) => {
    const currentKeys = getGeminiKeys();
    res.json({ 
      status: "ok", 
      time: new Date().toISOString(), 
      gemini_keys_count: currentKeys.length,
      deepseek_active: !!process.env.DEEPSEEK_API_KEY
    });
  });

  // Unified AI Processor
  app.post("/api/ai/process", async (req, res) => {
    const { provider, prompt, chunk, schema, useTable } = req.body;
    const finalPrompt = useTable ? `${prompt}\n\n${CONVERSION_TABLE}\n\nTexto:\n${chunk}` : `${prompt}\n\nTexto:\n${chunk}`;

    if (provider === 'gemini') {
      try {
        const result = await callUnifiedAI(finalPrompt, schema, req.body.image);
        return res.json({ 
          text: result.text, 
          provider: 'gemini', 
          keyIndex: result.keyIndex,
          model: result.model
        });
      } catch (error: any) {
        return res.status(error.status === 429 ? 429 : 500).json({ error: error.message });
      }
    } 

    if (provider === 'deepseek') {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "DEEPSEEK_API_KEY no configurada" });

      try {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: "Eres un asistente experto en pastelería. Responde ÚNICAMENTE con JSON válido." },
              { role: "user", content: `${finalPrompt}\n\nSchema:\n${JSON.stringify(schema)}\n\nTexto:\n${chunk}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1
          })
        });

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";
        return res.json({ text, provider: 'deepseek' });
      } catch (error) {
        console.error("DeepSeek Proxy Error:", error);
        return res.status(500).json({ error: "Error al comunicar con DeepSeek" });
      }
    }

    res.status(400).json({ error: "Proveedor no válido" });
  });

  // DB Sync Routes
  app.get("/api/db", (req, res) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      }
    } catch (e) {
      console.error("Error reading fresh db file:", e);
    }
    res.json(db);
  });

  app.post("/api/db/sync/full", (req, res) => {
    try {
      db = { ...db, ...req.body };
      saveDb();
      res.json({ status: "ok" });
    } catch (e) {
      res.status(500).json({ error: "Error al sincronizar" });
    }
  });

  // Public Order Capture from Catalog
  app.post("/api/public/orders", (req, res) => {
    try {
      const order = req.body;
      if (!order.customerName || !order.items) {
        return res.status(400).json({ error: "Datos de pedido incompletos" });
      }

      const newOrder = {
        ...order,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        date: new Date().toISOString(),
        source: 'catalog'
      };

      db.orders.push(newOrder);
      saveDb();
      
      res.json({ 
        status: "ok", 
        orderId: newOrder.id,
        message: "Pedido registrado correctamente en el sistema." 
      });
    } catch (e) {
      console.error("Error receiving public order:", e);
      res.status(500).json({ error: "Error interno al procesar el pedido" });
    }
  });

  app.post("/api/sunat/generate", async (req, res) => {
    const { order, settings } = req.body;
    if (!order || !order.taxData) {
      return res.status(400).json({ error: "Datos de pedido insuficientes" });
    }

    try {
      const sunatDir = path.join(process.cwd(), 'SUNAT_DATA');
      if (!fs.existsSync(sunatDir)) fs.mkdirSync(sunatDir);

      const docType = order.taxData.documentType === 'factura' ? '01' : '03';
      const serie = order.taxData.documentType === 'factura' ? 'F001' : 'B001';
      const fileName = `${docType}-${serie}-${order.id}`;
      
      // Header (.cab)
      const cabContent = `0101|${order.date}|PEN|${order.taxData.documentNumber}|${order.customerName}|${order.total}|0|0|${order.total}|`;
      fs.writeFileSync(path.join(sunatDir, `${fileName}.cab`), cabContent);

      // Detail (.det)
      const detContent = order.items.map((item: any) => {
        return `NIU|${item.quantity}|${item.productId}|${item.productName || item.formatName}|${item.price}|0|${item.price * item.quantity}|`;
      }).join('\n');
      fs.writeFileSync(path.join(sunatDir, `${fileName}.det`), detContent);

      res.json({ message: "Archivos generados en SUNAT_DATA", path: sunatDir });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error generando archivos" });
    }
  });

  // List all original recipe PDFs
  app.get("/api/recipes/pdfs", (req, res) => {
    try {
      const folderPath = path.join(process.cwd(), "recetas_originales");
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const files = fs.readdirSync(folderPath).filter(file => file.toLowerCase().endsWith('.pdf'));
      res.json(files);
    } catch (e) {
      console.error("Error listing PDFs:", e);
      res.status(500).json({ error: "Error reading original recipes folder" });
    }
  });

  // Serve original recipe PDFs statically
  app.use("/api/recipes/pdf-file", express.static(path.join(process.cwd(), "recetas_originales")));



  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: true,
        hmr: {
          host: localIP
        }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n\x1b[32m[DULCE CONTRASTE] ¡Sistema Activo!\x1b[0m`);
    console.log(`\x1b[36m➜\x1b[0m Local:    \x1b[34mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`\x1b[36m➜\x1b[0m Red:      \x1b[34mhttp://${localIP}:${PORT}\x1b[0m\n`);
  });
}

startServer();
