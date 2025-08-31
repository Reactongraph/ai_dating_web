import { Collection } from '@/types/collection';

export const mockCollection: Collection = {
  characters: [
    {
      id: '1',
      name: 'Aeli',
      age: 26,
      mainImage: '/assets/collection/image1.jpg',
      images: [
        {
          id: '1',
          url: '/assets/collection/image1.jpg',
          alt: 'Aeli in red dress',
        },
        {
          id: '2',
          url: '/assets/collection/image2.jpg',
          alt: 'Aeli in red sparkly dress',
        },
        {
          id: '3',
          url: '/assets/collection/image3.jpg',
          alt: 'Aeli in purple dress',
        },
        {
          id: '4',
          url: '/assets/collection/image4.png',
          alt: 'Aeli in polka dot dress',
        },
      ],
    },
    {
      id: '2',
      name: 'Aley',
      age: 26,
      mainImage: '/assets/models/girl1.jpg',
      images: [
        { id: '1', url: '/assets/collection/aley1.jpg', alt: 'Aley portrait' },
        { id: '2', url: '/assets/collection/aley2.jpg', alt: 'Aley outdoor' },
        { id: '3', url: '/assets/collection/aley3.jpg', alt: 'Aley casual' },
        { id: '4', url: '/assets/collection/aley4.jpg', alt: 'Aley fashion' },
        { id: '5', url: '/assets/collection/aley5.jpg', alt: 'Aley style' },
        { id: '6', url: '/assets/collection/aley6.jpg', alt: 'Aley elegant' },
        { id: '7', url: '/assets/collection/aley7.jpg', alt: 'Aley modern' },
      ],
    },
    {
      id: '3',
      name: 'Fraha',
      age: 25,
      mainImage: '/assets/models/girl2.jpg',
      images: [
        {
          id: '1',
          url: '/assets/models/girl2.jpg',
          alt: 'Fraha portrait',
        },
        { id: '2', url: '/assets/models/girl2.jpg', alt: 'Fraha style' },
      ],
    },
    {
      id: '4',
      name: 'Molley',
      age: 28,
      mainImage: '/assets/collection/molley1.jpg',
      images: [
        {
          id: '1',
          url: '/assets/collection/molley1.jpg',
          alt: 'Molley portrait',
        },
        { id: '2', url: '/assets/collection/molley2.jpg', alt: 'Molley style' },
        {
          id: '3',
          url: '/assets/collection/molley3.jpg',
          alt: 'Molley fashion',
        },
        {
          id: '4',
          url: '/assets/collection/molley4.jpg',
          alt: 'Molley elegant',
        },
        {
          id: '5',
          url: '/assets/collection/molley5.jpg',
          alt: 'Molley modern',
        },
      ],
    },
  ],
};
