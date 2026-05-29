import { writable } from 'svelte/store';
import type { MenuItem } from './data/menu';

export type Lang = 'es' | 'en';

export const languages: { code: Lang; label: string; short: string }[] = [
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'en', label: 'English', short: 'EN' },
];

export const defaultLang: Lang = 'es';
export const language = writable<Lang>(defaultLang);

export const messages = {
  es: {
    'meta.title': 'TROPICOOL - Demo',
    'meta.description':
      'Demo no oficial de rediseño para Tropicool: restaurante 100% plant based y cocktail bar en C.C. X Madrid, Alcorcón.',
    'demo.notice': 'Demo no oficial de rediseño. No afiliada ni aprobada por Tropicool.',
    'nav.menu': 'Carta',
    'nav.reserve': 'Reservar',
    'nav.order': 'Pedir online',
    'nav.contact': '¿Dónde estamos?',
    'lang.label': 'Idioma',
    'lang.aria': 'Cambiar idioma',
    'hero.kicker': '100% plant based + cocktail bar',
    'hero.text': 'El primer restaurante "100% plant based" abierto en un centro comercial de España.',
    'cta.reserve': 'Reservar',
    'cta.reserveTable': 'Reservar mesa',
    'cta.fullMenu': 'Ver carta completa',
    'cta.orderOnline': 'Pedir online',
    'cta.orderUber': 'Pedir en Uber Eats',
    'menu.eyebrow': 'Carta completa',
    'menu.title': 'Nuestra carta 100% plant based 🌱💚',
    'menu.description':
      'Carta, bebida, cócteles, menú del día, tardeo y shishas en un solo explorador. Los productos sin gluten pueden contener trazas por contaminación cruzada.',
    'booking.eyebrow': 'Reserva y pedidos',
    'booking.title': 'De aquí a la mesa en dos clics.',
    'booking.text':
      'Mesa para cenar, tardeo con cócteles o plan de finde: reserva en un toque y ven con hambre.',
    'booking.card.reserveTag': 'Reservas',
    'booking.card.reserveTitle': 'Mesa asegurada',
    'booking.card.reserveText': 'Enlace directo al sistema de reservas actual.',
    'booking.card.deliveryTag': 'Delivery',
    'booking.card.deliveryTitle': 'Tropicool en casa',
    'booking.card.deliveryText': 'Acceso a pedidos online sin mezclarlo con la reserva.',
    'booking.card.mapsTag': 'Cómo llegar',
    'gallery.eyebrow': 'Mood de cocina',
    'gallery.title': 'Tropical, vegetal, nocturno.',
    'contact.eyebrow': 'Contacto',
    'contact.title': 'Nos vemos en X Madrid.',
    'footer.note': 'Demo no oficial 2026 · propuesta pública de rediseño basada en contenido público.',
    'menuExplorer.title': 'Carta 100% plant based',
    'menuExplorer.all': 'Todo',
    'menuExplorer.searchLabel': 'Buscar en la carta',
    'menuExplorer.searchPlaceholder': 'Buscar nachos, burger, cóctel, soja...',
    'menuExplorer.clear': 'Limpiar búsqueda',
    'menuExplorer.count': '{visible} de {total} propuestas',
    'menuExplorer.allergenWarning': 'Los alérgenos deben validarse con cocina antes de publicar.',
    'menuExplorer.noResults': 'No hay resultados',
    'menuExplorer.noResultsText': 'Prueba con otra categoría o borra el filtro.',
    'menuExplorer.from': 'Desde {price}',
    'filter.all': 'Todo',
    'filter.vegan': 'Vegano',
    'filter.glutenFree': 'Sin gluten',
    'filter.spicy': 'Picante',
  },
  en: {
    'meta.title': 'Tropicool demo - Plant-based restaurant & cocktail bar in X Madrid',
    'meta.description':
      'Unofficial redesign demo for Tropicool: a 100% plant-based restaurant and cocktail bar at C.C. X Madrid, Alcorcon.',
    'demo.notice': 'Unofficial redesign demo. Not affiliated with or approved by Tropicool.',
    'nav.menu': 'Menu',
    'nav.reserve': 'Book',
    'nav.order': 'Order online',
    'nav.contact': 'Find us',
    'lang.label': 'Language',
    'lang.aria': 'Change language',
    'hero.kicker': '100% plant-based + cocktail bar',
    'hero.text': 'The first "100% plant-based" restaurant opened in a shopping centre in Spain.',
    'cta.reserve': 'Book',
    'cta.reserveTable': 'Book a table',
    'cta.fullMenu': 'View full menu',
    'cta.orderOnline': 'Order online',
    'cta.orderUber': 'Order on Uber Eats',
    'menu.eyebrow': 'Full menu',
    'menu.title': 'Our 100% plant-based menu 🌱💚',
    'menu.description':
      'Food, drinks, cocktails, lunch menu, afternoon plates and shishas in one explorer. Gluten-free products may contain traces due to cross-contamination.',
    'booking.eyebrow': 'Bookings and orders',
    'booking.title': 'From here to the table in two clicks.',
    'booking.text':
      'Dinner, cocktails or a weekend plan: book in a tap and arrive hungry.',
    'booking.card.reserveTag': 'Bookings',
    'booking.card.reserveTitle': 'Your table, sorted',
    'booking.card.reserveText': 'Direct link to the current reservation system.',
    'booking.card.deliveryTag': 'Delivery',
    'booking.card.deliveryTitle': 'Tropicool at home',
    'booking.card.deliveryText': 'Online ordering access without mixing it with reservations.',
    'booking.card.mapsTag': 'Directions',
    'gallery.eyebrow': 'Kitchen mood',
    'gallery.title': 'Tropical, plant-based, nocturnal.',
    'contact.eyebrow': 'Contact',
    'contact.title': 'See you at X Madrid.',
    'footer.note': 'Unofficial demo 2026 · public redesign proposal based on public content.',
    'menuExplorer.title': '100% plant-based menu',
    'menuExplorer.all': 'All',
    'menuExplorer.searchLabel': 'Search the menu',
    'menuExplorer.searchPlaceholder': 'Search nachos, burger, cocktail, soy...',
    'menuExplorer.clear': 'Clear search',
    'menuExplorer.count': '{visible} of {total} items',
    'menuExplorer.allergenWarning': 'Allergens must be validated with the kitchen before publishing.',
    'menuExplorer.noResults': 'No results',
    'menuExplorer.noResultsText': 'Try another category or clear the filter.',
    'menuExplorer.from': 'From {price}',
    'filter.all': 'All',
    'filter.vegan': 'Vegan',
    'filter.glutenFree': 'Gluten-free',
    'filter.spicy': 'Spicy',
  },
} satisfies Record<Lang, Record<string, string>>;

const menuNameEN: Record<string, string> = {
  Carta: 'Food',
  'Menú del día': 'Lunch menu',
  Tardeo: 'Afternoon plates',
  Bebida: 'Drinks',
  Cócteles: 'Cocktails',
  'Shishas - cachimbas': 'Shishas',
};

const sectionNameEN: Record<string, string> = {
  ENTRANTES: 'Starters',
  'STREET FOOD': 'Street food',
  'MENU INFANTIL': 'Kids menu',
  POSTRES: 'Desserts',
  'MENU DEL DIA': 'Lunch menu',
  TARDEO: 'Afternoon plates',
  LIMONADAS: 'Lemonades',
  'REFRESCOS, ZUMOS Y AGUA': 'Soft drinks, juices & water',
  'CERVEZAS Y SIDRA': 'Beer & cider',
  'SANGRIA, VERMU, VINO Y CAVA': 'Sangria, vermouth, wine & cava',
  'CAFE E INFUSIONES': 'Coffee & tea',
  CÓCTELES: 'Cocktails',
  'CON ALCOHOL': 'With alcohol',
  'SIN ALCOHOL': 'Alcohol-free',
  'SHISHAS-CACHIMBAS': 'Shishas',
};

const sectionDescriptionEN: Record<string, string> = {
  ENTRANTES: 'Tropicool is made for sharing. Start here and build the table around it.',
  'STREET FOOD': 'Street-food classics from around the world, always with a Tropicool twist.',
  'MENU INFANTIL': 'A plant-based menu for the little ones.',
  POSTRES: 'Sweet endings with a Tropicool accent.',
  'MENU DEL DIA': 'Lunch menu available Monday to Friday from 13:00 to 16:30, except holidays and eves.',
  TARDEO: 'Friday, Saturday, Sunday and holiday-afternoon specials from 18:30.',
  LIMONADAS: 'House lemonades made with 100% natural ingredients.',
  CÓCTELES: 'Classic cocktails with a Tropicool twist and alcohol-free options.',
  'CON ALCOHOL': 'Cocktails with alcohol.',
  'SIN ALCOHOL': 'Alcohol-free cocktails.',
  'SHISHAS-CACHIMBAS': 'Shishas with several flavor options. Ask the team for current availability.',
};

const labelEN: Record<string, string> = {
  Vegano: 'Vegan',
  Trigo: 'Wheat',
  Soja: 'Soy',
  'Sin gluten': 'Gluten-free',
  'Frutos secos': 'Tree nuts',
  Suave: 'Mild',
  Picante: 'Spicy',
  Sésamo: 'Sesame',
  Sesamo: 'Sesame',
  Mostaza: 'Mustard',
  Sulfitos: 'Sulphites',
  Apio: 'Celery',
  Altramuz: 'Lupin',
};

const itemDescriptionEN: Record<string, string> = {
  'carta-ENTRANTES-NACHOS':
    'Nachos with plant-based "chorizo", beans, homemade cheddar-style sauce, guacamole and pico de gallo. Contains gluten, soy and tree nuts.',
  'carta-ENTRANTES-FINGERS DE "POLLO"':
    'Crispy plant-based "chicken" fingers with mustard and agave sauce. Contains soy and mustard.',
  'carta-ENTRANTES-FALAFEL':
    'Homemade falafel with yogurt-style sauce, vegan mayo and tahini, finished with Dukkah. Contains soy and tree nuts.',
  'carta-ENTRANTES-BROCHETAS SAHARA':
    'Sahara-style skewers with plant-based pieces and tropical seasoning.',
  'carta-ENTRANTES-EDAMAME':
    'Edamame pods served with a Tropicool touch.',
  'carta-ENTRANTES-KARAAGE':
    'Japanese-style plant-based karaage, crisp outside and juicy inside.',
  'carta-ENTRANTES-TEQUEÑOS':
    'Venezuelan-style tequeños with a plant-based filling.',
  'carta-STREET FOOD-SÁNDWICH "EL CUBANITO"':
    'Pulled plant-based "pork" sandwich in brioche with vegan bacon, cheese-style sauce and pickles.',
  'carta-STREET FOOD-BURGER LATINA':
    'Burger with vegan bacon, jalapeño sauce, guacamole, red onion, lettuce and tomato.',
  'carta-STREET FOOD-BURGER ORIENTAL':
    'Burger with shiitake mushroom and kimchi mayo. Add vegan cheese or vegan bacon as extras.',
  'carta-STREET FOOD-BROCCOLINO YOGURTH':
    'Broccolini with yogurt-style sauce and Tropicool seasoning.',
  'carta-STREET FOOD-TACOS':
    'Plant-based tacos with fresh toppings and house sauces.',
  'carta-STREET FOOD-CURRY AMARILLO':
    'Yellow curry with vegetables and aromatic spices.',
  'carta-STREET FOOD-PAD THAI':
    'Plant-based Pad Thai with rice noodles, vegetables and Thai-inspired sauce.',
  'carta-STREET FOOD-NASI GORENG':
    'Indonesian-style fried rice with vegetables and plant-based protein.',
  'carta-STREET FOOD-SHAWARMA':
    'Plant-based shawarma with fresh vegetables and house sauce.',
  'carta-STREET FOOD-POKE BOWL/POLLO':
    'Poke bowl with plant-based "chicken", rice, vegetables and Tropicool dressing.',
  'carta-POSTRES-TORRIJA DE PIÑA COLADA':
    'Piña colada-style torrija with mango and passion fruit ice cream. Contains gluten.',
  'carta-POSTRES-TORRIJA DE MANGO':
    'Mango torrija with chocolate ice cream. Contains gluten.',
  'carta-POSTRES-TARTA DE CHOCO':
    'Chocolate cake with a cookie base and roasted orange marmalade.',
};

const nameEN: Record<string, string> = {
  'MENU INFANTIL': 'Kids menu',
  'TORRIJA DE PIÑA COLADA': 'Piña colada torrija',
  'TORRIJA DE MANGO': 'Mango torrija',
  'TARTA DE CHOCO': 'Chocolate cake',
};

export function t(key: string, lang: Lang, replacements: Record<string, string | number> = {}) {
  let value = messages[lang][key] ?? messages.es[key] ?? key;
  Object.entries(replacements).forEach(([token, replacement]) => {
    value = value.replaceAll(`{${token}}`, String(replacement));
  });
  return value;
}

export function initLanguage() {
  if (typeof window === 'undefined') return defaultLang;
  const saved = window.localStorage.getItem('tropicool-lang') as Lang | null;
  const initial = saved === 'en' || saved === 'es' ? saved : defaultLang;
  setLanguage(initial);
  return initial;
}

export function setLanguage(next: Lang) {
  language.set(next);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('tropicool-lang', next);
    window.dispatchEvent(new CustomEvent('tropicool-language-change', { detail: next }));
  }
}

export function translateMenuName(value: string, lang: Lang) {
  return lang === 'en' ? menuNameEN[value] ?? value : value;
}

export function translateSectionName(value: string, lang: Lang) {
  return lang === 'en' ? sectionNameEN[value] ?? value : value;
}

export function translateSectionDescription(value: string, lang: Lang) {
  if (lang === 'es') return value;
  return sectionDescriptionEN[value] ?? translateTextFallback(value);
}

export function translateLabel(value: string, lang: Lang) {
  return lang === 'en' ? labelEN[value] ?? value : value;
}

export function translateItemName(item: MenuItem, lang: Lang) {
  return lang === 'en' ? nameEN[item.name] ?? item.name : item.name;
}

export function translateVariantName(value: string, lang: Lang) {
  if (lang === 'es') return value;
  return translateTextFallback(value);
}

export function translateItemDescription(item: MenuItem, lang: Lang) {
  if (lang === 'es') return item.description;
  return itemDescriptionEN[`${item.sourceMenu}-${item.sourceSection}-${item.name}`] ?? translateTextFallback(item.description);
}

function translateTextFallback(value = '') {
  return value
    .replaceAll('Toda nuestra carta es 100% plant based', 'Our whole menu is 100% plant-based')
    .replaceAll('utilizando únicamente ingredientes de origen vegetal', 'using only plant-based ingredients')
    .replaceAll('Los ingredientes entre comillas son alternativas vegetales', 'Ingredients in quotation marks are plant-based alternatives')
    .replaceAll('Los productos marcados sin gluten', 'Products marked gluten-free')
    .replaceAll('contienen trazas por contaminación cruzada', 'may contain traces due to cross-contamination')
    .replaceAll('Contiene gluten', 'Contains gluten')
    .replaceAll('Contiene soja', 'Contains soy')
    .replaceAll('Contiene frutos secos', 'Contains tree nuts')
    .replaceAll('Contiene mostaza', 'Contains mustard')
    .replaceAll('Contiene sulfitos', 'Contains sulphites')
    .replaceAll('Contiene sésamo', 'Contains sesame')
    .replaceAll('Sin gluten', 'Gluten-free')
    .replaceAll('con salsa', 'with sauce')
    .replaceAll('Con salsa', 'With sauce')
    .replaceAll('con helado', 'with ice cream')
    .replaceAll('Con helado', 'With ice cream')
    .replaceAll('con arroz', 'with rice')
    .replaceAll('con verduras', 'with vegetables')
    .replaceAll('casera', 'homemade')
    .replaceAll('casero', 'homemade')
    .replaceAll('vegano', 'vegan')
    .replaceAll('vegetal', 'plant-based');
}
