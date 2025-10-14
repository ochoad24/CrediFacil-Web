# Componentes de Gestión de Archivos

Sistema completo de componentes para la carga, visualización y gestión de archivos en SvelteKit, integrado con el backend de almacenamiento S3.

## 📦 Componentes Disponibles

- **FileUploader**: Componente para cargar archivos (simple o múltiple)
- **FileList**: Lista de archivos con paginación, búsqueda y ordenamiento
- **FileItem**: Representación individual de un archivo
- **FileViewer**: Modal para visualizar archivos (imágenes y PDFs)

## 🚀 Instalación y Uso

### 1. Importar Componentes

```typescript
import { FileUploader, FileList, FileItem, FileViewer } from '$lib/components/ui';
import { fileService } from '$lib/services';
```

### 2. FileUploader - Subir Archivos

#### Ejemplo Básico (Un solo archivo)

```svelte
<script lang="ts">
  import { FileUploader } from '$lib/components/ui';
  import type { File } from '$lib/types/file';

  let uploadedFiles: File[] = [];

  const handleSuccess = (files: File[]) => {
    uploadedFiles = [...uploadedFiles, ...files];
    alert('Archivo subido exitosamente!');
  };

  const handleError = (error: string) => {
    alert(`Error: ${error}`);
  };
</script>

<FileUploader
  bucketName="client-documents"
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

#### Ejemplo Avanzado (Múltiples archivos con validación)

```svelte
<script lang="ts">
  import { FileUploader } from '$lib/components/ui';

  const handleSuccess = (files) => {
    console.log('Archivos subidos:', files);
  };
</script>

<FileUploader
  bucketName="loan-documents"
  multiple={true}
  accept="image/*,.pdf"
  maxSizeMB={15}
  onSuccess={handleSuccess}
  onError={(err) => console.error(err)}
/>
```

**Props de FileUploader:**
- `bucketName` (string, requerido): Nombre del bucket de S3
- `multiple` (boolean, default: false): Permite seleccionar múltiples archivos
- `accept` (string, default: "*/*"): Tipos de archivos aceptados
- `maxSizeMB` (number, default: 10): Tamaño máximo en MB
- `disabled` (boolean, default: false): Deshabilita el componente
- `className` (string): Clases CSS adicionales
- `onSuccess` (function): Callback cuando la carga es exitosa
- `onError` (function): Callback cuando hay un error

### 3. FileList - Listar Archivos con Paginación

#### Ejemplo Básico

```svelte
<script lang="ts">
  import { FileList } from '$lib/components/ui';
</script>

<FileList />
```

#### Ejemplo con Filtro por Bucket

```svelte
<FileList bucketName="client-documents" />
```

#### Ejemplo con Eliminación Personalizada

```svelte
<script lang="ts">
  import { FileList } from '$lib/components/ui';
  import type { File } from '$lib/types/file';

  const handleDelete = async (file: File) => {
    // Lógica personalizada antes de eliminar
    console.log('Eliminando archivo:', file.id);

    // Llamar al servicio
    await fileService.deleteFile(file.id);

    // Actualizar UI o estado
    console.log('Archivo eliminado exitosamente');
  };
</script>

<FileList
  bucketName="client-documents"
  showSearch={true}
  showPagination={true}
  initialLimit={15}
  onDelete={handleDelete}
/>
```

**Props de FileList:**
- `bucketName` (string | null): Filtrar archivos por bucket específico
- `showSearch` (boolean, default: true): Mostrar barra de búsqueda
- `showPagination` (boolean, default: true): Mostrar paginación
- `initialLimit` (number, default: 10): Archivos por página
- `onDelete` (function | null): Callback personalizado para eliminación
- `className` (string): Clases CSS adicionales

### 4. FileItem - Item Individual de Archivo

```svelte
<script lang="ts">
  import { FileItem, FileViewer } from '$lib/components/ui';
  import type { File } from '$lib/types/file';

  let file: File = {
    id: 'abc123',
    original_name: 'documento.pdf',
    // ... resto de propiedades
  };

  let viewerOpen = false;
  let selectedFile: File | null = null;

  const handleView = (file: File) => {
    selectedFile = file;
    viewerOpen = true;
  };

  const handleDelete = async (file: File) => {
    if (confirm(`¿Eliminar ${file.original_name}?`)) {
      await fileService.deleteFile(file.id);
    }
  };
</script>

<FileItem
  {file}
  showActions={true}
  onView={handleView}
  onDelete={handleDelete}
/>

<FileViewer
  file={selectedFile}
  open={viewerOpen}
  onClose={() => viewerOpen = false}
/>
```

**Props de FileItem:**
- `file` (File, requerido): Objeto de archivo a mostrar
- `showActions` (boolean, default: true): Mostrar botones de acción
- `onView` (function | null): Callback al hacer clic en "Ver"
- `onDownload` (function | null): Callback personalizado para descarga
- `onDelete` (function | null): Callback al hacer clic en "Eliminar"
- `className` (string): Clases CSS adicionales

### 5. FileViewer - Modal de Visualización

```svelte
<script lang="ts">
  import { FileViewer } from '$lib/components/ui';
  import type { File } from '$lib/types/file';

  let viewerOpen = false;
  let selectedFile: File | null = null;

  const openViewer = (file: File) => {
    selectedFile = file;
    viewerOpen = true;
  };
</script>

<button on:click={() => openViewer(someFile)}>
  Ver Archivo
</button>

<FileViewer
  file={selectedFile}
  open={viewerOpen}
  onClose={() => {
    viewerOpen = false;
    selectedFile = null;
  }}
/>
```

**Props de FileViewer:**
- `file` (File | null, requerido): Archivo a visualizar
- `open` (boolean, requerido): Estado del modal
- `onClose` (function): Callback al cerrar el modal

**Características:**
- ✅ Visualiza imágenes en tamaño completo
- ✅ Visualiza PDFs con iframe nativo del navegador
- ✅ Opción de descarga integrada
- ✅ Cierre con tecla ESC
- ✅ Información detallada del archivo
- ✅ Diseño responsivo

## 🎯 Casos de Uso Completos

### Caso 1: Formulario de Cliente con DPI

```svelte
<script lang="ts">
  import { FileUploader } from '$lib/components/ui';
  import type { File } from '$lib/types/file';

  let clientData = {
    name: '',
    phone: '',
    dpi_file_id: ''
  };

  let uploadedDPI: File | null = null;

  const handleDPIUpload = (files: File[]) => {
    uploadedDPI = files[0];
    clientData.dpi_file_id = files[0].id;
  };

  const submitForm = async () => {
    // Crear cliente con referencia al archivo
    const response = await fetch('/api/clients', {
      method: 'POST',
      body: JSON.stringify(clientData)
    });
  };
</script>

<form on:submit|preventDefault={submitForm}>
  <input bind:value={clientData.name} placeholder="Nombre" />
  <input bind:value={clientData.phone} placeholder="Teléfono" />

  <label>DPI del Cliente</label>
  <FileUploader
    bucketName="client-documents"
    accept="image/*,.pdf"
    maxSizeMB={5}
    onSuccess={handleDPIUpload}
  />

  {#if uploadedDPI}
    <p class="text-green-600">
      ✓ DPI subido: {uploadedDPI.original_name}
    </p>
  {/if}

  <button type="submit">Crear Cliente</button>
</form>
```

### Caso 2: Galería de Documentos de Préstamo

```svelte
<script lang="ts">
  import { FileUploader, FileList } from '$lib/components/ui';

  export let loanId: string;

  let refreshList = 0;

  const handleUploadSuccess = () => {
    // Refrescar la lista cuando se sube un archivo nuevo
    refreshList++;
  };
</script>

<div class="loan-documents">
  <h2>Documentos del Préstamo</h2>

  <div class="mb-6">
    <FileUploader
      bucketName="loan-documents"
      multiple={true}
      accept=".pdf,.jpg,.jpeg,.png"
      maxSizeMB={20}
      onSuccess={handleUploadSuccess}
    />
  </div>

  <FileList
    bucketName="loan-documents"
    initialLimit={20}
    key={refreshList}
  />
</div>
```

### Caso 3: Selector de Foto de Perfil

```svelte
<script lang="ts">
  import { FileUploader, FileItem } from '$lib/components/ui';
  import type { File } from '$lib/types/file';

  let profilePicture: File | null = null;

  const handleUpload = (files: File[]) => {
    profilePicture = files[0];
  };
</script>

<div class="profile-picture-uploader">
  <h3>Foto de Perfil</h3>

  {#if profilePicture}
    <FileItem
      file={profilePicture}
      showActions={false}
    />
  {:else}
    <FileUploader
      bucketName="profile-pictures"
      accept="image/*"
      maxSizeMB={2}
      onSuccess={handleUpload}
    />
  {/if}
</div>
```

## 🔧 Servicios Disponibles

### fileService

```typescript
import { fileService } from '$lib/services';

// Subir archivo
const response = await fileService.uploadFile(file, 'bucket-name');

// Obtener lista de archivos
const files = await fileService.getAllFiles({
  page: 1,
  limit: 10,
  search: 'documento',
  sort_by: 'created_at',
  sort_direction: 'desc'
});

// Obtener archivo por ID
const file = await fileService.getFileById('file-id');

// Actualizar archivo
await fileService.updateFile('file-id', {
  file: newFile,
  file_name: 'nuevo-nombre.pdf'
});

// Eliminar archivo
await fileService.deleteFile('file-id');

// Descargar archivo
await fileService.downloadFile('file-id', 'nombre-archivo.pdf');

// Obtener URL de preview
const url = fileService.getFilePreviewUrl('file-id');

// Utilidades
const size = fileService.formatFileSize(1024000); // "1 MB"
const icon = fileService.getFileIcon('pdf'); // "📄"
const isImage = fileService.isImage('image/jpeg'); // true
const canPreview = fileService.canPreview('application/pdf'); // true
```

## 📝 Tipos TypeScript

```typescript
import type {
  File,
  FileUploadRequest,
  FileUpdateRequest,
  FileListParams,
  FileListResponse,
  FilePagination
} from '$lib/types/file';
```

## 🎨 Personalización con Tailwind

Todos los componentes aceptan la prop `className` para personalización:

```svelte
<FileUploader
  bucketName="documents"
  className="mt-4 p-6 bg-gray-50 rounded-lg"
/>

<FileList
  className="shadow-lg border border-gray-200"
/>
```

## 🔒 Seguridad

- ✅ Validación de tamaño de archivo en el cliente
- ✅ Autenticación vía JWT (cookies)
- ✅ Cifrado AES-256-GCM en el servidor
- ✅ Soft delete de archivos
- ✅ Auditoría completa (created_by, updated_by)

## 📋 Buckets Recomendados

- `client-documents`: Documentos de clientes (DPI, licencias)
- `loan-documents`: Documentos de préstamos (contratos, garantías)
- `profile-pictures`: Fotos de perfil
- `company-documents`: Documentos de la empresa
- `temporary`: Archivos temporales

## 🐛 Troubleshooting

### Error: "file size exceeds maximum allowed size"
- Aumenta el prop `maxSizeMB` en el componente FileUploader
- Verifica la configuración `FILE_MAX_SIZE_MB` en el backend

### Las imágenes no se muestran
- Verifica que el backend esté corriendo
- Revisa las credenciales de S3/MinIO en `.env`
- Confirma que el bucket existe

### Los PDFs no se visualizan
- Algunos navegadores requieren plugins adicionales
- El usuario puede descargar el archivo como alternativa

## 📖 Más Información

Para más detalles sobre el backend, consulta:
- `/api-kredix/FILE_STORAGE_README.md`
