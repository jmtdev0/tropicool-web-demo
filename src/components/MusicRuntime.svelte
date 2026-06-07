<script lang="ts">
  import { Music2, Pause, Play, SkipForward, Volume2, VolumeX } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import { tropicalHouseTracks, type MusicTrack } from '../data/music';

  const targetVolume = 0.35;
  const firstFadeMs = 3600;
  const nextFadeMs = 650;

  type AudioContextConstructor = typeof AudioContext;
  type WindowWithAudio = Window &
    typeof globalThis & {
      webkitAudioContext?: AudioContextConstructor;
      __tropicoolMusicDebug?: {
        getState: () => MusicDebugState;
        seekNearEnd: () => void;
      };
    };

  type MusicDebugState = {
    audioContextState: AudioContextState | 'missing';
    audioVolume: number;
    currentTime: number;
    duration: number;
    ended: boolean;
    fallbackActive: boolean;
    lastPlayError: string | null;
    muted: boolean;
    paused: boolean;
    playbackVolume: number;
    playing: boolean;
    readyState: number;
    realAnalyserEnergy: number;
    renderedFrameCount: number;
    neonAudio: number;
    neonPulse: number;
    currentSrc: string;
    src: string;
    track: string;
    transitionCount: number;
  };

  const tracks = tropicalHouseTracks;

  let root: HTMLDivElement;
  let audio: HTMLAudioElement | null = null;
  let audioContext: AudioContext | null = null;
  let sourceNode: MediaElementAudioSourceNode | null = null;
  let analyser: AnalyserNode | null = null;
  let outputGain: GainNode | null = null;
  let frequencyData: Uint8Array | null = null;
  let frameId = 0;
  let fadeFrameId = 0;
  let selectedIndex = 0;
  let currentTrack: MusicTrack = tracks[0];
  let playing = false;
  let primed = false;
  let expanded = false;
  let userPaused = false;
  let reduceMotion = false;
  let volume = targetVolume;
  let energyFloor = 0;
  let pulse = 0;
  let silentFrames = 0;
  let lastAudioTime = 0;
  let fallbackActive = false;
  let lastPlayError: string | null = null;
  let realAnalyserEnergy = 0;
  let renderedFrameCount = 0;
  let currentNeonAudio = 0;
  let currentNeonPulse = 0;
  let transitionCount = 0;
  let reactiveElements: HTMLElement[] = [];
  let stopInitialPointer: (() => void) | null = null;
  let stopInitialKey: (() => void) | null = null;

  $: volumePercent = `${Math.round(volume * 100)}%`;
  $: playLabel = playing ? `Pausar ${currentTrack.shortTitle}` : `Reproducir ${currentTrack.shortTitle}`;
  $: panelLabel = expanded ? 'Ocultar controlador de música' : 'Mostrar controlador de música';

  onMount(() => {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    selectedIndex = pickDifferentIndex(-1);
    currentTrack = tracks[selectedIndex];
    reactiveElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-audio-reactive-neon], .menu-doodle-layer'),
    );

    prepareAudioElement();
    installDebugHooks();
    installInitialInteractionHandlers();

    return () => {
      teardown();
    };
  });

  function prepareAudioElement() {
    if (!audio || !currentTrack) return;

    audio.preload = 'metadata';
    audio.defaultMuted = false;
    audio.muted = false;
    audio.volume = 0;
    if (audio.src !== new URL(currentTrack.src, window.location.href).href) {
      audio.src = currentTrack.src;
      audio.load();
    }
  }

  function installInitialInteractionHandlers() {
    const handlePointer = (event: PointerEvent) => {
      if (root?.contains(event.target as Node)) return;
      void startFromFirstInteraction();
    };

    const handleKey = (event: KeyboardEvent) => {
      if (root?.contains(event.target as Node)) return;
      if (['Alt', 'Control', 'Meta', 'Shift', 'Tab'].includes(event.key)) return;
      void startFromFirstInteraction();
    };

    document.addEventListener('pointerdown', handlePointer, { passive: true });
    document.addEventListener('keydown', handleKey);

    stopInitialPointer = () => document.removeEventListener('pointerdown', handlePointer);
    stopInitialKey = () => document.removeEventListener('keydown', handleKey);
  }

  function removeInitialInteractionHandlers() {
    stopInitialPointer?.();
    stopInitialKey?.();
    stopInitialPointer = null;
    stopInitialKey = null;
  }

  async function startFromFirstInteraction() {
    if (primed || playing || userPaused) return;
    primed = true;
    removeInitialInteractionHandlers();
    await startPlayback(firstFadeMs);
  }

  async function startPlayback(fadeMs = nextFadeMs) {
    if (!audio || !currentTrack) return;

    try {
      prepareAudioElement();
      await ensureAudioGraph();

      audio.defaultMuted = false;
      audio.muted = false;
      setPlaybackVolume(fadeMs === firstFadeMs ? 0 : Math.min(getPlaybackVolume(), volume));
      await audio.play();
      playing = true;
      userPaused = false;
      lastPlayError = null;
      startAnalysisLoop();
      fadeToVolume(fadeMs);
    } catch (error) {
      lastPlayError = error instanceof Error ? error.message : String(error);
      playing = false;
      primed = false;
      setPlaybackVolume(0);
    }
  }

  async function ensureAudioGraph() {
    if (!audio || analyser) {
      await audioContext?.resume();
      if (audio) {
        audio.defaultMuted = false;
        audio.muted = false;
        audio.volume = outputGain ? 1 : audio.volume;
      }
      return;
    }

    const AudioContextClass =
      window.AudioContext ?? (window as WindowWithAudio).webkitAudioContext;
    if (!AudioContextClass) return;

    audioContext = new AudioContextClass();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.72;
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    outputGain = audioContext.createGain();
    outputGain.gain.value = 0;

    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(analyser);
    analyser.connect(outputGain);
    outputGain.connect(audioContext.destination);
    audio.volume = 1;
    audio.defaultMuted = false;
    audio.muted = false;
    await audioContext.resume();
  }

  function fadeToVolume(durationMs: number) {
    if (!audio) return;

    cancelAnimationFrame(fadeFrameId);
    const startVolume = getPlaybackVolume();
    const startedAt = performance.now();

    const step = (now: number) => {
      if (!audio || !playing) return;
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setPlaybackVolume(clamp(startVolume + (volume - startVolume) * eased, 0, 1));
      if (progress < 1) {
        fadeFrameId = requestAnimationFrame(step);
      }
    };

    fadeFrameId = requestAnimationFrame(step);
  }

  function startAnalysisLoop() {
    if (frameId || reduceMotion) {
      if (reduceMotion) setNeonVars(0, 0);
      return;
    }
    frameId = requestAnimationFrame(renderAudioFrame);
  }

  function renderAudioFrame() {
    frameId = 0;
    renderedFrameCount += 1;

    if (!playing || !analyser || !frequencyData) {
      energyFloor *= 0.82;
      pulse *= 0.8;
      setNeonVars(energyFloor, pulse);
      if (energyFloor > 0.01 || pulse > 0.01) {
        startAnalysisLoop();
      } else {
        setNeonVars(0, 0);
      }
      return;
    }

    analyser.getByteFrequencyData(frequencyData);

    const lowBins = frequencyData.slice(2, 20);
    const wideBins = frequencyData.slice(2, 72);
    const lowEnergy = lowBins.reduce((sum, value) => sum + value, 0) / (lowBins.length * 255);
    const wideEnergy = wideBins.reduce((sum, value) => sum + value, 0) / (wideBins.length * 255);
    const normalizedEnergy = clamp((Math.max(lowEnergy, wideEnergy * 0.7) - 0.06) * 1.25, 0, 0.82);
    realAnalyserEnergy = normalizedEnergy;
    const audioTime = audio?.currentTime ?? 0;
    const timeAdvanced = audioTime > lastAudioTime;
    const beatPhase = (audioTime * 124 / 60) % 1;
    const rhythmicPulse = audioTime > 0 ? Math.exp(-beatPhase * 8) : 0;
    lastAudioTime = audioTime;

    if (normalizedEnergy < 0.01 && timeAdvanced) {
      silentFrames += 1;
    } else {
      silentFrames = 0;
    }

    if (silentFrames > 20 && audioTime > 0) {
      fallbackActive = true;
      const fallbackPulse = rhythmicPulse;
      const fallbackEnergy = 0.14 + fallbackPulse * 0.28;
      energyFloor = energyFloor * 0.86 + fallbackEnergy * 0.14;
      pulse = Math.max(pulse * 0.84, fallbackPulse * 0.58);
    } else {
      fallbackActive = false;
      const transient = Math.max(0, normalizedEnergy - energyFloor);
      energyFloor = energyFloor * 0.82 + normalizedEnergy * 0.18;
      pulse = Math.max(pulse * 0.84, clamp(transient * 3.4, 0, 1), rhythmicPulse * 0.32);
    }

    setNeonVars(clamp(energyFloor + pulse * 0.22, 0, 0.92), pulse);
    startAnalysisLoop();
  }

  function setNeonVars(audioLevel: number, pulseLevel: number) {
    const safeAudio = reduceMotion ? 0 : clamp(audioLevel, 0, 1);
    const safePulse = reduceMotion ? 0 : clamp(pulseLevel, 0, 1);
    const values = {
      '--neon-audio': safeAudio.toFixed(3),
      '--neon-pulse': safePulse.toFixed(3),
    };
    currentNeonAudio = safeAudio;
    currentNeonPulse = safePulse;

    document.documentElement.style.setProperty('--neon-audio', values['--neon-audio']);
    document.documentElement.style.setProperty('--neon-pulse', values['--neon-pulse']);

    reactiveElements.forEach((element) => {
      element.style.setProperty('--neon-audio', values['--neon-audio']);
      element.style.setProperty('--neon-pulse', values['--neon-pulse']);
    });
  }

  function pausePlayback() {
    userPaused = true;
    audio?.pause();
    playing = false;
    cancelAnimationFrame(fadeFrameId);
    startAnalysisLoop();
  }

  async function togglePlayback() {
    removeInitialInteractionHandlers();
    if (playing) {
      pausePlayback();
      return;
    }

    primed = true;
    userPaused = false;
    await startPlayback(firstFadeMs);
  }

  function togglePanel() {
    expanded = !expanded;
  }

  async function playNext() {
    removeInitialInteractionHandlers();
    const wasPlaying = playing;
    await switchTrack(pickDifferentIndex(selectedIndex), wasPlaying, nextFadeMs);
  }

  async function handleTrackEnded() {
    if (userPaused) return;
    await switchTrack(pickDifferentIndex(selectedIndex), true, nextFadeMs);
  }

  async function switchTrack(index: number, shouldPlay: boolean, fadeMs: number) {
    selectTrack(index);
    setPlaybackVolume(0);

    if (shouldPlay) {
      primed = true;
      await startPlayback(fadeMs);
    }
  }

  function selectTrack(index: number) {
    selectedIndex = index;
    currentTrack = tracks[selectedIndex] ?? tracks[0];
    if (!audio || !currentTrack) return;

    transitionCount += 1;
    cancelAnimationFrame(fadeFrameId);
    audio.pause();
    audio.src = currentTrack.src;
    audio.load();
    playing = false;
    silentFrames = 0;
    lastAudioTime = 0;
  }

  function pickDifferentIndex(previousIndex: number) {
    if (tracks.length <= 1) return 0;

    let nextIndex = previousIndex;
    while (nextIndex === previousIndex) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    }
    return nextIndex;
  }

  function handleVolumeInput(event: Event) {
    volume = Number((event.currentTarget as HTMLInputElement).value);
    if (audio && playing) {
      setPlaybackVolume(volume);
    }
  }

  function getPlaybackVolume() {
    return outputGain ? outputGain.gain.value : (audio?.volume ?? 0);
  }

  function setPlaybackVolume(value: number) {
    const safeValue = clamp(value, 0, 1);
    if (outputGain) {
      outputGain.gain.value = safeValue;
      if (audio) audio.volume = 1;
      return;
    }
    if (audio) audio.volume = safeValue;
  }

  function installDebugHooks() {
    (window as WindowWithAudio).__tropicoolMusicDebug = {
      getState,
      seekNearEnd: () => {
        if (!audio || !Number.isFinite(audio.duration)) return;
        audio.currentTime = Math.max(0, audio.duration - 0.35);
      },
    };
  }

  function getState(): MusicDebugState {
    return {
      audioContextState: audioContext?.state ?? 'missing',
      audioVolume: audio?.volume ?? 0,
      currentTime: audio?.currentTime ?? 0,
      duration: audio?.duration ?? Number.NaN,
      ended: audio?.ended ?? false,
      fallbackActive,
      lastPlayError,
      muted: audio?.muted ?? true,
      neonAudio: currentNeonAudio,
      neonPulse: currentNeonPulse,
      paused: audio?.paused ?? true,
      playbackVolume: getPlaybackVolume(),
      playing,
      readyState: audio?.readyState ?? 0,
      realAnalyserEnergy,
      renderedFrameCount,
      currentSrc: audio?.currentSrc || '',
      src: audio?.src || '',
      track: currentTrack.shortTitle,
      transitionCount,
    };
  }

  function teardown() {
    removeInitialInteractionHandlers();
    cancelAnimationFrame(frameId);
    cancelAnimationFrame(fadeFrameId);
    audio?.pause();
    sourceNode?.disconnect();
    analyser?.disconnect();
    outputGain?.disconnect();
    void audioContext?.close();
    delete (window as WindowWithAudio).__tropicoolMusicDebug;
    setNeonVars(0, 0);
  }

  function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }
</script>

<div
  bind:this={root}
  class:playing
  class:expanded
  class="music-runtime"
  data-music-runtime
>
  <audio bind:this={audio} preload="metadata" aria-hidden="true" on:ended={handleTrackEnded}></audio>

  <button
    type="button"
    class="music-runtime__toggle"
    aria-label={panelLabel}
    aria-expanded={expanded}
    on:click={togglePanel}
  >
    <Music2 size={18} aria-hidden="true" />
  </button>

  <div class="music-runtime__panel" aria-hidden={!expanded}>
    <div class="music-runtime__track">
      <Music2 size={18} aria-hidden="true" />
      <div class="music-runtime__copy">
        <span>{currentTrack.shortTitle}</span>
        <small>{currentTrack.artist}</small>
      </div>
    </div>

    <div class="music-runtime__controls">
      <button type="button" class="music-runtime__button music-runtime__button--primary" aria-label={playLabel} on:click={togglePlayback}>
        {#if playing}
          <Pause size={18} aria-hidden="true" />
        {:else}
          <Play size={18} aria-hidden="true" />
        {/if}
      </button>

      <button type="button" class="music-runtime__button" aria-label="Siguiente canción" on:click={playNext}>
        <SkipForward size={18} aria-hidden="true" />
      </button>

      <label class="music-runtime__volume">
        {#if volume === 0}
          <VolumeX size={17} aria-hidden="true" />
        {:else}
          <Volume2 size={17} aria-hidden="true" />
        {/if}
        <span class="sr-only">Volumen</span>
        <input
          type="range"
          min="0"
          max="0.6"
          step="0.01"
          value={volume}
          aria-label={`Volumen ${volumePercent}`}
          on:input={handleVolumeInput}
        />
      </label>
    </div>
  </div>
</div>

<style>
  .music-runtime {
    position: fixed;
    right: max(1rem, env(safe-area-inset-right));
    bottom: max(1rem, env(safe-area-inset-bottom));
    z-index: 60;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    gap: 0.65rem;
    color: var(--tc-cream);
    pointer-events: none;
  }

  .music-runtime__toggle,
  .music-runtime__panel {
    pointer-events: auto;
  }

  .music-runtime__toggle {
    appearance: none;
    display: inline-grid;
    width: 3.35rem;
    height: 3.35rem;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid rgba(255, 249, 223, 0.22);
    border-radius: 999px;
    background:
      linear-gradient(180deg, rgba(255, 249, 223, 0.11), rgba(255, 249, 223, 0.04)),
      rgba(4, 22, 7, 0.9);
    box-shadow:
      0 16px 42px rgba(0, 0, 0, 0.34),
      0 0 calc(14px + (var(--neon-audio) * 18px)) rgba(239, 143, 186, 0.16);
    color: var(--tc-lime);
    cursor: pointer;
    backdrop-filter: blur(18px);
    transition:
      border-color 180ms ease,
      box-shadow 180ms ease,
      color 180ms ease,
      transform 180ms ease;
  }

  .music-runtime__toggle:hover,
  .music-runtime__toggle[aria-expanded="true"] {
    border-color: rgba(202, 255, 105, 0.5);
    color: var(--tc-cream);
    transform: translateY(-1px);
  }

  .music-runtime.playing .music-runtime__toggle,
  .music-runtime.expanded .music-runtime__panel {
    border-color: rgba(202, 255, 105, 0.42);
    box-shadow:
      0 20px 54px rgba(0, 0, 0, 0.38),
      0 0 calc(18px + (var(--neon-audio) * 30px) + (var(--neon-pulse) * 18px)) rgba(202, 255, 105, 0.18),
      0 0 calc(24px + (var(--neon-audio) * 36px)) rgba(239, 143, 186, 0.14);
  }

  .music-runtime__panel {
    position: absolute;
    right: calc(100% + 0.65rem);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    width: min(25rem, calc(100vw - 6rem));
    align-items: center;
    gap: 0.75rem;
    border: 1px solid rgba(255, 249, 223, 0.18);
    border-radius: 999px;
    background:
      linear-gradient(180deg, rgba(255, 249, 223, 0.1), rgba(255, 249, 223, 0.04)),
      rgba(4, 22, 7, 0.9);
    box-shadow:
      0 18px 48px rgba(0, 0, 0, 0.32),
      0 0 calc(14px + (var(--neon-audio) * 18px)) rgba(239, 143, 186, 0.16);
    padding: 0.55rem 0.7rem;
    opacity: 0;
    transform: translateX(0.65rem) scale(0.98);
    transform-origin: right center;
    visibility: hidden;
    pointer-events: none;
    backdrop-filter: blur(18px);
    transition:
      border-color 180ms ease,
      box-shadow 180ms ease,
      opacity 180ms ease,
      transform 180ms ease,
      visibility 180ms ease;
  }

  .music-runtime.expanded .music-runtime__panel {
    position: static;
    opacity: 1;
    transform: translateX(0) scale(1);
    visibility: visible;
    pointer-events: auto;
  }

  .music-runtime__track {
    display: grid;
    min-width: 0;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0.62rem;
  }

  .music-runtime__track :global(svg) {
    color: var(--tc-lime);
    filter: drop-shadow(0 0 8px rgba(202, 255, 105, 0.36));
  }

  .music-runtime__copy {
    display: grid;
    min-width: 0;
    line-height: 1.05;
  }

  .music-runtime__copy span,
  .music-runtime__copy small {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .music-runtime__copy span {
    font-size: 0.88rem;
    font-weight: 900;
  }

  .music-runtime__copy small {
    margin-top: 0.18rem;
    color: rgba(255, 249, 223, 0.64);
    font-size: 0.72rem;
    font-weight: 760;
  }

  .music-runtime__controls {
    display: flex;
    align-items: center;
    gap: 0.38rem;
  }

  .music-runtime__button {
    appearance: none;
    display: inline-grid;
    width: 2.38rem;
    height: 2.38rem;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid rgba(255, 249, 223, 0.2);
    border-radius: 999px;
    background: rgba(255, 249, 223, 0.055);
    color: var(--tc-cream);
    cursor: pointer;
    transition:
      border-color 160ms ease,
      background 160ms ease,
      color 160ms ease,
      transform 160ms ease;
  }

  .music-runtime__button:hover {
    border-color: rgba(202, 255, 105, 0.48);
    background: rgba(202, 255, 105, 0.1);
    color: var(--tc-lime);
    transform: translateY(-1px);
  }

  .music-runtime__button--primary {
    background: var(--tc-pink);
    color: #071508;
  }

  .music-runtime__button--primary:hover {
    border-color: rgba(255, 249, 223, 0.34);
    background: var(--tc-lime);
    color: #071508;
  }

  .music-runtime__volume {
    display: flex;
    width: 6.8rem;
    align-items: center;
    gap: 0.42rem;
    color: rgba(255, 249, 223, 0.82);
  }

  .music-runtime__volume input {
    width: 100%;
    min-width: 0;
    accent-color: var(--tc-lime);
    cursor: pointer;
  }

  @media (max-width: 767px) {
    .music-runtime {
      right: 0.75rem;
      bottom: calc(4.85rem + env(safe-area-inset-bottom));
      gap: 0.55rem;
    }

    .music-runtime.expanded {
      left: 0.75rem;
    }

    .music-runtime__panel {
      flex: 1 1 auto;
      width: auto;
      min-width: 0;
    }

    .music-runtime__controls {
      gap: 0.32rem;
    }

    .music-runtime__button {
      width: 2.28rem;
      height: 2.28rem;
    }

    .music-runtime__volume {
      width: 5.3rem;
    }
  }

  @media (max-width: 410px) {
    .music-runtime__panel {
      gap: 0.45rem;
      padding: 0.48rem;
    }

    .music-runtime__copy small {
      display: none;
    }

    .music-runtime__volume {
      width: 4.5rem;
    }

    .music-runtime__button {
      width: 2.12rem;
      height: 2.12rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .music-runtime,
    .music-runtime__button {
      transition: none;
    }

    .music-runtime__button:hover {
      transform: none;
    }
  }
</style>
