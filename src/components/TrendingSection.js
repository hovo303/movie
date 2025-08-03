import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/TrendingSection.css";

export function TrendingSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const carouselRef = useRef(null);

  // Fetch data from JSON file
  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        // Get session stored film IDs list
        const sessionFilmIds = JSON.parse(sessionStorage.getItem('selectedFilmIds') || '[]');
        
        // Map JSON data to component format
        const moviesData = data.TendingNow
          .map(item => ({
            id: item.Id,
            title: item.Title,
            image: `/assets/${item.CoverImage}`,
            category: item.Category,
            year: item.ReleaseYear,
            rating: item.MpaRating,
            duration: item.Duration,
            description: item.Description,
            date: new Date(item.Date),
          }))
          .sort((a, b) => {      
            if (sessionFilmIds.length > 0) {
              const aIndex = sessionFilmIds.indexOf(a.id);
              const bIndex = sessionFilmIds.indexOf(b.id);
              
              // If both are in session list, sort by their position (earlier index = more recent)
              if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
              }
              // If only 'a' is in session list, prioritize it
              if (aIndex !== -1 && bIndex === -1) {
                return -1;
              }
              // If only 'b' is in session list, prioritize it
              if (aIndex === -1 && bIndex !== -1) {
                return 1;
              }
            }
            
            // Otherwise sort by date (newest first)
            return b.date - a.date;
          })
          .slice(0, 50); // Limit to 50 items
        
        setTrendingMovies(moviesData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const itemWidth = 208; // 192px + 16px gap
  const visibleItems = 4;
  const maxIndex = Math.max(0, trendingMovies.length - visibleItems);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    snapToNearestItem();
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].clientX;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    snapToNearestItem();
  };

  // Snap to nearest item
  const snapToNearestItem = () => {
    const scrollPosition = carouselRef.current.scrollLeft;
    const newIndex = Math.round(scrollPosition / itemWidth);
    const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
    scrollToIndex(clampedIndex);
  };

  // Scroll to specific index
  const scrollToIndex = (index) => {
    const scrollPosition = index * itemWidth;
    carouselRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  // Handle movie click to save to session storage list
  const handleMovieClick = (movieId) => {
    // Get current session film IDs list
    const currentIds = JSON.parse(sessionStorage.getItem('selectedFilmIds') || '[]');
    
    // Remove the movie ID if it already exists in the list
    const filteredIds = currentIds.filter(id => id !== movieId);
    
    // Add the clicked movie ID to the beginning of the list (most recent)
    const updatedIds = [movieId, ...filteredIds];
    
    // Save updated list to session storage
    sessionStorage.setItem('selectedFilmIds', JSON.stringify(updatedIds));
    sessionStorage.setItem('selectedFilmId', movieId);
  };

  return (
    <div className="trending-section">
      <div className="trending-header">
        <h2 className="trending-title">Trending Now</h2>
      </div>

      {/* Carousel Container */}
      <div className="trending-carousel-container">
        <div 
          ref={carouselRef}
          className={`trending-carousel ${isDragging ? 'dragging' : 'smooth'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {trendingMovies.map((movie) => (
            <Link 
              key={movie.id}
              className={`trending-movie-card`}
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className="trending-movie-image-container">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="trending-movie-image"
                />
                <div className={`trending-movie-overlay ${isDragging ? 'dragging' : ''}`} />
              </div>
              <h3 className="trending-movie-title">
                {movie.title}
              </h3>
            </Link>
          ))}
        </div>


      </div>
    </div>
  );
}