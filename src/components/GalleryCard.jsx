import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import SaveButton from './SaveButton';
import { useReducedMotionPref } from '../utils/useReducedMotionPref';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Get protected video URL
const getProtectedVideoUrl = (filename) => {
  return `${API_BASE_URL}/media/video/${filename}`;
};

const getFullImageUrl = (filename) =>
  filename.includes('.mp4') ? `/api/media/video/${filename}` : `/api/media/image/${filename}`;

const GalleryCard = ({ product, currentPage, showViolentContent }) => {
  const [isHovered, setIsHovered] = useState(false);
  const reduced = useReducedMotionPref();

  // Safety check for product data
  if (!product || !product.image || !Array.isArray(product.image) || product.image.length === 0) {
    return (
      <div className="gallery-card">
        <div className="error-card">
          <p>Product data unavailable</p>
        </div>
      </div>
    );
  }

  const handleHover = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Show only the first media in the grid (cards keep their natural size so the
  // masonry layout doesn't reflow/jolt). All versions are viewable on the
  // detail page; a badge signals when a piece has more than one.
  const primaryMedia = product.image[0];
  const isVideo = primaryMedia.includes('.mp4');
  const fullImageUrl = getFullImageUrl(primaryMedia);
  const hasMultiple = product.image.length > 1;
  const isVisible = showViolentContent || !product.hasViolence;

  return (
    <motion.div
      className="gallery-card"
      initial={reduced ? false : { opacity: 0, y: 36 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={reduced ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="gallery-card-content">
        <Link to={`${product.id}?page=${currentPage}`} className="link-no-underline">
          {isVisible ? (
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
              {hasMultiple && (
                <span className="card-media-count" aria-label={`${product.image.length} items — view all on the piece's page`}>
                  <FontAwesomeIcon icon={faLayerGroup} />
                  {product.image.length}
                </span>
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
