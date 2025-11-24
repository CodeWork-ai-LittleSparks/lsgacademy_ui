/** @type {import('next').NextConfig} */
import path from 'path';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// const apiUrl = 'https://api.dev.lsgacademy.in';

let remotePatterns = [];
const domains = new Set();
if (apiUrl) {
  try {
    const u = new URL(apiUrl);
    const protocol = u.protocol.replace(':', '');
    const hostname = u.hostname;
    const pattern = { protocol, hostname, pathname: '/uploads/**' };
    if (u.port) pattern.port = u.port;
    remotePatterns.push(pattern);
    domains.add(hostname);
    // Allow both http and https for the same host (useful across envs)
    remotePatterns.push({ protocol: 'https', hostname, pathname: '/uploads/**' });
  } catch (e) {
    // Fallback to localhost only if env var is malformed
    remotePatterns.push({ protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/uploads/**' });
    domains.add('localhost');
  }
} else {
  // Dev fallback when NEXT_PUBLIC_API_URL is not set
  remotePatterns.push({ protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/uploads/**' });
  domains.add('localhost');
}

// Always allow the known production CDN/API host for uploads
remotePatterns.push({ protocol: 'https', hostname: 'api.dev.lsgacademy.in', pathname: '/uploads/**' });
domains.add('api.dev.lsgacademy.in');

const nextConfig = {
  // Use standalone output so Azure SWA can boot the server faster and more reliably
  output: 'standalone',
  images: {
    remotePatterns,
    domains: Array.from(domains),
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
