import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { MovieHero } from "../components/MovieHero";
import { TrendingSection } from "../components/TrendingSection";

export function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedFilmId, setSelectedFilmId] = useState(() => 
    sessionStorage.getItem('selectedFilmId') || null
  );

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'selectedFilmId') {
        setSelectedFilmId(e.newValue);
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // Also check for changes within the same tab
    const checkStorageChange = () => {
      const currentValue = sessionStorage.getItem('selectedFilmId');
      if (currentValue !== selectedFilmId) {
        setSelectedFilmId(currentValue);
      }
    };

    const interval = setInterval(checkStorageChange, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [selectedFilmId]);

  // Load movie data when selectedFilmId changes
  useEffect(() => {
      fetch('/data.json')
        .then(response => response.json())
        .then(data => {
           if (selectedFilmId) {
                const movie = data.TendingNow.find(item => item.Id.toString() === selectedFilmId);
                if (movie) {
                    setSelectedMovie(movie);
                }
          } else {
            setSelectedMovie(data.Featured);
          }
        })
        .catch(error => console.error('Error fetching movie data:', error));
    
  }, [selectedFilmId]);


  return (
    <div className="app-container">
      <div className="app-sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="app-main-content">
        <MovieHero selectedMovie={selectedMovie} />
        <TrendingSection />
      </div>
    </div>
  );
} 