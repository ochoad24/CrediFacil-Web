#!/bin/bash

# Script para buildear la imagen Docker del frontend con las variables correctas
# Uso: ./docker-build.sh [tag]

set -e  # Exit on error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Tag de la imagen (default: latest)
TAG="${1:-latest}"
IMAGE_NAME="web-kredix:$TAG"

echo -e "${BLUE}🐳 Docker Build Script - CrediFacil Frontend${NC}"
echo ""

# Verificar si existe .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado${NC}"
    echo "Copiando .env.example a .env..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Por favor edita el archivo .env con tus valores y ejecuta el script nuevamente${NC}"
    exit 1
fi

# Cargar variables del .env
echo -e "${BLUE}📋 Cargando variables de entorno desde .env...${NC}"
export $(grep -v '^#' .env | xargs)

# Verificar que las variables requeridas estén definidas
REQUIRED_VARS=("VITE_API_URL" "PUBLIC_NAME_COMPANY" "VITE_RECAPTCHA_SITE_KEY")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Error: Faltan las siguientes variables en .env:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "${RED}   - $var${NC}"
    done
    echo ""
    echo "Por favor edita tu archivo .env y agrega estas variables."
    exit 1
fi

# Mostrar configuración
echo ""
echo -e "${GREEN}✅ Variables cargadas correctamente:${NC}"
echo -e "   VITE_API_URL: ${BLUE}$VITE_API_URL${NC}"
echo -e "   PUBLIC_NAME_COMPANY: ${BLUE}$PUBLIC_NAME_COMPANY${NC}"
echo -e "   VITE_RECAPTCHA_SITE_KEY: ${BLUE}${VITE_RECAPTCHA_SITE_KEY:0:20}...${NC}"
echo ""

# Confirmar antes de buildear
echo -e "${YELLOW}🏗️  Se buildeará la imagen: ${IMAGE_NAME}${NC}"
read -p "¿Continuar? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Build cancelado${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🏗️  Iniciando build de Docker...${NC}"
echo ""

# Buildear la imagen con las variables de entorno
docker build \
  --build-arg VITE_API_URL="$VITE_API_URL" \
  --build-arg PUBLIC_NAME_COMPANY="$PUBLIC_NAME_COMPANY" \
  --build-arg VITE_RECAPTCHA_SITE_KEY="$VITE_RECAPTCHA_SITE_KEY" \
  -t "$IMAGE_NAME" \
  .

# Verificar si el build fue exitoso
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Build completado exitosamente!${NC}"
    echo ""
    echo -e "${BLUE}📦 Imagen creada: ${IMAGE_NAME}${NC}"
    echo ""
    echo -e "${YELLOW}Para ejecutar el contenedor:${NC}"
    echo -e "   docker run -d -p 3000:3000 --name web-kredix $IMAGE_NAME"
    echo ""
    echo -e "${YELLOW}Para ver los logs:${NC}"
    echo -e "   docker logs -f web-kredix"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Error durante el build${NC}"
    exit 1
fi
