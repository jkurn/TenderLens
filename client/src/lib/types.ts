import type { AIAnalysis, Document, KeyDate, Requirements } from "@shared/schema";

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export interface ProcessingState {
  status: ProcessingStatus;
  progress: number;
  message: string;
}

export type OpportunityRating = 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';

export function getOpportunityRating(score: number): OpportunityRating {
  if (score < 20) return 'Poor';
  if (score < 40) return 'Fair';
  if (score < 60) return 'Good';
  if (score < 80) return 'Very Good';
  return 'Excellent';
}

export function getOpportunityColor(score: number): string {
  if (score < 20) return 'text-error';
  if (score < 40) return 'text-warning';
  if (score < 60) return 'text-accent';
  if (score < 80) return 'text-accent';
  return 'text-success';
}

// Custom badge variants for use with shadcn ui
export type CustomBadgeVariants = 'default' | 'destructive' | 'outline' | 'secondary' | 'success' | 'warning';

// Helper for null checking opportunity score
export function nullSafeOpportunityScore(score: number | null | undefined): number {
  return score === null || score === undefined ? 0 : score;
}
