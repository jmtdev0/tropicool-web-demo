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
    'meta.title': 'Tropicool - Demo',
    'meta.description':
      'Demo no oficial de rediseño para Tropicool: restaurante 100% plant based y cocktail bar en C.C. X Madrid, Alcorcón.',
    'demo.notice': 'Demo no oficial de rediseño. No afiliada ni aprobada por Tropicool.',
    'nav.menu': 'Carta',
    'nav.gallery': 'Galería',
    'nav.reserve': 'Reservar',
    'nav.order': 'Pedir online',
    'nav.contact': '¿Dónde estamos?',
    'lang.label': 'Idioma',
    'lang.aria': 'Cambiar idioma',
    'hero.kicker': '100% plant based + cocktail bar',
    'hero.text': 'El primer restaurante "100% plant based" abierto en un centro comercial de España.',
    'hero.storyToggle': 'Conoce nuestra historia',
    'hero.storyLead': 'Tropicool nace de una pequeña locura.',
    'hero.storyText':
      'Acumulando viajes por todo el mundo, hemos aprendido y absorbido experiencias y momentos que intentamos aplicar en nuestro día a día.',
    'hero.aboutText':
      'Recopilamos platos y bebidas típicas de la franja que comprende desde el trópico de Cáncer hasta el trópico de Capricornio.',
    'hero.storySignature': '100% plant based · Be Tropic. Be Cool.',
    'hero.foundedText':
      'Fundamos Tropicool en el año 2000 y somos bien conocidos por revolucionar la manera en que la gente come y disfruta sus alimentos. Nos sentimos orgullosos por haber descubierto sabores exclusivos a nivel mundial y compartirlos con personas de todo el mundo. ¡Únete a nosotros!',
    'cta.reserve': 'Reservar',
    'cta.reserveTable': 'Reservar mesa',
    'cta.fullMenu': 'Ver carta completa',
    'cta.orderOnline': 'Pedir online',
    'cta.callNow': 'Llamar ahora',
    'cta.getDirections': 'Cómo llegar',
    'menu.eyebrow': 'Carta completa',
    'menu.title': 'Nuestra carta 100% plant based',
    'menu.description':
      'Toda nuestra carta es 100% plant based y utiliza únicamente ingredientes de origen vegetal. Los ingredientes entre comillas son alternativas vegetales que simulan a las de origen animal. Los productos marcados sin gluten no contienen gluten en sus ingredientes, pero pueden contener trazas por contaminación cruzada durante su elaboración.',
    'booking.card.reserveTag': 'Reservas',
    'booking.card.deliveryTag': 'Delivery',
    'reservation.title': 'Reserva por teléfono',
    'reservation.text': 'Para reservar mesa en Tropicool, llámanos y te confirmamos disponibilidad al momento.',
    'reservation.hoursTitle': 'Horario',
    'reservation.hours.mon': 'Lunes',
    'reservation.hours.monTime': '13:00-16:30 y 20:00-23:30',
    'reservation.hours.tueWed': 'Martes y miércoles',
    'reservation.hours.tueWedTime': '13:30-16:30 y 20:00-23:30',
    'reservation.hours.thu': 'Jueves',
    'reservation.hours.thuTime': '13:30-23:30',
    'reservation.hours.friSat': 'Viernes y sábado',
    'reservation.hours.friSatTime': '13:30-00:00',
    'reservation.hours.sun': 'Domingo',
    'reservation.hours.sunTime': '13:30-23:00',
    'reservation.close': 'Cerrar reserva',
    'reservation.later': 'Ahora no',
    'order.title': 'Pedir en Uber Eats',
    'order.text': 'Vas a salir de esta web y abrir Uber Eats para completar el pedido.',
    'order.continue': 'Continuar a Uber Eats',
    'order.cancel': 'Ahora no',
    'order.close': 'Cerrar pedido online',
    'gallery.eyebrow': 'Galería',
    'gallery.title': 'Tropicool a pantalla completa.',
    'gallery.text': 'Fotos y vídeos de Tropicool para abrir, mirar y cerrar sin salir de la web.',
    'gallery.open': 'Abrir',
    'gallery.close': 'Cerrar galería',
    'gallery.previous': 'Anterior',
    'gallery.next': 'Siguiente',
    'gallery.photo': 'Foto',
    'gallery.video': 'Vídeo',
    'contact.eyebrow': 'X Madrid',
    'contact.title': '¿Dónde estamos?',
    'contact.text': 'Estamos en C.C. X Madrid, Alcorcón. Guarda la ruta, llama si quieres reservar y vente con hambre.',
    'contact.locationTitle': 'Tropicool está en X-Madrid, Alcorcón.',
    'contact.locationText':
      'Nos encontrarás dentro del centro comercial X-Madrid, en Alcorcón. Guarda la ruta y ven directo a disfrutar de Tropicool.',
    'contact.mapCaption': 'Ubicación de Tropicool dentro de X-Madrid.',
    'footer.note': 'Demo no oficial 2026 · propuesta pública de rediseño basada en contenido público.',
    'menuExplorer.title': 'Carta 100% plant based',
    'menuExplorer.all': 'Todo',
    'menuExplorer.searchLabel': 'Buscar en la carta',
    'menuExplorer.searchPlaceholder': 'Buscar nachos, burger, cóctel, soja...',
    'menuExplorer.clear': 'Limpiar búsqueda',
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
    'nav.gallery': 'Gallery',
    'nav.reserve': 'Book',
    'nav.order': 'Order online',
    'nav.contact': 'Where are we?',
    'lang.label': 'Language',
    'lang.aria': 'Change language',
    'hero.kicker': '100% plant-based + cocktail bar',
    'hero.text': 'The first "100% plant-based" restaurant opened in a shopping centre in Spain.',
    'hero.storyToggle': 'Read the story',
    'hero.storyLead':
      'Tropicool was born from a small madness.',
    'hero.storyText':
      'After travelling around the world, we have learned and absorbed experiences and moments that we try to apply in our everyday life.',
    'hero.aboutText':
      'We gather typical dishes and drinks from the belt that stretches from the Tropic of Cancer to the Tropic of Capricorn.',
    'hero.storySignature': '100% plant-based · Be Tropic. Be Cool.',
    'hero.foundedText':
      'We founded Tropicool in 2000 and are well known for revolutionising the way people eat and enjoy their food. We are proud to have discovered exclusive flavours from around the world and to share them with people everywhere. Join us!',
    'cta.reserve': 'Book',
    'cta.reserveTable': 'Book a table',
    'cta.fullMenu': 'View full menu',
    'cta.orderOnline': 'Order online',
    'cta.callNow': 'Call now',
    'cta.getDirections': 'Get directions',
    'menu.eyebrow': 'Full menu',
    'menu.title': 'Our 100% plant-based menu',
    'menu.description':
      'Our whole menu is 100% plant-based, using only ingredients of plant origin. Ingredients in quotation marks are plant-based alternatives that simulate animal-based ones. *Products marked gluten-free do not contain gluten in any of their ingredients, but may contain traces due to cross-contamination during preparation.',
    'booking.card.reserveTag': 'Bookings',
    'booking.card.deliveryTag': 'Delivery',
    'reservation.title': 'Book by phone',
    'reservation.text': 'To book a table at Tropicool, call us and we will confirm availability right away.',
    'reservation.hoursTitle': 'Opening hours',
    'reservation.hours.mon': 'Monday',
    'reservation.hours.monTime': '1:00-4:30 pm and 8:00-11:30 pm',
    'reservation.hours.tueWed': 'Tuesday and Wednesday',
    'reservation.hours.tueWedTime': '1:30-4:30 pm and 8:00-11:30 pm',
    'reservation.hours.thu': 'Thursday',
    'reservation.hours.thuTime': '1:30-11:30 pm',
    'reservation.hours.friSat': 'Friday and Saturday',
    'reservation.hours.friSatTime': '1:30 pm-12:00 am',
    'reservation.hours.sun': 'Sunday',
    'reservation.hours.sunTime': '1:30-11:00 pm',
    'reservation.close': 'Close booking dialog',
    'reservation.later': 'Not now',
    'order.title': 'Order on Uber Eats',
    'order.text': 'You are about to leave this website and open Uber Eats to complete your order.',
    'order.continue': 'Continue to Uber Eats',
    'order.cancel': 'Not now',
    'order.close': 'Close online order dialog',
    'gallery.eyebrow': 'Gallery',
    'gallery.title': 'Tropicool fullscreen.',
    'gallery.text': 'Photos and videos from Tropicool to open, watch and close without leaving the site.',
    'gallery.open': 'Open',
    'gallery.close': 'Close gallery',
    'gallery.previous': 'Previous',
    'gallery.next': 'Next',
    'gallery.photo': 'Photo',
    'gallery.video': 'Video',
    'contact.eyebrow': 'X Madrid',
    'contact.title': 'Where are we?',
    'contact.text': 'Find us at C.C. X Madrid, Alcorcon. Save the route, call if you want to book and arrive hungry.',
    'contact.locationTitle': 'Tropicool is in X-Madrid, Alcorcon.',
    'contact.locationText':
      'Find us inside X-Madrid shopping centre in Alcorcon. Save the route and come straight to Tropicool.',
    'contact.mapCaption': 'Tropicool location inside X-Madrid.',
    'footer.note': 'Unofficial demo 2026 · public redesign proposal based on public content.',
    'menuExplorer.title': '100% plant-based menu',
    'menuExplorer.all': 'All',
    'menuExplorer.searchLabel': 'Search the menu',
    'menuExplorer.searchPlaceholder': 'Search nachos, burger, cocktail, soy...',
    'menuExplorer.clear': 'Clear search',
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
  Entrantes: 'Starters',
  'Street food': 'Street food',
  'Menú infantil': 'Kids menu',
  Postres: 'Desserts',
  'Menú del día': 'Lunch menu',
  Tardeo: 'Afternoon plates',
  Limonadas: 'Lemonades',
  'Refrescos, zumos y agua': 'Soft drinks, juices & water',
  'Cervezas y sidra': 'Beer & cider',
  'Sangría, vermú, vino y cava': 'Sangria, vermouth, wine & cava',
  'Café e infusiones': 'Coffee & tea',
  Cócteles: 'Cocktails',
  'Con alcohol': 'With alcohol',
  'Sin alcohol': 'Alcohol-free',
  'Shishas - cachimbas': 'Shishas',
};

const sectionDescriptionEN: Record<string, string> = {
  Entrantes: 'Tropicool is made for sharing. Start here and build the table around it.',
  'Street food': 'Street-food classics from around the world, always with a Tropicool twist.',
  'Menú infantil': 'A plant-based menu for the little ones.',
  Postres: 'Sweet endings with a Tropicool accent.',
  'Menú del día': 'Lunch menu available Monday to Friday from 13:00 to 16:30, except holidays and eves.',
  Tardeo: 'Friday, Saturday, Sunday and holiday-afternoon specials from 18:30.',
  Limonadas: 'House lemonades made with 100% natural ingredients.',
  Cócteles: 'Classic cocktails with a Tropicool twist and alcohol-free options.',
  'Con alcohol': 'Cocktails with alcohol.',
  'Sin alcohol': 'Alcohol-free cocktails.',
  'Shishas - cachimbas': 'Shishas with several flavor options. Ask the team for current availability.',
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
  'carta-ENTRANTES-Nachos':
    'Nachos with plant-based "chorizo", beans, homemade cheddar-style sauce, guacamole and pico de gallo. Contains gluten, soy and tree nuts.',
  'carta-ENTRANTES-Fingers de "pollo"':
    'Crispy plant-based "chicken" fingers with mustard and agave sauce. Contains soy and mustard.',
  'carta-ENTRANTES-Falafel':
    'Homemade falafel with yogurt-style sauce, vegan mayo and tahini, finished with Dukkah. Contains soy and tree nuts.',
  'carta-ENTRANTES-Brochetas Sahara':
    'Sahara-style skewers with plant-based pieces and tropical seasoning.',
  'carta-ENTRANTES-Edamame':
    'Edamame pods served with a Tropicool touch.',
  'carta-ENTRANTES-Karaage':
    'Japanese-style plant-based karaage, crisp outside and juicy inside.',
  'carta-ENTRANTES-Tequeños':
    'Venezuelan-style tequeños with a plant-based filling.',
  'carta-STREET FOOD-Sándwich "El Cubanito"':
    'Pulled plant-based "pork" sandwich in brioche with vegan bacon, cheese-style sauce and pickles.',
  'carta-STREET FOOD-Burger latina':
    'Burger with vegan bacon, jalapeño sauce, guacamole, red onion, lettuce and tomato.',
  'carta-STREET FOOD-Burger oriental':
    'Burger with shiitake mushroom and kimchi mayo. Add vegan cheese or vegan bacon as extras.',
  'carta-STREET FOOD-BROCCOLINO YOGURTH':
    'Broccolini with yogurt-style sauce and Tropicool seasoning.',
  'carta-STREET FOOD-Tacos':
    'Plant-based tacos with fresh toppings and house sauces.',
  'carta-STREET FOOD-CURRY AMARILLO':
    'Yellow curry with vegetables and aromatic spices.',
  'carta-STREET FOOD-Pad Thai':
    'Plant-based Pad Thai with rice noodles, vegetables and Thai-inspired sauce.',
  'carta-STREET FOOD-Nasi goreng':
    'Indonesian-style fried rice with vegetables and plant-based protein.',
  'carta-STREET FOOD-Shawarma':
    'Plant-based shawarma with fresh vegetables and house sauce.',
  'carta-STREET FOOD-Poke bowl pollo':
    'Poke bowl with plant-based "chicken", rice, vegetables and Tropicool dressing.',
  'carta-POSTRES-Torrija de piña colada':
    'Piña colada-style torrija with mango and passion fruit ice cream. Contains gluten.',
  'carta-POSTRES-Torrija de mango':
    'Mango torrija with chocolate ice cream. Contains gluten.',
  'carta-POSTRES-Tarta de choco':
    'Chocolate cake with a cookie base and roasted orange marmalade.',
};

const nameEN: Record<string, string> = {
  'Menú infantil': 'Kids menu',
  'Torrija de piña colada': 'Piña colada torrija',
  'Torrija de mango': 'Mango torrija',
  'Tarta de choco': 'Chocolate cake',
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
