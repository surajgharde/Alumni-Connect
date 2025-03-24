module.exports = {
    reactStrictMode: true,
    images: {
      domains: [
        'lh3.googleusercontent.com',
        'avatars.githubusercontent.com',
        'res.cloudinary.com'
      ],
    },
    async rewrites() {
      return [
        {
          source: '/socket.io/:path*',
          destination: 'http://localhost:3001/socket.io/:path*',
        },
      ];
    },
  };