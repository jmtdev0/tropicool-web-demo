<script lang="ts">
  import { Check, ChevronDown, Globe2 } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import { language, languages, initLanguage, setLanguage, t, type Lang } from '../i18n';

  let current: Lang = 'es';
  let open = false;
  let root: HTMLDivElement;

  const unsubscribe = language.subscribe((value) => {
    current = value;
  });

  onMount(() => {
    initLanguage();
    const handlePointerDown = (event: PointerEvent) => {
      if (root && !root.contains(event.target as Node)) open = false;
    };
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      unsubscribe();
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  });

  function labelFor(lang: Lang) {
    return lang === 'en' ? 'English (UK)' : 'Español';
  }

  function toggleLabel() {
    return current === 'es'
      ? 'Idioma seleccionado: español. Abrir selector de idioma.'
      : 'Selected language: English. Open language selector.';
  }

  function choose(lang: Lang) {
    setLanguage(lang);
    open = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') open = false;
  }
</script>

<div bind:this={root} class="language-select" on:keydown={handleKeydown}>
  <button
    type="button"
    class="language-select__trigger"
    aria-label={toggleLabel()}
    aria-haspopup="listbox"
    aria-expanded={open}
    on:click={() => (open = !open)}
  >
    <Globe2 size={15} aria-hidden="true" />
    <span>{labelFor(current)}</span>
    <ChevronDown size={17} aria-hidden="true" class={open ? 'open' : ''} />
  </button>

  {#if open}
    <div class="language-select__menu" role="listbox" aria-label={t('lang.label', current)}>
      {#each languages as option}
        <button
          type="button"
          class:selected={current === option.code}
          role="option"
          aria-selected={current === option.code}
          on:click={() => choose(option.code)}
        >
          <span>{labelFor(option.code)}</span>
          {#if current === option.code}
            <Check size={16} aria-hidden="true" />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .language-select {
    position: relative;
    z-index: 60;
  }

  .language-select__trigger {
    appearance: none;
    display: inline-flex;
    min-height: 40px;
    align-items: center;
    gap: 0.55rem;
    border: 1px solid rgba(255, 249, 223, 0.18);
    background: rgba(255, 249, 223, 0.07);
    color: var(--tc-cream);
    cursor: pointer;
    padding: 0.35rem 0.72rem;
    font-size: 0.82rem;
    font-weight: 850;
    white-space: nowrap;
    backdrop-filter: blur(14px);
    transition:
      border-color 160ms ease,
      background 160ms ease,
      color 160ms ease;
  }

  .language-select__trigger:hover,
  .language-select__trigger[aria-expanded="true"] {
    border-color: rgba(202, 255, 105, 0.5);
    background: rgba(202, 255, 105, 0.1);
  }

  .language-select__trigger :global(svg.open) {
    transform: rotate(180deg);
  }

  .language-select__menu {
    position: absolute;
    top: calc(100% + 0.55rem);
    right: 0;
    display: grid;
    width: max(100%, 13rem);
    gap: 0.45rem;
    border: 1px solid rgba(255, 249, 223, 0.18);
    background:
      linear-gradient(180deg, rgba(255, 249, 223, 0.08), rgba(255, 249, 223, 0.035)),
      rgba(4, 22, 7, 0.96);
    box-shadow: 0 22px 46px rgba(0, 0, 0, 0.36);
    padding: 0.55rem;
    backdrop-filter: blur(18px);
  }

  .language-select__menu button {
    appearance: none;
    display: flex;
    min-height: 42px;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border: 1px solid transparent;
    background: transparent;
    color: var(--tc-cream);
    cursor: pointer;
    padding: 0.62rem 0.72rem;
    text-align: left;
    font-size: 0.9rem;
    font-weight: 780;
  }

  .language-select__menu button:hover,
  .language-select__menu button.selected {
    border-color: rgba(239, 143, 186, 0.45);
    background: rgba(239, 143, 186, 0.16);
    color: var(--tc-cream);
  }

  .language-select__menu button.selected :global(svg) {
    color: var(--tc-lime);
  }

  @media (max-width: 520px) {
    .language-select__trigger {
      max-width: 8.8rem;
      padding-inline: 0.58rem;
      font-size: 0.78rem;
    }

    .language-select__menu {
      width: min(13rem, calc(100vw - 2rem));
    }
  }
</style>
