<script lang="ts">
	import { fileService } from '$lib/services/files/fileService';
	import Button from './Button.svelte';
	import { cn } from '$lib/utils/cn';
	import type { File } from '$lib/types/file';

	export let file: File;
	export let showActions: boolean = true;
	export let onView: ((file: File) => void) | null = null;
	export let onDownload: ((file: File) => void) | null = null;
	export let onDelete: ((file: File) => void) | null = null;
	export let className: string = '';

	let downloading = false;

	const handleView = () => {
		if (onView) {
			onView(file);
		}
	};

	const handleDownload = async () => {
		if (onDownload) {
			onDownload(file);
			return;
		}

		// Default download behavior
		downloading = true;
		try {
			await fileService.downloadFile(file.id, file.original_name);
		} catch (error) {
			console.error('Error downloading file:', error);
			alert(
				`Error al descargar el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
			);
		} finally {
			downloading = false;
		}
	};

	const handleDelete = () => {
		if (onDelete) {
			onDelete(file);
		}
	};

	$: fileIcon = fileService.getFileIcon(file.extension);
	$: fileSize = fileService.formatFileSize(file.file_size);
	$: canPreview = fileService.canPreview(file.mime_type);
	$: isImage = fileService.isImage(file.mime_type);
	$: thumbnailUrl = file.thumbnail_path
		? fileService.getFilePreviewUrl(file.id)
		: null;
</script>

<div
	class={cn(
		'file-item p-4 rounded-lg border border-border bg-surface hover:bg-muted/50 transition-colors',
		className
	)}
>
	<div class="flex items-start gap-4">
		<!-- File Icon or Thumbnail -->
		<div class="flex-shrink-0">
			{#if isImage && thumbnailUrl}
				<img
					src={thumbnailUrl}
					alt={file.original_name}
					class="w-16 h-16 object-cover rounded border border-border"
				/>
			{:else}
				<div
					class="w-16 h-16 flex items-center justify-center bg-muted rounded border border-border text-3xl"
				>
					{fileIcon}
				</div>
			{/if}
		</div>

		<!-- File Info -->
		<div class="flex-1 min-w-0">
			<h4 class="text-base font-medium text-primary truncate" title={file.original_name}>
				{file.original_name}
			</h4>
			<div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
				<span>{fileSize}</span>
				<span class="uppercase">{file.extension}</span>
				<span>{file.bucket_name}</span>
			</div>
			{#if file.created_by_user}
				<div class="mt-1 text-xs text-muted">
					Subido por {file.created_by_user.name}
				</div>
			{/if}
			<div class="mt-1 text-xs text-muted">
				{new Date(file.created_at).toLocaleDateString('es-ES', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})}
			</div>
		</div>

		<!-- Actions -->
		{#if showActions}
			<div class="flex-shrink-0 flex gap-2">
				{#if canPreview && onView}
					<Button variant="ghost" size="sm" on:click={handleView} title="Ver archivo">
						👁️
					</Button>
				{/if}

				<Button
					variant="ghost"
					size="sm"
					on:click={handleDownload}
					loading={downloading}
					title="Descargar archivo"
				>
					⬇️
				</Button>

				{#if onDelete}
					<Button variant="ghost" size="sm" on:click={handleDelete} title="Eliminar archivo">
						🗑️
					</Button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.file-item {
		transition: all 0.2s;
	}

	.file-item:hover {
		box-shadow: 0 1px 3px 0 rgba(25, 161, 230, 0.1), 0 1px 2px -1px rgba(25, 161, 230, 0.1);
	}
</style>
