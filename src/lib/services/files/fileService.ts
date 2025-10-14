import { apiClient } from '../api/client';
import type {
	File,
	FileListParams,
	FileListResponse,
	FileResponse,
	FileUploadResponse,
	FileDeleteResponse,
	FileUpdateRequest
} from '$lib/types/file';

class FileService {
	private baseUrl = '/v1/files';

	/**
	 * Get all files with pagination and filters
	 */
	async getAllFiles(params: FileListParams = {}): Promise<FileListResponse> {
		const {
			page = 1,
			limit = 10,
			search = '',
			sort_by = 'created_at',
			sort_direction = 'desc'
		} = params;

		const queryParams = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			sort_by,
			sort_direction
		});

		if (search.trim()) {
			queryParams.append('search', search.trim());
		}

		const response = await apiClient.get<FileListResponse>(`${this.baseUrl}?${queryParams}`);
		return response as unknown as FileListResponse;
	}

	/**
	 * Get a single file by ID
	 */
	async getFileById(id: string): Promise<FileResponse> {
		const response = await apiClient.get<FileResponse>(`${this.baseUrl}/${id}`);
		return response as unknown as FileResponse;
	}

	/**
	 * Upload a file
	 */
	async uploadFile(file: globalThis.File, bucketName: string): Promise<FileUploadResponse> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('bucket_name', bucketName);

		const url = `${apiClient['baseUrl']}${this.baseUrl}`;
		const response = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			body: formData
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || error.message || 'Failed to upload file');
		}

		return await response.json();
	}

	/**
	 * Update a file (replace file and/or rename)
	 */
	async updateFile(
		id: string,
		updateData: FileUpdateRequest
	): Promise<FileUploadResponse> {
		const formData = new FormData();

		if (updateData.file) {
			formData.append('file', updateData.file);
		}

		if (updateData.file_name) {
			formData.append('file_name', updateData.file_name);
		}

		const url = `${apiClient['baseUrl']}${this.baseUrl}/${id}`;
		const response = await fetch(url, {
			method: 'PUT',
			credentials: 'include',
			body: formData
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || error.message || 'Failed to update file');
		}

		return await response.json();
	}

	/**
	 * Delete a file (soft delete)
	 */
	async deleteFile(id: string): Promise<FileDeleteResponse> {
		const response = await apiClient.delete<FileDeleteResponse>(`${this.baseUrl}/${id}`);
		return response as unknown as FileDeleteResponse;
	}

	/**
	 * Download a file
	 */
	async downloadFile(id: string, fileName: string): Promise<void> {
		const url = `${apiClient['baseUrl']}${this.baseUrl}/${id}/download`;
		const response = await fetch(url, {
			method: 'GET',
			credentials: 'include'
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || error.message || 'Failed to download file');
		}

		// Create a blob from the response
		const blob = await response.blob();

		// Create a temporary URL for the blob
		const blobUrl = window.URL.createObjectURL(blob);

		// Create a temporary anchor element and trigger download
		const a = document.createElement('a');
		a.href = blobUrl;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();

		// Cleanup
		document.body.removeChild(a);
		window.URL.revokeObjectURL(blobUrl);
	}

	/**
	 * Get file preview URL (for images and PDFs)
	 */
	getFilePreviewUrl(id: string): string {
		return `${apiClient['baseUrl']}${this.baseUrl}/${id}/download`;
	}

	/**
	 * Format file size to human readable format
	 */
	formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	}

	/**
	 * Get file icon based on extension
	 */
	getFileIcon(extension: string): string {
		const ext = extension.toLowerCase();

		// Images
		if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
			return '🖼️';
		}

		// PDFs
		if (ext === 'pdf') {
			return '📄';
		}

		// Documents
		if (['doc', 'docx'].includes(ext)) {
			return '📝';
		}

		// Spreadsheets
		if (['xls', 'xlsx'].includes(ext)) {
			return '📊';
		}

		// Archives
		if (['zip', 'rar', '7z'].includes(ext)) {
			return '📦';
		}

		// Text
		if (ext === 'txt') {
			return '📃';
		}

		return '📎';
	}

	/**
	 * Check if file is an image
	 */
	isImage(mimeType: string): boolean {
		return mimeType.startsWith('image/');
	}

	/**
	 * Check if file is a PDF
	 */
	isPDF(mimeType: string): boolean {
		return mimeType === 'application/pdf';
	}

	/**
	 * Check if file can be previewed in browser
	 */
	canPreview(mimeType: string): boolean {
		return this.isImage(mimeType) || this.isPDF(mimeType);
	}
}

export const fileService = new FileService();
export type { File };
