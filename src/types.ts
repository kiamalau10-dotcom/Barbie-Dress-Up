export type Category = 'hair' | 'tops' | 'bottoms' | 'dresses' | 'shoes' | 'accessories' | 'background';

export interface ClothingItem {
  id: string;
  name: string;
  category: Category;
  image: string;
  thumbnail: string;
}

export interface GameState {
  selectedItems: Partial<Record<Category, string>>;
}
