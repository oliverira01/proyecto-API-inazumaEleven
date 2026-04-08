const BACKEND_URL = 'http://localhost:3001';

export const getImageUrl = (path) => {
  if (!path) return null;
  return `${BACKEND_URL}${path}`;
};