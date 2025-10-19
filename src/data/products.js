import imgPolera from '../assets/imagenes/polera/polera.png';

export const allProducts = [
  { 
    id: 1, 
    name: 'Catan', 
    price: '$29.990 CLP', 
    category: 'Juegos de Mesa', 
    image: 'https://devirinvestments.s3.eu-west-1.amazonaws.com/img/catalog/product/8436017220100-1200-face3d.jpg', 
    description: 'Catan es un juego de mesa para toda la familia que se ha convertido en un fenómeno mundial. Se trata de un juego que aúna la estrategia, la astucia y la capacidad para negociar.',
    manufacturer: 'Devir',
    distributor: 'Asmodee Chile',
    reviews: [
      { id: 1, author: 'GamerPro', rating: 5, comment: '¡Un clásico! Nunca pasa de moda.' },
      { id: 2, author: 'Ana', rating: 4, comment: 'Muy divertido para jugar con amigos.' }
    ] },
  { 
    id: 2,
    name: 'Carcassonne',
    price: '$24.990 CLP',
    category: 'Juegos de Mesa',
    image: 'https://devirinvestments.s3.eu-west-1.amazonaws.com/img/catalog/product/8436017222593-1200-frontflat-copy.jpg',
    description: 'Un clásico moderno de colocación de losetas. Los jugadores construyen un paisaje medieval, reclamando ciudades, caminos y granjas. Fácil de aprender, pero con gran profundidad estratégica y rejugabilidad.',
    manufacturer: 'Hans im Glück',
    distributor: 'Devir Chile',
    reviews: [
      { id: 1, author: 'Claudia R.', rating: 5, comment: '¡Mi juego favorito para iniciar a nuevos jugadores! Siempre es un éxito.' },
      { id: 2, author: 'Matias Gamer', rating: 5, comment: 'Un juego elegante y con mucha estrategia. Cada partida es diferente.' }
    ]
  },
  {
    id: 3,
    name: 'Controlador Inalámbrico Xbox Series X',
    price: '$59.990 CLP',
    category: 'Accesorios',
    image: 'https://prophonechile.cl/wp-content/uploads/2023/11/purpleeee.png',
    description: 'Experimenta el diseño modernizado del control inalámbrico de Xbox, con superficies esculpidas y una geometría refinada para una mayor comodidad durante el juego. Juega de forma inalámbrica o utiliza el cable USB-C de 2,7 m incluido para disfrutar de una experiencia de juego con cable.',
    manufacturer: 'Microsoft',
    distributor: 'Microsoft Chile',
    reviews: [
      { id: 1, author: 'JuanP_88', rating: 5, comment: 'El mejor control que he tenido. La textura de los gatillos es increíble y se siente muy premium.' },
      { id: 2, author: 'Carolina_G', rating: 4, comment: 'Funciona perfecto en PC también, muy cómodo, aunque me gustaría que la batería durara un poco más.' }
    ]
  },
  { 
    id: 4,
    name: 'Auriculares Gamer HyperX Cloud II',
    price: '$79.990 CLP',
    category: 'Accesorios',
    image: 'https://row.hyperx.com/cdn/shop/files/hyperx_cloud_ii_red_1_main.jpg?v=1737720332',
    description: 'Un auricular legendario por su comodidad y calidad de audio. Diseñado para largas sesiones de juego, cuenta con sonido envolvente virtual 7.1, almohadillas de espuma viscoelástica y un marco de aluminio duradero. El micrófono desmontable con cancelación de ruido asegura una comunicación clara.',
    manufacturer: 'HyperX (HP Inc.)',
    distributor: 'HP Chile',
    reviews: [
      { id: 1, author: 'Felipe_Plays', rating: 5, comment: 'Increíblemente cómodos, puedo usarlos por horas sin que me molesten. El sonido es espectacular para escuchar pasos en los juegos.' },
      { id: 2, author: 'Dani_Tech', rating: 5, comment: 'La calidad de construcción es de otro nivel. Valen cada peso, tanto para jugar como para escuchar música.' }
    ]
  },
  {
    id: 5,
    name: 'PlayStation 5',
    price: '$549.990 CLP',
    category: 'Consolas',
    image: 'https://static.pcfactory.cl/imagenes/53428-3.jpg',
    description: 'La consola PS5 desata nuevas posibilidades de juego que nunca habías imaginado. Experimenta una carga ultrarrápida con un SSD de alta velocidad, una inmersión más profunda con soporte para retroalimentación háptica, gatillos adaptativos y audio 3D.',
    manufacturer: 'Sony Interactive Entertainment',
    distributor: 'Sony Chile',
    reviews: [
      { id: 1, author: 'NextGenGamer', rating: 5, comment: 'La velocidad del SSD es una locura, los tiempos de carga casi no existen. ¡El control DualSense es un cambio total en la experiencia de juego!' },
      { id: 2, author: 'Sofi_Plays', rating: 5, comment: 'Los gráficos son increíbles y el audio 3D te sumerge por completo en el juego. Es verdaderamente de nueva generación.' }
    ]
  },
  {
    id: 6,
    name: 'PC Gamer ASUS ROG Strix',
    price: '$1.299.990 CLP',
    category: 'Computadores Gamers',
    image: 'https://www.asus.com/media/Odin/Websites/global/Series/52.png',
    description: 'Diseñado para el rendimiento extremo, este PC ROG Strix cuenta con componentes de última generación para jugar los títulos más exigentes en calidad ultra. Su sistema de refrigeración avanzado y diseño agresivo con iluminación RGB Aura Sync lo convierten en el centro de cualquier setup gamer.',
    manufacturer: 'ASUS (Republic of Gamers)',
    distributor: 'ASUS Chile',
    reviews: [
      { id: 1, author: 'PCMaster_CL', rating: 5, comment: 'Una bestia. Corre absolutamente todo en ultra a más de 100 FPS sin despeinarse. La refrigeración es de otro nivel.' },
      { id: 2, author: 'Lucia_Setup', rating: 5, comment: 'Además de potente, es precioso. La iluminación Aura Sync se ve increíble en mi escritorio. 10/10.' }
    ]
  },
  {
    id: 7,
    name: 'Silla Gamer Secretlab Titan',
    price: '$349.990 CLP',
    category: 'Sillas Gamers',
    image: 'https://images.secretlab.co/turntable/tr:n-w_750/R22PU-Stealth_02.jpg',
    description: 'Diseñada para una comodidad ergonómica absoluta, la Secretlab Titan es la silla de referencia para gamers. Con su soporte lumbar ajustable integrado y materiales de primera calidad, ofrece un soporte inigualable para largas sesiones de juego y trabajo.',
    manufacturer: 'Secretlab',
    distributor: 'Secretlab Chile / Distribuidores Autorizados',
    reviews: [
      { id: 1, author: 'StreamerPro', rating: 5, comment: 'La mejor inversión para mi espalda. Puedo estar horas y horas sin ninguna molestia. El soporte lumbar es increíble.' },
      { id: 2, author: 'ValeSetup', rating: 5, comment: 'La calidad de los materiales se nota al instante. Es firme, robusta y se ve espectacular en mi setup. 100% recomendada.' }
    ]
  },
  {
    id: 8,
    name: 'Mouse Gamer Logitech G502 HERO',
    price: '$49.990 CLP',
    category: 'Mouse',
    image: 'https://media.spdigital.cl/thumbnails/products/snbujg5__29f7dd61_thumbnail_4096.jpg',
    description: 'Uno de los mouse más populares del mundo, ahora actualizado con el sensor HERO 25K para máxima precisión y velocidad de seguimiento. Cuenta con 11 botones programables y un sistema de pesas ajustables para que personalices su peso y equilibrio.',
    manufacturer: 'Logitech G',
    distributor: 'Logitech Chile / Distribuidores Autorizados',
    reviews: [
      { id: 1, author: 'Shooter_CL', rating: 5, comment: 'El mejor mouse que he probado. El sensor es increíblemente preciso y poder ajustar el peso es un plus que se agradece mucho.' },
      { id: 2, author: 'Marta_Design', rating: 5, comment: 'Lo uso para diseñar y jugar. La ergonomía es perfecta para mi mano y los botones extra son muy útiles para atajos.' }
    ]
  },
  {
    id: 9,
    name: 'Mousepad Razer Goliathus Chroma',
    price: '$29.990 CLP',
    category: 'Mousepad',
    image: 'https://cl-cenco-pim-resizer.ecomm.cencosud.com/unsafe/adaptive-fit-in/3840x0/filters:quality(75)/prd-cl/product-medias/bb228f59-3aa1-4d9e-bbf4-b5f71bc89ca0/MK8YWFQA7I/MK8YWFQA7I-1/1737041557738-MK8YWFQA7I-1-1.jpg',
    description: 'Ilumina tu setup con el Razer Goliathus Chroma. Este mousepad de tela suave está optimizado para todos los sensores y estilos de juego, y cuenta con la tecnología Razer Chroma RGB con 16,8 millones de colores y un espectro de efectos personalizables.',
    manufacturer: 'Razer',
    distributor: 'Razer Latin America',
    reviews: [
      { id: 1, author: 'RGB_Fanatic', rating: 5, comment: 'La iluminación es espectacular y se sincroniza perfecto con mi teclado y mouse Razer. La superficie es súper suave.' },
      { id: 2, author: 'Cata_Plays', rating: 4, comment: 'Buen tamaño y el RGB le da un toque genial. El mouse desliza muy bien sobre él.' }
    ]
  },
  {
    id: 10,
    name: 'Polera Gamer Personalizada "Level-Up"',
    price: '$14.990 CLP',
    category: 'Poleras Personalizadas',
    image: imgPolera,
    description: '¡Viste tu pasión! Crea tu propia polera gamer con nuestros diseños exclusivos o sube el tuyo. Fabricadas con algodón de alta calidad para máxima comodidad durante tus maratones de juego. Elige tu talla, color y diseño para una prenda única.',
    manufacturer: 'LevelUp-Gamer (Producción Local)',
    distributor: 'LevelUp-Gamer',
    reviews: [
      { id: 1, author: 'El_Profe_Gamer', rating: 5, comment: 'Pedí una con el logo de mi canal y quedó increíble. La calidad de la tela y la impresión son de primera.' },
      { id: 2, author: 'Pancha', rating: 5, comment: 'Fue un regalo para mi pololo y le encantó. El proceso de personalización fue súper fácil.' }
    ]
  }
];