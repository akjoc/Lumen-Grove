/**
 * Resolve a file from the public/ folder against the Vite base URL.
 * Locally the base is '/', on GitHub Pages it is '/Lumen-Grove/',
 * so asset('assets/hero-leaves.jpg') works in both places.
 */
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\/+/, '')}`
