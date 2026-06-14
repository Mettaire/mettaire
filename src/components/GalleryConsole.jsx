import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const DATE_OPTIONS = ['all', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

const MEDIA_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Digital', label: 'Digital' },
  { value: 'Website', label: 'Code' },
  { value: 'Oil', label: 'Oil' },
  { value: 'Tattoo', label: 'Tattoo' },
  { value: 'Acrylic', label: 'Acrylic' },
  { value: 'Marker', label: 'Marker' },
  { value: 'Graphite', label: 'Graphite' },
  { value: 'Charcoal', label: 'Charcoal' },
  { value: 'Sculpture', label: 'Sculpture' },
  { value: 'Collage', label: 'Collage' },
  { value: 'Video', label: 'Video' },
];

// Compact dashboard label: 2022 -> '22, all -> ALL
const dateLabel = (d) => (d === 'all' ? 'ALL' : `'${d.slice(2)}`);

const GalleryConsole = ({
  filters,
  setFilters,
  handleFilterChange,
  sortOptions,
  sortBy,
  setSortBy,
  handleSortChange,
  showViolentContent,
  handleViewerDiscretionToggle,
}) => {
  const [open, setOpen] = useState(false);
  const consoleRef = useRef(null);

  // Close the console when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (consoleRef.current && !consoleRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectDate = (value) => {
    setFilters({ ...filters, date: value });
    handleFilterChange();
  };

  const selectMedia = (value) => {
    setFilters({ ...filters, media: value });
    handleFilterChange();
  };

  const selectSort = (value) => {
    setSortBy(value);
    handleSortChange();
  };

  return (
    <div className="gallery-console" ref={consoleRef}>
      <button
        className={`console-toggle ${open ? 'active' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Filter and sort panel"
      >
        <FontAwesomeIcon icon={faSliders} />
        <span className="console-toggle-label">PANEL</span>
      </button>

      <button
        onClick={handleViewerDiscretionToggle}
        className="viewer-discretion-button"
        aria-label="Toggle viewer discretion"
      >
        {showViolentContent ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
      </button>

      {open && (
        <div className="console-panel">
          <div className="console-row">
            <span className="console-label">DATE</span>
            <div className="console-chips">
              {DATE_OPTIONS.map((d) => (
                <button
                  key={d}
                  className={`console-chip ${filters.date === d ? 'active' : ''}`}
                  onClick={() => selectDate(d)}
                >
                  {dateLabel(d)}
                </button>
              ))}
            </div>
          </div>

          <div className="console-row">
            <span className="console-label">MEDIA</span>
            <div className="console-chips">
              {MEDIA_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  className={`console-chip ${filters.media === m.value ? 'active' : ''}`}
                  onClick={() => selectMedia(m.value)}
                >
                  {m.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="console-row">
            <span className="console-label">SORT</span>
            <div className="console-chips">
              {sortOptions.map((o) => (
                <button
                  key={o.value}
                  className={`console-chip ${sortBy === o.value ? 'active' : ''}`}
                  onClick={() => selectSort(o.value)}
                >
                  {o.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryConsole;
