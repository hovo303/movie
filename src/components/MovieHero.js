import { Play, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "../styles/MovieHero.css";

export function MovieHero({ selectedMovie }) {
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [initialMovie, setInitialMovie] = useState(null);
  const videoRef = useRef(null);

  // Track the initial movie to detect when user changes selection
  useEffect(() => {
    if (selectedMovie && !initialMovie) {
      setInitialMovie(selectedMovie);
    }
  }, [selectedMovie, initialMovie]);

  // Track when selectedMovie changes due to user interaction
  useEffect(() => {
    if (selectedMovie && initialMovie && selectedMovie.Id !== initialMovie.Id) {
      setHasUserInteracted(true);
    }
  }, [selectedMovie, initialMovie]);

  // Detect when a new movie is selected and start video after 2 seconds
  useEffect(() => {
    if (selectedMovie?.VideoUrl && hasUserInteracted) {
      setShowVideo(false);
      setIsLoading(false);
      
      let delayTimer;
      let loadingTimer;
      
      // Wait 2 seconds before starting loading
      delayTimer = setTimeout(() => {
        setIsLoading(true);
        
        // Show loading for a brief moment, then show video
        loadingTimer = setTimeout(() => {
          setShowVideo(true);
          setIsLoading(false);
          
          // Start video playback
          if (videoRef.current) {
            videoRef.current.play().catch(error => {
              console.error("Video autoplay failed:", error);
            });
          }
        }, 500);
      }, 2000);

      return () => {
        clearTimeout(delayTimer);
        clearTimeout(loadingTimer);
      };
    } else {
      // If no video URL or no user interaction, reset video state
      setShowVideo(false);
      setIsLoading(false);
    }
  }, [selectedMovie, hasUserInteracted]);

  // Convert duration from seconds to hours and minutes
  const formatDuration = (duration) => {
    const seconds = parseInt(duration);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (!selectedMovie) {
    return <div>Loading...</div>;
  }
  
  // Get background image URL
  const getBackgroundImage = () => {
    return `url(/assets/FeaturedCoverImage.png)`;
  };

  return (
    <div 
      className="movie-hero-container"
      style={{ '--hero-bg-image': showVideo ? 'none' : getBackgroundImage() }}
    >
      <div className="movie-hero-background">
        {showVideo && selectedMovie?.VideoUrl && (
          <video
            ref={videoRef}
            className="movie-hero-video"
            src={`/assets/${selectedMovie.VideoUrl}`}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
      </div>

      {isLoading && (
        <div className="movie-hero-loading">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="movie-hero-content">
        <div className="movie-hero-label">
          <span className="movie-hero-label-text">
            {selectedMovie.Category }
          </span>
        </div>

        <img 
          src={`/assets/${selectedMovie.TitleImage}`}
          alt={selectedMovie.Title}
          className="movie-hero-title-image"
        />

        <div className="movie-hero-details">
          <span className="movie-hero-year">{selectedMovie.ReleaseYear }</span>
          <div className="movie-hero-rating">
            {selectedMovie.MpaRating}
          </div>
          <span className="movie-hero-duration">{formatDuration(selectedMovie.Duration)}</span>
        </div>

        <p className="movie-hero-description">
          {selectedMovie.Description}
        </p>

        {/* Buttons */}
        <div className="movie-hero-buttons">
          {/* Play Button */}
          <button className="movie-hero-button movie-hero-play-button">
            <Play size={21} className="movie-hero-play-icon" />
            <span className="movie-hero-play-text">
              Play
            </span>
          </button>
          
          {/* More Info Button */}
          <button className="movie-hero-button movie-hero-info-button">
            <Info size={21} className="movie-hero-info-icon" />
            <span className="movie-hero-info-text">
              More Info
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}