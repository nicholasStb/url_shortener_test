# Next.js URL Shortener

Welcome to the Next.js URL Shortener project! This application allows you to shorten URLs, track usage, and manage your links, all built with Next.js, PostgreSQL, and Docker.

## Getting Started

This guide will walk you through setting up and running the URL Shortener application using Docker, Prisma, and Next.js. Please follow the steps below to get everything up and running on your machine.

### Prerequisites

Before you begin, make sure you have the following installed:

- **Docker Engine**: Ensure that Docker Engine is installed and running on your machine. You can download it from the [Docker website](https://docs.docker.com/get-docker/).
- **Docker Compose**: Docker Compose is included with Docker Desktop, but if needed, you can install it separately. This tool is used for defining and running multi-container Docker applications.

### Installation

1. **Clone the Repository**

   Open your terminal and clone the repository to your local machine:
   ```bash
   git clone https://github.com/nicholasStb/url_shortener_test
   ```

2. **Navigate to the Project Directory**

   Change to the project directory:
   ```bash
   cd url_shortener_test
   ```

3. **Create and Start the Docker Containers**

   Build and start the Docker containers by running the following command:
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Pull the necessary Docker images.
   - Create and start the PostgreSQL and Next.js containers.
   - Install the required Node.js dependencies.
   - Run database migrations using Prisma.
   - Start the Next.js development server.

4. **Access the Application**

   Once the setup is complete, you can access the application by opening your browser and navigating to:
   ```
   http://localhost:3000
   ```

### Additional Information

#### Services

- **PostgreSQL**: Accessible on port `5432`.
- **Next.js**: Accessible on port `3000`.

#### Environment Variables

The following environment variables are used in the `docker-compose.yml` file:

- `POSTGRES_USER`: The PostgreSQL username.
- `POSTGRES_PASSWORD`: The PostgreSQL password.
- `POSTGRES_DB`: The PostgreSQL database name.
- `PGPASSWORD`: The PostgreSQL password for the Next.js application.

#### Volumes

- **postgres_data**: This volume is used to persist PostgreSQL data.

#### Networks

- **nextjs_network**: The network used by the PostgreSQL and Next.js containers.

### Useful Commands

- **Start the containers**: 
  ```bash
  docker-compose up -d
  ```
- **Stop the containers**:
  ```bash
  docker-compose down
  ```
- **View logs**:
  ```bash
  docker-compose logs -f
  ```

### Learn More

To dive deeper into Next.js, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and APIs.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Your feedback and contributions are welcome!

---

Happy coding! If you have any issues or questions, feel free to open an issue on the repository.
