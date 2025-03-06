#!/bin/bash

# Eliminar package-lock.json para forzar npm install
rm -f package-lock.json

# Instalar dependencias con --no-package-lock para evitar generar un nuevo package-lock.json
npm install --no-package-lock

# Ejecutar el build
npm run build
