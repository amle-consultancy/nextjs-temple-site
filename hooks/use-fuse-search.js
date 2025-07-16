import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';


export function useFuseSearch(data = [], options = {}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const defaultOptions = {
    keys: [
      { name: 'name', weight: 2 },
      { name: 'deity', weight: 1.5 },
      { name: 'location.city', weight: 1 },
      { name: 'architecture', weight: 1 }
    ],
    threshold: 0.4, // Lower threshold for more precise matching (0 = exact, 1 = match anything)
    includeScore: true,
    ignoreLocation: true,
  };

  // Create Fuse instance with merged options
  const fuse = useMemo(() => {
    const fuseOptions = { ...defaultOptions, ...options };
    
    // Create a new instance of Fuse with the provided data and options
    return new Fuse(data, fuseOptions);
  }, [data, options]);

  // Update search results when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults(data);
      return;
    }

    // Remove the word "Temple" (case insensitive) from the query
    // This regex handles variations like "temple", "temples", and even if it's part of another word
    const cleanedQuery = query.replace(/\btemples?\b/gi, '').trim();
    
    // If query is empty after removing "Temple", return all results
    if (!cleanedQuery) {
      setResults(data);
      return;
    }

    const searchResults = fuse.search(cleanedQuery);
    setResults(searchResults.map(result => result.item));
  }, [query, fuse, data]);

  // Search function - automatically ignores the word "Temple" in queries
  const search = (searchQuery) => {
    // We set the original query to maintain UI consistency
    // The actual filtering of "Temple" happens in the useEffect
    setQuery(searchQuery);
  };

  // Reset search
  const reset = () => {
    setQuery('');
    setResults(data);
  };

  return {
    query,
    results,
    search,
    reset,
    setQuery,
  };
}

export default useFuseSearch;