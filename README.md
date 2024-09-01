# Assignment 2: Docker

I'm using a Mongoose assignment done in previous to do this docker assignment.

## Installing Node modules

Install the required dependencies and test it locally.

```bash
npm install
```

```bash
npm run dev
```

Generate Docker files using this command.

## Adding docker files

```bash
docker init
```
This creates Dockerfile, README.DOCKER.md, and compose.yaml for containerization.

Update compose.yaml to include environment variables for MongoDB Atlas, such as MONGO_URI.

##  Test by running

Verify that the container runs correctly in Docker Desktop.

```bash
docker compose up --watch
```

Build and start the Docker container.

```bash
docker compose up --build
```

## Conclusion

Docker watch command worked locally on my device, but the build process encountered issues that prevented successful build command from happening. Additionally, I was unable to deploy the Docker container to Azure and faced problems with MongoDB connections.
