import { PetCategory } from '../types/product.types';

export const PET_CATEGORIES: Record<
  PetCategory,
  { label: string; emoji: string; slug: string; theme: string }
> = {
  [PetCategory.DOGS]: { label: 'Dogs', emoji: '🐕', slug: 'dogs', theme: 'dogs' },
  [PetCategory.CATS]: { label: 'Cats', emoji: '🐈', slug: 'cats', theme: 'cats' },
  [PetCategory.FISH]: { label: 'Fish', emoji: '🐟', slug: 'fish', theme: 'fish' },
  [PetCategory.BIRDS]: { label: 'Birds', emoji: '🐦', slug: 'birds', theme: 'birds' },
  [PetCategory.SMALL_PETS]: { label: 'Small Pets', emoji: '🐹', slug: 'small-pets', theme: 'small_pets' },
};

export const PET_CATEGORY_LIST = Object.values(PET_CATEGORIES);
