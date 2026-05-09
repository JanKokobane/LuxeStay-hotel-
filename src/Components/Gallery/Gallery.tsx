/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import styles from './Gallery.module.css';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  category: string;
  size: 'small' | 'medium' | 'large' | 'tall';
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    url: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Pet-Friendly Accommodation',
    category: 'Rooms',
    size: 'tall'
  },
  {
    id: 2,
    url: 'https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Swimming Pool',
    category: 'Facilities',
    size: 'large'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200',
    title: 'Fitness Center',
    category: 'Facilities',
    size: 'small'
  },
  {
    id: 4,
    url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Business Room',
    category: 'Business',
    size: 'small'
  },
  {
    id: 5,
    url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Modern Hotel Exterior',
    category: 'Facilities',
    size: 'tall'
  },
  {
    id: 6,
    url: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Deluxe Suite',
    category: 'Rooms',
    size: 'medium'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200',
    title: 'Outdoor Dining',
    category: 'Dining',
    size: 'small'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1550966841-3ee7adac1661?q=80&w=1200',
    title: 'Restaurant Interior',
    category: 'Dining',
    size: 'medium'
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f261?q=80&w=1200',
    title: 'Luxury Suite',
    category: 'Rooms',
    size: 'small'
  },
  {
    id: 10,
    url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200',
    title: 'Bar & Lounge',
    category: 'Dining',
    size: 'small'
  }
];

const categories = ['All', 'Rooms', 'Facilities', 'Dining', 'Business'];

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? filteredImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === filteredImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') closeLightbox();
  };

  return (
    <section className={styles.section} id="gallery">
      <div className={styles.header}>
        <h2 className={styles.heading}>The Gallery</h2>
        <p className={styles.description}>
          Explore the beauty and elegance of Luxetay through our curated collection of luxury spaces and premier facilities.
        </p>
      </div>

      <div className={styles.filterContainer}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.filterButton} ${
              selectedCategory === category ? styles.filterButtonActive : ''
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.galleryGrid}>
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className={`${styles.galleryItem} ${styles[image.size]}`}
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.url}
              alt={image.title}
              className={styles.galleryImage}
              loading="lazy"
            />
            <div className={styles.imageOverlay}>
              <div className={styles.overlayContent}>
                <h3 className={styles.imageTitle}>{image.title}</h3>
                <span className={styles.imageCategory}>{image.category}</span>
                <Maximize2 className={styles.expandIcon} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          <button
            className={styles.lightboxClose}
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <button
            className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={40} />
          </button>

          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[currentImageIndex].url}
              alt={filteredImages[currentImageIndex].title}
              className={styles.lightboxImage}
            />
            <div className={styles.lightboxInfo}>
              <h3 className={styles.lightboxTitle}>
                {filteredImages[currentImageIndex].title}
              </h3>
              <span className={styles.lightboxCategory}>
                {filteredImages[currentImageIndex].category}
              </span>
              <span className={styles.lightboxCounter}>
                {currentImageIndex + 1} / {filteredImages.length}
              </span>
            </div>
          </div>

          <button
            className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={40} />
          </button>

          <div className={styles.thumbnailStrip}>
            {filteredImages.map((image, index) => (
              <button
                key={image.id}
                className={`${styles.thumbnail} ${
                  index === currentImageIndex ? styles.thumbnailActive : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              >
                <img src={image.url} alt={image.title} />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
