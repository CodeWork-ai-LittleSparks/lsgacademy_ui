/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
  images: {
    remotePatterns,
  },
};

export default nextConfig;
