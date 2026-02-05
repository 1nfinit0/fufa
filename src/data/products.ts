// src/data/products.ts

/**
 * Tipos e interfaces
 */

// Datos raw (estructura de entrada)
interface RawProductItem {
  name: string;
  description: string;
  price: string;
  catalogoPrice: string;
  images: string[];
  referencias?: string[];
}

interface RawProductCategory {
  id: number;
  category: string;
  description: string;
  items: RawProductItem[];
}

// Datos procesados (estructura de salida)
export interface ProductoItem {
  nombre: string;
  slug: string;
  id: string;
  descripcion: string;
  precio: number;
  precioAnterior: number;
  descuento: number;
  enOferta: boolean;
  imagen: string;
  imagenes: string[];
  videos: string[];
  stock: number;
  destacado: boolean;
  nuevo: boolean;
}

export interface Categoria {
  id: number;
  categoria: string;
  slug: string;
  descripcion: string;
  items: ProductoItem[];
}

export interface ProductoConCategoria extends ProductoItem {
  categoriaId: number;
  categoriaNombre: string;
  categoriaSlug: string;
}

/**
 * Genera un slug URL-friendly desde un texto
 */
export function generarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[|]/g, '') // Elimina pipe
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/[^a-z0-9-]/g, '') // Solo letras, números y guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .replace(/^-+|-+$/g, ''); // Elimina guiones al inicio y final
}

/**
 * Procesa los datos raw y añade slugs y metadata
 */
function procesarProductos(rawData: RawProductCategory[]): Categoria[] {
  return rawData.map(categoria => ({
    id: categoria.id,
    categoria: categoria.category,
    slug: generarSlug(categoria.category),
    descripcion: categoria.description,
    items: categoria.items.map(item => {
      const slug = generarSlug(item.name);
      const precio = parseFloat(item.price);
      const precioAnterior = parseFloat(item.catalogoPrice);
      
      return {
        nombre: item.name,
        slug: slug,
        // ID único combinando categoría y slug del producto
        id: `${generarSlug(categoria.category)}-${slug}`,
        descripcion: item.description,
        precio: precio,
        precioAnterior: precioAnterior,
        // Calcula el descuento porcentual
        descuento: Math.round(((precioAnterior - precio) / precioAnterior) * 100),
        enOferta: precioAnterior > precio,
        // Procesamiento de imágenes
        imagen: `/images/productos/${item.images[0]}`,
        imagenes: item.images.map(img => `/images/productos/${img}`),
        // Videos de referencia
        videos: item.referencias?.map(ref => `/videos/productos/${ref}`) || [],
        // Metadata útil
        stock: 10, // Puedes ajustar esto
        destacado: false, // Marcar manualmente productos destacados
        nuevo: false,
      };
    })
  }));
}

// Datos raw
const rawDataProducts: RawProductCategory[] = [
  {
    id: 1,
    category: "Cuidado Personal",
    description: "Productos para el cuidado diario de la piel y el cuerpo.",
    items: [
      {
        name: "Ekos Pulpa Hidratante Corporal Ucuuba | 400 ml",
        description:
          "Pulpa hidratante con manteca de ucuuba amazónica que reafirma y mejora la elasticidad de la piel. Estimula la producción natural de colágeno con resultados visibles en 3 días.",
        price: "40",
        catalogoPrice: "69",
        images: ["cuidado_c.jpg", "2.jpg", "3.webp"],
        referencias: ["a.mp4", "b.mp4", "c.mp4"],
      },
      {
        name: "Kit Tododia Flor de Pera y Melisa | Crema Corporal 100 ml + Crema de Manos 50 ml",
        description:
          "Combinación delicada con aroma de flor de pera y melissa. Fragancia suave, femenina y relajante ideal para uso diario.",
        price: "30",
        catalogoPrice: "69",
        images: ["cuidado_d.jpg", "2.png", "3.jpeg"],
        referencias: ["a.mp4", "b.mp4", "c.mp4"],
      },
      {
        name: "Loción Corporal Perfumada Sweet Black 130 ml Cyzone",
        description:
          "Loción hidratante corporal con aroma oriental dulce. Hidrata la piel mientras disfrutas de tu fragancia favorita todo el día. Formato práctico para llevar contigo.",
        price: "18",
        catalogoPrice: "40",
        images: ["cuidado_e.jpg", "2.webp", "3.jpg"],
        referencias: ["a.mp4", "b.mp4", "c.mp4"],
      },
      {
        name: "Loción Corporal Perfumada Sweet Black Intense 130 ml Cyzone",
        description:
          "Loción hidratante corporal con aroma oriental dulce intenso. Hidrata la piel con fragancia duradera todo el día. Formato práctico para uso diario.",
        price: "18",
        catalogoPrice: "44",
        images: ["cuidado_f.jpg", "2.png", "3.jpg"],
        referencias: ["a.mp4"],
      },
      {
        name: "Crema de manos Pitanga 75 ml, Ekos, Natura",
        description:
          "Pulpa hidratante ligera con aceite esencial de pitanga que brinda hidratación inmediata y prolongada. De rápida absorción, deja las manos suaves, uñas saludables y un delicado perfume refrescante. Formulada con 98% de origen natural y 94% vegetal. Ideal para quienes buscan piel suave y perfumada, en presentación de 75g.",
        price: "25",
        catalogoPrice: "45",
        images: ["cuidado_g.jpg", "2.jpg", "3.webp"],
        referencias: ["a.mp4", "b.mp4", "c.mp4"],
      },
    ],
  },
  {
    id: 2,
    category: "Protección Solar",
    description: "Productos para proteger la piel de los daños solares.",
    items: [
      {
        name: "Bloqueador Total Block Yanbal | 140 gr",
        description:
          "Protector solar SPF 100 de 140g con protección muy alta para rostro y cuerpo. Protege contra rayos UVA, UVB, IR y luz azul con hidratación incluida. Resistente al agua y sudor, de rápida absorción. Ideal para todo tipo de piel.",
        price: "55",
        catalogoPrice: "98.90",
        images: ["cosmetico_a.jpg", "2.png", "3.png"],
        referencias: ["a.mp4", "b.mp4", "c.mp4"],
      },
      {
        name: "Protector Solar Facial FPS 50 Piel Seca Natura - 50 ml",
        description:
          "Protector solar facial de 50ml con FPS UVB 70 y FPUVA 25, especial para piel seca. Textura ligera con acabado invisible y tecnología de bioprotección de triple acción. Complejo nutritivo que mantiene hidratación prolongada, resistente al agua y sudor. Fragancia refrescante con notas acuosas y frutas frescas.",
        price: "35",
        catalogoPrice: "80",
        images: ["cosmetico_b.jpg", "2.png", "3.png"],
        referencias: ["a.mp4", "b.mp4", "c.mp4"],
      },
      {
        name: "Protector Solar Facial en Barra FPS 50 Piel Seca Natura - 15 gr",
        description:
          "Protector solar facial en formato stick FPS UVB 50 y FPUVA 17, fácil aplicación sin ensuciar manos. Textura aterciopelada con efecto mate y acabado invisible para todos los tipos de piel. Mantiene hidratación, disimula poros y es ideal como pre-maquillaje o para reaplicar durante el día. Resistente al agua y sudor, con tecnología de bioprotección de triple acción, sin fragancia.",
        price: "55",
        catalogoPrice: "125",
        images: ["cosmetico_c.jpg", "2.webp", "3.webp"],
        referencias: ["a.mp4", "b.mp4", "c.mp4"],
      },
    ],
  },
  {
    id: 3,
    category: "Perfumes y Fragancias",
    description: "Perfumes y fragancias para diferentes ocasiones y estilos.",
    items: [
      {
        name: "Solo 80 ml Perfume de Hombre con Desodorante Yanbal",
        description: "Aplomo, confianza y seguridad. Eso impones, eso transmites. Y tu fragancia también habla por ti, por eso creamos Solo. La elegancia del cuero, el toque exótico del higo y las notas cítricas y herbales del jengibre se mezclan en esta colonia intensa y perdurable",
        price: "80",
        catalogoPrice: "99.90",
        images: ["perfume_b.jpg", "2.jpg", "3.webp"],
        referencias: ["a.mp4", "b.mp4", "c.mp4"],
      },
      {
        name: "Labial Barra Mate Studio Look Cyzone Burn Nude Burn Nude",
        description: "¡El Labial en barra Supermate Lips es tu aliado perfecto para añadir color a todos tus looks! Su acabado Powder Mate se desliza suavemente en tus labios, con hidratación gracias a geles de agua y manteca de mango africano, componentes emolientes que suavizan los labios y retienen el agua sobre estos para mejorar la hidratación. Larga duración hasta por 13 horas.",
        price: "12.5",
        catalogoPrice: "22.90",
        images: ["perfume_c.jpg", "2.webp", "3.jpg"],
        referencias: ["a.mp4", "b.mp4", "c.mp4"],
      },
      {
        name: "Rímel Máscara de Pestañas Magnetic Lash Studio Look Cyzone negro",
        description: "Despierta y descubre la revolucionaria Máscara de pestañas Magnetic Lash de Studio Look. Olvídate de las pestañas postizas incómodas y del rímel que se corre, esta máscara de pestañas largas te ofrece una mirada magnética irresistible con resultados de salón, ¡en casa!",
        price: "20",
        catalogoPrice: "25.90",
        images: ["perfume_d.jpg", "lash2.webp", "lash3.webp", "lash4.webp"],
        referencias: ["a.mp4", "b.mp4", "c.mp4"],
      },
    ],
  },
];

// Exportación principal con datos procesados
export const productos: Categoria[] = procesarProductos(rawDataProducts);

/**
 * Obtiene todos los productos de todas las categorías
 */
export function obtenerTodosLosProductos(): ProductoConCategoria[] {
  return productos.flatMap(categoria => 
    categoria.items.map(item => ({
      ...item,
      categoriaId: categoria.id,
      categoriaNombre: categoria.categoria,
      categoriaSlug: categoria.slug,
    }))
  );
}

/**
 * Obtiene un producto específico por su slug
 */
export function obtenerProductoPorSlug(slug: string): ProductoConCategoria | null {
  for (const categoria of productos) {
    const producto = categoria.items.find(item => item.slug === slug);
    if (producto) {
      return {
        ...producto,
        categoriaId: categoria.id,
        categoriaNombre: categoria.categoria,
        categoriaSlug: categoria.slug,
      };
    }
  }
  return null;
}

/**
 * Obtiene productos relacionados (de la misma categoría)
 */
export function obtenerProductosRelacionados(
  slug: string, 
  limite: number = 4
): ProductoConCategoria[] {
  for (const categoria of productos) {
    const productoActual = categoria.items.find(item => item.slug === slug);
    if (productoActual) {
      return categoria.items
        .filter(item => item.slug !== slug)
        .slice(0, limite)
        .map(item => ({
          ...item,
          categoriaSlug: categoria.slug,
          categoriaNombre: categoria.categoria,
          categoriaId: categoria.id,
        }));
    }
  }
  return [];
}

/**
 * Obtiene productos destacados
 */
export function obtenerProductosDestacados(limite: number = 6): ProductoConCategoria[] {
  return obtenerTodosLosProductos()
    .filter(producto => producto.destacado)
    .slice(0, limite);
}

/**
 * Obtiene productos en oferta
 */
export function obtenerProductosEnOferta(limite: number = 8): ProductoConCategoria[] {
  return obtenerTodosLosProductos()
    .filter(producto => producto.enOferta)
    .sort((a, b) => b.descuento - a.descuento) // Ordena por mayor descuento
    .slice(0, limite);
}

/**
 * Obtiene productos nuevos
 */
export function obtenerProductosNuevos(limite: number = 6): ProductoConCategoria[] {
  return obtenerTodosLosProductos()
    .filter(producto => producto.nuevo)
    .slice(0, limite);
}

/**
 * Obtiene una categoría completa por slug
 */
export function obtenerCategoriaPorSlug(slug: string): Categoria | undefined {
  return productos.find(cat => cat.slug === slug);
}

/**
 * Obtiene una categoría completa por ID
 */
export function obtenerCategoriaPorId(id: number): Categoria | undefined {
  return productos.find(cat => cat.id === id);
}

/**
 * Busca productos por término
 */
export function buscarProductos(termino: string): ProductoConCategoria[] {
  const terminoLower = termino.toLowerCase();
  return obtenerTodosLosProductos().filter(producto =>
    producto.nombre.toLowerCase().includes(terminoLower) ||
    producto.descripcion.toLowerCase().includes(terminoLower) ||
    producto.categoriaNombre.toLowerCase().includes(terminoLower)
  );
}

/**
 * Filtra productos por rango de precio
 */
export function filtrarPorPrecio(
  precioMin: number, 
  precioMax: number
): ProductoConCategoria[] {
  return obtenerTodosLosProductos().filter(
    producto => producto.precio >= precioMin && producto.precio <= precioMax
  );
}

/**
 * Obtiene productos por categoría
 */
export function obtenerProductosPorCategoria(
  categoriaSlug: string
): ProductoConCategoria[] {
  const categoria = obtenerCategoriaPorSlug(categoriaSlug);
  if (!categoria) return [];
  
  return categoria.items.map(item => ({
    ...item,
    categoriaId: categoria.id,
    categoriaNombre: categoria.categoria,
    categoriaSlug: categoria.slug,
  }));
}

/**
 * Calcula el total de productos
 */
export function contarTotalProductos(): number {
  return obtenerTodosLosProductos().length;
}

/**
 * Calcula el total de productos por categoría
 */
export function contarProductosPorCategoria(): Record<string, number> {
  return productos.reduce((acc, categoria) => {
    acc[categoria.slug] = categoria.items.length;
    return acc;
  }, {} as Record<string, number>);
}