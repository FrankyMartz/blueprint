/* ========================================================================== *
 * Assessments: Types: Service
 * ========================================================================== */

export interface FindAllOptions {
  offset?: number;
  limit?: number;
  includeDeleted?: boolean;
}

export interface AssessmentFilters {
  disorder?: string;
  searchTerm?: string;
}
