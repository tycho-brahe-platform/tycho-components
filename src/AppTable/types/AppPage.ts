import { EMPTY_GRID_PAGEABLE, EMPTY_PAGEABLE } from "./AppPageable";

export type AppPage<Type> = {
  content: Type[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  seed: number;
  executionTime?: number;
  totalHits?: number;
  uid?: string;
  empty?: boolean;
};

export const EMPTY_PAGE = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: EMPTY_PAGEABLE.size,
  seed: 0,
};

export const EMPTY_GRID_PAGE = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: EMPTY_GRID_PAGEABLE.size,
  seed: 0,
};

export const isPageEmpty = <T>(data: AppPage<T> | undefined): boolean =>
  !data || !data.content || data.content.length === 0;
