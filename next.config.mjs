// /** @type {import('next').NextConfig} */
// import path from 'path';
// const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// let remotePatterns = [];
// if (apiUrl) {
//   try {
//     const u = new URL(apiUrl);
//     const pattern = {
//       protocol: u.protocol.replace(':', ''),
//       hostname: u.hostname,
//       pathname: '/uploads/**',
//     };
//     if (u.port) pattern.port = u.port;
//     remotePatterns.push(pattern);
//   } catch (e) {
//     // Fallback to localhost only if env var is malformed
//     remotePatterns.push({ protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/uploads/**' });
//   }
// } else {
//   // Dev fallback when NEXT_PUBLIC_API_URL is not set
//   remotePatterns.push({ protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/uploads/**' });
// }

// const nextConfig = {

//   output: 'standalone',
//   images: {
//     remotePatterns,
//   },
//   // Ensure '@/...' imports resolve correctly in all environments
//   webpack: (config) => {
//     config.resolve = config.resolve || {};
//     config.resolve.alias = {
//       ...(config.resolve.alias || {}),
//       '@': path.resolve(process.cwd()),
//     };
//     return config;
//   },
// };

// export default nextConfig;


// // /** @type {import('next').NextConfig} */
// // import path from 'path';
// // const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// // let remotePatterns = [];
// // if (apiUrl) {
// //   try {
// //     const u = new URL(apiUrl);
// //     const pattern = {
// //       protocol: u.protocol.replace(':', ''),
// //       hostname: u.hostname,
// //       pathname: '/uploads/**',
// //     };
// //     if (u.port) pattern.port = u.port;
// //     remotePatterns.push(pattern);
// //   } catch (e) {
// //     remotePatterns.push({ protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/uploads/**' });
// //   }
// // } else {
// //   remotePatterns.push({ protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/uploads/**' });
// // }

// // const nextConfig = {
// //   output: 'standalone',

// //   images: {
// //     remotePatterns,
// //   },
// //   webpack: (config) => {
// //     config.resolve = config.resolve || {};
// //     config.resolve.alias = {
// //       ...(config.resolve.alias || {}),
// //       '@': path.resolve(process.cwd()),
// //     };
// //     return config;
// //   },
// // };

// // export default nextConfig;



// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   output: 'standalone',
// // }

// // export default nextConfig;

// /** next.config.js **/


// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   output: 'standalone',
// // };

// // export default nextConfig;




// // /** @type {import('next').NextConfig} */
// // import path from 'path';

// // const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// // let remotePatterns = [];

// // if (apiUrl) {
// //   try {
// //     const u = new URL(apiUrl);
// //     remotePatterns.push({
// //       protocol: u.protocol.replace(':', ''), // "https"
// //       hostname: u.hostname,                  // "api.dev.lsgacademy.in"
// //       pathname: '/uploads/**',
// //       ...(u.port ? { port: u.port } : {}),
// //     });
// //   } catch (e) {
// //     remotePatterns.push({
// //       protocol: 'http',
// //       hostname: 'localhost',
// //       port: '8000',
// //       pathname: '/uploads/**',
// //     });
// //   }
// // } else {
// //   remotePatterns.push({
// //     protocol: 'http',
// //     hostname: 'localhost',
// //     port: '8000',
// //     pathname: '/uploads/**',
// //   });
// // }

// // const nextConfig = {
// //   /** 🔥 Required for Azure Static Web Apps backend */
// //   output: 'export',

// //   /** 🔥 Required — SWA does NOT support Next.js image optimizer */
// //   images: {
// //     unoptimized: true,
// //     remotePatterns,
// //   },

// //   webpack: (config) => {
// //     config.resolve.alias = {
// //       ...(config.resolve.alias || {}),
// //       '@': path.resolve(process.cwd()),
// //     };
// //     return config;
// //   },
// // };

// // export default nextConfig;




// /** @type {import('next').NextConfig} */

// const nextConfig = {
//  output: "standalone",
//    reactStrictMode: true,
//     compress: true, 
//      swcMinify: true, 
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
};

export default nextConfig;