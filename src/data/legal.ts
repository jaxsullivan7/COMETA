export interface SeccionLegal {
  titulo: string;
  parrafos: string[];
}

export interface PaginaLegal {
  slug: string;
  titulo: string;
  entradilla: string;
  actualizado: string;
  secciones: SeccionLegal[];
}

/**
 * Textos base de carácter informativo. Deben revisarse con una asesora
 * legal antes de publicar la tienda y completar los datos entre corchetes.
 */
export const paginasLegales: PaginaLegal[] = [
  {
    slug: "aviso-legal",
    titulo: "Aviso legal",
    entradilla:
      "Información sobre el titular de este sitio web y las condiciones de uso.",
    actualizado: "Octubre de 2026",
    secciones: [
      {
        titulo: "1. Titular del sitio",
        parrafos: [
          "En cumplimiento del artículo 10 de la Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico, se informa de que este sitio web es titularidad de [NOMBRE Y APELLIDOS], con NIF [NIF] y domicilio en [DIRECCIÓN], España.",
          "Correo de contacto: [CORREO ELECTRÓNICO].",
        ],
      },
      {
        titulo: "2. Objeto",
        parrafos: [
          "COMETA es una boutique infantil dedicada a la venta de ropa para premamá, bebés y niños. Este sitio web tiene carácter informativo mientras la tienda prepara su apertura y no permite todavía la compra directa.",
        ],
      },
      {
        titulo: "3. Propiedad intelectual",
        parrafos: [
          "Los textos, ilustraciones, fotografías, logotipos y el resto de contenidos de este sitio están protegidos por la legislación de propiedad intelectual e industrial. Queda prohibida su reproducción o uso sin autorización expresa.",
        ],
      },
      {
        titulo: "4. Responsabilidad",
        parrafos: [
          "El titular no se responsabiliza de los daños derivados del mal uso del sitio ni de las interrupciones técnicas ajenas a su control. La información publicada puede actualizarse sin previo aviso.",
        ],
      },
      {
        titulo: "5. Legislación aplicable",
        parrafos: [
          "Esta relación se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales del domicilio del titular, salvo que la normativa de consumo establezca otro fuero.",
        ],
      },
    ],
  },
  {
    slug: "privacidad",
    titulo: "Política de privacidad",
    entradilla:
      "Cómo tratamos los datos personales que nos facilitas a través de este sitio.",
    actualizado: "Octubre de 2026",
    secciones: [
      {
        titulo: "1. Responsable del tratamiento",
        parrafos: [
          "Responsable: [NOMBRE Y APELLIDOS], NIF [NIF], con domicilio en [DIRECCIÓN]. Correo de contacto: [CORREO ELECTRÓNICO].",
        ],
      },
      {
        titulo: "2. Datos que tratamos",
        parrafos: [
          "Tratamos los datos que nos facilitas voluntariamente a través del formulario de contacto (nombre, correo electrónico y mensaje) y, si te suscribes, tu correo electrónico para enviarte novedades sobre la apertura de la tienda.",
        ],
      },
      {
        titulo: "3. Finalidad y base jurídica",
        parrafos: [
          "La finalidad es responder a tus consultas y, cuando lo autorices, informarte sobre novedades y lanzamientos. La base jurídica es tu consentimiento, que puedes retirar en cualquier momento.",
        ],
      },
      {
        titulo: "4. Conservación",
        parrafos: [
          "Conservaremos los datos durante el tiempo necesario para atender tu consulta y, en el caso de la newsletter, hasta que solicites la baja.",
        ],
      },
      {
        titulo: "5. Destinatarios",
        parrafos: [
          "No cedemos datos a terceros salvo obligación legal. Los proveedores tecnológicos que alojan el sitio y gestionan el correo actúan como encargados del tratamiento con las garantías exigidas por el RGPD.",
        ],
      },
      {
        titulo: "6. Tus derechos",
        parrafos: [
          "Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a [CORREO ELECTRÓNICO]. También puedes reclamar ante la Agencia Española de Protección de Datos.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    titulo: "Política de cookies",
    entradilla:
      "Qué cookies utiliza este sitio y cómo puedes gestionarlas.",
    actualizado: "Octubre de 2026",
    secciones: [
      {
        titulo: "1. Qué son las cookies",
        parrafos: [
          "Las cookies son pequeños archivos que se almacenan en tu dispositivo al navegar por un sitio web y permiten recordar información sobre tu visita.",
        ],
      },
      {
        titulo: "2. Cookies que utilizamos",
        parrafos: [
          "Actualmente este sitio solo utiliza cookies técnicas necesarias para su funcionamiento y no incorpora herramientas de analítica ni de publicidad. Si en el futuro se añaden, se solicitará tu consentimiento previo.",
        ],
      },
      {
        titulo: "3. Cómo gestionarlas",
        parrafos: [
          "Puedes eliminar o bloquear las cookies desde la configuración de tu navegador. Ten en cuenta que desactivar las cookies técnicas puede afectar al funcionamiento del sitio.",
        ],
      },
    ],
  },
];
