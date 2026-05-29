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

  const filters = [
    { id: 'todos', key: 'filter.all', label: 'Todo' },
    { id: 'Vegano', key: 'filter.vegan', label: 'Vegano' },
    { id: 'Sin gluten', key: 'filter.glutenFree', label: 'Sin gluten' },
    { id: 'Picante', key: 'filter.spicy', label: 'Picante' },
  ];

  let selectedMenu = 'todo';
  let activeFilter = 'todos';
  let query = '';

  const allItems = menus.flatMap((menu) =>
    menu.sections.flatMap((section) =>
      section.items.map((item) => ({
        ...item,
        category: menu.name,
        section: section.name,
      })),
    ),
  );

  $: selectedMenuData = menus.find((menu) => menu.id === selectedMenu);
  $: scopedItems =
    selectedMenu === 'todo'
      ? allItems
      : allItems.filter((item) => item.sourceMenu === selectedMenu);
  $: normalizedQuery = query.trim().toLowerCase();
  $: visibleItems = scopedItems.filter((item) => {
    const matchesQuery =
      !normalizedQuery ||
      `${item.name} ${translateItemName(item, $language)} ${item.description} ${translateItemDescription(item, $language)} ${item.category} ${translateMenuName(item.category, $language)} ${item.section} ${translateSectionName(item.section, $language)} ${item.labels.join(' ')} ${item.labels.map((label) => translateLabel(label, $language)).join(' ')}`
        .toLowerCase()
        .includes(normalizedQuery);
    const matchesFilter = activeFilter === 'todos' || item.labels.includes(activeFilter);
    return matchesQuery && matchesFilter;
  });
  $: groupedItems = groupBySection(visibleItems);

  function groupBySection(items: MenuItem[]) {
    const groups = new Map<string, { key: string; title: string; subtitle: string; items: MenuItem[] }>();

    items.forEach((item) => {
      const key = selectedMenu === 'todo' ? `${item.category}-${item.section}` : item.section;
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          title:
            selectedMenu === 'todo'
              ? `${translateMenuName(item.category, $language)} / ${translateSectionName(item.section, $language)}`
              : translateSectionName(item.section, $language),
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
    activeFilter = 'todos';
    query = '';
    requestAnimationFrame(() => document.getElementById('menu-results')?.scrollIntoView({ block: 'start' }));
  }

  function iconFor(menuId: string) {
    if (menuId.includes('cocteles') || menuId.includes('bebida')) return Martini;
    if (menuId.includes('tardeo')) return Flame;
    return Utensils;
  }
</script>

<div class="grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
  <aside class="lg:sticky lg:top-5 lg:self-start">
    <div class="glass-panel p-4">
      <div class="flex items-center gap-2 text-sm font-bold text-[var(--tc-lime)]">
        <Leaf size={18} aria-hidden="true" />
        {t('menuExplorer.title', $language)}
      </div>

      <div class="mt-4 grid gap-2">
        <a
          href="#menu-results"
          class:selected={selectedMenu === 'todo'}
          class="menu-tab"
          aria-current={selectedMenu === 'todo' ? 'true' : undefined}
          on:click|preventDefault={() => selectMenu('todo')}
        >
          <Utensils size={17} aria-hidden="true" />
          {t('menuExplorer.all', $language)}
          <span>{allItems.length}</span>
        </a>

        {#each menus as menu}
          {@const Icon = iconFor(menu.id)}
          <a
            href="#menu-results"
            class:selected={selectedMenu === menu.id}
            class="menu-tab"
            aria-current={selectedMenu === menu.id ? 'true' : undefined}
            on:click|preventDefault={() => selectMenu(menu.id)}
          >
            <Icon size={17} aria-hidden="true" />
            {translateMenuName(menu.name, $language)}
            <span>{menu.sections.reduce((total, section) => total + section.items.length, 0)}</span>
          </a>
        {/each}
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

        <div class="flex flex-wrap gap-2">
          {#each filters as filter}
            <button
              type="button"
              class:active-filter={activeFilter === filter.id}
              class="filter-chip"
              on:click={() => (activeFilter = filter.id)}
            >
              {#if filter.id === 'Sin gluten'}
                <WheatOff size={14} aria-hidden="true" />
              {:else if filter.id === 'Picante'}
                <Flame size={14} aria-hidden="true" />
              {:else if filter.id === 'Vegano'}
                <Leaf size={14} aria-hidden="true" />
              {/if}
              {t(filter.key, $language)}
            </button>
          {/each}
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[rgba(255,249,223,.72)]">
        <p>
          {t('menuExplorer.count', $language, { visible: visibleItems.length, total: scopedItems.length })}
          {#if selectedMenuData?.description}
            <span class="hidden md:inline"> · {selectedMenuData.description}</span>
          {/if}
        </p>
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
        <details class="menu-section" open={index === 0 || selectedMenu === 'todo' || Boolean(query)}>
          <summary>
            <span>
              <strong>{group.title}</strong>
              {#if group.subtitle}
                <small>{group.subtitle}</small>
              {/if}
            </span>
            <em>{group.items.length}</em>
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
                        <span class="label-chip">{translateLabel(label, $language)}</span>
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
  .menu-tab {
    display: grid;
    grid-template-columns: auto 1fr auto;
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

  .menu-tab:hover,
  .menu-tab.selected {
    border-color: rgba(202, 255, 105, 0.45);
    background: rgba(202, 255, 105, 0.1);
    transform: translateX(2px);
  }

  .menu-tab span {
    color: var(--tc-pink);
    font-size: 0.78rem;
    font-weight: 800;
  }

  .filter-chip {
    display: inline-flex;
    min-height: 40px;
    align-items: center;
    gap: 0.35rem;
    border: 1px solid rgba(255, 249, 223, 0.17);
    background: rgba(255, 249, 223, 0.055);
    color: var(--tc-cream);
    font-size: 0.82rem;
    font-weight: 820;
    padding: 0.56rem 0.75rem;
  }

  .filter-chip.active-filter {
    border-color: rgba(239, 143, 186, 0.74);
    background: rgba(239, 143, 186, 0.2);
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
    justify-content: space-between;
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
    text-transform: uppercase;
  }

  .menu-section small {
    display: block;
    max-width: 56rem;
    margin-top: 0.3rem;
    color: rgba(255, 249, 223, 0.68);
    font-size: 0.84rem;
  }

  .menu-section em {
    display: inline-grid;
    min-width: 2.4rem;
    min-height: 2.4rem;
    place-items: center;
    border: 1px solid rgba(202, 255, 105, 0.34);
    color: var(--tc-lime);
    font-style: normal;
    font-weight: 900;
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
    text-transform: uppercase;
  }

  .menu-card .price {
    flex: 0 0 auto;
    color: var(--tc-lime);
    font-weight: 920;
    white-space: nowrap;
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
</style>
