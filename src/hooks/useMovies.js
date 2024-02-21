import { useEffect, useState } from "react";

const KEY = "e6f9509f";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, SetError] = useState("");
  useEffect(
    function () {
      //   callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          SetError("");
          const res = await fetch(
            ` http://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Something went wrong");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          SetError("");
        } catch (err) {
          console.error(err);

          if (err.name !== "Abort") {
            SetError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        SetError("");
        return;
      }

      //   handleCloseMovie();
      fetchMovies();

      return () => controller.abort();
    },
    [query]
  );

  return { movies, isLoading, error };
}
