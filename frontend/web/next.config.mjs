/** @type {import('next').NextConfig} */
const nextConfig = {
  // This folder is the app's root (the main project folder has its own package-lock.json)
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;