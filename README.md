# InverX Frontend

Plataforma de inversiones inteligentes - Frontend desarrollado en React.

## 🚀 Despliegue en Vercel

### Prerrequisitos
1. Cuenta en [GitHub](https://github.com)
2. Cuenta en [Vercel](https://vercel.com)
3. Repositorio del proyecto subido a GitHub

### Pasos para el Despliegue

#### 1. Preparar el Repositorio
```bash
# Asegúrate de que todos los cambios estén commitados
git add .
git commit -m "Preparar para despliegue en Vercel"
git push origin main
```

#### 2. Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en "New Project"
3. Selecciona tu repositorio `inverx-frontend`
4. Vercel detectará automáticamente que es un proyecto React

#### 3. Configurar Variables de Entorno
En el dashboard de Vercel, ve a Settings > Environment Variables y agrega:

```
REACT_APP_API_BASE_URL=https://tu-api-backend.com/api
REACT_APP_API_TIMEOUT=15000
```

**⚠️ IMPORTANTE**: Reemplaza `https://tu-api-backend.com/api` con la URL real de tu API backend.

#### 4. Desplegar
1. Haz clic en "Deploy"
2. Vercel construirá y desplegará automáticamente tu aplicación
3. Recibirás una URL como: `https://inverx-frontend.vercel.app`

## 🛠️ Desarrollo Local

### Instalación
```bash
npm install
```

### Variables de Entorno
Copia el archivo de ejemplo y configura tus variables:
```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones locales:
```
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=10000
```

### Ejecutar en Desarrollo
```bash
npm start
```

### Construir para Producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas principales
├── hooks/              # Custom hooks
├── utils/              # Utilidades y configuraciones
├── context/            # Context providers
└── App.js              # Componente principal
```

## 🔧 Configuración

### Variables de Entorno Disponibles
- `REACT_APP_API_BASE_URL`: URL base de la API backend
- `REACT_APP_API_TIMEOUT`: Timeout para peticiones HTTP (ms)

### Archivos de Configuración
- `.env`: Variables para desarrollo local
- `.env.production`: Variables para producción
- `vercel.json`: Configuración específica para Vercel
- `public/_redirects`: Configuración para SPA routing

## 🚨 Notas Importantes

1. **CORS**: Asegúrate de que tu API backend permita requests desde el dominio de Vercel
2. **Variables de Entorno**: Nunca commitees archivos `.env` con datos sensibles
3. **API URL**: Actualiza `REACT_APP_API_BASE_URL` en Vercel con la URL real de tu backend
4. **SSL**: Vercel proporciona HTTPS automáticamente

## 📞 Soporte

Si tienes problemas con el despliegue:
1. Revisa los logs en el dashboard de Vercel
2. Verifica que las variables de entorno estén configuradas correctamente
3. Asegúrate de que la API backend esté accesible desde internet

---

**Desarrollado con ❤️ para InverX**
