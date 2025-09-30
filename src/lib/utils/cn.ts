/**
 * Utility function to merge class names safely
 * Similar to clsx but simpler implementation for this use case
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(' ');
}
