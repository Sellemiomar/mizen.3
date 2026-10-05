/**
 * Mizen - Canonical Knowledge Validator
 * Enforces strict evidence integrity rules across all canonical financing programs and claims.
 */

import { FinancingProduct, FinancingProvider } from '../types/knowledge';
import { KNOWLEDGE_REGISTRY } from './knowledgeRegistry';

export interface ValidationError {
  severity: 'ERROR' | 'WARNING';
  programId: string;
  field: string;
  message: string;
  code: string;
}

export interface ValidationSummary {
  valid: boolean;
  errorCount: number;
  warningCount: number;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export function validateKnowledgeCatalogue(
  products: FinancingProduct[] = KNOWLEDGE_REGISTRY.getProducts(),
  providers: FinancingProvider[] = KNOWLEDGE_REGISTRY.getProviders()
): ValidationSummary {
  const audit = KNOWLEDGE_REGISTRY.validateKnowledgeIntegrity();
  const errors: ValidationError[] = audit.violations.map((v, idx) => ({
    severity: 'ERROR',
    programId: 'canonical_knowledge',
    field: 'integrity',
    message: v,
    code: `VIOLATION_${idx + 1}`
  }));

  return {
    valid: audit.isValid,
    errorCount: errors.length,
    warningCount: 0,
    errors,
    warnings: []
  };
}
