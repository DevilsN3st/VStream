# VStream - 2 
A video Streaming app which uses HLS to serve video.
Anyone can start as a guest user and browse which is already logged in.


<br>
<br>
 > 'earlier version of this app is available at previous commit - 9f71224'
 > it used to serve video using node.js and express.js only by pipeing the video stream to response object.



Tech Stack Used -

- Node.js
- Express.js
- ffmpeg
- React.js
- PostgreSQL
- Prisma
- Redis
- Docker
- Nginx


# Frontend
Used React.js for frontend and Context Api for state management.

# Backend
Used Node.js and Express.js for backend server to process the request and response of client. 
<br>
Use of HLS ( HTTP Live Streaming ) for streaming video.
<br>
Used ffmpeg for converting mp4 video to HLS ( .m3u8 ) format.
<br>
Used Redis for caching data from server.
<br>

# DevOps
Used Docker for containerization.
<br>
Used Nginx for reverse proxy and load balancing.
<br>


# Data
Used PostgreSQL as DB and Prisma as ORM to store data.


# How to run
- Clone the repo
- Add .env file in root directory with following variables
```
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/postgres"
REDIS_URL="redis://redis:6379"
COOKIE_SECRET="some-secret"
```
- Make sure you have docker and docker-compose installed
- Run `docker-compose up --build` to build and run the containers
- Open `localhost:3050` in browser to see the app running


# Next Steps

- [ ] Add User Authentication and Authorization
- [ ] Add Caching to other features
- [ ] Add more features like like, dislike, comment, share, etc
- [ ] Add multiple quality options for video
- [ ] Add more features to video player like playback speed, etc