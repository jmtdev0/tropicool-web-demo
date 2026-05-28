<script lang="ts">
  import { onMount } from 'svelte';

  onMount(async () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('[data-hero-word]', {
      autoAlpha: 0,
      y: 28,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.08,
      delay: 0.08,
    });

    gsap.from('[data-hero-media]', {
      autoAlpha: 0,
      scale: 1.05,
      duration: 1.1,
      ease: 'power2.out',
      delay: 0.12,
    });

    gsap.utils.toArray<HTMLElement>('[data-animate]').forEach((element) => {
      gsap.from(element, {
        y: 30,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 86%',
          once: true,
        },
      });
    });
  });
</script>
