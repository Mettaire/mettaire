import React, { useState, useEffect, useRef } from 'react';
import GalleryCard from './GalleryCard';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import GalleryConsole from './GalleryConsole';
import Loading from './Loading';
import { useProducts } from '../context/ProductsProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const itemsPerPage = 16;
const maxButtonsToShow = 4;

const GalleryList = () => {
  const { products, loading: productsLoading, error } = useProducts();
  const navigate = useNavigate();
  

  const [filters, setFilters] = useState({
    date: 'all',
    media: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // Default sorting by name
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const [showViolentContent, setShowViolentContent] = useState(false); 
  const [loadingDueToViewerDiscretion, setLoadingDueToViewerDiscretion] = useState(false);


  const handleViewerDiscretionToggle = () => {
    setShowViolentContent((prev) => !prev); // Toggle the state
    setLoadingDueToViewerDiscretion(true);
  };

  const sortOptions = [
    { label: 'Recent', value: 'recent' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Name', value: 'name' }, 
  ];

  const filterProducts = (product) => {
    const { date, media } = filters;
    const dateFilter = date === 'all' || product.date === parseInt(date, 10);
    const mediaFilter = media === 'all' || product.media.toLowerCase().includes(media.toLowerCase());
    return dateFilter && mediaFilter;
  };

  const searchFilter = (product) => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const sortProducts = (a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'oldest') {
      return a.date - b.date;
    } else if(sortBy === 'recent'){
      return b.date - a.date;
    }
  };

  const applyFiltersAndSort = () => {
    // Handle case where products is not an array or is empty
    if (!products || !Array.isArray(products) || products.length === 0) {
      return [];
    }
    
    const filteredProducts = products.filter(filterProducts).filter(searchFilter);
    const sortedProducts = filteredProducts.sort(sortProducts);
    return sortedProducts;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); 
    const newParams = new URLSearchParams(window.location.search);
    newParams.set('page', pageNumber);
    navigate(`/cache?${newParams.toString()}`);

  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    const newParams = new URLSearchParams(window.location.search);
    newParams.set('page', '1');
    navigate(`/cache?${newParams.toString()}`);
    
  };

  const handleSortChange = () => {
    setCurrentPage(1);
    // Update URL parameters based on the new sort
  const newParams = new URLSearchParams(window.location.search);
  newParams.set('page', '1');
  navigate(`/cache?${newParams.toString()}`);
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resets page when search term changes
    // Update URL parameter based on the new search term
  const newParams = new URLSearchParams(window.location.search);
  newParams.set('page', '1');
  navigate(`/cache?${newParams.toString()}`);
  }
  
  

  useEffect(() => {
    // Extract query parameters from the location
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = parseInt(searchParams.get('page'), 10) || 1;
    // Set the state based on query parameters
    setCurrentPage(pageParam);    
  }, []);
  
   const isInitialMount = useRef(true);

   useEffect(() => {
     window.scrollTo(0, 0);

     // On first mount the app-level loading overlay already covers route entry,
     // so skip the local loader here to avoid a double loading screen.
     if (isInitialMount.current) {
       isInitialMount.current = false;
       setLoading(false);
       return;
     }

     // For in-page changes (filter / sort / search / page / discretion), which
     // don't trigger the route-level overlay, show the local loader briefly.
     setLoading(true);
     setLoadingDueToViewerDiscretion(false);
     const timer = setTimeout(() => {
       setLoading(false);
     }, 1000);
     return () => clearTimeout(timer);
   }, [currentPage, filters, sortBy, searchTerm, showViolentContent]);

  // Show loading if products are still loading
  if (productsLoading) {
    return <Loading />;
  }

  // Show error if products failed to load
  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  const totalPages = Math.ceil(applyFiltersAndSort().length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = applyFiltersAndSort().slice(indexOfFirstItem, indexOfLastItem);

  const renderPaginationButtons = () => {
    const buttons = [];
    const totalPages = Math.ceil(applyFiltersAndSort().length / itemsPerPage);

    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button className="pagination-prev" key="prev" onClick={() => handlePageChange(currentPage - 1)}>
        <FontAwesomeIcon icon={faChevronLeft}  />
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={i} onClick={() => handlePageChange(i)} className={currentPage === i ? 'active' : ''}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      buttons.push(
        <button className="pagination-next" key="next" onClick={() => handlePageChange(currentPage + 1)}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="gallery-list-container">
      <div className="filter-search-row">
        <div className="gallery-search">
        <h1 className="gallery-title">cache</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearchChange} className="gallery-search-bar" />
        </div>
        <div className="filter-and-sort-row">
          <GalleryConsole
            filters={filters}
            setFilters={setFilters}
            handleFilterChange={handleFilterChange}
            sortOptions={sortOptions}
            sortBy={sortBy}
            setSortBy={setSortBy}
            handleSortChange={handleSortChange}
            showViolentContent={showViolentContent}
            handleViewerDiscretionToggle={handleViewerDiscretionToggle}
          />
      </div>
      </div>

      {loading ? (
        <Loading /> // Render the loading component while loading is true
      ) : currentItems.length === 0 ? (
        <div className="no-products-message">
          <p>No products available at the moment.</p>
          <p>Please check back later or try refreshing the page.</p>
        </div>
      ) : (
        <>
          <div className="gallery-list">
            {currentItems.map((product) => (
              <GalleryCard key={product.id} product={product} currentPage={currentPage} showViolentContent={showViolentContent} />
            ))}
          </div>

          <div className="pagination">
            {renderPaginationButtons()}
          </div>
        </>
      )}
    </div>
  );
};

export default GalleryList;