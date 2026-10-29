export type Categoria = "premama" | "bebes" | "ninos";

export interface CategoriaInfo {
  slug: Categoria;
  nombre: string;
  rango: string;
  descripcion: string;
  imagen: string;
  tint: string;
}

export const categorias: CategoriaInfo[] = [
  {
    slug: "premama",
    nombre: "Premamá",
    rango: "Embarazo",
    descripcion:
      "Prendas que acompañan la espera con comodidad, sin renunciar a la elegancia.",
    imagen: "/brand/cat-premama.png",
    tint: "bg-blush-soft/70",
  },
  {
    slug: "bebes",
    nombre: "Bebés",
    rango: "0 – 36 meses",
    descripcion:
      "Tejidos suaves y costuras cuidadas para los primeros meses de vida.",
    imagen: "/brand/cat-bebes.png",
    tint: "bg-cream-deep/60",
  },
  {
    slug: "ninos",
    nombre: "Niños",
    rango: "4 – 12 años",
    descripcion:
      "Piezas resistentes y cómodas para jugar, crecer y volver a casa con arena.",
    imagen: "/brand/cat-ninos.png",
    tint: "bg-sage-soft/70",
  },
];

export interface Producto {
  id: string;
  nombre: string;
  categoria: Categoria;
  descripcion: string;
}

/**
 * Datos de ejemplo mientras la tienda no tiene catálogo real.
 * Los precios se dejan vacíos a propósito: no inventamos importes.
 */
export const productos: Producto[] = [
  {
    id: "vestido-margarita",
    nombre: "Vestido Margarita",
    categoria: "premama",
    descripcion: "Vestido largo de algodón orgánico con manga abullonada.",
  },
  {
    id: "blusa-duna",
    nombre: "Blusa Duna",
    categoria: "premama",
    descripcion: "Blusa fluida con abertura de lactancia discreta.",
  },
  {
    id: "pelele-nube",
    nombre: "Pelele Nube",
    categoria: "bebes",
    descripcion: "Pelele de punto suave con botones de nácar.",
  },
  {
    id: "conjunto-huerto",
    nombre: "Conjunto Huerto",
    categoria: "bebes",
    descripcion: "Camiseta y pantalón de algodón en tono salvia.",
  },
  {
    id: "pijama-estrellas",
    nombre: "Pijama Estrellas",
    categoria: "bebes",
    descripcion: "Pijama de dos piezas, puños elásticos y estampado tenue.",
  },
  {
    id: "peto-jardin",
    nombre: "Peto Jardín",
    categoria: "ninos",
    descripcion: "Peto vaquero con bolsillo frontal y tirantes ajustables.",
  },
  {
    id: "camiseta-marea",
    nombre: "Camiseta Marea",
    categoria: "ninos",
    descripcion: "Camiseta de rayas finas en algodón peinado.",
  },
  {
    id: "vestido-frambuesa",
    nombre: "Vestido Frambuesa",
    categoria: "ninos",
    descripcion: "Vestido de vuelo con lazada al hombro.",
  },
];

export const enlaces = {
  instagram: "https://www.instagram.com/",
  email: "hola@cometa.es",
  emailPlaceholder: true,
  telefono: "",
  whatsapp: "",
};

export const navegacion = [
  { texto: "Premamá", href: "/tienda/premama" },
  { texto: "Bebés", href: "/tienda/bebes" },
  { texto: "Niños", href: "/tienda/ninos" },
  { texto: "Nuestra historia", href: "/nosotras" },
  { texto: "Contacto", href: "/contacto" },
];
