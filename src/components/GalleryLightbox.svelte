<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { ChevronLeft, ChevronRight, Image as ImageIcon, Play, X } from '@lucide/svelte';
  import { language, t } from '../i18n';

  type GalleryItem = {
    type: 'image' | 'video';
    src: string;
    mobileSrc?: string;
    poster?: string;
    alt: string;
    title: string;
  };

  export let items: GalleryItem[] = [];

  let activeIndex: number | null = null;
  let dialog: HTMLDivElement;
  let lastFocus: HTMLElement | null = null;
  let mobileMedia = false;

  $: activeItem = activeIndex === null ? null : items[activeIndex];

  onMount(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => {
      mobileMedia = media.matches;
    };
    update();
    media.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
      document.body.classList.remove('lightbox-open');
    };
  });

  async function open(index: number) {
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeIndex = index;
    document.body.classList.add('lightbox-open');
    await tick();
    dialog?.focus();
  }

  function close() {
    activeIndex = null;
    document.body.classList.remove('lightbox-open');
    lastFocus?.focus();
  }

  function previous() {
    if (activeIndex === null || items.length === 0) return;
    activeIndex = (activeIndex - 1 + items.length) % items.length;
  }

  function next() {
    if (activeIndex === null || items.length === 0) return;
    activeIndex = (activeIndex + 1) % items.length;
  }

  function sourceFor(item: GalleryItem) {
    return mobileMedia && item.mobileSrc ? item.mobileSrc : item.src;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (activeIndex === null) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') previous();
    if (event.key === 'ArrowRight') next();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="gallery-grid">
  {#each items as item, index}
    <button
      type="button"
      class="gallery-tile"
      class:tall={index % 5 === 0}
      class:wide={index % 7 === 3}
      aria-label={`${t('gallery.open', $language)} ${item.title}`}
      on:click={() => open(index)}
    >
      <img
        src={item.poster ?? item.src}
        alt={item.alt}
        loading="lazy"
        decoding="async"
      />
      <span class="gallery-tile__meta">
        {#if item.type === 'video'}
          <Play size={16} aria-hidden="true" />
          {t('gallery.video', $language)}
        {:else}
          <ImageIcon size={16} aria-hidden="true" />
          {t('gallery.photo', $language)}
        {/if}
      </span>
    </button>
  {/each}
</div>

{#if activeItem}
  <div
    bind:this={dialog}
    class="gallery-lightbox"
    role="dialog"
    aria-modal="true"
    aria-label={activeItem.title}
    tabindex="-1"
    on:click|self={close}
  >
    <div class="gallery-lightbox__bar">
      <p>{activeItem.title}</p>
      <button type="button" aria-label={t('gallery.close', $language)} on:click={close}>
        <X size={22} aria-hidden="true" />
      </button>
    </div>

    <button class="gallery-lightbox__nav prev" type="button" aria-label={t('gallery.previous', $language)} on:click={previous}>
      <ChevronLeft size={30} aria-hidden="true" />
    </button>
    <button class="gallery-lightbox__nav next" type="button" aria-label={t('gallery.next', $language)} on:click={next}>
      <ChevronRight size={30} aria-hidden="true" />
    </button>

    <div class="gallery-lightbox__media">
      {#if activeItem.type === 'video'}
        <video
          src={sourceFor(activeItem)}
          poster={activeItem.poster}
          muted
          controls
          playsinline
          preload="metadata"
        ></video>
      {:else}
        <img src={activeItem.src} alt={activeItem.alt} />
      {/if}
    </div>
  </div>
{/if}

<style>
  :global(body.lightbox-open) {
    overflow: hidden;
  }

  .gallery-grid {
    display: grid;
    grid-auto-flow: dense;
    grid-auto-rows: clamp(11rem, 24vw, 19rem);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(0.65rem, 1.2vw, 1rem);
  }

  .gallery-tile {
    position: relative;
    min-height: 100%;
    overflow: hidden;
    border: 1px solid rgba(255, 249, 223, 0.16);
    background: #061e0c;
    color: var(--tc-cream);
    cursor: pointer;
    padding: 0;
    text-align: left;
  }

  .gallery-tile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      transform 220ms ease,
      filter 220ms ease;
  }

  .gallery-tile:hover img {
    transform: scale(1.035);
    filter: saturate(1.12) contrast(1.05);
  }

  .gallery-tile__meta {
    position: absolute;
    left: 0.75rem;
    bottom: 0.75rem;
    display: inline-flex;
    align-items: center;
    gap: 0.38rem;
    border: 1px solid rgba(255, 249, 223, 0.2);
    background: rgba(4, 22, 7, 0.82);
    color: var(--tc-cream);
    font-size: 0.74rem;
    font-weight: 850;
    padding: 0.42rem 0.55rem;
    backdrop-filter: blur(10px);
  }

  .gallery-lightbox {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: grid;
    place-items: center;
    background: rgba(2, 11, 4, 0.94);
    padding: clamp(3.75rem, 7vw, 5rem) clamp(1rem, 7vw, 5rem);
  }

  .gallery-lightbox__bar {
    position: absolute;
    inset: 1rem 1rem auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .gallery-lightbox__bar p {
    margin: 0;
    color: var(--tc-cream);
    font-size: 0.86rem;
    font-weight: 850;
  }

  .gallery-lightbox__bar button,
  .gallery-lightbox__nav {
    display: inline-grid;
    width: 2.75rem;
    height: 2.75rem;
    place-items: center;
    border: 1px solid rgba(255, 249, 223, 0.2);
    background: rgba(255, 249, 223, 0.07);
    color: var(--tc-cream);
    cursor: pointer;
  }

  .gallery-lightbox__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .gallery-lightbox__nav.prev {
    left: 1rem;
  }

  .gallery-lightbox__nav.next {
    right: 1rem;
  }

  .gallery-lightbox__media {
    display: grid;
    width: min(100%, 72rem);
    height: min(78svh, 48rem);
    place-items: center;
  }

  .gallery-lightbox__media img,
  .gallery-lightbox__media video {
    width: 100%;
    height: 100%;
    max-height: 78svh;
    object-fit: contain;
  }

  @media (min-width: 768px) {
    .gallery-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .gallery-tile.tall {
      grid-row: span 2;
    }

    .gallery-tile.wide {
      grid-column: span 2;
    }
  }

  @media (max-width: 640px) {
    .gallery-lightbox {
      padding-inline: 0.75rem;
    }

    .gallery-lightbox__nav {
      top: auto;
      bottom: 1rem;
      transform: none;
    }

    .gallery-lightbox__media {
      height: 72svh;
    }
  }
</style>
