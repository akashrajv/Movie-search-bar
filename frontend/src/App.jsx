import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import MovieCard from './components/MovieCard';

function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');

  // Debounced Autocomplete
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://movie-search-bar.onrender.com';
        const res = await fetch(`${apiUrl}/api/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (e, specificPage = 1) => {
    if (e) e.preventDefault();
    if (!query) return;

    setShowSuggestions(false);
    setLoading(true);
    setHasSearched(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://movie-search-bar.onrender.com';
      let url = `${apiUrl}/api/search?q=${encodeURIComponent(query)}&page=${specificPage}&limit=12`;
      if (year) url += `&year=${year}`;
      if (rating) url += `&rating=${rating}`;

      const res = await fetch(url);
      const data = await res.json();
      
      setMovies(data.data || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);
      setTotalResults(data.total || 0);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (movie) => {
    setQuery(movie.title);
    setShowSuggestions(false);
    
    // Redirection logic
    const links = movie.externalLinks;
    if (links) {
      const redirectUrl = links.ott || links.wikipedia;
      if (redirectUrl) {
        window.open(redirectUrl, '_blank', 'noopener,noreferrer');
        return; // Skip search if redirecting from suggestion
      }
    }

    // Fallback to normal search if no links
    setTimeout(() => {
      document.getElementById('search-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 0);
  };

  return (
    <div className="app-container">
      <header className={`hero-section ${hasSearched && !loading ? 'shrunk' : ''}`}>
        <div className="hero-content">
          <h1 className="hero-title"><span className="gradient-text">Atlas</span> Movies</h1>
          <p className="hero-subtitle">Discover your next favorite film.</p>
          
          <form id="search-form" className="search-form" onSubmit={(e) => handleSearch(e, 1)}>
            <div className="search-input-wrapper">
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search movies by title, plot, cast..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <button type="submit" className="search-button">Search</button>
              
              {showSuggestions && suggestions.length > 0 && (
                <ul className="autocomplete-dropdown">
                  {suggestions.map((s) => (
                    <li key={s._id} onMouseDown={() => handleSuggestionClick(s)}>
                      <div className="suggestion-item">
                        <span className="suggestion-title">{s.title}</span>
                        {s.year && <span className="suggestion-year">{s.year}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="filters-container">
              <input 
                type="number" 
                placeholder="Year" 
                value={year} 
                onChange={(e) => setYear(e.target.value)} 
                className="filter-input"
              />
              <input 
                type="number" 
                step="0.1" 
                placeholder="Min Rating (0-10)" 
                value={rating} 
                onChange={(e) => setRating(e.target.value)} 
                className="filter-input"
              />
            </div>
          </form>
        </div>
      </header>

      {hasSearched && (
        <main className="main-content">
          <div className="results-header">
            <h2>Search Results</h2>
            <p className="results-count">Found {totalResults} movies</p>
          </div>

          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="movies-grid">
                {movies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    disabled={page === 1} 
                    onClick={(e) => handleSearch(e, page - 1)}
                    className="page-btn"
                  >
                    Previous
                  </button>
                  <span className="page-info">Page {page} of {totalPages}</span>
                  <button 
                    disabled={page === totalPages} 
                    onClick={(e) => handleSearch(e, page + 1)}
                    className="page-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <p>No movies found matching your criteria.</p>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
