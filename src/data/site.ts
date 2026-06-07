export const site = {
  name: 'Tropicool',
  url: 'https://www.tropicoolrestaurante.com/',
  title: 'Tropicool - Demo',
  description:
    'Demo no oficial de rediseño para Tropicool: restaurante 100% plant based y cocktail bar en C.C. X Madrid, Alcorcón.',
  address: 'C/ Oslo 53, C.C. X Madrid, Alcorcón, Madrid 28922',
  shortAddress: 'C.C. X Madrid - Alcorcón',
  phone: '917321557',
  email: 'tropicoolrestauracion@gmail.com',
  links: {
    reserve: 'https://miglop.es/cltropicool10564425/reservas/',
    order:
      'https://www.ubereats.com/es/store/tropicool-x-madrid/DhIzTU52Se6PTXKcSx0n0g',
    maps:
      'https://www.google.com/maps/search/?api=1&query=Tropicool%20X%20Madrid%20Alcorc%C3%B3n',
    instagram: 'https://www.instagram.com/tropicool_xmadrid',
    facebook: 'https://www.facebook.com/Tropicool-restaurante-100088657610118/',
    tiktok: 'https://www.tiktok.com/@tropicool_xmadrid',
    mail: 'mailto:tropicoolrestauracion@gmail.com',
    tel: 'tel:+34917321557',
  },
  copy: {
    kicker: '100% plant based + cocktail bar',
    heroTitle: 'Be Tropic. Be Cool.',
    heroText:
      'El primer restaurante "100% plant based" abierto en un centro comercial de España.',
    intro:
      'Tropicool nace de viajar, probar y mezclar sabores de la franja tropical. Todo es plant based, con alternativas vegetales y una carta pensada para compartir.',
  },
  assets: {
    hero: '/images/assets/site/hero.webp',
    interior: '/images/assets/site/interior.webp',
    accent: '/images/assets/site/accent.webp',
  },
};

export const navigation = [
  { key: 'menu', label: 'Carta', href: '#carta' },
  { key: 'gallery', label: 'Galería', href: '/galeria/' },
  { key: 'reserve', label: 'Reservar', href: site.links.tel },
  { key: 'order', label: 'Pedir online', href: site.links.order },
  { key: 'contact', label: '¿Dónde estamos?', href: '#contacto' },
];
