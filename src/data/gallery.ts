export type GalleryItem = {
  type: 'image' | 'video';
  src: string;
  mobileSrc?: string;
  poster?: string;
  alt: string;
  title: string;
};

export const galleryMedia: GalleryItem[] = [
  {
    type: 'image',
    src: '/images/assets/instagram/279718164_676893033385822_10650176309447125_n.jpg',
    alt: 'Detalle de Tropicool compartido en Instagram',
    title: 'Tropicool',
  },
  {
    type: 'image',
    src: '/images/assets/instagram/320613368_2412907532190707_314409588155603933_n.jpg',
    alt: 'Plato y ambiente de Tropicool',
    title: 'Cocina plant based',
  },
  {
    type: 'image',
    src: '/images/assets/instagram/Gemini_Generated_Image_mlqie3mlqie3mlqi.png',
    alt: 'Logo rosa de Tropicool',
    title: 'Neon Tropicool',
  },
  {
    type: 'image',
    src: '/images/assets/instagram/logo_web_tropicool.png',
    alt: 'Logo de Tropicool',
    title: 'Tropicool logo',
  },
  {
    type: 'image',
    src: '/images/assets/instagram/title.jpg',
    alt: 'Letrero Tropicool',
    title: 'Letrero Tropicool',
  },
  ...Array.from({ length: 7 }, (_, index) => {
    const fileNumber = String(index + 1).padStart(2, '0');
    return {
      type: 'video' as const,
      src: `/videos/hero/desktop/hero-${fileNumber}.mp4`,
      mobileSrc: `/videos/hero/mobile/hero-${fileNumber}.mp4`,
      poster: `/images/assets/gallery/video-${fileNumber}.jpg`,
      alt: `Vídeo ${index + 1} de Tropicool`,
      title: `Vídeo Tropicool ${index + 1}`,
    };
  }),
];
