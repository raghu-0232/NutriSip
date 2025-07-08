# NutriSip

## Project Overview

This project is a full-stack web application called NutriSip. The entire application is containerized using Docker for consistent and isolated development and production environments.

### Technology Stack

| Layer      | Technology        | Version           | Description                                                                                                                            |
| :--------- | :---------------- | :---------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | **React.js**      | `^19.1.0`         | A JavaScript library for building user interfaces.                                                                                     |
|            | **Nginx**           | `stable-alpine`   | A high-performance web server used to serve the production build of the React application.                                             |
| **Backend**  | **Node.js**       | `18-alpine`       | A JavaScript runtime environment for executing the backend code.                                                                       |
|            | **Express.js**    | `^5.1.0`          | A web application framework for Node.js, used to build the backend API.                                                                |
| **Database** | **MySQL**           | `8.0`             | A popular open-source relational database used for data storage.                                                                       |
| **Real-time**| **ws (WebSocket)**| `^8.18.3`         | A library enabling two-way, real-time communication between the client and server.                                                     |
| **Deployment**| **Docker**        | `3.8` (Compose)   | Your entire application (frontend, backend, and database) is containerized using Docker, allowing for consistent and isolated environments. |

# Getting Started with Create React App

## How to Build and Run with Docker Compose

This application is designed to be run using Docker Compose, which orchestrates the frontend, backend, and database services.

### Prerequisites

*   Docker installed on your system.
*   Docker Compose installed on your system.

### 1. Build the Docker Images

Navigate to the root directory of the project in your terminal. Run the following command to build the Docker images for all services. This step compiles your application code and packages it into runnable images.

```bash
docker-compose build
```

### 2. Run the Application

Once the images are built, you can start all services in detached mode (in the background) using:

```bash
docker-compose up -d
```

### 3. Access the Application

After the containers start, you can access the NutriSip application in your web browser at:

`http://localhost`

### 4. Stop the Application

To stop and remove the containers, networks, and volumes created by `docker-compose up`, run the following command:

```bash
docker-compose down
```

