# Configuración de Búsqueda de Imágenes con Unsplash

## ¿Qué es esto?

Este proyecto ahora incluye funcionalidad de búsqueda de imágenes reales usando la API oficial de Unsplash. Esto permite que el sistema busque automáticamente imágenes relevantes para cada proyecto basándose en su nombre, en lugar de usar solo imágenes SVG generadas.

## ¿Por qué Unsplash?

- **Gratuito**: 50 solicitudes por hora sin costo
- **Calidad**: Imágenes de alta calidad de fotógrafos profesionales
- **Variedad**: Millones de imágenes disponibles
- **API robusta**: Búsqueda precisa y resultados relevantes
- **Sin problemas CORS**: API oficial sin restricciones de navegador

## Configuración

### 1. Obtener API Key de Unsplash

1. Ve a [Unsplash Developers](https://unsplash.com/developers)
2. Crea una cuenta o inicia sesión
3. Crea una nueva aplicación
4. Copia tu "Access Key"

### 2. Configurar la aplicación

1. Copia el archivo `.env.example` como `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` y agrega tu API key:
   ```
   REACT_APP_UNSPLASH_ACCESS_KEY=tu_access_key_aqui
   ```

3. Reinicia el servidor de desarrollo

## Cómo funciona

El sistema tiene una jerarquía de búsqueda de imágenes:

1. **Primera opción**: Busca imágenes reales en Unsplash basándose en el nombre del proyecto
2. **Segunda opción**: Si Unsplash no está disponible, intenta extraer imágenes de la URL del proyecto
3. **Tercera opción**: Si todo falla, genera imágenes SVG temáticas

## Características de la búsqueda

- **Búsqueda inteligente**: Usa el nombre del proyecto como término de búsqueda
- **Imágenes variadas**: Genera múltiples URLs con diferentes dimensiones
- **Carga rápida**: Imágenes optimizadas automáticamente por Unsplash
- **Fallback automático**: Si Unsplash no está disponible, usa imágenes SVG
- **Sin configuración**: Funciona inmediatamente sin setup

## Ejemplos de búsqueda

Para un proyecto llamado "King Abdullah Financial District":
- La API de Unsplash buscará imágenes relacionadas con arquitectura, edificios financieros, etc.
- Se obtendrán hasta 3 imágenes reales con metadatos completos
- Cada imagen incluye información del fotógrafo y enlaces de atribución

## Solución de problemas

### La aplicación sigue usando imágenes SVG
- **Verifica tu API key**: Asegúrate de que `REACT_APP_UNSPLASH_ACCESS_KEY` esté configurada correctamente
- **Reinicia el servidor**: Después de agregar la API key, reinicia `npm start`
- **Revisa la consola**: Busca mensajes de error en las herramientas de desarrollador
- **Límite de API**: Si has excedido las 50 solicitudes por hora, espera o actualiza tu plan

### Error CORS o ERR_BLOCKED_BY_ORB
- Esto se resuelve usando la API oficial en lugar de Unsplash Source
- La API oficial no tiene problemas CORS

### Imágenes no relacionadas
- La API de Unsplash devuelve resultados más precisos que Unsplash Source
- Si no encuentra imágenes relevantes, automáticamente usa imágenes SVG como fallback
- Para proyectos con nombres muy específicos, puede devolver imágenes más generales
- Esto es normal y proporciona variedad visual

### Carga lenta de imágenes
- Las imágenes se cargan desde los servidores de Unsplash
- La velocidad depende de tu conexión a internet
- Las imágenes se cachean automáticamente en el navegador

## Ventajas sobre otras APIs

- **Sin registro**: No necesitas crear cuentas o obtener API keys
- **Sin límites**: No hay restricciones de uso mensual
- **Sin costos**: Completamente gratuito para siempre
- **Mantenimiento**: Sin preocupaciones por keys expiradas o límites excedidos

## Sin conexión a internet

La aplicación funciona perfectamente sin conexión:
- Generará imágenes SVG únicas y atractivas para cada proyecto
- Los colores y iconos se adaptan temáticamente al nombre del proyecto
- Carga instantánea sin dependencias externas
- Sin costos ni configuración requerida