import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const ProjectCarousel = ({ products, getProtectedImageUrl }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      image: "secondwind.webp",
      title: "Second Wind",
      description: "Full-stack platform connecting people impacted by the justice system to resources, support, and employment."
    },
    {
      id: 2,
      image: "careerspring.webp",
      title: "CareerSpring Interest Finder",
      description: "A custom WordPress career-interest assessment tool built with JavaScript, HTML & CSS to help people map their professional paths."
    },
    {
      id: 3,
      image: "SAP.webp",
      title: "SAP (FORTHESOUL)",
      description: "An Arduino-powered sculpture that speaks an existential narrative drawn from Sartre, Camus, and my own words."
    },
    {
      id: 4,
      image: "metvoyager.webp",
      title: "METVoyager",
      description: "A web app that taps the MET API to recommend artworks and save favorites to a personal gallery."
    }
  ];

  // Map a carousel image to its piece on the site, so each card opens that
  // work's detail page — the same behavior as the home mini-gallery.
  const findProductId = (image) =>
    (Array.isArray(products)
      ? products.find((p) => p.image && p.image.some((img) => img.includes(image)))
      : null)?.id ?? null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Below 748px we swap the flat slider for a 3D coverflow.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 747px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 747px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-play (pauses on hover or touch)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => nextSlide(), 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Swipe handling for the mobile coverflow
  const touchX = useRef(null);
  const onTouchStart = (e) => {
    setIsAutoPlaying(false);
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current != null) {
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (dx > 40) prevSlide();
      else if (dx < -40) nextSlide();
    }
    touchX.current = null;
    setIsAutoPlaying(true);
  };

  // Size the (flat) viewport to the active slide so the controls sit right under
  // the caption. Only runs for the tablet/desktop slider.
  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  useEffect(() => {
    if (isMobile) return;
    const slide = slideRefs.current[currentSlide];
    const container = containerRef.current;
    if (!slide || !container) return;
    const sync = () => {
      container.style.height = `${slide.offsetHeight}px`;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(slide);
    return () => ro.disconnect();
  }, [currentSlide, isMobile]);

  // 3D placement for a card based on its distance from the active one
  const cardStyle = (index) => {
    const n = projects.length;
    let offset = index - currentSlide;
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;
    const abs = Math.abs(offset);
    const hidden = abs >= 2; // only the centre + immediate neighbours show
    // Steep rotation + tight spacing so the centre and its two neighbours read
    // as three faces of a 3D shape; the side faces tilt outward.
    return {
      transform: `translateX(calc(-50% + ${offset * 34}vw)) translateY(-50%) translateZ(${abs === 0 ? 40 : -120}px) rotateY(${offset * 60}deg)`,
      zIndex: 10 - abs,
      opacity: hidden ? 0 : 1,
      pointerEvents: hidden ? 'none' : 'auto',
    };
  };

  const dots = (
    <div className="carousel-dots">
      {projects.map((_, i) => (
        <button
          key={i}
          className={`carousel-dot ${i === currentSlide ? 'active' : ''}`}
          onClick={() => goToSlide(i)}
          aria-label={`Go to project ${i + 1}`}
        />
      ))}
    </div>
  );

  // ---- Mobile: 3D glowing coverflow ----
  if (isMobile) {
    const active = projects[currentSlide];
    return (
      <div
        className="project-carousel coverflow"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="coverflow-stage">
          {projects.map((project, index) => {
            const isActive = index === currentSlide;
            const detailId = findProductId(project.image);
            return (
              <div
                key={project.id}
                className={`coverflow-card ${isActive ? 'active' : ''}`}
                style={cardStyle(index)}
                onClick={() =>
                  isActive
                    ? detailId && navigate(`/cache/${detailId}`)
                    : goToSlide(index)
                }
                role="button"
                aria-label={isActive ? `Open ${project.title}` : `Go to ${project.title}`}
              >
                <img
                  src={getProtectedImageUrl(project.image, products)}
                  loading="lazy"
                  alt={project.title}
                />
              </div>
            );
          })}
        </div>

        <div className="carousel-controls">
          <button className="carousel-nav carousel-prev" onClick={prevSlide} aria-label="Previous project">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {dots}
          <button className="carousel-nav carousel-next" onClick={nextSlide} aria-label="Next project">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div className="coverflow-caption">
          <h3>{active.title}</h3>
          <p>{active.description}</p>
        </div>
      </div>
    );
  }

  // ---- Tablet / desktop: flat slider ----
  return (
    <div
      className="project-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="carousel-container" ref={containerRef}>
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentSlide * (100 / projects.length)}%)`,
            width: `${projects.length * 100}%`,
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => (slideRefs.current[index] = el)}
              className="carousel-slide"
              style={{ width: `${100 / projects.length}%` }}
            >
              <div className="image-with-description-v1">
                {(() => {
                  const detailId = findProductId(project.image);
                  const img = (
                    <img
                      src={getProtectedImageUrl(project.image, products)}
                      loading="lazy"
                      alt={project.title}
                    />
                  );
                  return detailId ? (
                    <Link to={`/cache/${detailId}`} className="project-link">
                      {img}
                    </Link>
                  ) : (
                    img
                  );
                })()}
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  {/* Controls live inside each card so they slide with it */}
                  <div className="carousel-controls">
                    <button
                      className="carousel-nav carousel-prev"
                      onClick={prevSlide}
                      aria-label="Previous project"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    {dots}

                    <button
                      className="carousel-nav carousel-next"
                      onClick={nextSlide}
                      aria-label="Next project"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCarousel;
