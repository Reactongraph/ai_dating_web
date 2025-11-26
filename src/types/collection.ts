export interface CharacterImage {
  id: string;
  url: string;
  alt: string;
  imageType?: 'sfw' | 'nsfw';
}

export interface CollectionCharacter {
  id: string;
  name: string;
  age: number;
  images: CharacterImage[];
  mainImage: string;
  imageType?: 'sfw' | 'nsfw';
}

export interface Collection {
  characters: CollectionCharacter[];
}
