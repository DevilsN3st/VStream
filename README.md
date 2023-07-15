# VStream - 2 
A video Streaming app which uses HLS ( HTTP Live Streaming ) to serve video with adaptive bitrate support.
Anyone can start as a guest user and browse which is already logged in.
Some Sample Videos and Users are already seeded in the database.
Follow the below mentioned steps to run the app with seeded data.


<br>
<blockquote><p>
 earlier version of this app is available at previous commit - 9f71224
</p></blockquote>
<blockquote><p>
 it used to serve video using node.js and express.js only by pipeing the video stream to response object.
</p></blockquote>
<br>



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
Used Node.js and Express.js for backend. 
Used NodeJs Stream to serve video in chunks.
Used Redis for caching and Nginx for load balancing.

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
- Once the docker Containers are up and running, open the terminal of server container and run `prisma migrate dev` to migrate the database schema
- On same terminal run `prisma generate` to generate prisma and `prisma db seed` to seed the database
- Open `localhost:3050` in browser to see the app running


# Next Steps

- [ ] Add User Authentication and Authorization
- [ ] Add Caching to other features
- [ ] Add more features like like, dislike, comment, share, etc
- [ ] Add multiple quality options for video
- [ ] Add more features to video player like playback speed, etc