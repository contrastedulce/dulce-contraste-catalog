import { Product, AppSettings } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "lgi6tdmzp",
    "name": "Explosión Tropical de Tres Leches",
    "recipeId": "znmq55lqk",
    "type": "single",
    "saleFormats": [
      {
        "name": "entera",
        "multiplier": 1,
        "price": 194,
        "leadTime": "48h",
        "availability": "on_order",
        "image": "https://i.postimg.cc/T1D6tqcJ/Captura-de-pantalla-2026-05-05-113110.png"
      },
      {
        "name": "unidad",
        "multiplier": 0.1,
        "divisor": 10,
        "price": 19,
        "extraSupplies": [],
        "availability": "in_stock",
        "leadTime": "",
        "image": "https://i.postimg.cc/T1D6tqcJ/Captura-de-pantalla-2026-05-05-113110.png"
      }
    ],
    "margin": 200,
    "image": "https://i.postimg.cc/T1D6tqcJ/Captura-de-pantalla-2026-05-05-113110.png",
    "description": "Disfruta nuestro Tres Leches de Piña Colada: un bizcocho esponjoso bañado en una mezcla cremosa de leches y coco, con un toque de ron. Relleno de piña fresca y cubierto con una suave crema tropical, es un postre jugoso, refrescante y lleno de sabor caribeño. 🌴✨\n\n🌴 Un viaje tropical en cada bocado.",
    "category": "Tortas"
  },
  {
    "id": "f4ocmmt32",
    "name": "Cheesecakes hearts",
    "recipeId": "hpsn13bej",
    "type": "single",
    "saleFormats": [
      {
        "name": "unidad",
        "multiplier": 1,
        "price": 3
      }
    ],
    "margin": 200,
    "category": "Galletas"
  },
  {
    "id": "xo8cqq0cz",
    "name": "TORTA DE CHOCOLATE ",
    "recipeId": "yxhdqtplj",
    "type": "single",
    "saleFormats": [
      {
        "name": "entera",
        "multiplier": 1,
        "price": 131,
        "divisor": 1,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ]
      },
      {
        "name": "porción",
        "multiplier": 0.1111111111111111,
        "divisor": 9,
        "price": 15,
        "extraSupplies": [
          {
            "supplyId": "e10nwc3qw",
            "quantity": 1
          },
          {
            "supplyId": "eu9oeqopb",
            "quantity": 1
          }
        ]
      }
    ],
    "margin": 200,
    "image": "https://i.postimg.cc/fLKGBzp0/Captura-de-pantalla-2026-05-05-124442.png",
    "description": "Sumérgete en el placer absoluto con nuestra torta de chocolate: un bizcocho intensamente húmedo, bañado en almíbar de chocolate que potencia cada capa. En su interior, un generoso relleno de manjar de olla, cremoso y profundo en sabor. Todo cubierto con un seductor fudge de chocolate y coronado con finas virutas de chocolate bitter que equilibran el dulzor.\nCada bocado es pura tentación. 🍫",
    "availability": "in_stock"
  },
  {
    "id": "c8vj47uvi",
    "name": "BANDEJA TORTA CHOCOLATE Y MANJAR",
    "recipeId": "elbnmf4kv",
    "type": "single",
    "saleFormats": [
      {
        "name": "bandeja",
        "multiplier": 1,
        "price": 15,
        "extraSupplies": [
          {
            "supplyId": "v96wita78",
            "quantity": 1
          },
          {
            "supplyId": "eu9oeqopb",
            "quantity": 1
          }
        ]
      }
    ],
    "margin": 200,
    "image": "https://photos.app.goo.gl/geMojScRmzwJGGXW9",
    "availability": "on_order",
    "leadTime": "48h"
  },
  {
    "id": "0ji1136rb",
    "name": "GALLETAS DE AVENA",
    "recipeId": "ozy9h9m4u",
    "type": "single",
    "saleFormats": [
      {
        "name": "UNIDAD ",
        "multiplier": 1,
        "price": 1.3,
        "availability": "in_stock",
        "leadTime": ""
      },
      {
        "name": "bowl x10",
        "multiplier": 10,
        "price": 13,
        "availability": "in_stock",
        "leadTime": ""
      },
      {
        "name": "bowl x 30",
        "multiplier": 30,
        "price": 30,
        "divisor": 0.03333333333333333,
        "availability": "in_stock",
        "leadTime": ""
      }
    ],
    "margin": 200,
    "category": "Galletas"
  },
  {
    "id": "i8hukbrpi",
    "name": "GALLETA DE AVENA CON LAKANTO",
    "recipeId": "r2hlcfatn",
    "type": "single",
    "saleFormats": [
      {
        "name": "UNIDAD",
        "multiplier": 1,
        "price": 1,
        "availability": "on_order"
      },
      {
        "name": "TAPER X10",
        "multiplier": 10,
        "price": 12,
        "availability": "on_order"
      }
    ],
    "margin": 30
  },
  {
    "id": "q6q916bpr",
    "name": "CROCANTE DE MANZANA",
    "recipeId": "ywkl6fioh",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA",
        "multiplier": 1,
        "price": 89,
        "divisor": 1
      },
      {
        "name": "porcion",
        "multiplier": 0.125,
        "divisor": 8,
        "price": 13,
        "extraSupplies": [
          {
            "supplyId": "t2436g3i8",
            "quantity": 1
          },
          {
            "supplyId": "eu9oeqopb",
            "quantity": 1
          }
        ]
      }
    ],
    "margin": 200
  },
  {
    "id": "ohf5skydx",
    "name": "RED VELVET CAKE",
    "recipeId": "oq4ol7gkq",
    "type": "single",
    "saleFormats": [
      {
        "name": "entera",
        "multiplier": 1,
        "divisor": 1,
        "price": 107,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ]
      },
      {
        "name": "porcion",
        "multiplier": 0.125,
        "divisor": 8,
        "price": 14,
        "extraSupplies": [
          {
            "supplyId": "e10nwc3qw",
            "quantity": 1
          },
          {
            "supplyId": "372py9pj4",
            "quantity": 1
          }
        ]
      }
    ],
    "margin": 200
  },
  {
    "id": "key1v1wwv",
    "name": "TORTA DE CHOCOLATE FLAT",
    "recipeId": "972ihogu3",
    "type": "single",
    "saleFormats": [
      {
        "name": "FLAT",
        "multiplier": 1,
        "divisor": 1,
        "price": 55,
        "extraSupplies": [
          {
            "supplyId": "26yzwjlv2",
            "quantity": 1
          },
          {
            "supplyId": "b1nymevu4",
            "quantity": 1
          }
        ]
      }
    ],
    "margin": 225,
    "category": "Tortas"
  },
  {
    "id": "jbbxg9uet",
    "name": "CHEESECAKE CRUMBLE DE MANZANA",
    "recipeId": "i07cr2j8y",
    "type": "single",
    "saleFormats": [
      {
        "name": "entera",
        "multiplier": 1,
        "divisor": 1,
        "price": 146,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ]
      },
      {
        "name": "porcion",
        "multiplier": 0.125,
        "divisor": 8,
        "price": 19,
        "extraSupplies": [
          {
            "supplyId": "t2436g3i8",
            "quantity": 1
          },
          {
            "supplyId": "eu9oeqopb",
            "quantity": 1
          },
          {
            "supplyId": "f41ppqlom",
            "quantity": 1
          },
          {
            "supplyId": "oawqbra77",
            "quantity": 1
          }
        ]
      }
    ],
    "margin": 200,
    "category": "Tartas"
  },
  {
    "id": "ca3zazene",
    "name": "CHEESECAKE DE FRESA sin azucar",
    "recipeId": "dnrevg27g",
    "type": "single",
    "saleFormats": [
      {
        "name": "entera",
        "multiplier": 1,
        "divisor": 1,
        "price": 192,
        "extraSupplies": []
      },
      {
        "name": "unidad",
        "multiplier": 0.1,
        "divisor": 10,
        "price": 19,
        "extraSupplies": [
          {
            "supplyId": "",
            "quantity": 1
          }
        ]
      }
    ],
    "margin": 200
  },
  {
    "id": "n1fe5xnne",
    "name": "CHEESECAKE SAUCO sin azucar",
    "recipeId": "qil6wbur0",
    "type": "single",
    "saleFormats": [
      {
        "name": "entera",
        "multiplier": 1,
        "divisor": 1,
        "price": 192,
        "extraSupplies": []
      },
      {
        "name": "unidad",
        "multiplier": 0.1,
        "divisor": 10,
        "price": 19,
        "extraSupplies": [
          {
            "supplyId": "",
            "quantity": 1
          }
        ]
      }
    ],
    "margin": 200
  },
  {
    "id": "tnhtjood0",
    "name": "CHEESECAKE MANGO sin azucar",
    "recipeId": "60ie7hh0a",
    "type": "single",
    "saleFormats": [
      {
        "name": "entera",
        "multiplier": 1,
        "divisor": 1,
        "price": 189,
        "extraSupplies": []
      },
      {
        "name": "unidad",
        "multiplier": 0.1,
        "divisor": 10,
        "price": 19,
        "extraSupplies": []
      }
    ],
    "margin": 200
  },
  {
    "id": "9mff3fnfy",
    "name": "Tiramisú",
    "recipeId": "j8dlg2yns",
    "type": "single",
    "saleFormats": [
      {
        "name": "entera",
        "multiplier": 1,
        "divisor": 1,
        "price": 133,
        "extraSupplies": []
      },
      {
        "name": "unidad",
        "multiplier": 0.1111111111111111,
        "divisor": 9,
        "price": 15,
        "extraSupplies": []
      }
    ],
    "margin": 200
  },
  {
    "id": "msw8uhq95",
    "name": "TORTA HELADA ",
    "recipeId": "iiauihb4c",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA 26 CM ",
        "multiplier": 1,
        "divisor": 1,
        "price": 90,
        "extraSupplies": [
          {
            "supplyId": "hrjf0kmot",
            "quantity": 1
          },
          {
            "supplyId": "0qm4a3l35",
            "quantity": 1
          }
        ]
      },
      {
        "name": "ENTERA 20 CM",
        "multiplier": 0.5,
        "divisor": 2,
        "price": 40,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ]
      },
      {
        "name": "PORCION ",
        "multiplier": 0.0625,
        "divisor": 16,
        "price": 15,
        "extraSupplies": [
          {
            "supplyId": "e10nwc3qw",
            "quantity": 1
          },
          {
            "supplyId": "372py9pj4",
            "quantity": 1
          },
          {
            "supplyId": "oawqbra77",
            "quantity": 1
          },
          {
            "supplyId": "f41ppqlom",
            "quantity": 1
          }
        ]
      }
    ],
    "margin": 200,
    "category": "Tortas"
  },
  {
    "id": "swxiyrobv",
    "name": "TORTA VAINILLA CHOCOCHIPS",
    "recipeId": "m1cfugi44",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA 24 Y 22 CM",
        "multiplier": 1,
        "divisor": 1,
        "price": 122,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ]
      },
      {
        "name": "PORCION",
        "multiplier": 0.125,
        "divisor": 8,
        "price": 16,
        "extraSupplies": [
          {
            "supplyId": "e10nwc3qw",
            "quantity": 1
          },
          {
            "supplyId": "oawqbra77",
            "quantity": 1
          },
          {
            "supplyId": "f41ppqlom",
            "quantity": 1
          },
          {
            "supplyId": "372py9pj4",
            "quantity": 1
          }
        ]
      }
    ],
    "margin": 200
  },
  {
    "id": "y6y2kywt3",
    "name": "TORTA DE CHOCOLATE (1 RELLENO)",
    "recipeId": "g0rbt6vn7",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA",
        "multiplier": 1,
        "divisor": 1,
        "price": 92,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ]
      },
      {
        "name": "PORCION",
        "multiplier": 0.1111111111111111,
        "divisor": 9,
        "price": 11,
        "extraSupplies": [
          {
            "supplyId": "e10nwc3qw",
            "quantity": 1
          },
          {
            "supplyId": "372py9pj4",
            "quantity": 1
          },
          {
            "supplyId": "oawqbra77",
            "quantity": 1
          },
          {
            "supplyId": "f41ppqlom",
            "quantity": 1
          }
        ]
      }
    ],
    "margin": 200
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  "primaryColor": "#F27D26",
  "borderRadius": "1rem",
  "currency": "PEN",
  "language": "es",
  "masterCosts": {
    "salaries": {
      "heavy": {
        "monthly": 1500,
        "hoursPerMonth": 240
      },
      "light": {
        "monthly": 600,
        "hoursPerMonth": 240
      }
    },
    "services": {
      "electricity": {
        "monthly": 200,
        "usagePercent": 50
      },
      "water": {
        "monthly": 20,
        "usagePercent": 40
      },
      "gas": {
        "monthly": 50,
        "usagePercent": 100
      },
      "rent": {
        "monthly": 1000,
        "usagePercent": 200
      },
      "machinery": {
        "monthly": 37.5,
        "usagePercent": 100
      },
      "utensils": {
        "monthly": 12.5,
        "usagePercent": 100
      }
    },
    "taxes": {
      "igv": 18,
      "salesTax": 1.5
    }
  },
  "whatsappPhone": "923506309"
};
