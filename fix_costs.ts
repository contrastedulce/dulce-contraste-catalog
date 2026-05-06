import fs from 'fs';

const dbPath = 'db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log(`Analizando ${db.supplies.length} insumos...`);

let count = 0;
db.supplies = db.supplies.map(supply => {
  const isBulkUnit = ['gramos', 'gr', 'ml', 'gramo'].includes(supply.unit.toLowerCase());
  const isBulkPrice = supply.cost > 1; // Un gramo de harina no cuesta S/ 90.00
  const isBulkStock = supply.stock > 1;

  if (isBulkUnit && isBulkPrice && isBulkStock) {
    const unitCost = supply.cost / supply.stock;
    
    // Verificación de cordura: El costo unitario no debería ser extremadamente alto si era un bulto
    if (unitCost < 5) {
      const oldCost = supply.cost;
      supply.cost = unitCost;
      console.log(`✅ Corregido: ${supply.name} | De S/ ${oldCost.toFixed(2)} a S/ ${supply.cost.toFixed(4)}`);
      count++;
    }
  } else if (supply.name.toLowerCase().includes('huevo') && supply.cost > 10) {
     // Caso especial Huevos: Jaba de 90 a S/ 36.30
     const unitCost = supply.cost / supply.stock;
     supply.cost = unitCost;
     console.log(`🥚 Huevos Corregidos: ${supply.name} | Unitario: S/ ${supply.cost.toFixed(4)}`);
     count++;
  }
  return supply;
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`\n🎉 ¡Sincronización completa! Se han normalizado ${count} insumos.`);
