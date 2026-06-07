import { spawn, spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const port = Number(process.env.MUSIC_TEST_PORT ?? 4331);
const providedUrl = process.env.MUSIC_TEST_URL;
const baseUrl = providedUrl ?? `http://127.0.0.1:${port}/`;
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const failures = [];

let serverProcess = null;

function assert(condition, message, details = undefined) {
  if (condition) return;
  failures.push({ message, details });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFor(predicate, timeoutMs, label) {
  const startedAt = Date.now();
  let lastValue;

  while (Date.now() - startedAt < timeoutMs) {
    lastValue = await predicate();
    if (lastValue) return lastValue;
    await sleep(100);
  }

  throw new Error(`Timeout waiting for ${label}. Last value: ${JSON.stringify(lastValue)}`);
}

async function waitForServer(url) {
  await waitFor(
    async () => {
      try {
        const response = await fetch(url);
        return response.ok;
      } catch {
        return false;
      }
    },
    30_000,
    `server ${url}`,
  );
}

function startServer() {
  if (providedUrl) return;

  serverProcess = spawn(npmCommand, ['run', 'dev', '--', '--port', String(port)], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
    windowsHide: true,
  });

  serverProcess.stdout.on('data', (chunk) => process.stdout.write(`[astro] ${chunk}`));
  serverProcess.stderr.on('data', (chunk) => process.stderr.write(`[astro] ${chunk}`));
}

function stopServer() {
  if (!serverProcess?.pid) return;

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(serverProcess.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    serverProcess.kill('SIGTERM');
  }
}

async function getMusicState(page) {
  return page.evaluate(() => window.__tropicoolMusicDebug?.getState());
}

async function waitForMusicState(page, predicate, label, timeoutMs = 10_000) {
  return waitFor(async () => {
    const state = await getMusicState(page);
    return state && predicate(state) ? state : false;
  }, timeoutMs, label);
}

async function assertTimeAdvances(page, label) {
  const first = await getMusicState(page);
  await sleep(750);
  const second = await getMusicState(page);

  assert(Boolean(first && second), `${label}: debug state must exist`);
  assert(
    second.currentTime > first.currentTime + 0.25,
    `${label}: audio currentTime should advance while playing`,
    { before: first, after: second },
  );
}

async function sampleNeon(page, durationMs = 1200) {
  const samples = [];
  const startedAt = Date.now();

  while (Date.now() - startedAt < durationMs) {
    samples.push(await getMusicState(page));
    await sleep(120);
  }

  return samples.filter(Boolean);
}

function assertNeonReactive(samples, label) {
  const activeSamples = samples.filter((state) => state.neonAudio > 0.015 || state.neonPulse > 0.015);
  const audioValues = samples.map((state) => Number(state.neonAudio.toFixed(3)));
  const pulseValues = samples.map((state) => Number(state.neonPulse.toFixed(3)));
  const uniqueAudioValues = new Set(audioValues);
  const uniquePulseValues = new Set(pulseValues);
  const firstFrame = samples[0]?.renderedFrameCount ?? 0;
  const lastFrame = samples.at(-1)?.renderedFrameCount ?? 0;

  assert(samples.length >= 4, `${label}: should collect enough neon samples`, samples);
  assert(activeSamples.length >= 2, `${label}: neon values should become active`, samples);
  assert(
    uniqueAudioValues.size > 1 || uniquePulseValues.size > 1,
    `${label}: neon values should change over time`,
    { audioValues, pulseValues },
  );
  assert(lastFrame > firstFrame, `${label}: visual analysis loop should keep rendering frames`, {
    firstFrame,
    lastFrame,
  });
}

function assertLocalMp3sAreNotSilent() {
  const folder = join(process.cwd(), 'public', 'music', 'tropical tech house mix vol.2');
  const files = readdirSync(folder).filter((file) => file.endsWith('.mp3')).sort();
  const nullSink = process.platform === 'win32' ? 'NUL' : '/dev/null';

  assert(files.length === 12, 'there should be exactly 12 generated MP3 tracks', files);

  files.forEach((file) => {
    const result = spawnSync(
      'ffmpeg',
      ['-hide_banner', '-i', join(folder, file), '-af', 'volumedetect', '-f', 'null', nullSink],
      { encoding: 'utf8' },
    );
    const output = `${result.stdout}\n${result.stderr}`;
    const meanMatch = output.match(/mean_volume:\s*(-?\d+(?:\.\d+)?) dB/);
    const maxMatch = output.match(/max_volume:\s*(-?\d+(?:\.\d+)?) dB/);
    const meanVolume = meanMatch ? Number(meanMatch[1]) : Number.NEGATIVE_INFINITY;
    const maxVolume = maxMatch ? Number(maxMatch[1]) : Number.NEGATIVE_INFINITY;

    assert(result.status === 0, `${file}: ffmpeg should read the MP3`, output);
    assert(meanVolume > -45, `${file}: mean volume should not be silent`, { meanVolume, maxVolume });
    assert(maxVolume > -12, `${file}: max volume should not be silent`, { meanVolume, maxVolume });
  });
}

async function forceTrackEndAndAssertContinuation(page, cycle) {
  const before = await getMusicState(page);
  await page.evaluate(() => window.__tropicoolMusicDebug?.seekNearEnd());

  const after = await waitForMusicState(
    page,
    (state) =>
      state.transitionCount > before.transitionCount &&
      state.track !== before.track &&
      state.src !== before.src &&
      state.playing &&
      !state.paused &&
      state.readyState >= 2 &&
      state.playbackVolume > 0.1,
    `automatic transition ${cycle}`,
    10_000,
  );

  assert(after.src !== before.src, `transition ${cycle}: source should change`, { before, after });
  assert(after.readyState >= 2, `transition ${cycle}: new track should be ready enough to play`, after);
  assert(after.playbackVolume > 0, `transition ${cycle}: playback volume should recover`, after);
  assert(!after.lastPlayError, `transition ${cycle}: play() should not report errors`, after);

  await assertTimeAdvances(page, `transition ${cycle}`);
}

async function run() {
  assertLocalMp3sAreNotSilent();

  startServer();
  await waitForServer(baseUrl);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const consoleErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.locator('[data-music-runtime]').waitFor({ timeout: 10_000 });
  await waitForMusicState(page, (state) => state.readyState >= 0 && Boolean(state.src), 'initial audio debug state');

  const collapsedState = await page.evaluate(() => {
    const panel = document.querySelector('.music-runtime__panel');
    const toggle = document.querySelector('.music-runtime__toggle');
    const panelStyle = panel ? getComputedStyle(panel) : null;
    const toggleBox = toggle?.getBoundingClientRect();
    return {
      panelVisible: panelStyle?.visibility,
      panelOpacity: panelStyle?.opacity,
      toggleRadius: toggle ? getComputedStyle(toggle).borderRadius : '',
      toggleWidth: toggleBox?.width ?? 0,
      toggleHeight: toggleBox?.height ?? 0,
    };
  });
  assert(collapsedState.panelVisible === 'hidden', 'music panel should start collapsed', collapsedState);
  assert(Number(collapsedState.panelOpacity) === 0, 'collapsed music panel should be transparent', collapsedState);
  assert(
    Math.abs(collapsedState.toggleWidth - collapsedState.toggleHeight) < 1,
    'collapsed music toggle should be circular',
    collapsedState,
  );

  await page.getByLabel('Mostrar controlador de música').click();
  await page.getByLabel(/^Reproducir/).waitFor({ timeout: 5_000 });

  await page.getByLabel(/^Reproducir/).click();
  const started = await waitForMusicState(
    page,
    (state) =>
      state.playing &&
      !state.paused &&
      !state.muted &&
      state.readyState >= 2 &&
      state.playbackVolume > 0.1 &&
      state.audioContextState === 'running',
    'started playback',
  );
  assert(started.audioVolume > 0.9, 'HTML audio output volume should be open', started);
  await waitForMusicState(page, (state) => state.playbackVolume > 0.1, 'fade-in raises effective volume');
  await assertTimeAdvances(page, 'initial playback');
  assertNeonReactive(await sampleNeon(page), 'initial neon playback');

  await page.getByLabel(/^Pausar/).click();
  await waitForMusicState(page, (state) => !state.playing && state.paused, 'paused playback');
  await page.getByLabel(/^Reproducir/).click();
  await waitForMusicState(
    page,
    (state) => state.playing && !state.paused && state.readyState >= 2 && state.playbackVolume > 0.1,
    'resumed playback',
  );
  await assertTimeAdvances(page, 'resumed playback');
  assertNeonReactive(await sampleNeon(page), 'neon after pause and resume');

  for (let cycle = 1; cycle <= 4; cycle += 1) {
    await forceTrackEndAndAssertContinuation(page, cycle);
    assertNeonReactive(await sampleNeon(page, 700), `neon after automatic transition ${cycle}`);
  }

  const beforeNext = await getMusicState(page);
  await page.getByLabel('Siguiente canción').click();
  const afterNext = await waitForMusicState(
    page,
    (state) =>
      state.transitionCount > beforeNext.transitionCount &&
      state.track !== beforeNext.track &&
      state.src !== beforeNext.src &&
      state.playing &&
      !state.paused &&
      state.readyState >= 2 &&
      state.playbackVolume > 0.1,
    'manual next track',
    10_000,
  );
  assert(afterNext.src !== beforeNext.src, 'manual next should choose a different source', { beforeNext, afterNext });
  await assertTimeAdvances(page, 'manual next playback');
  assertNeonReactive(await sampleNeon(page), 'neon after manual next');

  const cssState = await page.evaluate(() => {
    const hero = getComputedStyle(document.querySelector('[data-audio-reactive-neon]'));
    const menu = getComputedStyle(document.querySelector('.menu-doodle-layer'));
    return {
      heroAudio: hero.getPropertyValue('--neon-audio').trim(),
      heroPulse: hero.getPropertyValue('--neon-pulse').trim(),
      heroAnimation: hero.animationName,
      menuAudio: menu.getPropertyValue('--neon-audio').trim(),
      menuPulse: menu.getPropertyValue('--neon-pulse').trim(),
    };
  });
  assert(cssState.heroAudio === cssState.menuAudio, 'hero and doodles should share neon audio value', cssState);
  assert(cssState.heroPulse === cssState.menuPulse, 'hero and doodles should share neon pulse value', cssState);
  assert(cssState.heroAnimation === 'none', 'hero should not run independent CSS animation', cssState);

  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('[data-music-runtime]').waitFor({ timeout: 10_000 });
  await page.getByLabel('Mostrar controlador de música').click();
  await page.getByLabel(/^Reproducir/).click();
  await waitForMusicState(
    page,
    (state) =>
      state.playing &&
      !state.paused &&
      state.readyState >= 2 &&
      state.playbackVolume > 0.1 &&
      !state.lastPlayError,
    'playback after reload',
  );
  await assertTimeAdvances(page, 'reload playback');
  assertNeonReactive(await sampleNeon(page), 'neon after reload');

  assert(consoleErrors.length === 0, 'browser console should not contain errors', consoleErrors);

  await browser.close();

  if (failures.length) {
    console.error(JSON.stringify({ ok: false, failures }, null, 2));
    process.exitCode = 1;
    return;
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        checked: [
          'all 12 local MP3 tracks are non-silent',
          'music control starts collapsed as a circular button',
          'play starts after user gesture',
          'effective playback volume rises',
          'audio currentTime advances',
          'neons react during initial playback',
          'neons react after pause and resume',
          '4 automatic end-of-track transitions keep playing',
          'neons react after automatic transitions',
          'manual next keeps playing',
          'neons react after manual next',
          'hero and doodles share the same neon variables',
          'reload can play again',
          'neons react after reload',
          'browser console has no errors',
        ],
      },
      null,
      2,
    ),
  );
}

try {
  await run();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  stopServer();
}
