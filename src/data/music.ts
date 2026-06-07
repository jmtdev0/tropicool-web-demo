export type MusicTrack = {
  id: string;
  artist: string;
  title: string;
  shortTitle: string;
  src: string;
  duration: number;
};

const basePath = '/music/tropical tech house mix vol.2';

export const tropicalHouseTracks: MusicTrack[] = [
  {
    id: 'wade-stereo-conga',
    artist: 'Wade',
    title: 'Stereo Conga (Original Mix)',
    shortTitle: 'Stereo Conga',
    src: `${basePath}/01-wade-stereo-conga.mp3`,
    duration: 160,
  },
  {
    id: 'antoine-clamaran-colorada',
    artist: 'Antoine Clamaran',
    title: 'Colorada (Original Mix)',
    shortTitle: 'Colorada',
    src: `${basePath}/02-antoine-clamaran-colorada.mp3`,
    duration: 96,
  },
  {
    id: 'rafa-barrios-estrella-de-la-manana',
    artist: 'Rafa Barrios',
    title: 'Estrella de la Mañana (feat. Cecilia Todd)',
    shortTitle: 'Estrella de la Mañana',
    src: `${basePath}/03-rafa-barrios-estrella-de-la-manana.mp3`,
    duration: 114,
  },
  {
    id: 'wade-de-fiesta-por-sevilla',
    artist: 'Wade',
    title: 'De Fiesta Por Sevilla (Original Mix)',
    shortTitle: 'De Fiesta Por Sevilla',
    src: `${basePath}/04-wade-de-fiesta-por-sevilla.mp3`,
    duration: 131,
  },
  {
    id: 'jude-frank-la-luna',
    artist: 'Jude & Frank',
    title: 'La Luna',
    shortTitle: 'La Luna',
    src: `${basePath}/05-jude-frank-la-luna.mp3`,
    duration: 153,
  },
  {
    id: 'jesus-nava-suicide-girl',
    artist: 'Jesus Nava',
    title: 'Suicide Girl',
    shortTitle: 'Suicide Girl',
    src: `${basePath}/06-jesus-nava-suicide-girl.mp3`,
    duration: 143,
  },
  {
    id: 'di-martino-la-esperanza',
    artist: 'Di Martino',
    title: 'La Esperanza',
    shortTitle: 'La Esperanza',
    src: `${basePath}/07-di-martino-la-esperanza.mp3`,
    duration: 179,
  },
  {
    id: 'dennis-cruz-el-sueno',
    artist: 'Dennis Cruz',
    title: 'El Sueño (feat. Martina Camargo)',
    shortTitle: 'El Sueño',
    src: `${basePath}/08-dennis-cruz-el-sueno.mp3`,
    duration: 159,
  },
  {
    id: 'simon-fava-yvvan-back-la-colegiala',
    artist: 'Simon Fava & Yvvan Back',
    title: 'La Colegiala',
    shortTitle: 'La Colegiala',
    src: `${basePath}/09-simon-fava-yvvan-back-la-colegiala.mp3`,
    duration: 85,
  },
  {
    id: 'pablo-ferrero-get-jackin',
    artist: 'Pablo Ferrero',
    title: 'Get Jackin (Original Mix)',
    shortTitle: 'Get Jackin',
    src: `${basePath}/10-pablo-ferrero-get-jackin.mp3`,
    duration: 178,
  },
  {
    id: 'samuel-rodriguez-coffee-run',
    artist: 'Samuel Rodriguez',
    title: 'Coffee Run (Original Mix)',
    shortTitle: 'Coffee Run',
    src: `${basePath}/11-samuel-rodriguez-coffee-run.mp3`,
    duration: 247,
  },
  {
    id: 'chris-brooks-martin-bordacahar-look-out',
    artist: 'Chris Brooks & Martin Bordacahar',
    title: 'Look Out (Original Mix)',
    shortTitle: 'Look Out',
    src: `${basePath}/12-chris-brooks-martin-bordacahar-look-out.mp3`,
    duration: 259.4,
  },
];
