import rawMenuData from './tropicool-menu.generated.json';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  variants: { name: string; price: string }[];
  labels: string[];
  image: string;
  imageAlt: string;
  sourceMenu: string;
  sourceSection: string;
  category: string;
  section: string;
};

export type MenuSection = {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
};

export type MenuGroup = {
  id: string;
  name: string;
  sourceName: string;
  description: string;
  sourceUrl: string;
  sections: MenuSection[];
};

export type TropicoolMenuData = {
  generatedAt: string;
  source: string;
  menus: MenuGroup[];
  items: MenuItem[];
};

export const menuData = rawMenuData as TropicoolMenuData;

const preferredNames = [
  'Nachos',
  'Sándwich "El Cubanito"',
  'Burger latina',
  'Curry amarillo',
  'Torrija de piña colada',
  'Karaage',
];

export const featuredItems = preferredNames
  .map((name) => menuData.items.find((item) => item.name === name && item.image))
  .filter(Boolean) as MenuItem[];

export const galleryItems = menuData.items
  .filter((item) => item.image)
  .filter((item) => ['Carta', 'Cócteles', 'Tardeo'].includes(item.category))
  .slice(0, 10);

export function wixImage(image: string, width = 900, height = 1120) {
  const match = image.match(/\/media\/([^/?#]+)/);
  if (!match) return image;
  const uri = match[1];
  return `https://static.wixstatic.com/media/${uri}/v1/fill/w_${width},h_${height},al_c,q_82,enc_avif,quality_auto/${uri}`;
}

export const menuStats = {
  items: menuData.items.length,
  sections: menuData.menus.reduce((total, menu) => total + menu.sections.length, 0),
  menus: menuData.menus.length,
};
