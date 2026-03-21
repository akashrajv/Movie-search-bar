const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sampleMovies = [
  {
    title: "The Matrix",
    year: 1999,
    plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    genres: ["Action", "Sci-Fi"],
    imdb: { rating: 8.7 },
    poster: "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDYyMi00MTM1LWI3NjQtZGNiNDZlM2VjNDM2XkEyXkFqcGc@._V1_SX300.jpg",
    fullplot: "Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination. Neo finds himself targeted by the police when he is contacted by Morpheus, a legendary computer hacker branded a terrorist by the government. Morpheus awakens Neo to the real world, a ravaged wasteland where most of humanity have been captured by a race of machines that live off of the humans' body heat and electrochemical energy and who imprison their minds within an artificial reality known as the Matrix. As a rebel against the machines, Neo must return to the Matrix and confront the agents: super-powerful computer programs devoted to snuffing out Neo and the entire human rebellion.",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    directors: ["Lana Wachowski", "Lilly Wachowski"],
    externalLinks: {
      ott: "https://www.netflix.com/title/20519077",
      wikipedia: "https://en.wikipedia.org/wiki/The_Matrix"
    }
  },
  {
    title: "Inception",
    year: 2010,
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    imdb: { rating: 8.8 },
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    directors: ["Christopher Nolan"],
    externalLinks: {
      ott: "https://www.netflix.com/title/70131314",
      wikipedia: "https://en.wikipedia.org/wiki/Inception"
    }
  },
  {
    title: "Interstellar",
    year: 2014,
    plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    imdb: { rating: 8.6 },
    poster: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LWFmZGYtNzUyZjVmOWY3MzNhXkEyXkFqcGc@._V1_SX300.jpg",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    directors: ["Christopher Nolan"],
    externalLinks: {
      ott: "https://www.primevideo.com/detail/Interstellar/0JF9W7X6OWX",
      wikipedia: "https://en.wikipedia.org/wiki/Interstellar_(film)"
    }
  },
  {
    title: "The Godfather",
    year: 1972,
    plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    genres: ["Crime", "Drama"],
    imdb: { rating: 9.2 },
    poster: "https://m.media-amazon.com/images/M/MV5BYTJkNGQyYzUtZDllEO00MDVmLWEzNGUtYzI2OWVwOWEwNmY2XkEyXkFqcGc@._V1_SX300.jpg",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    directors: ["Francis Ford Coppola"],
    externalLinks: {
      ott: "https://www.primevideo.com/detail/The-Godfather/0JF9W7X6OWX",
      wikipedia: "https://en.wikipedia.org/wiki/The_Godfather"
    }
  },
  {
    title: "Pulp Fiction",
    year: 1994,
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    genres: ["Crime", "Drama"],
    imdb: { rating: 8.9 },
    poster: "https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDFmOC00Y2E1LWExOTctNDYyZDNkZGZlMWUyXkEyXkFqcGc@._V1_SX300.jpg",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    directors: ["Quentin Tarantino"],
    externalLinks: {
      ott: "https://www.netflix.com/title/880640",
      wikipedia: "https://en.wikipedia.org/wiki/Pulp_Fiction"
    }
  }
];

async function importData() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not found in .env");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db('moviedb');
    const collection = db.collection('movies');

    await collection.deleteMany({});
    console.log("Cleared existing movies");

    // Load extra movies from JSON if available
    let allMovies = [...sampleMovies];
    const tamilMoviesPath = path.join(__dirname, 'tamil_movies.json');
    
    if (fs.existsSync(tamilMoviesPath)) {
      try {
        const tamilMovies = JSON.parse(fs.readFileSync(tamilMoviesPath, 'utf8'));
        allMovies = [...allMovies, ...tamilMovies];
        console.log(`Loaded ${tamilMovies.length} movies from tamil_movies.json`);
      } catch (err) {
        console.error("Error parsing tamil_movies.json:", err.message);
      }
    }

    const result = await collection.insertMany(allMovies);
    console.log(`${result.insertedCount} movies imported successfully!`);

  } catch (err) {
    console.error("Import error:", err);
  } finally {
    await client.close();
  }
}

importData();
