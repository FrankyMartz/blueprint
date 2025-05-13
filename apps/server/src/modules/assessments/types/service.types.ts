/* ========================================================================== *
 * Assessments: Types: Service
 * ========================================================================== */

import type { Assessments } from '@app/modules/database';

export interface FindAllOptions {
  offset?: number;
  limit?: number;
  includeDeleted?: boolean;
}

export interface AssessmentFilters {
  disorder?: string;
  searchTerm?: string;
}
