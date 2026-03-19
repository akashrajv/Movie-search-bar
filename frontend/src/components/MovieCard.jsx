import React from 'react';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <div className="movie-card-image-wrapper">
        <img 
          src={movie.poster ? movie.poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
          alt={movie.title} 
          className="movie-poster" 
          loading="lazy"
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
        <p className="movie-plot">{movie.plot ? movie.plot.slice(0, 100) + '...' : 'No plot available.'}</p>
      </div>
    </div>
  );
};

export default MovieCard;
