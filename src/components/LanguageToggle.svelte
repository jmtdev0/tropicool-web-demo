<script lang="ts">
  import { Globe2 } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import { language, languages, initLanguage, setLanguage, t, type Lang } from '../i18n';

  let current: Lang = 'es';

  const unsubscribe = language.subscribe((value) => {
    current = value;
  });

  onMount(() => {
    initLanguage();
    return unsubscribe;
  });

  function toggle() {
    setLanguage(current === 'es' ? 'en' : 'es');
  }

  function toggleLabel() {
    return current === 'es'
      ? 'Idioma ES / EN: español seleccionado. Cambiar a inglés.'
      : 'Language ES / EN: English selected. Switch to Spanish.';
  }
</script>

<button
  type="button"
  class="language-toggle"
  aria-label={toggleLabel()}
  on:click={toggle}
>
  <Globe2 size={15} aria-hidden="true" />
  <span class="sr-only">{t('lang.label', current)} </span>
  {#each languages as option, index}
    <span class:active={current === option.code}>{option.short}</span>
    {#if index === 0}
      <span aria-hidden="true" class="separator">/</span>
    {/if}
  {/each}
</button>

<style>
  .language-toggle {
    display: inline-flex;
    min-height: 40px;
    align-items: center;
    gap: 0.42rem;
    border: 1px solid rgba(255, 249, 223, 0.16);
    background: rgba(255, 249, 223, 0.06);
    color: var(--tc-cream);
    padding: 0.35rem 0.55rem;
    font-size: 0.75rem;
    font-weight: 900;
  }

  .language-toggle span:not(.sr-only) {
    opacity: 0.48;
  }

  .language-toggle .separator {
    opacity: 0.35;
  }

  .language-toggle span.active {
    color: var(--tc-lime);
    opacity: 1;
  }
</style>
