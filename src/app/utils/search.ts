import { artworks } from '../data/artworks';

export const searchArtworks = (query: string) => {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    return artworks;
  }

  return artworks.filter((artwork) => {
    return (
      artwork.title.toLowerCase().includes(searchTerm) ||
      artwork.artist.toLowerCase().includes(searchTerm) ||
      artwork.description.toLowerCase().includes(searchTerm) ||
      artwork.category.toLowerCase().includes(searchTerm)
    );
  });
}; 