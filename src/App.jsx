import React, { useState, useEffect } from "react";
import "tailwindcss";
import ".//App.css";
import Search from "./components/search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "Get",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setsearchTerm] = useState("");
  const [errorMessage, setrerrorMessage] = useState("");
  const [movieList, setmovieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [DebounceSearchTerm, setDebounceSearchTerm] = useState(``);

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = ``) => {
    setLoading(true);
    setrerrorMessage("");
    /* */
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();
      console.log(data);
      if (data.response === "false") {
        setrerrorMessage("error fetching movies: please try again later");
        setmovieList([]);
        return;
      }

      setmovieList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setrerrorMessage("error fetching movies: please try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(DebounceSearchTerm);
  }, [DebounceSearchTerm]);

  return (
    <>
      <main>
        <div className="bg-[url(hero-bg.png)] w-[95vw] m-0 p-0  h-[100vh] bg-local bg-center bg-cover absolute z-0" />
        <div className="div wrapper">
          <header>
            <img src="./hero.png" alt="hero banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
            </h1>
            <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
          </header>

          

          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies </h2>

            {loading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500"> {errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
