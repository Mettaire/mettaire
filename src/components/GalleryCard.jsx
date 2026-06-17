import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SaveButton from './SaveButton';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Get protected video URL
const getProtectedVideoUrl = (filename) => {
  return `${API_BASE_URL}/media/video/${filename}`;
};

const GalleryCard = ({ product, currentPage, showViolentContent }) => {
  // Hooks must run before any early return
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageCount = product?.image?.length ?? 0;

  useEffect(() => {
    if (imageCount <= 1) return undefined;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === imageCount - 1 ? 0 : prevIndex + 1));
    }, 5000); // Change the duration here for the image transition
    return () => clearInterval(interval);
  }, [imageCount]);

  // Safety check for product data (after hooks)
  if (!product || !product.image || !Array.isArray(product.image) || product.image.length === 0) {
    return (
      <div className="gallery-card">
        <div className="error-card">
          <p>Product data unavailable</p>
        </div>
      </div>
    );
  }

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const currentImageUrl = product.image[currentImageIndex];
  const isVideo = currentImageUrl.includes('.mp4');
  
  // Convert filename to full API URL
  const getFullImageUrl = (filename) => {
    if (filename.includes('.mp4')) {
      return `/api/media/video/${filename}`;
    } else {
      return `/api/media/image/${filename}`;
    }
  };
  
  const fullImageUrl = getFullImageUrl(currentImageUrl);

  return (
    <motion.div
      className="gallery-card"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="gallery-card-content">
        <Link to={`${product.id}?page=${currentPage}`} className="link-no-underline">
          {showViolentContent || !product.hasViolence ? (
            <>
              {isVideo ? (
                <video
                  className="gallery-video"
                  autoPlay
                  width="auto"
                  loop
                  muted={!isHovered}
                  onMouseOver={handleHover}
                  onMouseLeave={handleMouseLeave}
                  playsInline
                  controls={false}
                  src={fullImageUrl}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img 
                  src={fullImageUrl} 
                  loading="lazy" 
                  alt={product.name} 
                  className="gallery-image"
                />
              )}
              <div className="card-overlay">
                <span className="card-overlay-title">{product.name}</span>
                <span className="card-overlay-meta">
                  {product.media}{product.date ? ` · ${product.date}` : ''}
                </span>
              </div>
            </>
          ) : (
            <div className="restricted-content-container">
              <div>
                <video className="warning-image" autoPlay muted width="200px" loop playsInline controls={false}>
                  <source src={getProtectedVideoUrl('toxic.mp4')} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p>Content Warning: This piece may contain sensitive or explicit material. Proceed with caution. To view, click the button with the crossed-out eye.</p>
            </div>
          )}
        </Link>
        <div className="save-button-container">
          <SaveButton artwork={product} />
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryCard;
