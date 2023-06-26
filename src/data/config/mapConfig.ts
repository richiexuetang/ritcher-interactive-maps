import { ConfigDataType } from '@/types/config';

const mapConfig: ConfigDataType[] = [
  {
    name: 'witcher3',
    mapOptions: [
      {
        name: 'White Orchard',
        path: 'white-orchard',
        imagePath: 'https://i.ibb.co/LrH9X7Y/white-orchard.jpg',
      },
      {
        name: 'Velen & Novigrad',
        path: 'velen-novigrad',
        imagePath: 'https://i.ibb.co/V361TC7/velen-novigrad.jpg',
      },
      {
        name: 'Skellige Isles',
        path: 'skellige',
        imagePath: 'https://i.ibb.co/YhGYntq/skellige.jpg',
      },
      {
        name: 'Kaer Morhen',
        path: 'kaer-morhen',
        imagePath: 'https://i.ibb.co/ZS7X6f0/kaer-morhen.jpg',
      },
      {
        name: 'Toussaint',
        path: 'toussaint',
        imagePath: 'https://i.ibb.co/r6X4cg4/toussaint.jpg',
      },
    ],
  },
  {
    name: 'totk',
    mapOptions: [
      {
        name: 'Hyrule Sky',
        path: 'hyrule-sky',
        imagePath: 'https://i.ibb.co/Mpv8gNt/hyrule-sky.webp',
      },
      {
        name: 'Hyrule Surface',
        path: 'hyrule-surface',
        imagePath: 'https://i.ibb.co/ts6ZrL6/hyrule-surface.webp',
      },
      {
        name: 'Hyrule Depths',
        path: 'hyrule-depths',
        imagePath: 'https://i.ibb.co/sjyHTmD/hyrule-depths.webp',
      },
    ],
  },
];

export default mapConfig;
