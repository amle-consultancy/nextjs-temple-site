import Fuse from 'fuse.js';

export function createFuseInstance(data, options = {}) {
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

  const fuseOptions = { ...defaultOptions, ...options };
  return new Fuse(data, fuseOptions);
}
 
export function performFuseSearch(data, query, options = {}) {
  const fuse = createFuseInstance(data, options);

  const cleanedQuery = query.replace(/\btemple\b/gi, '').trim();
  
  if (!cleanedQuery) {
    return data;
  }
  
  const results = fuse.search(cleanedQuery);
  
  return results.map(result => result.item);
}