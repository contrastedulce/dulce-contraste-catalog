import express from "express"; // Server restart forced - final database sync
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
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

  const saveDb = () => {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  };

// Unified AI Configuration & Rotation
let currentKeyIndex = 0;
const MODELS_TO_TRY = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-1.5-flash", "gemini-pro"];
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
        
        const is429 = errorStatus === 429 || 
                      errorStatus === 'RESOURCE_EXHAUSTED' || 
                      errorMsg.includes('429') || 
                      errorDetails.toLowerCase().includes('quota');

        console.error(`[AI Error] Key ${currentKeyIndex % keys.length} | Model: ${modelName} | Status: ${errorStatus}`);

        if (is429) {
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
