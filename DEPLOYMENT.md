# 📋 Guía de Despliegue - InverX Frontend

## ✅ Lista de Verificación Pre-Despliegue

### 1. Preparación del Código
- [x] Build de producción funciona correctamente
- [x] Variables de entorno configuradas
- [x] SPA routing configurado (_redirects y vercel.json)
- [x] Archivos de configuración creados

### 2. Archivos Importantes Creados
- `.env.example` - Plantilla de variables de entorno
- `.env.production` - Variables para producción
- `vercel.json` - Configuración de Vercel
- `public/_redirects` - Configuración para SPA routing

## 🚀 Proceso de Despliegue en Vercel

### Paso 1: Subir a GitHub
```bash
git add .
git commit -m "feat: configuración completa para despliegue en Vercel"
git push origin main
```

### Paso 2: Configurar Vercel
1. **Crear cuenta en Vercel**: https://vercel.com
2. **Conectar GitHub**: Autorizar acceso a tus repositorios
3. **Importar proyecto**: Seleccionar `inverx-frontend`
4. **Configuración automática**: Vercel detectará React automáticamente

### Paso 3: Variables de Entorno en Vercel
En el dashboard de Vercel > Settings > Environment Variables:

| Variable | Valor | Entorno |
|----------|-------|----------|
| `REACT_APP_API_BASE_URL` | `https://tu-backend.com/api` | Production |
| `REACT_APP_API_TIMEOUT` | `15000` | Production |

**⚠️ CRÍTICO**: Reemplaza `https://tu-backend.com/api` con la URL real de tu API.

### Paso 4: Desplegar
1. Click en "Deploy"
2. Esperar el build (2-3 minutos)
3. Obtener URL de producción

## 🔧 Configuraciones Técnicas

### Build Settings (Automático)
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Routing Configuration
- **SPA Routing**: Configurado en `vercel.json`
- **Fallback**: Todas las rutas redirigen a `index.html`
- **Assets**: Servidos desde `/static/`

## 🌐 URLs y Dominios

### URLs Automáticas
- **Producción**: `https://inverx-frontend.vercel.app`
- **Preview**: `https://inverx-frontend-git-main.vercel.app`
- **Branches**: `https://inverx-frontend-git-[branch].vercel.app`

### Dominio Personalizado (Opcional)
1. En Vercel Dashboard > Settings > Domains
2. Agregar dominio personalizado
3. Configurar DNS según instrucciones

## 🔍 Verificación Post-Despliegue

### Checklist de Funcionalidad
- [ ] Página de login carga correctamente
- [ ] Navegación entre rutas funciona
- [ ] API calls funcionan (verificar Network tab)
- [ ] Autenticación funciona
- [ ] Dashboard carga datos
- [ ] Rutas protegidas funcionan
- [ ] Botón atrás/adelante del navegador funciona

### Debugging Común

#### Error: "API calls failing"
**Solución**: Verificar `REACT_APP_API_BASE_URL` en Vercel

#### Error: "404 en rutas directas"
**Solución**: Verificar que `vercel.json` esté configurado correctamente

#### Error: "CORS issues"
**Solución**: Configurar CORS en el backend para permitir el dominio de Vercel

## 📊 Monitoreo

### Analytics de Vercel
- **Performance**: Métricas de carga
- **Usage**: Requests y bandwidth
- **Errors**: Logs de errores

### Logs de Despliegue
- Accesibles en Vercel Dashboard > Functions
- Útiles para debugging de build errors

## 🔄 Actualizaciones

### Despliegue Automático
- Cada push a `main` despliega automáticamente
- Preview deployments para otras branches
- Rollback disponible en dashboard

### Despliegue Manual
```bash
# Desde CLI de Vercel
npx vercel --prod
```

## 🆘 Soporte

### Recursos
- [Documentación Vercel](https://vercel.com/docs)
- [Guía React SPA](https://vercel.com/guides/deploying-react-with-vercel)
- [Variables de Entorno](https://vercel.com/docs/concepts/projects/environment-variables)

### Contacto
Si necesitas ayuda específica con el despliegue, revisa:
1. Logs en Vercel Dashboard
2. Network tab en DevTools
3. Console errors en el navegador

---

**Estado**: ✅ Listo para despliegue
**Última actualización**: $(date)