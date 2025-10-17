/**
 * Date utilities for handling UTC to local time conversions
 * Specifically configured for Guatemala timezone (GMT-6)
 */

const GUATEMALA_OFFSET_HOURS = -6; // Guatemala is UTC-6

/**
 * Format a UTC date string to Guatemala local time
 * Used for displaying system dates (createdAt, updatedAt) in local time
 *
 * @param utcDateString - ISO 8601 UTC date string from backend
 * @param includeTime - Whether to include time in the output (default: true)
 * @returns Formatted date string in Guatemala timezone
 */
export function formatUTCToLocal(utcDateString: string | null | undefined, includeTime = true): string {
	if (!utcDateString) return '-';

	try {
		// Parse the UTC date string
		const utcDate = new Date(utcDateString);

		// Check if date is valid
		if (isNaN(utcDate.getTime())) {
			return '-';
		}

		// Use Intl.DateTimeFormat for automatic timezone conversion to Guatemala
		const options: Intl.DateTimeFormatOptions = {
			timeZone: 'America/Guatemala',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			...(includeTime && {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})
		};

		const formatter = new Intl.DateTimeFormat('es-GT', options);
		return formatter.format(utcDate);
	} catch (error) {
		console.error('Error formatting date:', error);
		return '-';
	}
}

/**
 * Format a UTC date string to short Guatemala local time (DD/MM/YYYY)
 *
 * @param utcDateString - ISO 8601 UTC date string from backend
 * @returns Short formatted date string (DD/MM/YYYY)
 */
export function formatUTCToLocalShort(utcDateString: string | null | undefined): string {
	if (!utcDateString) return '-';

	try {
		const utcDate = new Date(utcDateString);

		if (isNaN(utcDate.getTime())) {
			return '-';
		}

		// Use Intl.DateTimeFormat for automatic timezone conversion to Guatemala
		const options: Intl.DateTimeFormatOptions = {
			timeZone: 'America/Guatemala',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		};

		const formatter = new Intl.DateTimeFormat('es-GT', options);
		return formatter.format(utcDate);
	} catch (error) {
		console.error('Error formatting date:', error);
		return '-';
	}
}

/**
 * Format a UTC date string to relative time (e.g., "hace 5 minutos")
 *
 * @param utcDateString - ISO 8601 UTC date string from backend
 * @returns Relative time string in Spanish
 */
export function formatUTCToRelative(utcDateString: string | null | undefined): string {
	if (!utcDateString) return '-';

	try {
		const utcDate = new Date(utcDateString);

		if (isNaN(utcDate.getTime())) {
			return '-';
		}

		const now = new Date();
		const diffMs = now.getTime() - utcDate.getTime();
		const diffSec = Math.floor(diffMs / 1000);
		const diffMin = Math.floor(diffSec / 60);
		const diffHour = Math.floor(diffMin / 60);
		const diffDay = Math.floor(diffHour / 24);

		if (diffSec < 60) {
			return 'hace un momento';
		} else if (diffMin < 60) {
			return `hace ${diffMin} minuto${diffMin !== 1 ? 's' : ''}`;
		} else if (diffHour < 24) {
			return `hace ${diffHour} hora${diffHour !== 1 ? 's' : ''}`;
		} else if (diffDay < 30) {
			return `hace ${diffDay} día${diffDay !== 1 ? 's' : ''}`;
		} else {
			return formatUTCToLocalShort(utcDateString);
		}
	} catch (error) {
		console.error('Error formatting relative date:', error);
		return '-';
	}
}

/**
 * Format a UTC date string to time only (HH:MM)
 *
 * @param utcDateString - ISO 8601 UTC date string from backend
 * @returns Time string in Guatemala timezone (HH:MM)
 */
export function formatUTCToTime(utcDateString: string | null | undefined): string {
	if (!utcDateString) return '-';

	try {
		const utcDate = new Date(utcDateString);

		if (isNaN(utcDate.getTime())) {
			return '-';
		}

		const options: Intl.DateTimeFormatOptions = {
			timeZone: 'America/Guatemala',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		};

		return new Intl.DateTimeFormat('es-GT', options).format(utcDate);
	} catch (error) {
		console.error('Error formatting time:', error);
		return '-';
	}
}

/**
 * Check if a date string is today in Guatemala timezone
 *
 * @param utcDateString - ISO 8601 UTC date string from backend
 * @returns true if date is today in Guatemala timezone
 */
export function isToday(utcDateString: string | null | undefined): boolean {
	if (!utcDateString) return false;

	try {
		const utcDate = new Date(utcDateString);

		if (isNaN(utcDate.getTime())) {
			return false;
		}

		const now = new Date();

		// Convert both dates to Guatemala timezone for comparison
		const dateInGuatemala = new Date(utcDate.toLocaleString('en-US', { timeZone: 'America/Guatemala' }));
		const nowInGuatemala = new Date(now.toLocaleString('en-US', { timeZone: 'America/Guatemala' }));

		return (
			dateInGuatemala.getDate() === nowInGuatemala.getDate() &&
			dateInGuatemala.getMonth() === nowInGuatemala.getMonth() &&
			dateInGuatemala.getFullYear() === nowInGuatemala.getFullYear()
		);
	} catch (error) {
		return false;
	}
}
