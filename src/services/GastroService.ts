// Helper for AI generation via Server Proxy
async function callServerAI(params: { 
  prompt: string, 
  image?: string, 
  schema?: any, 
  useTable?: boolean 
}) {
  const response = await fetch('/api/ai/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      provider: 'gemini', 
      ...params,
      chunk: '' // Empty chunk since instructions and image are main content
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error en el servidor de IA');
  }
  
  const data = await response.json();
  return JSON.parse(data.text || '{}');
}

export async function processGastroData(fileContent: string, type: 'costs' | 'procedures') {
  try {
    const prompt = `Analiza el contenido de un archivo de ${type === 'costs' ? 'costos de insumos' : 'procedimientos de recetas'} y extrae:
    Si es de costos: nombre, unidad, costo, categoría.
    Si es de procedimientos: nombre de la receta, ingredientes, pasos, rendimiento.`;

    const schema = {
      type: "OBJECT",
      properties: {
        items: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              unit: { type: "STRING" },
              cost: { type: "NUMBER" },
              category: { type: "STRING" },
              ingredients: { 
                type: "ARRAY", 
                items: { 
                  type: "OBJECT",
                  properties: { name: { type: "STRING" }, quantity: { type: "NUMBER" }, unit: { type: "STRING" } }
                }
              },
              steps: { type: "ARRAY", items: { type: "STRING" } },
              yield: { type: "NUMBER" }
            }
          }
        }
      }
    };

    const response = await fetch('/api/ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        provider: 'gemini', 
        prompt, 
        chunk: fileContent, 
        schema,
        useTable: true
      })
    });

    if (!response.ok) throw new Error('Error en el servidor de IA');
    const data = await response.json();
    return JSON.parse(data.text || '{"items": []}');
  } catch (error) {
    console.error("Error en processGastroData:", error);
    throw error;
  }
}

export async function processPurchaseReceipt(imageBase64: string) {
  try {
    const currentYear = new Date().getFullYear();
    const prompt = `Analiza la imagen de una boleta de COMPRA de insumos y extrae:
    1. 'supplierName': Nombre comercial.
    2. 'date': Fecha (YYYY-MM-DD). IMPORTANTE: Si el año no está explícito en la imagen, asume que el año es ${currentYear}. Si la fecha es ilegible, usa la fecha de hoy.
    3. 'items': Lista de productos.
    4. 'items[].rawName': Nombre del producto.
    5. 'items[].quantity': Cantidad.
    6. 'items[].unit': Unidad.
    7. 'items[].price': PRECIO BRUTO DE LÍNEA (antes de descuentos globales).
    8. 'subtotal': Suma de todos los productos (antes de descuentos). 
    9. 'totalDiscount': Descuento total aplicado (ej: 'TOTAL DESCUENTO' en boleta).
    10. 'total': Importe final pagado (Subtotal - Descuento).`;

    const schema = {
      type: "object",
      properties: {
        supplierName: { type: "string" },
        date: { type: "string" },
        subtotal: { type: "number" },
        totalDiscount: { type: "number" },
        total: { type: "number" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              rawName: { type: "string" },
              quantity: { type: "number" },
              unit: { type: "string" },
              price: { type: "number" }
            }
          }
        }
      }
    };

    return await callServerAI({ prompt, image: imageBase64, schema });
  } catch (error) {
    console.error("Error en processPurchaseReceipt:", error);
    throw error;
  }
}

export async function processSalesReceipt(imageBase64: string) {
  try {
    const currentYear = new Date().getFullYear();
    const prompt = `Analiza la imagen de una boleta de VENTA directa a cliente y extrae:
    1. 'customerName': Nombre del cliente.
    2. 'date': Fecha (YYYY-MM-DD). IMPORTANTE: Si el año no está explícito en la imagen, asume que el año es ${currentYear}. Si la fecha es ilegible, usa la fecha de hoy.
    3. 'items': Lista de productos vendidos.
    4. 'items[].rawName': Nombre del producto.
    5. 'items[].quantity': Cantidad.
    6. 'items[].price': PRECIO UNITARIO.
    7. 'total': Total de la boleta.`;

    const schema = {
      type: "OBJECT",
      properties: {
        customerName: { type: "STRING" },
        date: { type: "STRING" },
        items: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              rawName: { type: "STRING" },
              quantity: { type: "NUMBER" },
              price: { type: "NUMBER" }
            }
          }
        },
        total: { type: "NUMBER" }
      }
    };

    return await callServerAI({ prompt, image: imageBase64, schema });
  } catch (error) {
    console.error("Error en processSalesReceipt:", error);
    throw error;
  }
}
