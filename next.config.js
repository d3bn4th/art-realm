/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'upload.wikimedia.org',
      'imgur.com',
      'res.cloudinary.com'
    ],
  },
  typescript: {
    // Temporarily disable type checking during build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 