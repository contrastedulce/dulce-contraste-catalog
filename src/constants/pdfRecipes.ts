import { Recipe, Supply } from '../types';

export const PDF_SUPPLIES: Supply[] = [
  { id: 'pdf_leche', name: 'Leche fresca', unit: 'ml', cost: 5, category: 'Lácteos', stock: 1000, minStock: 0 },
  { id: 'pdf_mantequilla', name: 'Mantequilla sin sal', unit: 'gr', cost: 45, category: 'Lácteos', stock: 1000, minStock: 0 },
  { id: 'pdf_harina', name: 'Harina sin preparar', unit: 'gr', cost: 5, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_cocoa', name: 'Cocoa', unit: 'gr', cost: 25, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_yemas', name: 'Yemas de huevo', unit: 'gr', cost: 15, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_huevos', name: 'Huevos', unit: 'gr', cost: 8, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_claras', name: 'Claras de huevo', unit: 'gr', cost: 10, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_azucar', name: 'Azúcar blanca', unit: 'gr', cost: 4, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_glucosa', name: 'Glucosa', unit: 'gr', cost: 12, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_crema_leche', name: 'Crema de leche', unit: 'gr', cost: 18, category: 'Lácteos', stock: 1000, minStock: 0 },
  { id: 'pdf_sal', name: 'Sal gruesa', unit: 'gr', cost: 2, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_colapez', name: 'Colapez en polvo', unit: 'gr', cost: 60, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_manjar', name: 'Manjar blanco', unit: 'gr', cost: 15, category: 'Lácteos', stock: 1000, minStock: 0 },
  { id: 'pdf_queso_crema', name: 'Queso crema / Mascarpone', unit: 'gr', cost: 35, category: 'Lácteos', stock: 1000, minStock: 0 },
  { id: 'pdf_miel', name: 'Miel de abeja', unit: 'gr', cost: 20, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_choco_blanco', name: 'Chocolate blanco', unit: 'gr', cost: 40, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_aceite', name: 'Aceite vegetal', unit: 'gr', cost: 8, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_pure_fresa', name: 'Puré de fresas', unit: 'gr', cost: 15, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_pectina', name: 'Pectina', unit: 'gr', cost: 150, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_zumo_limon', name: 'Jugo de limón', unit: 'gr', cost: 5, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_leche_coco', name: 'Leche de coco', unit: 'gr', cost: 15, category: 'Lácteos', stock: 1000, minStock: 0 },
  { id: 'pdf_colapez_lamina', name: 'Colapez en lámina', unit: 'gr', cost: 80, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_licor_coco', name: 'Licor de coco (Malibu)', unit: 'gr', cost: 50, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_joy_gelato', name: 'Joy gelato de coco', unit: 'gr', cost: 60, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_ralladura_limon', name: 'Ralladura de limón', unit: 'unid', cost: 2, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_agua', name: 'Agua', unit: 'ml', cost: 1, category: 'Frescos', stock: 1000, minStock: 0 },
  // Nuevos Insumos Empanadas Criollas
  { id: 'pdf_manteca', name: 'Manteca vegetal', unit: 'gr', cost: 10, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_pimienta', name: 'Pimienta', unit: 'gr', cost: 30, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_nuez_moscada', name: 'Nuez moscada', unit: 'gr', cost: 50, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_lomo', name: 'Lomo limpio o guachalomo', unit: 'gr', cost: 35, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_ajo', name: 'Ajo picado', unit: 'gr', cost: 15, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_cebolla_roja', name: 'Cebolla roja en brunoise', unit: 'gr', cost: 5, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_aji_amarillo_pic', name: 'Ají amarillo picado', unit: 'gr', cost: 8, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_tomate_brunoise', name: 'Tomate brunoise/concasse', unit: 'gr', cost: 5, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_cebolla_china', name: 'Cebolla china', unit: 'gr', cost: 8, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_culantro', name: 'Culantro', unit: 'gr', cost: 10, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_papa_amarilla', name: 'Papa amarilla en cubos', unit: 'gr', cost: 6, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_sillao', name: 'Sillao', unit: 'gr', cost: 8, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_salsa_ostion', name: 'Salsa de ostión', unit: 'gr', cost: 25, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_vinagre_tinto', name: 'Vinagre tinto', unit: 'gr', cost: 5, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_fondo_res', name: 'Fondo de res', unit: 'ml', cost: 3, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_pan_molde', name: 'Pan de molde blanco', unit: 'gr', cost: 8, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_caldo_pollo', name: 'Caldo de pollo', unit: 'ml', cost: 3, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_leche_evap', name: 'Leche evaporada', unit: 'gr', cost: 12, category: 'Lácteos', stock: 1000, minStock: 0 },
  { id: 'pdf_queso_parmesano', name: 'Queso parmesano rallado', unit: 'gr', cost: 45, category: 'Lácteos', stock: 1000, minStock: 0 },
  { id: 'pdf_pecanas', name: 'Pecanas picadas', unit: 'gr', cost: 80, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_huevo_duro', name: 'Huevo duro', unit: 'unid', cost: 1, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_aceituna', name: 'Aceituna negra', unit: 'unid', cost: 0.5, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_pasta_aji_ama', name: 'Pasta de ají amarillo', unit: 'gr', cost: 15, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_pasta_aji_mir', name: 'Pasta de ají mirasol', unit: 'gr', cost: 18, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_alverjitas', name: 'Alverjitas', unit: 'gr', cost: 8, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_zanahoria', name: 'Zanahoria picada/bastones', unit: 'gr', cost: 4, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_chicha_jora', name: 'Chicha de jora', unit: 'ml', cost: 5, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_asado_res', name: 'Asado de res (pejerrey)', unit: 'gr', cost: 38, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_cebolla_blanca', name: 'Cebolla blanca brunoise', unit: 'gr', cost: 6, category: 'Frescos', stock: 1000, minStock: 0 },
  { id: 'pdf_pasta_tomate', name: 'Pasta de tomate', unit: 'gr', cost: 12, category: 'Secos', stock: 1000, minStock: 0 },
  { id: 'pdf_vino_tinto', name: 'Vino tinto', unit: 'gr', cost: 25, category: 'Secos', stock: 1000, minStock: 0 }
];

export const PDF_RECIPES: Recipe[] = [
  // ---------------------------------------------------------
  // CAKE ROLL DE CHOCOLATE CON CARAMELO BLANDO Y QUESO CREMA
  // ---------------------------------------------------------
  {
    id: 'pdf_biscuit_choco',
    name: 'Biscuit de chocolate',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_leche', quantity: 60 },
      { supplyId: 'pdf_mantequilla', quantity: 30 },
      { supplyId: 'pdf_harina', quantity: 40 },
      { supplyId: 'pdf_cocoa', quantity: 15 },
      { supplyId: 'pdf_yemas', quantity: 60 },
      { supplyId: 'pdf_huevos', quantity: 70 },
      { supplyId: 'pdf_claras', quantity: 105 },
      { supplyId: 'pdf_azucar', quantity: 50 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Calentar la leche con la mantequilla.",
      "Incorporar la harina y la cocoa previamente tamizadas y rápidamente mezclar con espátula hasta que este homogéneo.",
      "Colocar la mezcla en un bowl con paleta. Añadir las yemas de huevo y huevos poco a poco.",
      "Paralelamente montar las claras a punto nieve con el azúcar en forma de lluvia.",
      "Incorporar las claras a nieve sobre la mezcla previa en forma envolvente y disponer sobre un silpat de 35 x 35 cm.",
      "Horno a 180° C x 8 minutos aprox."
    ]
  },
  {
    id: 'pdf_caramelo_blando',
    name: 'Caramelo blando',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_glucosa', quantity: 45 },
      { supplyId: 'pdf_azucar', quantity: 45 },
      { supplyId: 'pdf_crema_leche', quantity: 115 },
      { supplyId: 'pdf_mantequilla', quantity: 35 },
      { supplyId: 'pdf_sal', quantity: 1 },
      { supplyId: 'pdf_colapez', quantity: 1 },
      { supplyId: 'pdf_manjar', quantity: 25 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Calentar el azúcar y glucosa hasta formar un caramelo claro (160° C referencial).",
      "Calentar la crema de leche hasta hervir y desglasar el caramelo. Continuar cocinando hasta alcanzar los 107° C.",
      "Retirar del fuego añadir la gelatina hidratada y el manjar blanco.",
      "Enfriar un poco y luego incorporar la mantequilla.",
      "Emulsionar con batidor.",
      "Refrigerar toda la noche."
    ]
  },
  {
    id: 'pdf_chantilly_queso',
    name: 'Chantilly de queso',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_crema_leche', quantity: 260 },
      { supplyId: 'pdf_queso_crema', quantity: 75 },
      { supplyId: 'pdf_colapez', quantity: 3 },
      { supplyId: 'pdf_miel', quantity: 10 },
      { supplyId: 'pdf_choco_blanco', quantity: 45 },
      { supplyId: 'pdf_azucar', quantity: 20 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Llevar a ebullición la crema de leche, azúcar y la miel de abeja.",
      "Retirar del fuego añadir la gelatina hidratada y luego el chocolate blanco finamente picado.",
      "Mezclar como una ganache y terminar con el queso crema.",
      "Refrigerar toda la noche."
    ]
  },
  {
    id: 'pdf_cakeroll_choco',
    name: 'Cake Roll de Chocolate con Caramelo Blando y Queso Crema',
    type: 'complete',
    ingredients: [
      { recipeId: 'pdf_biscuit_choco', quantity: 1 },
      { recipeId: 'pdf_caramelo_blando', quantity: 1 },
      { recipeId: 'pdf_chantilly_queso', quantity: 1 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Montar la chantilly de queso hasta que este firme.",
      "Desmoldar el biscuit y cubrir con la chantilly de queso con la ayuda de una espátula.",
      "Con la ayuda de una manga boquilla lisa manguera el caramelo blando en un extremo del cake.",
      "Enrollar con la ayuda de un plástico. Refrigerar unas 2 horas como mínimo.",
      "Decorar con la chantilly y rulos de chocolate."
    ]
  },

  // ---------------------------------------------------------
  // CAKE ROLL DE FRESAS, COCO Y CHOCOLATE BLANCO
  // ---------------------------------------------------------
  {
    id: 'pdf_biscuit_vainilla',
    name: 'Biscuit de vainilla',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_yemas', quantity: 105 },
      { supplyId: 'pdf_azucar', quantity: 30 },
      { supplyId: 'pdf_azucar', quantity: 75 },
      { supplyId: 'pdf_claras', quantity: 200 },
      { supplyId: 'pdf_harina', quantity: 85 },
      { supplyId: 'pdf_leche', quantity: 45 },
      { supplyId: 'pdf_aceite', quantity: 60 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Blanquear las yemas con el azúcar 1 hasta que este pálido, aparte montar las claras a punto nieve con el azúcar 2 en forma de lluvia.",
      "Incorporar el merengue a las yemas batidas poco a poco.",
      "Luego incorporar la harina previamente tamizada en forma envolvente.",
      "Aparte mezclar el aceite vegetal con la leche fresca.",
      "Añadir a una pequeña porción y luego terminar de incorporar al resto del batido.",
      "Colocar la masa en un tapete o silpat de 35 x 35 aprox.",
      "Horno a 180° C x 8 minutos aprox."
    ]
  },
  {
    id: 'pdf_confitura_fresas',
    name: 'Confitura de fresas',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_pure_fresa', quantity: 200 },
      { supplyId: 'pdf_glucosa', quantity: 20 },
      { supplyId: 'pdf_azucar', quantity: 20 },
      { supplyId: 'pdf_pectina', quantity: 5 },
      { supplyId: 'pdf_zumo_limon', quantity: 10 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Mezclar la pectina y la azúcar.",
      "Calentar el puré de fresa con el jugo de limón y la glucosa.",
      "Añadir la mezcla de pectina y azúcar en forma de lluvia.",
      "Llevar a ebullición moviendo constantemente durante unos minutos.",
      "Retirar del fuego y dejar reposar con film en contacto hasta que este frio.",
      "Regenerar antes de utilizar."
    ]
  },
  {
    id: 'pdf_chantilly_coco',
    name: 'Chantilly de coco',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_crema_leche', quantity: 300 },
      { supplyId: 'pdf_choco_blanco', quantity: 124 },
      { supplyId: 'pdf_leche_coco', quantity: 106 },
      { supplyId: 'pdf_colapez_lamina', quantity: 5 },
      { supplyId: 'pdf_licor_coco', quantity: 12 },
      { supplyId: 'pdf_joy_gelato', quantity: 10 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Calentar la crema de leche y verterla sobre el chocolate blanco previamente picado y la leche de coco. Emulsionar correctamente con un bamix o licuadora.",
      "Añadir la gelatina previamente hidratada y el joy gelato de coco. Mixear. Enfriar toda la noche en la refrigeradora.",
      "Añadir el licor.",
      "Montar en la batidora en velocidad alta."
    ]
  },
  {
    id: 'pdf_cakeroll_fresas',
    name: 'Cake Roll de Fresas, Coco y Chocolate Blanco',
    type: 'complete',
    ingredients: [
      { recipeId: 'pdf_biscuit_vainilla', quantity: 1 },
      { recipeId: 'pdf_confitura_fresas', quantity: 1 },
      { recipeId: 'pdf_chantilly_coco', quantity: 1 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Desmoldar el biscuit y cubrir con la confitura de fresas. Esparcirla bien.",
      "Cubrir con la chantilly de coco y terminar de enrollar y dar forma.",
      "Refrigerar unas 2 horas como mínimo.",
      "Decorar con la chantilly de coco y fresas frescas."
    ]
  },

  // ---------------------------------------------------------
  // CAKE ROLL DE PYE DE LIMON
  // ---------------------------------------------------------
  {
    id: 'pdf_crema_limon',
    name: 'Crema de limón',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_huevos', quantity: 200 },
      { supplyId: 'pdf_azucar', quantity: 150 },
      { supplyId: 'pdf_zumo_limon', quantity: 150 },
      { supplyId: 'pdf_ralladura_limon', quantity: 3 },
      { supplyId: 'pdf_mantequilla', quantity: 150 },
      { supplyId: 'pdf_colapez', quantity: 5 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Hidratar la gelatina en agua fría. Reservar.",
      "Colocar los huevos, azúcar, zumo de limón y ralladura en un baño María y cocinar hasta 82° C (batiendo constantemente con batidor globo).",
      "Añadir la gelatina.",
      "Enfriar la mezcla en la batidora y añadir la mantequilla pomada.",
      "Conservar en el frio hasta su uso."
    ]
  },
  {
    id: 'pdf_merengue_italiano',
    name: 'Merengue Italiano',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_claras', quantity: 150 },
      { supplyId: 'pdf_azucar', quantity: 300 },
      { supplyId: 'pdf_agua', quantity: 100 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Llevar el azúcar + agua a 121º C.",
      "Cuando el almíbar alcance los 118 ºC empezar a batir las claras a velocidad tres y cuando alcance los 121 º C verter en forma de hilo sobre las claras. Batir hasta enfriar completamente."
    ]
  },
  {
    id: 'pdf_cakeroll_limon',
    name: 'Cake Roll de Pye de Limon',
    type: 'complete',
    ingredients: [
      { recipeId: 'pdf_biscuit_vainilla', quantity: 1 },
      { recipeId: 'pdf_crema_limon', quantity: 1 },
      { recipeId: 'pdf_merengue_italiano', quantity: 1 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Desmoldar el biscuit y cubrir con crema de limón. Esparcirla bien.",
      "Enrollar el biscuit.",
      "Cubrir con el merengue Italiano."
    ]
  },

  // =========================================================
  // EMPANADAS CRIOLLAS
  // =========================================================
  {
    id: 'pdf_masa_empanada',
    name: 'Masa para empanadas',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_harina', quantity: 500 },
      { supplyId: 'pdf_agua', quantity: 125 },
      { supplyId: 'pdf_azucar', quantity: 50 },
      { supplyId: 'pdf_sal', quantity: 8 },
      { supplyId: 'pdf_yemas', quantity: 30 },
      { supplyId: 'pdf_manteca', quantity: 150 },
      { supplyId: 'pdf_mantequilla', quantity: 113 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Mezclar la harina, sal y azúcar con la manteca y mantequilla en cubos hasta que se haga como una arena gruesa.",
      "Incorporar las yemas y cortar con un cornet. Ir agregando el agua de a pocos hasta tener una masa homogénea y que no se pegue a las manos.",
      "Reposar en el refrigerador durante 2 horas como mínimo.",
      "Porcionar la masa en bollos de 50 gr cada una aprox. Reposar al frio nuevamente por 30 minutos.",
      "Retirar la masa, estirar (forma de ovalo). Colocar el relleno congelado y labrar.",
      "Congelar nuevamente antes de hornear.",
      "Pincelar con yema de huevo.",
      "Horno a 180° C."
    ]
  },
  {
    id: 'pdf_salsa_bechamel',
    name: 'Salsa Bechamel',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_leche', quantity: 1000 },
      { supplyId: 'pdf_harina', quantity: 100 },
      { supplyId: 'pdf_mantequilla', quantity: 100 },
      { supplyId: 'pdf_sal', quantity: 4 },
      { supplyId: 'pdf_pimienta', quantity: 4 },
      { supplyId: 'pdf_nuez_moscada', quantity: 2 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Elaborar un roux blanco con la mantequilla fundida y la harina. Dejar enfriar.",
      "Llevar a ebullición la leche fresca y añadir de a pocos el roux frío, moviendo constantemente con un batidor manual, cuidando que no se queme.",
      "Dejar cocinar la harina y sazonar la salsa con la sal, pimienta y una pizca de nuez moscada rallada. Pasar por el colador."
    ]
  },
  {
    id: 'pdf_lomo_saltado',
    name: 'Relleno de Lomo Saltado',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_lomo', quantity: 360 },
      { supplyId: 'pdf_ajo', quantity: 25 },
      { supplyId: 'pdf_cebolla_roja', quantity: 140 },
      { supplyId: 'pdf_aji_amarillo_pic', quantity: 40 },
      { supplyId: 'pdf_tomate_brunoise', quantity: 160 },
      { supplyId: 'pdf_cebolla_china', quantity: 40 },
      { supplyId: 'pdf_culantro', quantity: 25 },
      { supplyId: 'pdf_papa_amarilla', quantity: 200 },
      { supplyId: 'pdf_sillao', quantity: 80 },
      { supplyId: 'pdf_salsa_ostion', quantity: 80 },
      { supplyId: 'pdf_vinagre_tinto', quantity: 40 },
      { supplyId: 'pdf_fondo_res', quantity: 100 },
      { supplyId: 'pdf_sal', quantity: 1 },
      { supplyId: 'pdf_aceite', quantity: 10 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Cortar el lomo en cubos pequeños. En un wok con un poco de aceite saltear la carne.",
      "Agregar la cebolla, el tomate, el ajo, ají amarillo, cebolla china, culantro, el sillao, salsa de ostión y vinagre tinto.",
      "Añadir el fondo de carne. Reservar. El saltado debe ser a fuego vivo para generar fuego y ese gusto a fogón.",
      "Freír las papas en abundante aceite, escurrir y mezclar con el lomo.",
      "Enfriar el relleno por completo."
    ]
  },
  
  {
    id: 'pdf_base_aji_gallina',
    name: 'Base de ají de gallina',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_aji_amarillo_pic', quantity: 400 },
      { supplyId: 'pdf_cebolla_roja', quantity: 160 },
      { supplyId: 'pdf_ajo', quantity: 30 },
      { supplyId: 'pdf_aceite', quantity: 30 },
      { supplyId: 'pdf_pan_molde', quantity: 160 },
      { supplyId: 'pdf_caldo_pollo', quantity: 500 },
      { supplyId: 'pdf_leche_evap', quantity: 200 },
      { supplyId: 'pdf_queso_parmesano', quantity: 120 },
      { supplyId: 'pdf_pecanas', quantity: 80 },
      { supplyId: 'pdf_sal', quantity: 2 },
      { supplyId: 'pdf_pimienta', quantity: 2 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Sudar el ají, el ajo y la cebolla en una sartén con aceite durante 15 minutos o hasta que estén bien tiernos. Ir agregando caldo de a pocos.",
      "Licuar el pan blanco y el aderezo realizado previamente hasta obtener una crema espesa. Agregar leche evaporada y pecanas.",
      "Incorporar a la olla y calentar.",
      "Opcionalmente: Añadir roux para ligar la crema si es necesario, y enfriar."
    ]
  },
  {
    id: 'pdf_coccion_pollo',
    name: 'Pollo deshilachado (Cocción)',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_caldo_pollo', quantity: 500 },
      { supplyId: 'pdf_sal', quantity: 2 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Realizar un caldo con verduras. Colocar las pechugas de pollo y cocinar. Añadir sal.",
      "Retirar y enfriar.",
      "Deshilachar el pollo."
    ]
  },
  {
    id: 'pdf_empanada_aji_gallina',
    name: 'Empanada de Ají de Gallina',
    type: 'complete',
    ingredients: [
      { recipeId: 'pdf_masa_empanada', quantity: 1 },
      { recipeId: 'pdf_base_aji_gallina', quantity: 1 },
      { recipeId: 'pdf_coccion_pollo', quantity: 1 },
      { recipeId: 'pdf_salsa_bechamel', quantity: 1 },
      { supplyId: 'pdf_huevo_duro', quantity: 1 },
      { supplyId: 'pdf_aceituna', quantity: 1 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Mezclar la base de ají de gallina fría con el pollo deshilachado y la salsa bechamel.",
      "Bolear y congelar el relleno.",
      "Al momento de armar disponer el relleno, el huevo y la aceituna en la masa estirada.",
      "Cerrar, congelar, pincelar y hornear."
    ]
  },
  {
    id: 'pdf_base_seco',
    name: 'Base de seco de res',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_asado_res', quantity: 1000 },
      { supplyId: 'pdf_cebolla_roja', quantity: 200 },
      { supplyId: 'pdf_pasta_aji_ama', quantity: 20 },
      { supplyId: 'pdf_pasta_aji_mir', quantity: 60 },
      { supplyId: 'pdf_culantro', quantity: 150 },
      { supplyId: 'pdf_alverjitas', quantity: 30 },
      { supplyId: 'pdf_zanahoria', quantity: 150 },
      { supplyId: 'pdf_chicha_jora', quantity: 200 },
      { supplyId: 'pdf_fondo_res', quantity: 2000 },
      { supplyId: 'pdf_sal', quantity: 2 },
      { supplyId: 'pdf_pimienta', quantity: 2 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Limpiar la carne y trozarla. Sellar los trozos de carne a fuego medio alto hasta formar costra. Reservar.",
      "En la misma olla sofreír la cebolla y luego ajo a fuego lento. Añadir pastas de ají, cocinando bien el aderezo.",
      "Agregar culantro licuado. Desglasar con chicha de jora y colocar la carne.",
      "Cubrir con caldo o agua y cocinar por 1 hora o más hasta que ablande.",
      "Añadir alverjitas y zanahoria a mitad de cocción.",
      "Enfriar, mechar la carne y reservar."
    ]
  },
  {
    id: 'pdf_empanada_seco',
    name: 'Empanada de Seco de Res',
    type: 'complete',
    ingredients: [
      { recipeId: 'pdf_masa_empanada', quantity: 1 },
      { recipeId: 'pdf_base_seco', quantity: 1 },
      { recipeId: 'pdf_salsa_bechamel', quantity: 1 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Calentar la base de seco de res y añadir un roux si es necesario para ligar.",
      "Enfriar y añadir la carne mechada y la salsa bechamel para el relleno final.",
      "Colocar en la masa, cerrar, congelar, pincelar y hornear."
    ]
  },
  {
    id: 'pdf_base_asado',
    name: 'Base asado criollo ligado',
    type: 'sub',
    ingredients: [
      { supplyId: 'pdf_asado_res', quantity: 1000 },
      { supplyId: 'pdf_cebolla_blanca', quantity: 200 },
      { supplyId: 'pdf_ajo', quantity: 30 },
      { supplyId: 'pdf_zanahoria', quantity: 100 },
      { supplyId: 'pdf_tomate_brunoise', quantity: 200 },
      { supplyId: 'pdf_pasta_tomate', quantity: 40 },
      { supplyId: 'pdf_vino_tinto', quantity: 300 },
      { supplyId: 'pdf_fondo_res', quantity: 3000 },
      { supplyId: 'pdf_aceite', quantity: 30 },
      { supplyId: 'pdf_sal', quantity: 2 },
      { supplyId: 'pdf_pimienta', quantity: 2 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Limpiar la carne y salpimentar. Sellar por todos lados en cacerola con aceite. Retirar.",
      "Aprovechar jugos y cocinar cebolla y ajo hasta cristalizar. Agregar pasta de tomate y tomate en concasse.",
      "Desglasar con vino tinto y agregar bastones de zanahoria.",
      "Colocar asado, cubrir con fondo y cocinar durante 1 hora y media en olla a presión.",
      "Enfriar y desmechar la carne.",
      "Pasar por colador el jugo y prensarlo bien. Ligar el jugo con un roux a fuego suave."
    ]
  },
  {
    id: 'pdf_empanada_asado',
    name: 'Empanada de Asado Criollo',
    type: 'complete',
    ingredients: [
      { recipeId: 'pdf_masa_empanada', quantity: 1 },
      { recipeId: 'pdf_base_asado', quantity: 1 },
      { recipeId: 'pdf_salsa_bechamel', quantity: 1 }
    ],
    equipment: [], laborCost: 0, yield: 1, yieldUnit: 'un',
    instructions: [
      "Mezclar la base de asado ligado (el jugo espeso) con la carne mechada y la salsa bechamel.",
      "Enfriar bien el relleno.",
      "Armar la empanada, congelar, pincelar y hornear."
    ]
  }
];
