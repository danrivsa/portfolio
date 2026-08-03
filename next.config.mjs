/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath:'/portfolio',
  output:'export',
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: '/portfolio'
  }
};

export default nextConfig;
