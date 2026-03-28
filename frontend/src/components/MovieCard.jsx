import React from 'react';

const MovieCard = ({ movie }) => {
  // Use poster as the primary source, but Atlas sample_mflix sometimes uses broken links or none.
  const posterUrl = movie.poster && movie.poster.startsWith('http') 
    ? movie.poster 
    : 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <div className="movie-card">
      <div className="movie-card-image-wrapper">
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="movie-poster" 
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=Poster+Not+Found'; }}
        />
        <div className="movie-rating">
          ★ {movie.imdb?.rating || 'N/A'}
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{movie.year}</p>
        <div className="movie-genres">
          {movie.genres && movie.genres.slice(0, 3).map((genre, idx) => (
            <span key={idx} className="genre-tag">{genre}</span>
          ))}
        </div>
        <p className="movie-plot">{movie.plot ? movie.plot.slice(0, 120) + '...' : 'No plot available.'}</p>
        
        <div className="movie-actions">
          {movie.externalLinks?.ott && (
            <a 
              href={movie.externalLinks.ott} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="action-btn ott-btn"
            >
              Watch Now
            </a>
          )}
          {movie.externalLinks?.wikipedia && (
            <a 
              href={movie.externalLinks.wikipedia} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="action-btn wiki-btn"
            >
              Wiki
            </a>
          )}
          {movie.fullplot && !movie.externalLinks?.ott && (
             <span className="action-btn info-btn" title={movie.fullplot}>View More</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
