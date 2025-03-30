// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Increase serverless function timeout
    experimental: {
      serverComponentsExternalPackages: ['mongoose'],
      serverActions: {
        bodySizeLimit: '2mb', // Increase body size limit
      },
    },
    // Increase API response timeout
    api: {
      responseLimit: false,
      bodyParser: {
        sizeLimit: '2mb',
      },
    },
    // Increase webpack memory limit
    webpack: (config) => {
      config.performance = {
        ...config.performance,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
      return config;
    },
  }
  
  export default nextConfig;
  
  