/**
 * Sanitizes database/API error messages before showing them to users.
 * Prevents leaking internal database structure, table names, and constraint details.
 */
export const sanitizeDbError = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error || '');

  // Map known Postgres/Supabase error patterns to user-friendly messages
  if (message.includes('duplicate key') || message.includes('unique constraint')) {
    return 'This record already exists.';
  }
  if (message.includes('foreign key')) {
    return 'Cannot complete this action due to related records.';
  }
  if (message.includes('row-level security') || message.includes('RLS')) {
    return 'You do not have permission to perform this action.';
  }
  if (message.includes('violates check constraint')) {
    return 'The provided data is invalid. Please check your input.';
  }
  if (message.includes('not found') || message.includes('no rows')) {
    return 'The requested record was not found.';
  }
  if (message.includes('JWT') || message.includes('token')) {
    return 'Your session has expired. Please sign in again.';
  }
  if (message.includes('Cooldown') || message.includes('cooldown')) {
    return message; // Cooldown messages are intentional user-facing messages
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'A network error occurred. Please check your connection and try again.';
  }

  // Log full error for debugging (only in dev)
  if (import.meta.env.DEV) {
    console.error('Database error:', error);
  }

  return 'An unexpected error occurred. Please try again.';
};
