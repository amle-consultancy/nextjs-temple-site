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
    threshold: 0.4, 
    includeScore: true,
    ignoreLocation: true,
  };

  const fuse = useMemo(() => {
    const fuseOptions = { ...defaultOptions, ...options };
    
    return new Fuse(data, fuseOptions);
  }, [data, options]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(data);
      return;
    }

    const cleanedQuery = query.replace(/\btemples?\b/gi, '').trim();
    
    if (!cleanedQuery) {
      setResults(data);
      return;
    }

    const searchResults = fuse.search(cleanedQuery);
    setResults(searchResults.map(result => result.item));
  }, [query, fuse, data]);

  const search = (searchQuery) => {
    setQuery(searchQuery);
  };

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