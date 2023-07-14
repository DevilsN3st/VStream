# VStream - 2 
A video Streaming app which uses HLS to serve video.
Anyone can start as a guest user and browse which is already logged in.


Tech Stack Used -

- Node.js
- Express.js
- PostgreSQL
- Prisma
- React.js
- Redis
- Docker
- Nginx
- ffmpeg


# Frontend
Used React.js for frontend and Context Api for state management.

# Backend
Used Node.js and Express.js for backend. 
Use of HLS for streaming video.
Used ffmpeg for converting video to HLS format.
Used Redis for caching and Nginx for load balancing.

# Data
Used PostgreSQL as DB and Prisma as ORM to store data.


# Next Steps

- [ ] Add User Authentication and Authorization
- [ ] Add Caching to other features
- [ ] Add more features like like, dislike, comment, share, etc
- [ ] Add multiple quality options for video
- [ ] Add more features to video player like playback speed, etc