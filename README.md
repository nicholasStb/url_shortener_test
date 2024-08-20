Next.js URL Shortener
This project is a URL shortener application built with Next.js, PostgreSQL, and Docker.

Getting Started
This README covers the necessary steps to set up Docker, Prisma, and run the development server for your Next.js project. Adjust any specific instructions based on your project's actual configurations and requirements.

Setting up the Docker based environments and required infrastructure.
Docker Engine: Make sure Docker Engine is installed and running on your machine. You can download it from the Docker website.(https://docs.docker.com/get-docker/)
Docker Compose: Install Docker Compose, which is a tool for defining and running multi-container Docker applications. It’s often included with Docker Desktop, but you can also install it separately if needed.
Installation
Clone the repository : git clone https://github.com/nicholasStb/url_shortener_test
Open a command prompt/terminal and change directory into the cloned code base. (using 'cd' command)
Create and start the Docker containers
Execute command 'docker-compose up --build' in the command prompt/terminal

This command will:
Pull the necessary Docker images.
Create and start the PostgreSQL and Next.js containers.
Install the necessary Node.js dependencies.
Run database migrations using Prisma.
Start the Next.js development server.
Access the application
Open http://localhost:3000 with your browser to see the result.

Extra Information
Services
PostgreSQL: Accessible on port 5432.
Next.js: Accessible on port 3000.
Environment Variables
The following environment variables are used in the docker-compose.yml file

POSTGRES_USER: The PostgreSQL username.
POSTGRES_PASSWORD: The PostgreSQL password.
POSTGRES_DB: The PostgreSQL database name.
PGPASSWORD: The PostgreSQL password for the Next.js application.
Volumns
postgres_data: Stores the PostgreSQL data.

Networks
nextjs_network: The network used by the PostgreSQL and Next.js containers.

Commands
Start the containers: docker-compose up -d Stop the containers: docker-compose down View logs: docker-compose logs -f

Learn More
To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and API. Learn Next.js - an interactive Next.js tutorial. You can check out the Next.js GitHub repository - your feedback and contributions are welcome!
