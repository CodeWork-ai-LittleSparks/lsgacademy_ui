/** @type {import('next').NextConfig} */
import path from 'path';
// const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiUrl = 'https://api.dev.lsgacademy.in';

let remotePatterns = [];
if (apiUrl) {
  try {
    const u = new URL(apiUrl);
    const pattern = {
      protocol: u.protocol.replace(':', ''),
      hostname: u.hostname,
      pathname: '/uploads/**',
    };
    if (u.port) pattern.port = u.port;
    remotePatterns.push(pattern);
  } catch (e) {
    // Fallback to localhost only if env var is malformed
    remotePatterns.push({ protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/uploads/**' });
  }
} else {
  // Dev fallback when NEXT_PUBLIC_API_URL is not set
  remotePatterns.push({ protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/uploads/**' });
}

const nextConfig = {
  // Use standalone output so Azure SWA can boot the server faster and more reliably
  output: 'standalone',
  images: {
    remotePatterns,
  },
  // Ensure '@/...' imports resolve correctly in all environments
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(process.cwd()),
    };
    return config;
  },
};

export default nextConfig;
