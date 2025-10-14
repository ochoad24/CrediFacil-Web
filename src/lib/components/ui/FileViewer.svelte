<script lang="ts">
	import { fileService } from '$lib/services/files/fileService';
	import Button from './Button.svelte';
	import { cn } from '$lib/utils/cn';
	import type { File } from '$lib/types/file';
	import { onMount } from 'svelte';

	export let file: File | null = null;
	export let open: boolean = false;
	export let onClose: () => void = () => {};

	let downloading = false;
	let modalElement: HTMLDivElement;

	$: fileUrl = file ? fileService.getFilePreviewUrl(file.id) : null;
	$: isImage = file ? fileService.isImage(file.mime_type) : false;
	$: isPDF = file ? fileService.isPDF(file.mime_type) : false;
	$: canPreview = file ? fileService.canPreview(file.mime_type) : false;

	const handleClose = () => {
		open = false;
		onClose();
	};

	const handleBackdropClick = (event: MouseEvent) => {
		if (event.target === modalElement) {
			handleClose();
		}
	};

	const handleDownload = async () => {
		if (!file) return;

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

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && open) {
			handleClose();
		}
	};

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	// Prevent body scroll when modal is open
	$: if (typeof document !== 'undefined') {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}
</script>

{#if open && file}
	<!-- Modal Backdrop -->
	<div
		bind:this={modalElement}
		class="file-viewer-modal fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
		on:click={handleBackdropClick}
		on:keydown={(e) => e.key === 'Escape' && handleClose()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="file-viewer-title"
		tabindex="-1"
	>
		<!-- Modal Content -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="file-viewer-content relative w-full max-w-6xl max-h-[90vh] m-4 bg-surface rounded-lg shadow-2xl flex flex-col"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-border">
				<div class="flex-1 min-w-0 pr-4">
					<h3 id="file-viewer-title" class="text-lg font-semibold text-primary truncate">
						{file.original_name}
					</h3>
					<div class="flex gap-4 mt-1 text-sm text-muted">
						<span>{fileService.formatFileSize(file.file_size)}</span>
						<span class="uppercase">{file.extension}</span>
					</div>
				</div>

				<div class="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						on:click={handleDownload}
						loading={downloading}
						title="Descargar"
					>
						⬇️ Descargar
					</Button>
					<Button variant="ghost" size="sm" on:click={handleClose} title="Cerrar (Esc)">
						✕
					</Button>
				</div>
			</div>

			<!-- File Preview -->
			<div class="flex-1 overflow-auto p-4 bg-muted/30">
				{#if canPreview}
					<div class="h-full flex items-center justify-center">
						{#if isImage}
							<!-- Image Preview -->
							<img
								src={fileUrl}
								alt={file.original_name}
								class="max-w-full max-h-full object-contain rounded"
							/>
						{:else if isPDF}
							<!-- PDF Preview -->
							<iframe
								src={fileUrl}
								title={file.original_name}
								class="w-full h-full min-h-[600px] rounded border border-border"
							></iframe>
						{/if}
					</div>
				{:else}
					<!-- Cannot Preview -->
					<div class="h-full flex flex-col items-center justify-center text-center p-8">
						<div class="text-6xl mb-4">
							{fileService.getFileIcon(file.extension)}
						</div>
						<p class="text-lg text-secondary mb-2">
							No se puede previsualizar este tipo de archivo
						</p>
						<p class="text-sm text-muted mb-6">
							{file.mime_type}
						</p>
						<Button variant="primary" on:click={handleDownload} loading={downloading}>
							⬇️ Descargar archivo
						</Button>
					</div>
				{/if}
			</div>

			<!-- Footer with File Info -->
			<div class="p-4 border-t border-border bg-muted/50">
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span class="text-muted">Bucket:</span>
						<span class="ml-2 text-secondary">{file.bucket_name}</span>
					</div>
					{#if file.created_by_user}
						<div>
							<span class="text-muted">Subido por:</span>
							<span class="ml-2 text-secondary">{file.created_by_user.name}</span>
						</div>
					{/if}
					<div>
						<span class="text-muted">Fecha:</span>
						<span class="ml-2 text-secondary">
							{new Date(file.created_at).toLocaleDateString('es-ES', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</span>
					</div>
					<div>
						<span class="text-muted">Hash:</span>
						<span class="ml-2 text-secondary font-mono text-xs truncate block">
							{file.hash.substring(0, 16)}...
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.file-viewer-modal {
		animation: fadeIn 0.2s ease-out;
	}

	.file-viewer-content {
		animation: slideUp 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
