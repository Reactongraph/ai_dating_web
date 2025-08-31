export interface CharacterImage {
  id: string;
  url: string;
  alt: string;
}

export interface CollectionCharacter {
  id: string;
  name: string;
  age: number;
  images: CharacterImage[];
  mainImage: string;
}

export interface Collection {
  characters: CollectionCharacter[];
}
