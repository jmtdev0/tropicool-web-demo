<script lang="ts">
  import { onMount } from 'svelte';
  import { menuData } from '../data/menu';
  import {
    initLanguage,
    language,
    t,
    translateItemDescription,
    translateItemName,
    type Lang,
  } from '../i18n';

  const itemsById = new Map(menuData.items.map((item) => [item.id, item]));

  function applyLanguage(lang: Lang) {
    document.documentElement.lang = lang;
    document.title = t('meta.title', lang);

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('meta.description', lang));
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', t('meta.title', lang));
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', t('meta.description', lang));

    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((node) => {
      node.textContent = t(node.dataset.i18n ?? '', lang);
    });

    document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]').forEach((node) => {
      node.setAttribute('aria-label', t(node.dataset.i18nAriaLabel ?? '', lang));
    });

    document.querySelectorAll<HTMLElement>('[data-menu-item-name]').forEach((node) => {
      const item = itemsById.get(node.dataset.menuItemName ?? '');
      if (item) node.textContent = translateItemName(item, lang);
    });

    document.querySelectorAll<HTMLElement>('[data-menu-item-description]').forEach((node) => {
      const item = itemsById.get(node.dataset.menuItemDescription ?? '');
      if (item) node.textContent = translateItemDescription(item, lang);
    });
  }

  onMount(() => {
    applyLanguage(initLanguage());
    const unsubscribe = language.subscribe(applyLanguage);
    return unsubscribe;
  });
</script>
