import React, { useState, useEffect } from 'react';
import { extractImagesFromUrl, validateImageUrls, generateThemedImages, getProjectRelatedImagesWithSearch } from '../utils/imageExtractor';
import './ImageSlider.css';

const ImageSlider = ({ url, projectName }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        let imageUrls = [];
        
        // First priority: Try to get real images based on project name
        if (projectName) {
          console.log(`Searching for real images for project: ${projectName}`);
          imageUrls = await getProjectRelatedImagesWithSearch(projectName, 3);
        }
        
        // Second priority: Try to extract images from the provided URL if no project images found
        if (imageUrls.length === 0 && url) {
          console.log('Trying to extract images from URL:', url);
          imageUrls = await extractImagesFromUrl(url);
        }
        
        // Third priority: Use generated themed images as fallback
        if (imageUrls.length === 0) {
          console.log('Using generated themed images as fallback');
          const placeholderImages = generateThemedImages(projectName || 'default project', 3);
          imageUrls = placeholderImages;
        }
        
        // Validate image URLs (only for real URLs, not data URLs)
        const validatedImages = await validateImageUrls(imageUrls);
        
        if (validatedImages.length === 0) {
          // If all images failed validation, use emergency themed images
          console.log('All images failed validation, using emergency images');
          const emergencyImages = generateThemedImages('business project', 3);
          setImages(emergencyImages);
        } else {
          setImages(validatedImages);
        }
      } catch (error) {
        console.error('Error loading images:', error);
        // Use emergency themed images on error
        const emergencyImages = generateThemedImages('default', 3);
        setImages(emergencyImages);
      } finally {
        setLoading(false);
      }
    };
    
    loadImages();
  }, [url, projectName]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!url) {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Sin imágenes disponibles</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p className="text-sm">Cargando imágenes...</p>
        </div>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm">{error || 'No se pudieron cargar las imágenes'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden group">
      {/* Imagen actual */}
      <div className="relative w-full h-full">
        <img
          src={typeof images[currentIndex] === 'object' ? images[currentIndex].url : images[currentIndex]}
          alt={typeof images[currentIndex] === 'object' ? images[currentIndex].title : `${projectName} - Imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Controles de navegación */}
      {images.length > 1 && (
        <>
          {/* Botón anterior */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Botón siguiente */}
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Contador de imágenes */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;