import Fuse from 'fuse.js';

/**
 * Creates a Fuse.js instance for fuzzy searching
 * @param {Array} data - The array of objects to search through
 * @param {Object} options - Fuse.js options
 * @returns {Fuse} - A configured Fuse instance
 */
export function createFuseInstance(data, options = {}) {
  // Default options for temple search - strictly limited to name, deity, city, architecture
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
    useExtendedSearch: true,
  };

  // Merge default options with provided options
  const fuseOptions = { ...defaultOptions, ...options };
  
  return new Fuse(data, fuseOptions);
}

/**
 * Performs a fuzzy search on the provided data
 * @param {Array} data - The array of objects to search through
 * @param {string} query - The search query
 * @param {Object} options - Fuse.js options
 * @returns {Array} - The search results
 */
export function performFuseSearch(data, query, options = {}) {
  const fuse = createFuseInstance(data, options);
  
  // Remove the word "Temple" (case insensitive) from the query
  const cleanedQuery = query.replace(/\btemple\b/gi, '').trim();
  
  // If query is empty after removing "Temple", return all data
  if (!cleanedQuery) {
    return data;
  }
  
  const results = fuse.search(cleanedQuery);
  
  // Return just the items (without scores)
  return results.map(result => result.item);
}