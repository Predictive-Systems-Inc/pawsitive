/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
            "http://127.0.0.1:8000/api/:path*"
      },
      {
        source: "/docs",
        destination:
            "http://127.0.0.1:8000/docs"
      }
    ];
  }
};

module.exports = nextConfig;
