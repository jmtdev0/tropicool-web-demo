<script lang="ts">
  import { Search, Leaf, WheatOff, Flame, Martini, Utensils, X } from '@lucide/svelte';
  import type { MenuGroup, MenuItem } from '../data/menu';
  import {
    language,
    t,
    translateItemDescription,
    translateItemName,
    translateLabel,
    translateMenuName,
    translateSectionDescription,
    translateSectionName,
    translateVariantName,
  } from '../i18n';

  export let menus: MenuGroup[] = [];

  let selectedMenu = 'carta';
  let selectedSection = '';
  let glutenFreeOnly = false;
  let query = '';

  const primaryMenuIds = new Set(['carta', 'bebida']);

  const allItems = menus.flatMap((menu) =>
    menu.sections.flatMap((section) =>
      section.items.map((item) => ({
        ...item,
        category: menu.name,
        section: section.name,
      })),
    ),
  );

  $: primaryMenus = menus.filter((menu) => primaryMenuIds.has(menu.id));
  $: secondaryMenus = menus.filter((menu) => !primaryMenuIds.has(menu.id));
  $: selectedMenuData = menus.find((menu) => menu.id === selectedMenu);
  $: scopedItems = allItems.filter(
    (item) => item.sourceMenu === selectedMenu && (!selectedSection || item.section === selectedSection),
  );
  $: normalizedQuery = query.trim().toLowerCase();
  $: visibleItems = scopedItems.filter((item) => {
    const matchesQuery =
      !normalizedQuery ||
      `${item.name} ${translateItemName(item, $language)} ${item.description} ${translateItemDescription(item, $language)} ${item.category} ${translateMenuName(item.category, $language)} ${item.section} ${translateSectionName(item.section, $language)} ${item.labels.join(' ')} ${item.labels.map((label) => translateLabel(label, $language)).join(' ')}`
        .toLowerCase()
        .includes(normalizedQuery);
    const matchesFilter = !glutenFreeOnly || item.labels.includes('Sin gluten');
    return matchesQuery && matchesFilter;
  });
  $: groupedItems = groupBySection(visibleItems);

  function groupBySection(items: MenuItem[]) {
    const groups = new Map<string, { key: string; title: string; subtitle: string; items: MenuItem[] }>();

    items.forEach((item) => {
      const key = item.section;
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          title: translateSectionName(item.section, $language),
          subtitle:
            translateSectionDescription(
              menus
                .find((menu) => menu.id === item.sourceMenu)
                ?.sections.find((section) => section.name === item.section)?.description ?? '',
              $language,
            ),
          items: [],
        });
      }
      groups.get(key)?.items.push(item);
    });

    return [...groups.values()];
  }

  function priceLabel(item: MenuItem) {
    if (item.price) return item.price;
    if (item.variants.length === 1) return item.variants[0].price;
    if (item.variants.length > 1) return t('menuExplorer.from', $language, { price: item.variants[0].price });
    return '';
  }

  function imageFor(image: string, width = 720, height = 840) {
    const match = image.match(/\/media\/([^/?#]+)/);
    if (!match) return image;
    const uri = match[1];
    return `https://static.wixstatic.com/media/${uri}/v1/fill/w_${width},h_${height},al_c,q_82,enc_avif,quality_auto/${uri}`;
  }

  function selectMenu(menuId: string) {
    selectedMenu = menuId;
    selectedSection = '';
    glutenFreeOnly = false;
    query = '';
    requestAnimationFrame(() => document.getElementById('menu-results')?.scrollIntoView({ block: 'start' }));
  }

  function selectSection(menuId: string, sectionName: string) {
    selectedMenu = menuId;
    selectedSection = sectionName;
    glutenFreeOnly = false;
    query = '';
    requestAnimationFrame(() => document.getElementById('menu-results')?.scrollIntoView({ block: 'start' }));
  }

  function iconFor(menuId: string) {
    if (menuId.includes('cocteles') || menuId.includes('bebida')) return Martini;
    if (menuId.includes('tardeo')) return Flame;
    return Utensils;
  }

  function labelClass(label: string) {
    if (label === 'Sin gluten') return 'gluten-free';
    if (label === 'Picante') return 'spicy';
    return '';
  }
</script>

<div class="menu-layout grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
  <aside class="menu-nav lg:sticky lg:top-5 lg:self-start">
    <div class="menu-nav-stack">
      <div class="glass-panel menu-nav-panel p-3 lg:p-4">
        <div class="menu-tabs">
          {#each primaryMenus as menu}
            {@const Icon = iconFor(menu.id)}
            <div class="menu-tab-group">
              <a
                href="#menu-results"
                class:selected={selectedMenu === menu.id && !selectedSection}
                class="menu-tab"
                aria-current={selectedMenu === menu.id && !selectedSection ? 'true' : undefined}
                on:click|preventDefault={() => selectMenu(menu.id)}
              >
                <Icon size={17} aria-hidden="true" />
                {translateMenuName(menu.name, $language)}
              </a>

              <div class="menu-subtabs">
                {#each menu.sections as section}
                  <a
                    href="#menu-results"
                    class:selected={selectedMenu === menu.id && selectedSection === section.name}
                    class="menu-subtab"
                    aria-current={selectedMenu === menu.id && selectedSection === section.name ? 'true' : undefined}
                    on:click|preventDefault={() => selectSection(menu.id, section.name)}
                  >
                    {translateSectionName(section.name, $language)}
                  </a>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="glass-panel menu-nav-panel p-3 lg:p-4">
        <div class="menu-tabs">
          {#each secondaryMenus as menu}
          {@const Icon = iconFor(menu.id)}
          <a
            href="#menu-results"
            class:selected={selectedMenu === menu.id && !selectedSection}
            class="menu-tab"
            aria-current={selectedMenu === menu.id && !selectedSection ? 'true' : undefined}
            on:click|preventDefault={() => selectMenu(menu.id)}
          >
            <Icon size={17} aria-hidden="true" />
            {translateMenuName(menu.name, $language)}
          </a>
          {/each}
        </div>
      </div>
    </div>
  </aside>

  <div id="menu-results" class="min-w-0 scroll-mt-24">
    <div class="glass-panel p-4 md:p-5">
      <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <label class="relative block">
          <span class="sr-only">{t('menuExplorer.searchLabel', $language)}</span>
          <Search
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--tc-lime)]"
            size={18}
            aria-hidden="true"
          />
          <input
            bind:value={query}
            class="h-12 w-full border border-[rgba(255,249,223,.2)] bg-[#041607]/80 pl-11 pr-11 text-sm text-[var(--tc-cream)] placeholder:text-[rgba(255,249,223,.55)]"
            type="search"
            placeholder={t('menuExplorer.searchPlaceholder', $language)}
          />
          {#if query}
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--tc-cream)]"
              aria-label={t('menuExplorer.clear', $language)}
              on:click={() => (query = '')}
            >
              <X size={16} aria-hidden="true" />
            </button>
          {/if}
        </label>

        <label class="gluten-toggle">
          <input type="checkbox" bind:checked={glutenFreeOnly} />
          <span aria-hidden="true">
            <WheatOff size={15} />
          </span>
          {t('filter.glutenFree', $language)}
        </label>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[rgba(255,249,223,.72)]">
        {#if selectedMenuData?.description}
          <p>{selectedMenuData.description}</p>
        {/if}
        <p class="text-[var(--tc-pink)]">{t('menuExplorer.allergenWarning', $language)}</p>
      </div>
    </div>

    <div class="mt-6 grid gap-5">
      {#if visibleItems.length === 0}
        <div class="border border-[rgba(255,249,223,.18)] bg-[#041607]/70 p-8 text-center">
          <p class="text-xl font-black text-[var(--tc-pink)]">{t('menuExplorer.noResults', $language)}</p>
          <p class="mt-2 text-sm text-[rgba(255,249,223,.72)]">{t('menuExplorer.noResultsText', $language)}</p>
        </div>
      {/if}

      {#each groupedItems as group, index (group.key)}
        <details class="menu-section" open={index === 0 || Boolean(selectedSection) || Boolean(query)}>
          <summary>
            <span>
              <strong>{group.title}</strong>
              {#if group.subtitle}
                <small>{group.subtitle}</small>
              {/if}
            </span>
          </summary>

          <div class="grid gap-4 pt-4 md:grid-cols-2 xl:grid-cols-3">
            {#each group.items as item}
              <article class="menu-card">
                {#if item.image}
                  <img
                    src={imageFor(item.image)}
                    alt={item.imageAlt || item.name}
                    loading="lazy"
                    decoding="async"
                  />
                {/if}

                <div class="flex grow flex-col p-4">
                  <div class="flex items-start justify-between gap-3">
                    <h3>{translateItemName(item, $language)}</h3>
                    {#if priceLabel(item)}
                      <p class="price">{priceLabel(item)}</p>
                    {/if}
                  </div>

                  {#if item.description}
                    <p class="mt-3 text-sm text-[rgba(255,249,223,.76)]">{translateItemDescription(item, $language)}</p>
                  {/if}

                  {#if item.variants.length > 1}
                    <div class="mt-4 grid gap-1 text-xs text-[rgba(255,249,223,.72)]">
                      {#each item.variants as variant}
                        <div class="flex justify-between gap-3 border-t border-[rgba(255,249,223,.1)] pt-1">
                          <span>{translateVariantName(variant.name, $language)}</span>
                          <strong>{variant.price}</strong>
                        </div>
                      {/each}
                    </div>
                  {/if}

                  {#if item.labels.length}
                    <div class="mt-auto flex flex-wrap gap-1.5 pt-4">
                      {#each item.labels.slice(0, 5) as label}
                        <span class={`label-chip ${labelClass(label)}`}>{translateLabel(label, $language)}</span>
                      {/each}
                    </div>
                  {/if}
                </div>
              </article>
            {/each}
          </div>
        </details>
      {/each}
    </div>
  </div>
</div>

<style>
  .menu-nav-stack {
    display: grid;
    gap: 0.8rem;
  }

  .menu-tab-group {
    display: grid;
    gap: 0.35rem;
  }

  .menu-tab {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 0.7rem;
    min-height: 44px;
    border: 1px solid rgba(255, 249, 223, 0.13);
    background: rgba(255, 249, 223, 0.04);
    color: var(--tc-cream);
    padding: 0.72rem 0.8rem;
    text-align: left;
    text-decoration: none;
    transition:
      border-color 160ms ease,
      background 160ms ease,
      transform 160ms ease;
  }

  .menu-subtabs {
    display: grid;
    gap: 0.3rem;
    padding-left: 1.65rem;
  }

  .menu-subtab {
    display: inline-flex;
    min-height: 34px;
    align-items: center;
    border-left: 1px solid rgba(255, 249, 223, 0.14);
    color: rgba(255, 249, 223, 0.72);
    font-size: 0.82rem;
    font-weight: 740;
    padding: 0.42rem 0.7rem;
    text-decoration: none;
    transition:
      border-color 160ms ease,
      background 160ms ease,
      color 160ms ease,
      transform 160ms ease;
  }

  .menu-layout,
  .menu-nav,
  .menu-nav-panel,
  .menu-tabs {
    min-width: 0;
  }

  .menu-tab:hover,
  .menu-tab.selected {
    border-color: rgba(202, 255, 105, 0.45);
    background: rgba(202, 255, 105, 0.1);
    transform: translateX(2px);
  }

  .menu-subtab:hover,
  .menu-subtab.selected {
    border-color: rgba(239, 143, 186, 0.58);
    background: rgba(239, 143, 186, 0.1);
    color: var(--tc-cream);
    transform: translateX(2px);
  }

  .gluten-toggle {
    display: inline-flex;
    min-height: 40px;
    align-items: center;
    gap: 0.45rem;
    border: 1px solid rgba(255, 249, 223, 0.17);
    background: rgba(255, 249, 223, 0.055);
    color: var(--tc-cream);
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 820;
    padding: 0.56rem 0.75rem;
  }

  .gluten-toggle:has(input:checked) {
    border-color: rgba(255, 178, 73, 0.74);
    background: rgba(255, 178, 73, 0.17);
    color: #ffe6b9;
  }

  .gluten-toggle input {
    width: 1rem;
    height: 1rem;
    accent-color: #ffb249;
  }

  .gluten-toggle span {
    display: inline-flex;
    color: #ffb249;
  }

  .menu-section {
    border: 1px solid rgba(255, 249, 223, 0.16);
    background: rgba(4, 22, 7, 0.58);
  }

  .menu-section summary {
    display: flex;
    min-height: 76px;
    cursor: pointer;
    list-style: none;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
  }

  .menu-section summary::-webkit-details-marker {
    display: none;
  }

  .menu-section strong {
    color: var(--tc-pink);
    font-size: clamp(1.2rem, 2vw, 1.7rem);
    font-weight: 950;
  }

  .menu-section small {
    display: block;
    max-width: 56rem;
    margin-top: 0.3rem;
    color: rgba(255, 249, 223, 0.68);
    font-size: 0.84rem;
  }

  .menu-section > div {
    padding: 0 1rem 1rem;
  }

  .menu-card {
    display: flex;
    min-height: 100%;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(255, 249, 223, 0.14);
    background:
      linear-gradient(180deg, rgba(255, 249, 223, 0.055), rgba(255, 249, 223, 0.02)),
      #061e0c;
  }

  .menu-card img {
    aspect-ratio: 4 / 3;
    width: 100%;
    object-fit: cover;
  }

  .menu-card h3 {
    color: var(--tc-cream);
    font-size: 1rem;
    font-weight: 920;
    line-height: 1.08;
  }

  .menu-card p strong {
    color: var(--tc-cream);
    font-weight: 920;
  }

  .menu-card .price {
    flex: 0 0 auto;
    color: var(--tc-lime);
    font-weight: 920;
    white-space: nowrap;
  }

  .label-chip.gluten-free {
    border-color: rgba(255, 178, 73, 0.48);
    background: rgba(255, 178, 73, 0.16);
    color: #ffe6b9;
  }

  .label-chip.spicy {
    border-color: rgba(255, 83, 83, 0.5);
    background: rgba(255, 83, 83, 0.16);
    color: #ffc8c8;
  }

  @media (max-width: 640px) {
    .menu-section summary {
      align-items: flex-start;
      padding: 0.9rem;
    }

    .menu-section > div {
      padding-inline: 0.75rem;
    }
  }

  @media (max-width: 1023px) {
    .menu-nav {
      position: sticky;
      top: 4rem;
      z-index: 30;
      margin-inline: -16px;
      padding: 0.5rem 16px;
      background: rgba(4, 22, 7, 0.9);
      backdrop-filter: blur(18px);
    }

    .menu-nav-panel {
      border-color: rgba(255, 249, 223, 0.12);
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
    }

    .menu-nav-title {
      font-size: 0.72rem;
    }

    .menu-tabs {
      display: flex;
      max-width: 100%;
      gap: 0.5rem;
      overflow-x: auto;
      overscroll-behavior-x: contain;
      padding-bottom: 0.2rem;
      scrollbar-width: none;
      scroll-snap-type: x proximity;
    }

    .menu-tabs::-webkit-scrollbar {
      display: none;
    }

    .menu-tab {
      min-height: 40px;
      scroll-snap-align: start;
      white-space: nowrap;
    }

    .menu-tab-group {
      display: contents;
    }

    .menu-subtabs {
      display: flex;
      flex: 0 0 auto;
      gap: 0.45rem;
      padding-left: 0;
    }

    .menu-subtab {
      min-height: 40px;
      border: 1px solid rgba(255, 249, 223, 0.13);
      background: rgba(255, 249, 223, 0.035);
      scroll-snap-align: start;
      white-space: nowrap;
    }
  }

  @media (min-width: 1024px) {
    .menu-tabs {
      display: grid;
      gap: 0.5rem;
    }

    .menu-tab {
      display: grid;
      grid-template-columns: auto 1fr;
    }
  }
</style>
