import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const en = {
  nav: { home: 'Home', three: '3D Experience', residences: 'Residences', business: 'Business', retail: 'Retail Spaces', location: 'Location', amenities: 'Amenities', contact: 'Contact', about: 'About the investor', inquire: 'Inquire', menu: 'Menu', close: 'Close' },
  hero: { tag: 'A living canopy in the city', scroll: 'Scroll to explore', explore3d: 'Explore in 3D', design: 'Lumen Grove Design',
    s1t: 'A facade grown, not built', s1: 'Inspired by the layered shade of a tree canopy, the facade breathes with planted terraces, dappled light and organic lines that soften the skyline.',
    s2t: 'Light, filtered through green', s2: 'Every home is oriented to catch the day as it moves — morning gold in the kitchen, a long green dusk on the terrace. Architecture that behaves like a forest edge.',
    s3t: 'A new chapter takes root', s3: 'Residences, workplaces and neighborhood retail gathered under one canopy in Your City, Your District. This is city living, replanted.', cta: 'Explore our apartments' },
  loc: { label: "What's around", title: 'Location', intro: 'Set on a quiet, tree-lined avenue in Your District, Lumen Grove keeps the whole city within a short walk or ride — while its own gardens keep the city at a gentle distance.' },
  common: { results: 'Results', reset: 'Reset filters', seeMore: 'See more', loadMore: 'Load more residences', area: 'Area', floor: 'Floor', rooms: 'Rooms', submit: 'Submit', inquireUnit: 'Inquire about this unit', downloadPlan: 'Download plan (PDF)', back: 'Back to catalog', available: 'Available', reserved: 'Reserved', walk: 'walk', drive: 'drive' },
}
const es = {
  nav: { home: 'Inicio', three: 'Experiencia 3D', residences: 'Residencias', business: 'Negocios', retail: 'Espacios comerciales', location: 'Ubicación', amenities: 'Amenidades', contact: 'Contacto', about: 'Sobre el inversionista', inquire: 'Consultar', menu: 'Menú', close: 'Cerrar' },
  hero: { tag: 'Un dosel vivo en la ciudad', scroll: 'Desliza para explorar', explore3d: 'Explorar en 3D', design: 'Diseño Lumen Grove',
    s1t: 'Una fachada que crece', s1: 'Inspirada en la sombra de un dosel de árboles, la fachada respira con terrazas plantadas y líneas orgánicas.',
    s2t: 'Luz filtrada por el verde', s2: 'Cada hogar está orientado para seguir el día: oro matutino en la cocina y un atardecer verde en la terraza.',
    s3t: 'Un nuevo capítulo echa raíces', s3: 'Residencias, oficinas y comercio bajo un mismo dosel. La vida urbana, replantada.', cta: 'Ver apartamentos' },
  loc: { label: 'Qué hay cerca', title: 'Ubicación', intro: 'En una avenida arbolada y tranquila, Lumen Grove mantiene toda la ciudad a un paseo de distancia.' },
  common: { results: 'Resultados', reset: 'Restablecer filtros', seeMore: 'Ver más', loadMore: 'Cargar más', area: 'Superficie', floor: 'Piso', rooms: 'Ambientes', submit: 'Enviar', inquireUnit: 'Consultar por esta unidad', downloadPlan: 'Descargar plano (PDF)', back: 'Volver al catálogo', available: 'Disponible', reserved: 'Reservada', walk: 'a pie', drive: 'en auto' },
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: 'en', fallbackLng: 'en', interpolation: { escapeValue: false },
})
export default i18n
export const LANGS = ['en', 'es'] as const
