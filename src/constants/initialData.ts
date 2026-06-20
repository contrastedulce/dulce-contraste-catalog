import { Product, AppSettings, Recipe } from '../types';

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
        "price": 20,
        "extraSupplies": [],
        "availability": "on_order",
        "leadTime": "",
        "image": "https://i.postimg.cc/T1D6tqcJ/Captura-de-pantalla-2026-05-05-113110.png"
      }
    ],
    "margin": 200,
    "image": "https://i.postimg.cc/T1D6tqcJ/Captura-de-pantalla-2026-05-05-113110.png",
    "description": "Disfruta nuestro Tres Leches de Piña Colada: un bizcocho esponjoso bañado en una mezcla cremosa de leches y coco, con un toque de ron. Relleno de piña fresca y cubierto con una suave crema tropical, es un postre jugoso, refrescante y lleno de sabor caribeño. 🌴✨\n\n🌴 Un viaje tropical en cada bocado.",
    "category": "Tortas",
    "isActive": true
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
        "price": 3,
        "availability": "on_order"
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
        ],
        "availability": "on_order"
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "image": "https://i.postimg.cc/3RMfWYG8/Captura-de-pantalla-2026-05-16-123830.png",
    "description": "Sumérgete en el placer absoluto con nuestra torta de chocolate: un bizcocho intensamente húmedo, bañado en almíbar de chocolate que potencia cada capa. En su interior, un generoso relleno de manjar de olla, cremoso y profundo en sabor. Todo cubierto con un seductor fudge de chocolate y coronado con finas virutas de chocolate bitter que equilibran el dulzor.\nCada bocado es pura tentación. 🍫",
    "category": "Tortas",
    "categoryGroup": "TORTA DE CHOCOLATE",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "c8vj47uvi",
    "name": " TORTA CHOCOLATE Y MANJAR BANDEJA",
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
        ],
        "availability": "in_stock",
        "leadTime": ""
      }
    ],
    "margin": 200,
    "image": "https://photos.app.goo.gl/geMojScRmzwJGGXW9",
    "category": "Tortas",
    "categoryGroup": "TORTA DE CHOCOLATE"
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
      },
      {
        "name": "bowl x15",
        "multiplier": 15,
        "divisor": 0.06666666666666667,
        "price": 18,
        "extraSupplies": [
          {
            "supplyId": "apmlhkrto",
            "quantity": 1
          },
          {
            "supplyId": "",
            "quantity": 1
          }
        ],
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
    "margin": 30,
    "category": "Galletas"
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
        "divisor": 1,
        "availability": "on_order"
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
        ],
        "availability": "on_order"
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
        ],
        "availability": "on_order"
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas"
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 225,
    "category": "Tortas",
    "categoryGroup": "TORTA DE CHOCOLATE"
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
        ],
        "availability": "on_order"
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
        ],
        "availability": "on_order"
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
        "extraSupplies": [],
        "availability": "on_order"
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tartas"
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
        "extraSupplies": [],
        "availability": "on_order"
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tartas"
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
        "extraSupplies": [],
        "availability": "on_order"
      },
      {
        "name": "unidad",
        "multiplier": 0.1,
        "divisor": 10,
        "price": 19,
        "extraSupplies": [],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tartas"
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
        ],
        "availability": "on_order"
      },
      {
        "name": "ENTERA 20 CM",
        "multiplier": 0.5,
        "divisor": 2,
        "price": 45,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ],
        "availability": "on_order"
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
        ],
        "availability": "on_order"
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
        ],
        "availability": "on_order"
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas"
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
        ],
        "availability": "on_order"
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas",
    "categoryGroup": "TORTA DE CHOCOLATE",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "pj0be1ijw",
    "name": "BROWNIES",
    "recipeId": "rnqiwb5n3",
    "type": "single",
    "saleFormats": [
      {
        "name": "UNIDAD",
        "multiplier": 0.06666666666666667,
        "divisor": 15,
        "price": 2,
        "extraSupplies": [
          {
            "supplyId": "",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      },
      {
        "name": "MINI",
        "multiplier": 0.016666666666666666,
        "divisor": 60,
        "price": 1,
        "extraSupplies": [],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Bocaditos Dulces y Salados",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "fhfxf6c3k",
    "name": "TRES LECHES",
    "recipeId": "8ujdul8ll",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA",
        "multiplier": 1,
        "price": 82,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ],
        "leadTime": "24h",
        "availability": "on_order"
      },
      {
        "name": "BANDEJA",
        "multiplier": 0.16666666666666666,
        "divisor": 6,
        "price": 14,
        "extraSupplies": [
          {
            "supplyId": "arn4rb0qq",
            "quantity": 1
          },
          {
            "supplyId": "f41ppqlom",
            "quantity": 1
          },
          {
            "supplyId": "oawqbra77",
            "quantity": 1
          },
          {
            "supplyId": "372py9pj4",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas",
    "categoryGroup": "TRES LECHES",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "ob3sne0q6",
    "name": "TRES LECHES CAFE",
    "recipeId": "gddphl9f9",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA",
        "multiplier": 1,
        "price": 80,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      },
      {
        "name": "BANDEJA",
        "multiplier": 0.16666666666666666,
        "divisor": 6,
        "price": 15,
        "extraSupplies": [
          {
            "supplyId": "arn4rb0qq",
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
            "supplyId": "372py9pj4",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas",
    "categoryGroup": "TRES LECHES",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "ajfcmqak9",
    "name": "TRES LECHES",
    "recipeId": "5gl2fqruc",
    "type": "single",
    "saleFormats": [
      {
        "name": "FLAT ",
        "multiplier": 1,
        "price": 80,
        "extraSupplies": [
          {
            "supplyId": "26yzwjlv2",
            "quantity": 1
          },
          {
            "supplyId": "b1nymevu4",
            "quantity": 1
          },
          {
            "supplyId": "",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas",
    "categoryGroup": "TRES LECHES CLASICA",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "hwnb6qikm",
    "name": "COPA DE PROFITEROLES",
    "recipeId": "x33bempjl",
    "type": "single",
    "saleFormats": [
      {
        "name": "Unidad",
        "multiplier": 8,
        "price": 0,
        "extraSupplies": [
          {
            "supplyId": "",
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
        ],
        "availability": "on_order",
        "divisor": 0.125
      }
    ],
    "margin": 200,
    "category": "Pasteles",
    "categoryGroup": "PROFITEROLES",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "msvd78o83",
    "name": "TENTACION DE CAFE SIN AZUCAR 18 CM",
    "recipeId": "4i879u2j9",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA ",
        "multiplier": 1,
        "price": 106,
        "extraSupplies": [
          {
            "supplyId": "4lh9hri9w",
            "quantity": 1
          },
          {
            "supplyId": "qjvk0w1or",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      },
      {
        "name": "PARA MI",
        "multiplier": 0.16666666666666666,
        "divisor": 6,
        "price": 22,
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
        ],
        "availability": "in_stock",
        "leadTime": ""
      }
    ],
    "margin": 200,
    "image": "https://i.postimg.cc/4d9GG0xY/Captura-de-pantalla-2026-05-09-120550.png",
    "category": "Tortas",
    "categoryGroup": "TORTA DE CAFE ",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "084f69648",
    "name": "TENTACION DE CAFE 18 CM",
    "recipeId": "153hlxlrl",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA",
        "multiplier": 1,
        "price": 74,
        "availability": "on_order",
        "extraSupplies": [
          {
            "supplyId": "4lh9hri9w",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ]
      },
      {
        "name": "PARA MI",
        "multiplier": 0.16666666666666666,
        "divisor": 6,
        "price": 12,
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas",
    "categoryGroup": "TORTA DE CAFE ",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "h6hy5jo6i",
    "name": "TORTA NARANJA/MANGO",
    "recipeId": "2iz9s72g6",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA ",
        "multiplier": 1,
        "price": 119,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "0qm4a3l35",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      },
      {
        "name": "PARA MI ",
        "multiplier": 0.125,
        "divisor": 8,
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
            "supplyId": "f41ppqlom",
            "quantity": 1
          },
          {
            "supplyId": "oawqbra77",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas",
    "categoryGroup": "",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "l9lp4o8ko",
    "name": "TROPICAL CAKE",
    "recipeId": "2hba4fp6z",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA 18CM",
        "multiplier": 1,
        "price": 127,
        "availability": "on_order",
        "extraSupplies": [
          {
            "supplyId": "4lh9hri9w",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ]
      },
      {
        "name": "ENTERA 22CM",
        "multiplier": 1.5,
        "divisor": 0.6666666666666666,
        "price": 184,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ],
        "availability": "on_order"
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
            "supplyId": "372py9pj4",
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas",
    "categoryGroup": "TORTA DE NARANJA",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "21mxcx289",
    "name": "TORTA DE LIMON Y ARANDANO",
    "recipeId": "hzjcfz028",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA ",
        "multiplier": 1,
        "price": 0,
        "extraSupplies": [
          {
            "supplyId": "cgzfqc039",
            "quantity": 400
          },
          {
            "supplyId": "",
            "quantity": 1
          },
          {
            "supplyId": "",
            "quantity": 1
          },
          {
            "supplyId": "",
            "quantity": 1
          },
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "0qm4a3l35",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas",
    "categoryGroup": "",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "ahjznzuar",
    "name": "TORTA DE LIMON Y ARANDANO",
    "recipeId": "zodavyfy6",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA",
        "multiplier": 1,
        "price": 166,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4gezry0pm",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      },
      {
        "name": "PORCION",
        "multiplier": 0.1111111111111111,
        "divisor": 9,
        "price": 18,
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas",
    "categoryGroup": "TORTA DE LIMON Y ARANDANO",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "64r9rcvki",
    "name": "PARA MI",
    "recipeId": "8dqbs705m",
    "type": "single",
    "saleFormats": [
      {
        "name": "Unidad",
        "multiplier": 0.1,
        "price": 21,
        "divisor": 10,
        "extraSupplies": [
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tortas",
    "categoryGroup": "TORTA DE LIMON Y ARANDANO",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "y2p9t9kdz",
    "name": "PIE DE LIMON",
    "recipeId": "u4lyqoeyu",
    "type": "single",
    "saleFormats": [
      {
        "name": "ENTERA",
        "multiplier": 1,
        "price": 71,
        "extraSupplies": [
          {
            "supplyId": "1ov3sngi9",
            "quantity": 1
          },
          {
            "supplyId": "4g1mszpcj",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      },
      {
        "name": "MEDIA",
        "multiplier": 0.5,
        "divisor": 2,
        "price": 0,
        "extraSupplies": [
          {
            "supplyId": "26yzwjlv2",
            "quantity": 1
          },
          {
            "supplyId": "b1nymevu4",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      },
      {
        "name": "PARA MI",
        "multiplier": 0.125,
        "divisor": 8,
        "price": 9,
        "extraSupplies": [
          {
            "supplyId": "zr83p6xka",
            "quantity": 1
          },
          {
            "supplyId": "eu9oeqopb",
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
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Tartas",
    "categoryGroup": "",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "d02zwrkvc",
    "name": "CRINKLE DE CHOCOLATE",
    "recipeId": "k7l4ir8aj",
    "type": "single",
    "saleFormats": [
      {
        "name": "DECENA",
        "multiplier": 10,
        "price": 16,
        "divisor": 0.1,
        "extraSupplies": [
          {
            "supplyId": "2r7ko8dnz",
            "quantity": 1
          },
          {
            "supplyId": "372py9pj4",
            "quantity": 1
          }
        ],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Galletas",
    "categoryGroup": "",
    "isActive": true,
    "isFeatured": false
  },
  {
    "id": "qpmbxc06x",
    "name": "arabito queso,espinaca y tocino",
    "recipeId": "5cst5axe3",
    "type": "single",
    "saleFormats": [
      {
        "name": "Unidad",
        "multiplier": 1,
        "price": 3,
        "availability": "on_order"
      },
      {
        "name": "centena",
        "multiplier": 100,
        "divisor": 0.01,
        "price": 325,
        "extraSupplies": [],
        "availability": "on_order"
      }
    ],
    "margin": 200,
    "category": "Bocaditos Dulces y Salados",
    "categoryGroup": "",
    "isActive": true,
    "isFeatured": false
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
  "whatsappPhone": "923506309",
  "deliveryZones": []
};

export const INITIAL_RECIPES: Recipe[] = [
  {
    "id": "jhzojxroi",
    "name": "Bizcocho base",
    "type": "sub",
    "ingredients": [
      {
        "supplyId": "fbqw3duz6",
        "quantity": 4
      },
      {
        "supplyId": "yslt8wfyl",
        "quantity": 120
      },
      {
        "supplyId": "dpqr41o7p",
        "quantity": 55
      },
      {
        "supplyId": "bzu0kzinx",
        "quantity": 40
      },
      {
        "supplyId": "elqp6m4nd",
        "quantity": 2
      },
      {
        "supplyId": "y9tyjb74t",
        "quantity": 28
      },
      {
        "supplyId": "4ndlrnhez",
        "quantity": 28
      },
      {
        "supplyId": "oy5aaxczp",
        "quantity": 55
      }
    ],
    "equipment": [
      {
        "equipmentId": "",
        "hoursUsed": 0
      }
    ],
    "laborCost": 1,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "bizcocho"
  },
  {
    "id": "zl4cnqepw",
    "name": "mescla de leches",
    "type": "sub",
    "ingredients": [
      {
        "supplyId": "xd58iotwm",
        "quantity": 185
      },
      {
        "supplyId": "j0wohqlkm",
        "quantity": 90
      },
      {
        "supplyId": "sdmh7ppfw",
        "quantity": 300
      },
      {
        "supplyId": "yv6cktt18",
        "quantity": 300
      },
      {
        "supplyId": "1ygdxlj3l",
        "quantity": 35
      },
      {
        "supplyId": "9yfysmwsu",
        "quantity": 1
      }
    ],
    "equipment": [],
    "laborCost": 0.5,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 913,
    "yieldUnit": "ml"
  },
  {
    "id": "vxmi6f48w",
    "name": "Compota de Piña Colada",
    "type": "sub",
    "ingredients": [
      {
        "supplyId": "r0r1cncrn",
        "quantity": 167
      },
      {
        "supplyId": "baehzs086",
        "quantity": 13
      },
      {
        "supplyId": "yslt8wfyl",
        "quantity": 60
      },
      {
        "supplyId": "btetrgecp",
        "quantity": 4
      },
      {
        "supplyId": "1ygdxlj3l",
        "quantity": 20
      }
    ],
    "equipment": [
      {
        "equipmentId": "unknown",
        "hoursUsed": 0.1
      },
      {
        "equipmentId": "unknown",
        "hoursUsed": 0.1
      }
    ],
    "laborCost": 0.75,
    "yield": 1,
    "yieldUnit": "batch"
  },
  {
    "id": "3bq6vbz69",
    "name": "Crema de Piña Colada",
    "type": "sub",
    "ingredients": [
      {
        "supplyId": "asxtu27b9",
        "quantity": 275
      },
      {
        "supplyId": "yslt8wfyl",
        "quantity": 63
      },
      {
        "supplyId": "y9tyjb74t",
        "quantity": 38
      },
      {
        "supplyId": "wq5jbfw2k",
        "quantity": 132
      },
      {
        "supplyId": "1ygdxlj3l",
        "quantity": 38
      },
      {
        "supplyId": "r0r1cncrn",
        "quantity": 120
      }
    ],
    "equipment": [
      {
        "equipmentId": "2",
        "hoursUsed": 0.2
      }
    ],
    "laborCost": 1,
    "yield": 1,
    "yieldUnit": "batch"
  },
  {
    "id": "1r5gls5by",
    "name": "Decoración de Piña Colada",
    "type": "sub",
    "ingredients": [
      {
        "supplyId": "oxlh33nef",
        "quantity": 30
      },
      {
        "supplyId": "mea69wqys",
        "quantity": 6
      },
      {
        "supplyId": "wq5jbfw2k",
        "quantity": 2
      }
    ],
    "equipment": [],
    "laborCost": 0.2,
    "yield": 1,
    "yieldUnit": "assembly"
  },
  {
    "id": "znmq55lqk",
    "name": "TRES LECHES DE PIÑA COLADA",
    "type": "complete",
    "ingredients": [
      {
        "recipeId": "jhzojxroi",
        "quantity": 1
      },
      {
        "recipeId": "zl4cnqepw",
        "quantity": 913
      },
      {
        "recipeId": "vxmi6f48w",
        "quantity": 1
      },
      {
        "recipeId": "3bq6vbz69",
        "quantity": 1
      },
      {
        "recipeId": "1r5gls5by",
        "quantity": 1
      }
    ],
    "equipment": [
      {
        "equipmentId": "1",
        "hoursUsed": 0.5,
        "wattsUsed": 1700
      },
      {
        "equipmentId": "2",
        "hoursUsed": 0.2,
        "wattsUsed": 375
      }
    ],
    "laborCost": 5,
    "laborMinutes": {
      "heavy": 10,
      "light": 30
    },
    "serviceMinutes": {
      "electricity": 15,
      "water": 5,
      "gas": 0,
      "machinery": 42,
      "utensils": 5
    },
    "extraCosts": {
      "biosecurity": 1,
      "packaging": 3
    },
    "yield": 1,
    "yieldUnit": "porciones"
  },
  {
    "id": "9jcdyimue",
    "name": "manjar de olla",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 780,
        "supplyId": "j0wohqlkm"
      },
      {
        "quantity": 780,
        "supplyId": "lf1fbo6av"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 980,
    "yieldUnit": "gr"
  },
  {
    "id": "v1pzthcee",
    "name": "manjar de olla pisco",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 390,
        "supplyId": "j0wohqlkm"
      },
      {
        "quantity": 390,
        "supplyId": "lf1fbo6av"
      },
      {
        "quantity": 60,
        "supplyId": "g8byylwoz"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 490,
    "yieldUnit": "gr"
  },
  {
    "id": "m4p5052q8",
    "name": "manjar de olla pisco (Copia)",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 390,
        "supplyId": "j0wohqlkm"
      },
      {
        "quantity": 390,
        "supplyId": "lf1fbo6av"
      },
      {
        "quantity": 60,
        "supplyId": "vvuwpw558"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 490,
    "yieldUnit": "gr"
  },
  {
    "id": "vqle6g10v",
    "name": "FROSTING",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 75,
        "supplyId": "58r7s5tgk"
      },
      {
        "quantity": 75,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 150,
        "supplyId": "2zv3hf4bk"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 300,
    "yieldUnit": "gr"
  },
  {
    "id": "hpsn13bej",
    "name": "Cheesecakes hearts",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 240,
        "supplyId": "qp1x6n9tl"
      },
      {
        "quantity": 75,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 75,
        "supplyId": "lbp8zjoce"
      },
      {
        "quantity": 220,
        "supplyId": "58r7s5tgk"
      },
      {
        "quantity": 225,
        "supplyId": "yv6cktt18"
      },
      {
        "quantity": 0,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 7,
        "supplyId": "2jxqc40rz"
      },
      {
        "quantity": 220,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 2,
        "supplyId": "jv5mewdup"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 30,
      "light": 30
    },
    "serviceMinutes": {
      "electricity": 30,
      "water": 10,
      "gas": 0,
      "machinery": 30,
      "utensils": 30
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 40,
    "yieldUnit": "un"
  },
  {
    "id": "rr1edzoa9",
    "name": "Cheesecakes hearts",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 240,
        "supplyId": "qp1x6n9tl"
      },
      {
        "quantity": 75,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 75,
        "supplyId": "lbp8zjoce"
      },
      {
        "quantity": 220,
        "supplyId": "58r7s5tgk"
      },
      {
        "quantity": 225,
        "supplyId": "yv6cktt18"
      },
      {
        "quantity": 0,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 7,
        "supplyId": "2jxqc40rz"
      },
      {
        "quantity": 220,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 2,
        "supplyId": "jv5mewdup"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "umt3hmgd4",
    "name": "Fudge ",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 780,
        "supplyId": "j0wohqlkm"
      },
      {
        "quantity": 780,
        "supplyId": "lf1fbo6av"
      },
      {
        "quantity": 85,
        "supplyId": "jjxw9ho6g"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 5,
      "gas": 180,
      "machinery": 0,
      "utensils": 60
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1100,
    "yieldUnit": "gr"
  },
  {
    "id": "1yf1b7ad1",
    "name": "ALMIBAR DE CHOCOLATE",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 300,
        "supplyId": "y9tyjb74t"
      },
      {
        "quantity": 375,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 30,
        "supplyId": "jjxw9ho6g"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 5,
      "gas": 20,
      "machinery": 0,
      "utensils": 5
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 750,
    "yieldUnit": "ML"
  },
  {
    "id": "wo6gx6y4j",
    "name": "QUEQUE DE CHOCOLATE (base)",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 500,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 215,
        "supplyId": "3x0rluvr0"
      },
      {
        "quantity": 135,
        "supplyId": "4ndlrnhez"
      },
      {
        "quantity": 4,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 10,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 375,
        "supplyId": "y9tyjb74t"
      },
      {
        "quantity": 4,
        "supplyId": "5ciegmvso"
      },
      {
        "quantity": 375,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 12,
        "supplyId": "9x5x72cfn"
      },
      {
        "quantity": 5,
        "supplyId": "pzrf2y0el"
      },
      {
        "quantity": 4,
        "supplyId": "9yfysmwsu"
      },
      {
        "quantity": 85,
        "supplyId": "jjxw9ho6g"
      },
      {
        "quantity": 10,
        "supplyId": "ufb1zjt8x"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 3,
    "yieldUnit": "UND"
  },
  {
    "id": "yxhdqtplj",
    "name": "TORTA DE CHOCOLATE",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 1,
        "recipeId": "wo6gx6y4j"
      },
      {
        "quantity": 500,
        "supplyId": "cgzfqc039"
      },
      {
        "quantity": 250,
        "supplyId": "qokstlusd"
      },
      {
        "quantity": 100,
        "supplyId": "mlu9fw1gz"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "elbnmf4kv",
    "name": "TORTA DE CHOCOLATE bandeja",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 3,
        "recipeId": "wo6gx6y4j"
      },
      {
        "quantity": 450,
        "supplyId": "cgzfqc039"
      },
      {
        "quantity": 450,
        "supplyId": "qokstlusd"
      },
      {
        "quantity": 100,
        "supplyId": "mlu9fw1gz"
      },
      {
        "quantity": 80,
        "supplyId": "mea69wqys"
      },
      {
        "quantity": 300,
        "recipeId": "1yf1b7ad1"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 9,
    "yieldUnit": "un"
  },
  {
    "id": "6sjjhrru0",
    "name": "Cheesecakes hearts",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 240,
        "supplyId": "qp1x6n9tl"
      },
      {
        "quantity": 75,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 75,
        "supplyId": "lbp8zjoce"
      },
      {
        "quantity": 220,
        "supplyId": "58r7s5tgk"
      },
      {
        "quantity": 225,
        "supplyId": "yv6cktt18"
      },
      {
        "quantity": 0,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 7,
        "supplyId": "2jxqc40rz"
      },
      {
        "quantity": 220,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 2,
        "supplyId": "jv5mewdup"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 40,
    "yieldUnit": "un"
  },
  {
    "id": "ozy9h9m4u",
    "name": "galletas de avena",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 250,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 220,
        "supplyId": "3x0rluvr0"
      },
      {
        "quantity": 200,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 2,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 320,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 5,
        "supplyId": "9x5x72cfn"
      },
      {
        "quantity": 5,
        "supplyId": "pzrf2y0el"
      },
      {
        "quantity": 4,
        "supplyId": "9yfysmwsu"
      },
      {
        "quantity": 5,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 220,
        "supplyId": "b72rywqdt"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 90,
    "yieldUnit": "un"
  },
  {
    "id": "r2hlcfatn",
    "name": "galletas de avena lakanto",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 220,
        "supplyId": "7d40nyxn9"
      },
      {
        "quantity": 200,
        "supplyId": "wjevllv3v"
      },
      {
        "quantity": 225,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 2,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 320,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 5,
        "supplyId": "9x5x72cfn"
      },
      {
        "quantity": 5,
        "supplyId": "pzrf2y0el"
      },
      {
        "quantity": 4,
        "supplyId": "9yfysmwsu"
      },
      {
        "quantity": 5,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 220,
        "supplyId": "b72rywqdt"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 90,
    "yieldUnit": "un"
  },
  {
    "id": "ah5ekwsi1",
    "name": "Crocante de manzana (relleno)",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 1000,
        "supplyId": "x74p2sn68"
      },
      {
        "quantity": 30,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 30,
        "supplyId": "lbp8zjoce"
      },
      {
        "quantity": 40,
        "supplyId": "3x0rluvr0"
      },
      {
        "quantity": 40,
        "supplyId": "ld4hfma38"
      },
      {
        "quantity": 60,
        "supplyId": "g8byylwoz"
      },
      {
        "quantity": 5,
        "supplyId": "khn2qw6wp"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "7lvreo06t",
    "name": "Crocante de manzana (base)",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 100,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 100,
        "supplyId": "lbp8zjoce"
      },
      {
        "quantity": 240,
        "supplyId": "3x0rluvr0"
      },
      {
        "quantity": 2,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 5,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 300,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 5,
        "supplyId": "khn2qw6wp"
      },
      {
        "quantity": 4,
        "supplyId": "9yfysmwsu"
      },
      {
        "quantity": 60,
        "supplyId": "b72rywqdt"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "ywkl6fioh",
    "name": "Crocante de manzana",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 1,
        "recipeId": "7lvreo06t"
      },
      {
        "quantity": 1,
        "recipeId": "ah5ekwsi1"
      },
      {
        "quantity": 1,
        "supplyId": "uttt5qpic"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "3e7mivv10",
    "name": "QUEQUE RED VELVET ",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 250,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 10,
        "supplyId": "9x5x72cfn"
      },
      {
        "quantity": 4,
        "supplyId": "9yfysmwsu"
      },
      {
        "quantity": 10,
        "supplyId": "jjxw9ho6g"
      },
      {
        "quantity": 500,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 180,
        "supplyId": "4ndlrnhez"
      },
      {
        "quantity": 10,
        "supplyId": "ufb1zjt8x"
      },
      {
        "quantity": 10,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 4,
        "supplyId": "5ciegmvso"
      },
      {
        "quantity": 3,
        "supplyId": "jv5mewdup"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 3,
    "yieldUnit": "und"
  },
  {
    "id": "wn842b7pv",
    "name": "almibar de canela",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 250,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 5,
        "supplyId": "khn2qw6wp"
      },
      {
        "quantity": 5,
        "supplyId": "a0cykragp"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 500,
    "yieldUnit": "ml"
  },
  {
    "id": "oq4ol7gkq",
    "name": "RED VELVET CAKE",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 3,
        "recipeId": "3e7mivv10"
      },
      {
        "quantity": 300,
        "recipeId": "wn842b7pv"
      },
      {
        "quantity": 650,
        "recipeId": "vqle6g10v"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "972ihogu3",
    "name": "TORTA DE CHOCOLATE FLAT",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 1,
        "recipeId": "wo6gx6y4j"
      },
      {
        "quantity": 200,
        "supplyId": "cgzfqc039"
      },
      {
        "quantity": 200,
        "supplyId": "qokstlusd"
      },
      {
        "quantity": 100,
        "supplyId": "mlu9fw1gz"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "ykna43z51",
    "name": "CHEESECAKE CRUMBLE DE MANZANA base",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 120,
        "supplyId": "qp1x6n9tl"
      },
      {
        "quantity": 60,
        "supplyId": "bn90y50on"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "imexwoaua",
    "name": "CHEESECAKE CRUMBLE DE MANZANA relleno",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 338,
        "supplyId": "58r7s5tgk"
      },
      {
        "quantity": 3,
        "supplyId": "2jxqc40rz"
      },
      {
        "quantity": 1,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 225,
        "supplyId": "yv6cktt18"
      },
      {
        "quantity": 22,
        "supplyId": "bzu0kzinx"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "d8yd0jd6d",
    "name": "CHEESECAKE CRUMBLE DE MANZANA relleno 2",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 30,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 500,
        "supplyId": "x74p2sn68"
      },
      {
        "quantity": 3,
        "supplyId": "khn2qw6wp"
      },
      {
        "quantity": 1,
        "supplyId": "9r9s5lndq"
      },
      {
        "quantity": 1,
        "supplyId": "lcbvg0xe4"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "mpprbksqs",
    "name": "CHEESECAKE CRUMBLE DE MANZANA crumble",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 90,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 50,
        "supplyId": "bn90y50on"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "i07cr2j8y",
    "name": "CHEESECAKE CRUMBLE DE MANZANA",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 1,
        "recipeId": "ykna43z51"
      },
      {
        "quantity": 1,
        "recipeId": "imexwoaua"
      },
      {
        "quantity": 1,
        "recipeId": "d8yd0jd6d"
      },
      {
        "quantity": 1,
        "recipeId": "mpprbksqs"
      },
      {
        "quantity": 230,
        "supplyId": "9vkafijw4",
        "isFixed": true
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "23v5pige2",
    "name": "cheesecake sin azucar  (relleno)",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 681,
        "supplyId": "58r7s5tgk",
        "isFixed": false
      },
      {
        "quantity": 400,
        "supplyId": "yv6cktt18"
      },
      {
        "quantity": 50,
        "supplyId": "2zv3hf4bk"
      },
      {
        "quantity": 3,
        "supplyId": "ohnkd2ntd"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "hp7car6p1",
    "name": "base de galletas ",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 240,
        "supplyId": "qp1x6n9tl"
      },
      {
        "quantity": 50,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 50,
        "supplyId": "lbp8zjoce"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "dnrevg27g",
    "name": "CHEESECAKE DE FRESA sin azucar",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 1,
        "recipeId": "23v5pige2"
      },
      {
        "quantity": 1,
        "recipeId": "hp7car6p1"
      },
      {
        "quantity": 100,
        "supplyId": "9vkafijw4",
        "isFixed": true
      },
      {
        "quantity": 250,
        "supplyId": "1rnuok126",
        "isFixed": true
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "qil6wbur0",
    "name": "CHEESECAKE SAUCO sin azucar ",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 1,
        "recipeId": "23v5pige2"
      },
      {
        "quantity": 1,
        "recipeId": "hp7car6p1"
      },
      {
        "quantity": 100,
        "supplyId": "9vkafijw4",
        "isFixed": true
      },
      {
        "quantity": 250,
        "supplyId": "zr1jiernx",
        "isFixed": true
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "60ie7hh0a",
    "name": "CHEESECAKE MANGO sin azucar ",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 1,
        "recipeId": "23v5pige2"
      },
      {
        "quantity": 1,
        "recipeId": "hp7car6p1"
      },
      {
        "quantity": 100,
        "supplyId": "9vkafijw4",
        "isFixed": true
      },
      {
        "quantity": 180,
        "supplyId": "soca1q5s6",
        "isFixed": false
      },
      {
        "quantity": 5,
        "supplyId": "bzu0kzinx"
      },
      {
        "quantity": 50,
        "supplyId": "9vkafijw4",
        "isFixed": true
      },
      {
        "quantity": 200,
        "supplyId": "hi972w8jk"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "j8dlg2yns",
    "name": "Tiramisu",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 6,
        "supplyId": "2jxqc40rz"
      },
      {
        "quantity": 160,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 150,
        "supplyId": "y9tyjb74t"
      },
      {
        "quantity": 317,
        "supplyId": "yv6cktt18"
      },
      {
        "quantity": 5,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 15,
        "supplyId": "2zv3hf4bk"
      },
      {
        "quantity": 250,
        "supplyId": "7fu60ocok",
        "isFixed": true
      },
      {
        "quantity": 250,
        "supplyId": "58r7s5tgk"
      },
      {
        "quantity": 5,
        "supplyId": "5ciegmvso"
      },
      {
        "quantity": 60,
        "supplyId": "1ygdxlj3l"
      },
      {
        "quantity": 50,
        "supplyId": "lmt8exjw2",
        "isFixed": true
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "u1xkhjuh5",
    "name": "Bizcocho t.helada",
    "type": "sub",
    "ingredients": [
      {
        "supplyId": "fbqw3duz6",
        "quantity": 4
      },
      {
        "supplyId": "yslt8wfyl",
        "quantity": 120
      },
      {
        "supplyId": "dpqr41o7p",
        "quantity": 90
      },
      {
        "supplyId": "bzu0kzinx",
        "quantity": 30
      }
    ],
    "equipment": [
      {
        "equipmentId": "",
        "hoursUsed": 0
      }
    ],
    "laborCost": 1,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "bizcocho"
  },
  {
    "id": "ewid4kekj",
    "name": "ESPEJO t.helada",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 200,
        "supplyId": "4l0phm031"
      },
      {
        "quantity": 20,
        "supplyId": "tqmpyj9od"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "8spjv3ey5",
    "name": "CHARLOTTE t.helada",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 200,
        "supplyId": "4l0phm031"
      },
      {
        "quantity": 20,
        "supplyId": "tqmpyj9od"
      },
      {
        "quantity": 780,
        "supplyId": "j0wohqlkm"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "iiauihb4c",
    "name": "TORTA HELADA FRESA ",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 1,
        "recipeId": "u1xkhjuh5"
      },
      {
        "quantity": 1,
        "recipeId": "ewid4kekj"
      },
      {
        "quantity": 1,
        "recipeId": "8spjv3ey5"
      },
      {
        "quantity": 1,
        "recipeId": "4iiyrjjtv"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "4iiyrjjtv",
    "name": "ALMIBAR t. helada",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 100,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 15,
        "supplyId": "g8byylwoz"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "1b4zje0sk",
    "name": "QUEQUE VIANILLA CHOCOCHIP",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 300,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 100,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 100,
        "supplyId": "lbp8zjoce"
      },
      {
        "quantity": 100,
        "supplyId": "4ndlrnhez"
      },
      {
        "quantity": 10,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 6,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 300,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 6,
        "supplyId": "pzrf2y0el"
      },
      {
        "quantity": 120,
        "supplyId": "j0wohqlkm"
      },
      {
        "quantity": 150,
        "supplyId": "hgbxvuuch"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 3,
    "yieldUnit": "UN"
  },
  {
    "id": "m1cfugi44",
    "name": "TORTA VAINILLA CHOCOCHIPS",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 3,
        "recipeId": "1b4zje0sk"
      },
      {
        "quantity": 210,
        "recipeId": "i692fvqqs"
      },
      {
        "quantity": 250,
        "recipeId": "vqle6g10v"
      },
      {
        "quantity": 500,
        "supplyId": "cgzfqc039"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "i692fvqqs",
    "name": "ALMIBAR  VAINILLA",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 80,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 5,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 15,
        "supplyId": "g8byylwoz"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 300,
    "yieldUnit": "ML"
  },
  {
    "id": "g0rbt6vn7",
    "name": "TORTA DE CHOCOLATE (1 relleno)",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 200,
        "recipeId": "1yf1b7ad1"
      },
      {
        "quantity": 3,
        "recipeId": "wo6gx6y4j"
      },
      {
        "quantity": 250,
        "supplyId": "cgzfqc039"
      },
      {
        "quantity": 250,
        "supplyId": "qokstlusd"
      },
      {
        "quantity": 100,
        "supplyId": "mlu9fw1gz"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "rnqiwb5n3",
    "name": "BROWNIES",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 100,
        "supplyId": "lbp8zjoce"
      },
      {
        "quantity": 100,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 400,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 3,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 280,
        "supplyId": "dpqr41o7p"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "2d38seymv",
    "name": "GENOVESA base",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 4,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 120,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 90,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 30,
        "supplyId": "bzu0kzinx"
      },
      {
        "quantity": 5,
        "supplyId": "a0cykragp"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 435,
    "yieldUnit": "gr"
  },
  {
    "id": "pqyf14bq2",
    "name": "BAÑO DE LECHES",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 300,
        "supplyId": "sdmh7ppfw"
      },
      {
        "quantity": 150,
        "supplyId": "yv6cktt18"
      },
      {
        "quantity": 200,
        "supplyId": "j0wohqlkm"
      },
      {
        "quantity": 250,
        "supplyId": "y9tyjb74t"
      },
      {
        "quantity": 20,
        "supplyId": "g8byylwoz"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 915,
    "yieldUnit": "GR"
  },
  {
    "id": "urj2ya4ch",
    "name": "CHANTILLY ",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 210,
        "supplyId": "asxtu27b9"
      },
      {
        "quantity": 210,
        "supplyId": "yv6cktt18"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 420,
    "yieldUnit": "g"
  },
  {
    "id": "8ujdul8ll",
    "name": "TRES LECHES CLASICA ",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 1,
        "recipeId": "2d38seymv"
      },
      {
        "quantity": 915,
        "recipeId": "pqyf14bq2"
      },
      {
        "quantity": 419,
        "recipeId": "urj2ya4ch"
      },
      {
        "quantity": 10,
        "supplyId": "jjxw9ho6g"
      },
      {
        "quantity": 100,
        "supplyId": "rsqp5eqnw"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "gddphl9f9",
    "name": "TRES LECHES  CAFE",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 432,
        "recipeId": "2d38seymv"
      },
      {
        "quantity": 915,
        "recipeId": "pqyf14bq2"
      },
      {
        "quantity": 419,
        "recipeId": "urj2ya4ch"
      },
      {
        "quantity": 4,
        "supplyId": "5ciegmvso"
      },
      {
        "quantity": 60,
        "supplyId": "mlu9fw1gz"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "5gl2fqruc",
    "name": "TRES LECHES CLASICA FLAT",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 288,
        "recipeId": "2d38seymv"
      },
      {
        "quantity": 600,
        "recipeId": "pqyf14bq2"
      },
      {
        "quantity": 280,
        "recipeId": "urj2ya4ch"
      },
      {
        "quantity": 10,
        "supplyId": "jjxw9ho6g"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "8vyntkme1",
    "name": "PASTA CHOUX",
    "type": "sub",
    "ingredients": [
      {
        "id": "ux8y1abu9",
        "supplyId": "y9tyjb74t",
        "quantity": 200,
        "isFixed": false
      },
      {
        "id": "7vrsxh90s",
        "supplyId": "bn90y50on",
        "quantity": 180,
        "isFixed": false
      },
      {
        "id": "p2yn3dbau",
        "supplyId": "yslt8wfyl",
        "quantity": 8,
        "isFixed": false
      },
      {
        "id": "giip7c49a",
        "supplyId": "9yfysmwsu",
        "quantity": 4,
        "isFixed": false
      },
      {
        "id": "m8oe70d71",
        "supplyId": "dpqr41o7p",
        "quantity": 220,
        "isFixed": false
      },
      {
        "id": "h01um1u7g",
        "supplyId": "fbqw3duz6",
        "quantity": 7,
        "isFixed": false
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 200,
    "yieldUnit": "unidades"
  },
  {
    "id": "thfzgatn7",
    "name": "CREMA PASTELERA",
    "type": "sub",
    "ingredients": [
      {
        "id": "vs4xzxhq1",
        "supplyId": "y9tyjb74t",
        "quantity": 250,
        "isFixed": false
      },
      {
        "id": "w4x4usc0p",
        "supplyId": "yslt8wfyl",
        "quantity": 80,
        "isFixed": false
      },
      {
        "id": "9omykf9q6",
        "supplyId": "bzu0kzinx",
        "quantity": 25,
        "isFixed": false
      },
      {
        "id": "nxrmprike",
        "supplyId": "2jxqc40rz",
        "quantity": 3,
        "isFixed": false
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 300,
    "yieldUnit": "G"
  },
  {
    "id": "x33bempjl",
    "name": "COPA PROFITEROLES",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 200,
        "recipeId": "8vyntkme1"
      },
      {
        "quantity": 1600,
        "supplyId": "39vxwcmyt"
      },
      {
        "quantity": 800,
        "supplyId": "mlu9fw1gz"
      },
      {
        "quantity": 2000,
        "recipeId": "3ra5qvr37"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 200,
    "yieldUnit": "un"
  },
  {
    "id": "3ra5qvr37",
    "name": "CREMA DIPLOMAT",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 200,
        "supplyId": "39vxwcmyt"
      },
      {
        "quantity": 200,
        "supplyId": "yv6cktt18"
      },
      {
        "quantity": 40,
        "supplyId": "2zv3hf4bk"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 400,
    "yieldUnit": "g"
  },
  {
    "id": "y62i7fbrd",
    "name": "QUEQUE DE CAFE",
    "type": "sub",
    "ingredients": [
      {
        "id": "7mnqn5oqn",
        "supplyId": "dpqr41o7p",
        "quantity": 298,
        "isFixed": false
      },
      {
        "id": "p4amyc9fc",
        "supplyId": "jjxw9ho6g",
        "quantity": 52,
        "isFixed": false
      },
      {
        "id": "opj9aud0w",
        "supplyId": "yslt8wfyl",
        "quantity": 300,
        "isFixed": false
      },
      {
        "id": "71bix2scc",
        "supplyId": "9x5x72cfn",
        "quantity": 9,
        "isFixed": false
      },
      {
        "id": "u6ttwjz5y",
        "supplyId": "9yfysmwsu",
        "quantity": 3,
        "isFixed": false
      },
      {
        "id": "w8n470h43",
        "supplyId": "khn2qw6wp",
        "quantity": 2,
        "isFixed": false
      },
      {
        "quantity": 8,
        "supplyId": "ufb1zjt8x"
      },
      {
        "quantity": 15,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 93,
        "supplyId": "4ndlrnhez"
      },
      {
        "quantity": 7,
        "supplyId": "5ciegmvso"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 3,
    "yieldUnit": "UN"
  },
  {
    "id": "n4hibgl5j",
    "name": "CREMA PASTELERA sin azucar",
    "type": "sub",
    "ingredients": [
      {
        "id": "vs4xzxhq1",
        "supplyId": "y9tyjb74t",
        "quantity": 250,
        "isFixed": false
      },
      {
        "id": "w4x4usc0p",
        "supplyId": "9vkafijw4",
        "quantity": 80,
        "isFixed": false
      },
      {
        "id": "9omykf9q6",
        "supplyId": "bzu0kzinx",
        "quantity": 25,
        "isFixed": false
      },
      {
        "id": "nxrmprike",
        "supplyId": "2jxqc40rz",
        "quantity": 3,
        "isFixed": false
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 390,
    "yieldUnit": "G"
  },
  {
    "id": "9h58rgryv",
    "name": "QUEQUE DE CAFE sin azucar",
    "type": "sub",
    "ingredients": [
      {
        "id": "7mnqn5oqn",
        "supplyId": "dpqr41o7p",
        "quantity": 298,
        "isFixed": false
      },
      {
        "id": "p4amyc9fc",
        "supplyId": "jjxw9ho6g",
        "quantity": 52,
        "isFixed": false
      },
      {
        "id": "opj9aud0w",
        "supplyId": "9vkafijw4",
        "quantity": 300,
        "isFixed": true
      },
      {
        "id": "71bix2scc",
        "supplyId": "9x5x72cfn",
        "quantity": 9,
        "isFixed": false
      },
      {
        "id": "u6ttwjz5y",
        "supplyId": "9yfysmwsu",
        "quantity": 3,
        "isFixed": false
      },
      {
        "id": "w8n470h43",
        "supplyId": "khn2qw6wp",
        "quantity": 2,
        "isFixed": false
      },
      {
        "quantity": 8,
        "supplyId": "ufb1zjt8x"
      },
      {
        "quantity": 15,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 93,
        "supplyId": "4ndlrnhez"
      },
      {
        "quantity": 7,
        "supplyId": "5ciegmvso"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 3,
    "yieldUnit": "UN"
  },
  {
    "id": "xuwnninh9",
    "name": "FROSTING sin azucar",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 100,
        "supplyId": "58r7s5tgk",
        "isFixed": true
      },
      {
        "quantity": 100,
        "supplyId": "bn90y50on",
        "isFixed": true
      },
      {
        "quantity": 50,
        "supplyId": "9vkafijw4",
        "isFixed": true
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 250,
    "yieldUnit": "gr"
  },
  {
    "id": "4i879u2j9",
    "name": "TORTA DE CAFE SIN AZUCAR",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 3,
        "recipeId": "9h58rgryv"
      },
      {
        "quantity": 300,
        "recipeId": "yg42e6id8"
      },
      {
        "quantity": 209,
        "recipeId": "wa8gs3070"
      },
      {
        "quantity": 225,
        "recipeId": "xuwnninh9"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "153hlxlrl",
    "name": "TORTA  DE CAFE ",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 3,
        "recipeId": "y62i7fbrd"
      },
      {
        "quantity": 300,
        "recipeId": "m7nqqcoe6"
      },
      {
        "quantity": 300,
        "recipeId": "vqle6g10v"
      },
      {
        "quantity": 210,
        "recipeId": "8x3wac4aj"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "wa8gs3070",
    "name": "ALMIBAR CAFE sin azucar",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 80,
        "supplyId": "9vkafijw4"
      },
      {
        "quantity": 5,
        "supplyId": "5ciegmvso"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 300,
    "yieldUnit": "ML"
  },
  {
    "id": "8x3wac4aj",
    "name": "ALMIBAR CAFE ",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 80,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 5,
        "supplyId": "5ciegmvso"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 300,
    "yieldUnit": "ML"
  },
  {
    "id": "m7nqqcoe6",
    "name": "CREMA PASTELERA cafe",
    "type": "sub",
    "ingredients": [
      {
        "id": "vs4xzxhq1",
        "supplyId": "y9tyjb74t",
        "quantity": 250,
        "isFixed": false
      },
      {
        "id": "w4x4usc0p",
        "supplyId": "yslt8wfyl",
        "quantity": 80,
        "isFixed": false
      },
      {
        "id": "9omykf9q6",
        "supplyId": "bzu0kzinx",
        "quantity": 25,
        "isFixed": false
      },
      {
        "id": "nxrmprike",
        "supplyId": "2jxqc40rz",
        "quantity": 3,
        "isFixed": false
      },
      {
        "quantity": 7,
        "supplyId": "5ciegmvso"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 300,
    "yieldUnit": "G"
  },
  {
    "id": "yg42e6id8",
    "name": "CREMA PASTELERA CAFE sin azucar",
    "type": "sub",
    "ingredients": [
      {
        "id": "vs4xzxhq1",
        "supplyId": "y9tyjb74t",
        "quantity": 250,
        "isFixed": false
      },
      {
        "id": "w4x4usc0p",
        "supplyId": "9vkafijw4",
        "quantity": 80,
        "isFixed": false
      },
      {
        "id": "9omykf9q6",
        "supplyId": "bzu0kzinx",
        "quantity": 25,
        "isFixed": false
      },
      {
        "id": "nxrmprike",
        "supplyId": "2jxqc40rz",
        "quantity": 3,
        "isFixed": false
      },
      {
        "quantity": 8,
        "supplyId": "5ciegmvso"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 390,
    "yieldUnit": "G"
  },
  {
    "id": "72xd9o60y",
    "name": "MANJAR  PISTACHO",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 300,
        "supplyId": "cgzfqc039"
      },
      {
        "quantity": 40,
        "supplyId": "gs0895d3g"
      },
      {
        "quantity": 40,
        "supplyId": "y9tyjb74t"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 380,
    "yieldUnit": "Gr"
  },
  {
    "id": "97txwki97",
    "name": "CREMA PISTACHO",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 100,
        "recipeId": "72xd9o60y"
      },
      {
        "quantity": 100,
        "supplyId": "yv6cktt18"
      },
      {
        "quantity": 100,
        "supplyId": "asxtu27b9"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 300,
    "yieldUnit": "GR"
  },
  {
    "id": "fpr9r0qvx",
    "name": "TORTA CHOCOPISTACHO",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 3,
        "recipeId": "yxhdqtplj"
      },
      {
        "quantity": 1280,
        "recipeId": "97txwki97"
      },
      {
        "quantity": 400,
        "recipeId": "1yf1b7ad1"
      },
      {
        "quantity": 35,
        "supplyId": "gs0895d3g"
      },
      {
        "quantity": 16,
        "supplyId": "7exf5r7z4"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 16,
    "yieldUnit": "un"
  },
  {
    "id": "v1wjpcfbv",
    "name": "QUEQUE DE NARANJA ",
    "type": "sub",
    "ingredients": [
      {
        "id": "3lhy729mv",
        "supplyId": "bn90y50on",
        "quantity": 101,
        "isFixed": false
      },
      {
        "id": "7jkg9x8s8",
        "supplyId": "4ndlrnhez",
        "quantity": 202,
        "isFixed": false
      },
      {
        "id": "kg5xhmk9o",
        "supplyId": "yslt8wfyl",
        "quantity": 382,
        "isFixed": false
      },
      {
        "id": "fngbswxgy",
        "supplyId": "fbqw3duz6",
        "quantity": 7,
        "isFixed": false
      },
      {
        "id": "m4f1i3746",
        "supplyId": "dpqr41o7p",
        "quantity": 675,
        "isFixed": false
      },
      {
        "id": "5mzt6mwxb",
        "supplyId": "pzrf2y0el",
        "quantity": 24,
        "isFixed": false
      },
      {
        "id": "t499egz5t",
        "supplyId": "o4ffydf3e",
        "quantity": 2,
        "isFixed": false
      },
      {
        "id": "ozoy3l0c8",
        "supplyId": "07i3w6ez8",
        "quantity": 337,
        "isFixed": false
      },
      {
        "id": "fx8znchre",
        "quantity": 67,
        "isFixed": false,
        "recipeId": "z0u3fy4zz"
      },
      {
        "id": "964ptovw3",
        "supplyId": "9yfysmwsu",
        "quantity": 9,
        "isFixed": false
      },
      {
        "id": "4jf1tpqt3",
        "supplyId": "9x5x72cfn",
        "quantity": 2.25,
        "isFixed": false
      },
      {
        "quantity": 101,
        "supplyId": "lbp8zjoce"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 3,
    "yieldUnit": "unidades"
  },
  {
    "id": "z0u3fy4zz",
    "name": "miel de naranja",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 2,
        "supplyId": "o4ffydf3e"
      },
      {
        "quantity": 75,
        "supplyId": "yslt8wfyl"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 120,
    "yieldUnit": "g"
  },
  {
    "id": "2iz9s72g6",
    "name": "TORTA DE NARANJA Y MANGO",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 3,
        "recipeId": "v1wjpcfbv"
      },
      {
        "quantity": 400,
        "supplyId": "39vxwcmyt"
      },
      {
        "quantity": 300,
        "supplyId": "hi972w8jk"
      },
      {
        "quantity": 250,
        "recipeId": "vqle6g10v"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "x45py5ge8",
    "name": "naranja curd",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 3,
        "supplyId": "o4ffydf3e"
      },
      {
        "quantity": 1.5,
        "supplyId": "2jxqc40rz"
      },
      {
        "quantity": 0.5,
        "supplyId": "gla2uzxjy"
      },
      {
        "quantity": 38,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 15,
        "supplyId": "tqmpyj9od"
      },
      {
        "quantity": 75,
        "supplyId": "bn90y50on"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 215,
    "yieldUnit": "gr"
  },
  {
    "id": "t4h7vvus2",
    "name": "compota de mango",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 125,
        "supplyId": "hi972w8jk"
      },
      {
        "quantity": 35,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 6,
        "supplyId": "bzu0kzinx"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 196,
    "yieldUnit": "un"
  },
  {
    "id": "nd6xceajc",
    "name": "crema de naranja",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 2,
        "supplyId": "o4ffydf3e"
      },
      {
        "quantity": 35,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 2,
        "supplyId": "tqmpyj9od"
      },
      {
        "quantity": 12,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 1.5,
        "supplyId": "2jxqc40rz"
      },
      {
        "quantity": 7,
        "supplyId": "bn90y50on"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 216,
    "yieldUnit": "gr"
  },
  {
    "id": "czl4znk10",
    "name": "frosting de mango",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 250,
        "supplyId": "asxtu27b9"
      },
      {
        "quantity": 40,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 150,
        "supplyId": "hi972w8jk"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 390,
    "yieldUnit": "un"
  },
  {
    "id": "2hba4fp6z",
    "name": "TROPICAL CAKE",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 3,
        "recipeId": "v1wjpcfbv"
      },
      {
        "quantity": 196,
        "recipeId": "t4h7vvus2"
      },
      {
        "quantity": 215,
        "recipeId": "x45py5ge8"
      },
      {
        "quantity": 216,
        "recipeId": "nd6xceajc"
      },
      {
        "quantity": 388,
        "recipeId": "czl4znk10"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "hzjcfz028",
    "name": "QUEQUE LIMON Y ARANDANO",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 590,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 16,
        "supplyId": "9x5x72cfn"
      },
      {
        "quantity": 4,
        "supplyId": "9yfysmwsu"
      },
      {
        "quantity": 100,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 240,
        "supplyId": "lbp8zjoce"
      },
      {
        "quantity": 600,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 16,
        "supplyId": "ohnkd2ntd"
      },
      {
        "quantity": 20,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 6,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 320,
        "supplyId": "y9tyjb74t"
      },
      {
        "quantity": 299,
        "supplyId": "tzgg5ad4a"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 3,
    "yieldUnit": "UN"
  },
  {
    "id": "zodavyfy6",
    "name": "TORTA DE LIMON Y ARANDANO",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 3,
        "recipeId": "hzjcfz028"
      },
      {
        "quantity": 500,
        "supplyId": "cgzfqc039"
      },
      {
        "quantity": 250,
        "recipeId": "vqle6g10v"
      },
      {
        "quantity": 0
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "8dqbs705m",
    "name": "TORTA DE LIMON Y ARANDANO PARA MI",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 3,
        "recipeId": "hzjcfz028"
      },
      {
        "quantity": 500,
        "supplyId": "cgzfqc039"
      },
      {
        "quantity": 500,
        "recipeId": "vqle6g10v"
      },
      {
        "quantity": 100,
        "supplyId": "tzgg5ad4a"
      },
      {
        "quantity": 10,
        "supplyId": "7exf5r7z4"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "ankkk8lk4",
    "name": "MASA AZUCARADA ",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 250,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 125,
        "supplyId": "2zv3hf4bk"
      },
      {
        "quantity": 150,
        "supplyId": "lbp8zjoce"
      },
      {
        "quantity": 1,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 1,
        "supplyId": "ohnkd2ntd"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "d8octmwov",
    "name": "RELLENO DE LIMON",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 780,
        "supplyId": "sdmh7ppfw"
      },
      {
        "quantity": 4,
        "supplyId": "2jxqc40rz"
      },
      {
        "quantity": 7,
        "supplyId": "ohnkd2ntd"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "ecdku5n23",
    "name": "MERENGUE ITALIANO ",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 4,
        "supplyId": "gla2uzxjy"
      },
      {
        "quantity": 300,
        "supplyId": "yslt8wfyl"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "u4lyqoeyu",
    "name": "PIE DE LIMON ",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 1,
        "recipeId": "ankkk8lk4"
      },
      {
        "quantity": 1,
        "recipeId": "d8octmwov"
      },
      {
        "quantity": 1,
        "recipeId": "ecdku5n23"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 1,
    "yieldUnit": "un"
  },
  {
    "id": "k7l4ir8aj",
    "name": "GALLETA CRINKLE DE CHOCOLATE",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 100,
        "supplyId": "yslt8wfyl"
      },
      {
        "quantity": 140,
        "supplyId": "dpqr41o7p"
      },
      {
        "quantity": 40,
        "supplyId": "jjxw9ho6g"
      },
      {
        "quantity": 5,
        "supplyId": "pzrf2y0el"
      },
      {
        "quantity": 5,
        "supplyId": "9yfysmwsu"
      },
      {
        "quantity": 80,
        "supplyId": "bn90y50on"
      },
      {
        "quantity": 2,
        "supplyId": "fbqw3duz6"
      },
      {
        "quantity": 5,
        "supplyId": "a0cykragp"
      },
      {
        "quantity": 150,
        "supplyId": "2zv3hf4bk"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 23,
    "yieldUnit": "un"
  },
  {
    "id": "mk44h2ucd",
    "name": "queso, espinaca, tocino",
    "type": "sub",
    "ingredients": [
      {
        "quantity": 227,
        "supplyId": "58r7s5tgk"
      },
      {
        "quantity": 30,
        "supplyId": "yv6cktt18"
      },
      {
        "quantity": 100,
        "supplyId": "rqeo3d5uo"
      },
      {
        "quantity": 100,
        "supplyId": "yx4ezk0yc"
      },
      {
        "quantity": 4,
        "supplyId": "9yfysmwsu"
      },
      {
        "quantity": 4,
        "supplyId": "fvjwuqvq3"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 467,
    "yieldUnit": "g"
  },
  {
    "id": "5cst5axe3",
    "name": "ARABITO ESPINACA, QUESO Y TOCINO",
    "type": "complete",
    "ingredients": [
      {
        "quantity": 30,
        "supplyId": "5bd2bnq7p"
      },
      {
        "quantity": 467,
        "recipeId": "mk44h2ucd"
      }
    ],
    "equipment": [],
    "laborCost": 0,
    "laborMinutes": {
      "heavy": 0,
      "light": 0
    },
    "serviceMinutes": {
      "electricity": 0,
      "water": 0,
      "gas": 0,
      "machinery": 0,
      "utensils": 0
    },
    "extraCosts": {
      "biosecurity": 0,
      "packaging": 0
    },
    "yield": 30,
    "yieldUnit": "un"
  }
];
