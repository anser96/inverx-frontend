// Servicio para extraer imágenes de URLs

/**
 * Genera imágenes temáticas basadas en el nombre del proyecto
 * @param {string} url - URL del sitio web (opcional)
 * @param {string} projectName - Nombre del proyecto
 * @returns {Promise<string[]>} - Array de URLs de imágenes generadas
 */
export const extractImagesFromUrl = async (url, projectName = '') => {
  try {
    // Generar imágenes temáticas basadas en el nombre del proyecto
    const themedImages = generateThemedImages(projectName);
    return themedImages;
  } catch (error) {
    console.error('Error generating themed images:', error);
    return getDefaultImages();
  }
};

/**
 * Obtiene la imagen Open Graph de una URL
 * @param {string} url - URL del sitio web
 * @returns {Promise<string|null>} - URL de la imagen OG
 */
const getOpenGraphImage = async (url) => {
  try {
    // Usar un servicio CORS proxy para obtener metadatos
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (data.contents) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
      // Buscar meta tags de Open Graph
      const ogImage = doc.querySelector('meta[property="og:image"]');
      if (ogImage) {
        const imageUrl = ogImage.getAttribute('content');
        if (imageUrl && isValidImageUrl(imageUrl)) {
          return makeAbsoluteUrl(imageUrl, url);
        }
      }
      
      // Buscar meta tags de Twitter
      const twitterImage = doc.querySelector('meta[name="twitter:image"]');
      if (twitterImage) {
        const imageUrl = twitterImage.getAttribute('content');
        if (imageUrl && isValidImageUrl(imageUrl)) {
          return makeAbsoluteUrl(imageUrl, url);
        }
      }
      
      // Buscar favicon como último recurso
      const favicon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
      if (favicon) {
        const imageUrl = favicon.getAttribute('href');
        if (imageUrl) {
          return makeAbsoluteUrl(imageUrl, url);
        }
      }
    }
  } catch (error) {
    console.warn('Error getting Open Graph image:', error);
  }
  return null;
};

/**
 * Obtiene una captura de pantalla de la URL usando un servicio público
 * @param {string} url - URL del sitio web
 * @returns {Promise<string|null>} - URL de la captura de pantalla
 */
const getScreenshotImage = async (url) => {
  try {
    // Usar servicio de captura de pantalla gratuito
    const screenshotUrl = `https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(url)}&dimension=1024x768`;
    
    // Verificar que la imagen se carga correctamente
    const isValid = await validateImageUrl(screenshotUrl);
    if (isValid) {
      return screenshotUrl;
    }
  } catch (error) {
    console.warn('Error getting screenshot:', error);
  }
  return null;
};

/**
 * Obtiene imágenes relacionadas con el nombre del proyecto
 * @param {string} projectName - Nombre del proyecto
 * @returns {Promise<string[]>} - Array de URLs de imágenes
 */
const getProjectRelatedImages = async (projectName) => {
  try {
    // Usar imágenes temáticas generadas basadas en el nombre del proyecto
      return generateThemedImages(projectName);
  } catch (error) {
    console.warn('Error getting project related images:', error);
    return [];
  }
};

/**
 * Obtiene imágenes relacionadas con el dominio
 * @param {string} url - URL del sitio web
 * @returns {Promise<string[]>} - Array de URLs de imágenes
 */
const getDomainRelatedImages = async (url) => {
  try {
    const domain = new URL(url).hostname;
    // Generar imágenes temáticas basadas en el dominio
      return generateThemedImages(domain);
  } catch (error) {
    console.warn('Error getting domain related images:', error);
    return [];
  }
};

/**
 * Genera imágenes temáticas usando SVG y gradientes
 * @param {string} projectName - Nombre del proyecto
 * @returns {string[]} - Array de URLs de imágenes SVG generadas
 */
const generateThemedImages = (projectName) => {
  const projectType = detectProjectType(projectName);
  const colors = getProjectColors(projectName);
  const icons = getProjectIcons(projectType);
  
  const images = [];
  
  // Generar 3 variaciones de imágenes SVG
  for (let i = 0; i < 3; i++) {
    const svgImage = createSVGImage({
      icon: icons[i % icons.length],
      gradient: colors[i % colors.length],
      projectName: projectName,
      variant: i + 1
    });
    
    // Convertir SVG a data URL usando encodeURIComponent para evitar errores de codificación
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgImage)}`;
    images.push(dataUrl);
  }
  
  return images;
};





/**
 * Detecta el tipo de proyecto basado en el nombre
 * @param {string} projectName - Nombre del proyecto
 * @returns {string} - Tipo de proyecto detectado
 */
const detectProjectType = (projectName) => {
  const name = projectName.toLowerCase();
  
  if (name.includes('financial') || name.includes('bank') || name.includes('finance')) {
    return 'financial';
  }
  if (name.includes('real estate') || name.includes('property') || name.includes('building') || name.includes('tower')) {
    return 'real_estate';
  }
  if (name.includes('tech') || name.includes('digital') || name.includes('software') || name.includes('ai')) {
    return 'technology';
  }
  if (name.includes('energy') || name.includes('solar') || name.includes('renewable') || name.includes('green')) {
    return 'energy';
  }
  if (name.includes('health') || name.includes('medical') || name.includes('pharma') || name.includes('hospital')) {
    return 'healthcare';
  }
  if (name.includes('retail') || name.includes('shopping') || name.includes('mall') || name.includes('store')) {
    return 'retail';
  }
  
  return 'business'; // Default
};

/**
 * Obtiene colores temáticos para el proyecto
 * @param {string} projectName - Nombre del proyecto
 * @returns {Array} - Array de gradientes de colores
 */
const getProjectColors = (projectName) => {
  const projectType = detectProjectType(projectName);
  
  const colorSchemes = {
    financial: [
      ['#1e3a8a', '#3b82f6'], // Azul financiero
      ['#065f46', '#10b981'], // Verde dinero
      ['#7c2d12', '#ea580c']  // Naranja premium
    ],
    real_estate: [
      ['#374151', '#6b7280'], // Gris arquitectónico
      ['#92400e', '#d97706'], // Dorado construcción
      ['#1f2937', '#4b5563']  // Negro elegante
    ],
    technology: [
      ['#581c87', '#a855f7'], // Púrpura tech
      ['#1e40af', '#3b82f6'], // Azul digital
      ['#059669', '#10b981']  // Verde innovación
    ],
    energy: [
      ['#166534', '#22c55e'], // Verde energía
      ['#ca8a04', '#eab308'], // Amarillo solar
      ['#0369a1', '#0ea5e9']  // Azul sostenible
    ],
    healthcare: [
      ['#dc2626', '#ef4444'], // Rojo médico
      ['#0369a1', '#0ea5e9'], // Azul salud
      ['#059669', '#10b981']  // Verde bienestar
    ],
    retail: [
      ['#be185d', '#ec4899'], // Rosa comercial
      ['#7c2d12', '#ea580c'], // Naranja retail
      ['#581c87', '#a855f7']  // Púrpura lujo
    ],
    business: [
      ['#1f2937', '#374151'], // Gris corporativo
      ['#1e40af', '#3b82f6'], // Azul negocio
      ['#059669', '#10b981']  // Verde crecimiento
    ]
  };
  
  return colorSchemes[projectType] || colorSchemes.business;
};

/**
 * Obtiene iconos SVG para el tipo de proyecto
 * @param {string} projectType - Tipo de proyecto
 * @returns {Array} - Array de iconos SVG
 */
const getProjectIcons = (projectType) => {
  const icons = {
    financial: [
      '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
      '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11l-3-3-3 3"/>',
      '<path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/><path d="M9 12l2 2 4-4"/>'
    ],
    real_estate: [
      '<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M13 9v.01M13 12v.01M13 15v.01"/>',
      '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
      '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>'
    ],
    technology: [
      '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
      '<path d="M12.5 2C9.5 2 7 4.5 7 7.5c0 5.25 3.5 7.5 5.5 7.5s5.5-2.25 5.5-7.5C18 4.5 15.5 2 12.5 2z"/><path d="M8.5 8.5L16 16M16.5 8.5L8 16"/>',
      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>'
    ],
    energy: [
      '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
      '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
      '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>'
    ],
    healthcare: [
      '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      '<path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>',
      '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>'
    ],
    retail: [
      '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
      '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
      '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'
    ],
    business: [
      '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
      '<polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>',
      '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'
    ]
  };
  
  return icons[projectType] || icons.business;
};

/**
 * Crea una imagen SVG personalizada
 * @param {Object} options - Opciones para generar el SVG
 * @returns {string} - Código SVG
 */
const createSVGImage = ({ icon, gradient, projectName, variant }) => {
  const [color1, color2] = gradient;
  const gradientId = `gradient-${variant}`;
  
  // Truncar nombre del proyecto si es muy largo
  const displayName = projectName.length > 25 
    ? projectName.substring(0, 25) + '...' 
    : projectName;
  
  return `
    <svg width="400" height="250" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Fondo con gradiente -->
      <rect width="400" height="250" fill="url(#${gradientId})"/>
      
      <!-- Patrón de fondo sutil -->
      <defs>
        <pattern id="pattern-${variant}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/>
        </pattern>
      </defs>
      <rect width="400" height="250" fill="url(#pattern-${variant})"/>
      
      <!-- Icono principal -->
      <g transform="translate(200, 100)" filter="url(#shadow)">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${icon}
        </svg>
      </g>
      
      <!-- Texto del proyecto -->
      <text x="200" y="190" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold" filter="url(#shadow)">
        ${displayName}
      </text>
      
      <!-- Elementos decorativos -->
      <circle cx="50" cy="50" r="20" fill="rgba(255,255,255,0.1)"/>
      <circle cx="350" cy="200" r="15" fill="rgba(255,255,255,0.1)"/>
      <rect x="320" y="30" width="30" height="30" fill="rgba(255,255,255,0.1)" rx="5"/>
    </svg>
  `;
};

/**
 * Obtiene imágenes por defecto en caso de error
 * @returns {string[]} - Array de URLs de imágenes por defecto
 */
const getDefaultImages = () => {
  const defaultColors = [['#1f2937', '#374151'], ['#1e40af', '#3b82f6'], ['#059669', '#10b981']];
  const defaultIcon = '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>';
  
  return defaultColors.map((gradient, index) => {
    const svgImage = createSVGImage({
      icon: defaultIcon,
      gradient: gradient,
      projectName: 'Proyecto de Inversión',
      variant: index + 1
    });
    return `data:image/svg+xml;base64,${btoa(svgImage)}`;
  });
};

/**
 * Valida si una URL de imagen es válida y accesible
 * @param {string} imageUrl - URL de la imagen
 * @returns {Promise<boolean>} - True si la imagen es válida
 */
const validateImageUrl = (imageUrl) => {
  return new Promise((resolve) => {
    // Allow Unsplash URLs without validation since they're dynamic
    if (imageUrl && imageUrl.includes('source.unsplash.com')) {
      resolve(true);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
    
    // Timeout después de 5 segundos
    setTimeout(() => resolve(false), 5000);
  });
};

/**
 * Verifica si una URL parece ser una imagen válida
 * @param {string} url - URL a verificar
 * @returns {boolean} - True si parece ser una imagen
 */
const isValidImageUrl = (url) => {
  if (!url) return false;
  
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  const hasImageExtension = imageExtensions.test(url);
  const isDataUrl = url.startsWith('data:image/');
  const isHttpUrl = url.startsWith('http');
  const isUnsplashSourceUrl = url.includes('source.unsplash.com');
  const isUnsplashApiUrl = url.includes('images.unsplash.com');
  
  // Allow Unsplash URLs (both source and API), data URLs, or HTTP URLs with image extensions
  return isUnsplashSourceUrl || isUnsplashApiUrl || isDataUrl || (hasImageExtension && isHttpUrl);
};

/**
 * Convierte una URL relativa en absoluta
 * @param {string} imageUrl - URL de la imagen (puede ser relativa)
 * @param {string} baseUrl - URL base del sitio
 * @returns {string} - URL absoluta
 */
const makeAbsoluteUrl = (imageUrl, baseUrl) => {
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  try {
    return new URL(imageUrl, baseUrl).href;
  } catch (error) {
    return imageUrl;
  }
};

/**
 * Filtra y valida un array de URLs de imágenes
 * @param {string[]|object[]} imageUrls - Array de URLs de imágenes o objetos con propiedad url
 * @returns {Promise<string[]|object[]>} - Array de URLs o objetos válidos
 */
export const validateImageUrls = async (imageUrls) => {
  const validItems = [];
  
  for (const item of imageUrls) {
    // Si es un objeto con propiedad url (como los de Unsplash)
    if (typeof item === 'object' && item.url) {
      if (await validateImageUrl(item.url)) {
        validItems.push(item);
      }
    }
    // Si es una string (URL directa)
    else if (typeof item === 'string') {
      if (await validateImageUrl(item)) {
        validItems.push(item);
      }
    }
  }
  
  return validItems;
};

// Función para buscar imágenes usando Unsplash API
const searchUnsplashImages = async (query, count = 3) => {
  try {
    const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      console.warn('Unsplash API key not found, falling back to generated images');
      return generateThemedImages(query, count);
    }
    
    console.log(`Searching Unsplash API for: ${query}`);
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${accessKey}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const images = data.results.map((photo, index) => ({
        url: photo.urls.regular,
        thumbnailUrl: photo.urls.thumb,
        title: photo.alt_description || `${query} - Image ${index + 1}`,
        source: 'unsplash',
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html
      }));
      
      console.log(`Found ${images.length} Unsplash images`);
      return images;
    } else {
      console.log('No Unsplash images found, falling back to generated images');
      return generateThemedImages(query, count);
    }
  } catch (error) {
    console.error('Error searching Unsplash images:', error);
    return generateThemedImages(query, count);
  }
};

// Enhanced function to get project-related images with real search
const getProjectRelatedImagesWithSearch = async (projectName, count = 3) => {
  try {
    console.log(`Getting project images for: ${projectName}`);
    
    // First try to get real images from Unsplash
    const realImages = await searchUnsplashImages(projectName, count);
    
    // Check if we got valid Unsplash images
    if (realImages && realImages.length > 0 && realImages[0].source === 'unsplash') {
      console.log(`Returning ${realImages.length} Unsplash images`);
      return realImages;
    }
    
    // Otherwise fallback to generated images
    console.log('Falling back to generated images');
    return generateThemedImages(projectName, count);
  } catch (error) {
    console.error('Error in getProjectRelatedImagesWithSearch:', error);
    return generateThemedImages(projectName, count);
  }
};

// Exportar la función generateThemedImages para uso en otros componentes
export { generateThemedImages, searchUnsplashImages, getProjectRelatedImagesWithSearch };