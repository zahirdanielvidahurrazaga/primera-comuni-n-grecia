/**
 * Todos los datos del evento viven aquí.
 * Para montar otra galería (otro bautizo, otra comunión, otra boda)
 * basta con cambiar este archivo, las fotos de /public y el proyecto de Supabase.
 */

export const EVENT = {
  /** Identificador de las fotos en la base — separa este evento de cualquier otro */
  id: 'grecia-comunion-2026',

  /** Bucket de Supabase Storage donde viven las fotos */
  bucket: 'communion-photos',

  nombre: 'Grecia',
  titulo: 'Mi Primera Comunión',

  /** 28 de noviembre de 2026 */
  fecha: new Date('2026-11-28T00:00:00-06:00'),
  fechaCorta: '28 · XI · 2026',
  fechaLarga: '28 de Noviembre de 2026',

  misa: {
    lugar: 'Capilla del convento "La Guadalupana"',
  },
  recepcion: {
    lugar: 'Jardín Angelis',
  },

  padres: ['Elías Neri Zamora Ch.', 'Beatriz Valdez de Zamora'],
  padrinos: ['Marco Antonio Ixcoatl M.', 'Sonia Valdez De Ixcoatl'],

  versiculo: {
    cita: 'Juan 6:35',
    texto: 'Yo soy el pan de vida; el que viene a mí, nunca tendrá hambre, y el que cree en mí, nunca tendrá sed.',
  },

  hashtag: '#PrimeraComuniónDeGrecia',

  /** Código del panel de administración (/#admin) */
  adminCode: '2026',
} as const;
