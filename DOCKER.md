# Docker Build Guide - Frontend

Este documento explica cómo construir y ejecutar la aplicación frontend con Docker.

## Variables de Entorno Requeridas

El frontend de SvelteKit requiere las siguientes variables de entorno **durante el build**:

### Variables Públicas (disponibles en el cliente)
- `PUBLIC_NAME_COMPANY`: Nombre de la compañía (ej. "BigBank")
- `VITE_API_URL`: URL del backend API (ej. "https://api.credifacil.xyz/api")
- `VITE_RECAPTCHA_SITE_KEY`: Site key de Google reCAPTCHA

### Variables de Runtime
- `PORT`: Puerto donde correrá el servidor (default: 3000)
- `HOST`: Host para bind (default: 0.0.0.0)

## Build con Docker

### Opción 1: Usando docker build con --build-arg

```bash
docker build \
  --build-arg VITE_API_URL=https://api.credifacil.xyz/api \
  --build-arg PUBLIC_NAME_COMPANY=BigBank \
  --build-arg VITE_RECAPTCHA_SITE_KEY=6Lc7FeErAAAAAK_-OBH4Ida-mjVsX9B6BbGom8VH \
  -t web-kredix:latest \
  .
```

### Opción 2: Usando docker-compose

Crea un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${VITE_API_URL:-https://api.credifacil.xyz/api}
        PUBLIC_NAME_COMPANY: ${PUBLIC_NAME_COMPANY:-BigBank}
        VITE_RECAPTCHA_SITE_KEY: ${VITE_RECAPTCHA_SITE_KEY}
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - HOST=0.0.0.0
      - NODE_ENV=production
    restart: unless-stopped
```

Luego ejecuta:

```bash
# Asegúrate de tener las variables en tu .env o exportadas
docker-compose up -d
```

### Opción 3: Usando .env automáticamente

Si tienes un archivo `.env` configurado, puedes usar este comando:

```bash
# Exportar variables del .env
export $(grep -v '^#' .env | xargs)

# Build con las variables exportadas
docker build \
  --build-arg VITE_API_URL=$VITE_API_URL \
  --build-arg PUBLIC_NAME_COMPANY=$PUBLIC_NAME_COMPANY \
  --build-arg VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY \
  -t web-kredix:latest \
  .
```

## Ejecutar el Contenedor

Después de buildear la imagen:

```bash
docker run -d \
  -p 3000:3000 \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  --name web-kredix \
  web-kredix:latest
```

## Ejemplo Completo: Desarrollo Local con Docker

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-org/CrediFacil.git
cd CrediFacil/web-kredix

# 2. Copiar .env.example a .env y configurar
cp .env.example .env
nano .env  # Editar con tus valores

# 3. Exportar variables
export $(grep -v '^#' .env | xargs)

# 4. Build de la imagen
docker build \
  --build-arg VITE_API_URL=$VITE_API_URL \
  --build-arg PUBLIC_NAME_COMPANY=$PUBLIC_NAME_COMPANY \
  --build-arg VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY \
  -t web-kredix:dev \
  .

# 5. Ejecutar contenedor
docker run -d \
  -p 3000:3000 \
  -e PORT=3000 \
  --name web-kredix-dev \
  web-kredix:dev

# 6. Ver logs
docker logs -f web-kredix-dev
```

## Docker Compose Completo (con Backend)

Ejemplo de `docker-compose.yml` para levantar frontend + backend:

```yaml
version: '3.8'

services:
  # Backend API
  api:
    build:
      context: ../api-kredix
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=postgres
      - DB_PASSWORD=postgres
      - DB_NAME=kredix_db
      - DB_FRESH_DB=true
    depends_on:
      - postgres
    networks:
      - kredix-network

  # Frontend Web
  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_API_URL: http://localhost:8080/api
        PUBLIC_NAME_COMPANY: BigBank
        VITE_RECAPTCHA_SITE_KEY: 6Lc7FeErAAAAAK_-OBH4Ida-mjVsX9B6BbGom8VH
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - HOST=0.0.0.0
    depends_on:
      - api
    networks:
      - kredix-network

  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: kredix_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - kredix-network

volumes:
  postgres_data:

networks:
  kredix-network:
    driver: bridge
```

## Troubleshooting

### Error: "PUBLIC_NAME_COMPANY is not exported"

**Causa**: La variable `PUBLIC_NAME_COMPANY` no se pasó durante el build.

**Solución**: Asegúrate de pasar todas las variables con `--build-arg`:

```bash
docker build \
  --build-arg PUBLIC_NAME_COMPANY=BigBank \
  --build-arg VITE_API_URL=https://api.credifacil.xyz/api \
  --build-arg VITE_RECAPTCHA_SITE_KEY=your_key \
  -t web-kredix .
```

### Error: Build falla con "Cannot find module"

**Causa**: Dependencias no instaladas correctamente.

**Solución**: Limpia cache de Docker y rebuilldea:

```bash
docker build --no-cache -t web-kredix .
```

### La aplicación no conecta con el backend

**Causa**: `VITE_API_URL` apunta a localhost dentro del contenedor.

**Solución**:
- En desarrollo con Docker Compose, usa el nombre del servicio: `http://api:8080/api`
- En producción, usa la URL pública: `https://api.credifacil.xyz/api`

## CI/CD

### GitHub Actions Example

```yaml
name: Build and Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          docker build \
            --build-arg VITE_API_URL=${{ secrets.VITE_API_URL }} \
            --build-arg PUBLIC_NAME_COMPANY=BigBank \
            --build-arg VITE_RECAPTCHA_SITE_KEY=${{ secrets.RECAPTCHA_SITE_KEY }} \
            -t ${{ secrets.DOCKER_REGISTRY }}/web-kredix:latest \
            .

      - name: Push to registry
        run: docker push ${{ secrets.DOCKER_REGISTRY }}/web-kredix:latest
```

## Producción

Para producción, considera:

1. **Usar valores específicos de producción** en las variables
2. **No incluir el archivo .env** en la imagen (ya se compila en el build)
3. **Usar HTTPS** para el API_URL
4. **Configurar reverse proxy** (nginx, Caddy) delante del contenedor
5. **Health checks** en Docker/Kubernetes

Ejemplo con Caddy como reverse proxy:

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      args:
        VITE_API_URL: https://api.credifacil.xyz/api
        PUBLIC_NAME_COMPANY: CrediFacil
        VITE_RECAPTCHA_SITE_KEY: ${RECAPTCHA_SITE_KEY}
    expose:
      - 3000
    restart: always

  caddy:
    image: caddy:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - web
    restart: always

volumes:
  caddy_data:
  caddy_config:
```

## Ver También

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Docker Documentation](https://docs.docker.com)
- [Proyecto README](../README.md)
