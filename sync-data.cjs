const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');
const TARGET_PATH = path.join(__dirname, 'src', 'constants', 'initialData.ts');

function sync() {
  console.log('🔄 Iniciando sincronización de datos...');
  
  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Error: No se encontró db.json');
    return;
  }

  try {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const products = db.products || [];
    const settings = db.settings || {};

    const content = `import { Product, AppSettings } from '../types';

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export const INITIAL_SETTINGS: AppSettings = ${JSON.stringify(settings, null, 2)};
`;

    fs.writeFileSync(TARGET_PATH, content);
    console.log(`✅ ¡Sincronización exitosa! ${products.length} productos exportados.`);
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error);
  }
}

sync();
