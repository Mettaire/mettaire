import React from 'react';
import Coverflow from './Coverflow';

const ProjectCarousel = ({ products, getProtectedImageUrl }) => {
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

  const items = projects.map((p) => {
    const detailId = findProductId(p.image);
    return {
      key: p.id,
      image: p.image,
      to: detailId ? `/cache/${detailId}` : null,
      title: p.title,
      description: p.description,
    };
  });

  return (
    <Coverflow
      items={items}
      getImageUrl={(img) => getProtectedImageUrl(img, products)}
      showCaption
    />
  );
};

export default ProjectCarousel;
