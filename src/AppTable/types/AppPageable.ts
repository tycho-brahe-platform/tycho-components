import { SortingState } from '@tanstack/react-table';

export type AppPageable = {
  page: number;
  size: number;
  seed?: number;
  sort?: SortingState;
};

export const EMPTY_PAGEABLE: AppPageable = {
  page: 0,
  size: 10,
  seed: 1,
};

export const EMPTY_GRID_PAGEABLE: AppPageable = {
  page: 0,
  size: 12,
  seed: 1,
};

export function convertPageable(pageable: AppPageable) {
  const sort: string[] = [];
  if (pageable.sort) {
    pageable.sort.forEach((item, index) => {
      sort.push(`${item.id},${item.desc ? 'desc' : 'asc'}`);
    });
  }

  return { ...pageable, sort: sort.join(',') };
}
