import { mkdir, writeFile } from 'node:fs/promises';

const MENUS = [
  ['carta', 'https://www.tropicoolrestaurante.com/menus?menu=men%C3%BA-de-cena-1'],
  ['menu-del-dia', 'https://www.tropicoolrestaurante.com/menus?menu=menu-del-dia-1'],
  ['tardeo', 'https://www.tropicoolrestaurante.com/menus?menu=tardeo'],
  ['bebida', 'https://www.tropicoolrestaurante.com/menus?menu=sides'],
  ['cocteles', 'https://www.tropicoolrestaurante.com/menus?menu=c%C3%B3cteles'],
  ['shishas-cachimbas', 'https://www.tropicoolrestaurante.com/menus?menu=shishas--cachimbas'],
];

const CATEGORY_LABELS = {
  carta: 'Carta',
  'menu-del-dia': 'Menú del día',
  tardeo: 'Tardeo',
  bebida: 'Bebida',
  cocteles: 'Cócteles',
  'shishas-cachimbas': 'Shishas - cachimbas',
};

function decodeHtml(value = '') {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/\s+/g, ' ')
    .trim();
}

function first(pattern, source) {
  const match = source.match(pattern);
  return match ? decodeHtml(match[1]) : '';
}

function absoluteWixImage(url) {
  if (!url) return '';
  return url.replace(/\/v1\/fill\/.*$/, '');
}

function parseVariants(itemHtml) {
  const variantBlocks = itemHtml.split(/data-hook="item\.variant"/).slice(1);
  return variantBlocks
    .map((block) => ({
      name: first(/data-hook="variant\.name"[^>]*>([\s\S]*?)<\/[^>]+>/i, block),
      price: first(/data-hook="variant\.price"[^>]*>([\s\S]*?)<\/[^>]+>/i, block),
    }))
    .filter((variant) => variant.name || variant.price);
}

function parseItem(itemHtml, sourceMenu, sourceSection) {
  const labels = [
    ...itemHtml.matchAll(/<img[^>]+alt="([^"]+)"[^>]*title="([^"]+)"/g),
  ].map((match) => decodeHtml(match[1]));
  const imageMatch = itemHtml.match(/<img src="([^"]+)" alt="([^"]*)" style=/);
  const variants = parseVariants(itemHtml);
  const name = first(/data-hook="item\.name"[^>]*>([\s\S]*?)<\/span>/i, itemHtml);
  const price = first(/data-hook="item\.price"[^>]*>([\s\S]*?)<\/p>/i, itemHtml);

  return {
    id: `${sourceMenu}-${sourceSection}-${name}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    name,
    description: first(/data-hook="item\.description"[^>]*>([\s\S]*?)<\/p>/i, itemHtml),
    price,
    variants,
    labels: [...new Set(labels)],
    image: absoluteWixImage(imageMatch?.[1] ?? ''),
    imageAlt: decodeHtml(imageMatch?.[2] ?? name),
    sourceMenu,
    sourceSection,
  };
}

function parseSections(html, sourceMenu) {
  return html
    .split(/<div class="skn_kD_" data-hook="section\.container"/)
    .slice(1)
    .map((sectionHtml) => {
      const name = first(/data-hook="section\.name"[^>]*>([\s\S]*?)<\/[^>]+>/i, sectionHtml);
      const description = first(/data-hook="section\.description"[^>]*>([\s\S]*?)<\/p>/i, sectionHtml);
      const itemHtmlBlocks = sectionHtml.split(/<div data-hook="item\.container"/).slice(1);
      const items = itemHtmlBlocks
        .map((itemHtml) => parseItem(itemHtml, sourceMenu, name))
        .filter((item) => item.name);

      return {
        id: `${sourceMenu}-${name}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
        name,
        description,
        items,
      };
    })
    .filter((section) => section.name || section.items.length);
}

async function scrapeMenu([id, url]) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
  const name = first(/data-hook="menu\.name"[^>]*>([\s\S]*?)<\/[^>]+>/i, html) || CATEGORY_LABELS[id];
  const description = first(/data-hook="menu\.description"[^>]*>([\s\S]*?)<\/p>/i, html);

  return {
    id,
    name: CATEGORY_LABELS[id] ?? name,
    sourceName: name,
    description,
    sourceUrl: url,
    sections: parseSections(html, id),
  };
}

const menus = await Promise.all(MENUS.map(scrapeMenu));
const items = menus.flatMap((menu) =>
  menu.sections.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      category: menu.name,
      section: section.name,
    })),
  ),
);

await mkdir('src/data', { recursive: true });
await writeFile(
  'src/data/tropicool-menu.generated.json',
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: 'https://www.tropicoolrestaurante.com/menus',
      menus,
      items,
    },
    null,
    2,
  )}\n`,
);

console.log(`Wrote ${items.length} menu items across ${menus.length} menus.`);
