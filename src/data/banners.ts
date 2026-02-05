// src/data/banners.ts

export interface Banner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  altText: string;
}

const banners: Banner[] = [
  {
    id: 0,
    imageUrl: '/banners/0.webp',
    linkUrl: '',
    altText: 'Promotional Banner 0',
  },
  {
    id: 1,
    imageUrl: '/banners/1.webp',
    linkUrl: '',
    altText: 'Promotional Banner 1',
  },
  {
    id: 2,
    imageUrl: '/banners/2.webp',
    linkUrl: '',
    altText: 'Promotional Banner 2',
  },  
  {
    id: 3,
    imageUrl: '/banners/3.webp',
    linkUrl: '',
    altText: 'Promotional Banner 3',
  },
  {
    id: 4,
    imageUrl: '/banners/4.webp',
    linkUrl: '',
    altText: 'Promotional Banner 4',
  },
  {
    id: 5,
    imageUrl: '/banners/5.webp',
    linkUrl: '',
    altText: 'Promotional Banner 5',
  }
];

export function getBanners(): Banner[] {
  return banners;
}