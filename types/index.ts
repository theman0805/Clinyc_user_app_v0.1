// Re-export all types from organized modules
export * from './auth';
export * from './navigation';
export * from './api';

// Legacy types for backward compatibility (to be removed after migration)
export type { User as LegacyUser } from './auth';
export type { Case as MedicalCase } from './api';

// Additional utility types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
} 