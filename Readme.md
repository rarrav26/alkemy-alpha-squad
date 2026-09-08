# DigitalArs - Billetera Virtual

Repositorio monorepo para el desarrollo de la solución integral DigitalArs.

## Estructura del Repositorio

- **backend/**: API REST en ASP.NET Core 10 con Entity Framework Core.
- **frontend/**: Aplicación web en React con Material UI.
- **database/**: Scripts de base de datos SQL Server y modelos de datos.
- **docs/**: Documentación técnica y especificaciones.

## Instrucciones de Setup

### Requisitos Previos
- .NET 10 SDK
- Node.js (v18+) y npm
- SQL Server

### Inicialización del Backend
1. Ir a la carpeta del backend:
   cd backend
2. Restaurar dependencias:
   dotnet restore
3. Ejecutar la API:
   dotnet run

### Inicialización del Frontend
1. Ir a la carpeta del frontend:
   cd frontend
2. Instalar dependencias:
   npm install
3. Iniciar el servidor de desarrollo:
   npm run dev