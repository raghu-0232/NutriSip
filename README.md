# NutriSip

## Project Overview

This project is a full-stack web application called NutriSip. The entire application is containerized using Docker for consistent and isolated development and production environments.

### Technology Stack

| Layer      | Technology        | Description                                                                                                                            |
| :--------- | :---------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | **React.js**      | A JavaScript library for building user interfaces.                                                                                     |
|            | **Nginx**           | A high-performance web server used to serve the production build of the React application.                                             |
| **Backend**  | **Node.js**       | A JavaScript runtime environment for executing the backend code.                                                                       |
|            | **Express.js**    | A web application framework for Node.js, used to build the backend API.                                                                |
| **Database** | **MySQL**           | A popular open-source relational database used for data storage.                                                                       |
| **Real-time**| **ws (WebSocket)**| A library enabling two-way, real-time communication between the client and server.                                                     |
| **Deployment**| **Docker**        | Your entire application (frontend, backend, and database) is containerized using Docker, allowing for consistent and isolated environments. |

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## How to Deploy with Docker Compose

This application can be easily deployed using Docker Compose, which orchestrates the frontend, backend, and database services.

### Prerequisites

*   Docker installed on your system.
*   Docker Compose installed on your system.

### 1. Environment Variables

Create a `.env` file in the root directory of the project (where `docker-compose.yml` is located). This file will contain sensitive information and API keys.

```
# PhonePe API Credentials (replace with your actual values)
PHONEPE_MERCHANT_ID=YOUR_PHONEPE_MERCHANT_ID
PHONEPE_SALT_KEY=YOUR_PHONEPE_SALT_KEY
PHONEPE_REDIRECT_URL=http://localhost:3000/payment-status
```

### 2. Build and Run with Docker Compose

Navigate to the root directory of the project in your terminal:

```bash
cd /path/to/your/my-app
```

First, build the Docker images for your services. This step compiles your application code within the Docker images.

```bash
docker-compose build
```

Once the images are built, you can start all services defined in your `docker-compose.yml` file:

```bash
docker-compose up -d
```

The `-d` flag runs the containers in detached mode (in the background).

### 3. Access the Application

Once all services are up and running, you can access the frontend application in your web browser at:

`http://localhost:3000`

### 4. Stop the Application

To stop and remove the containers, networks, and volumes created by `docker-compose up`, run:

```bash
docker-compose down
```

If you want to remove the persistent MySQL data volume as well (useful for a clean restart), use:

```bash
docker-compose down --volumes
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> 38a210b (feat: Add Docker Compose deployment instructions and clean up .gitignore)
