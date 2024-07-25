This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, ensure you have Docker installed on your system.

### Setting Up Docker

1. **Build the Docker Image**

   ```bash
   docker build -t nextjs-url-shortener .
   ```

2. **Run the Docker Container**

   ```bash
   docker run -d -p 3000:3000 nextjs-url-shortener
   ```

### Setting Up Prisma

1. **Install Prisma CLI**

   If you haven't already installed Prisma CLI, you can install it globally using npm:

   ```bash
   npm install -g prisma
   ```

2. **Initialize Prisma**

   If you don't have a `prisma` directory with your schema, you can initialize it by running:

   ```bash
   npx prisma init
   ```

3. **Configure the Database**

   Update your `prisma/schema.prisma` file with the desired database configuration. By default, the project uses SQLite, but you can switch to PostgreSQL, MySQL, or any other supported database.

4. **Run Prisma Migrate**

   Run the migrations to set up your database schema:

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client**

   Generate the Prisma Client to interact with your database:

   ```bash
   npx prisma generate
   ```

### Running the Development Server

1. **Install Dependencies**

   First, install the project dependencies:

   ```bash
   npm install
   ```

2. **Run the Development Server**

   Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

This README covers the necessary steps to set up Docker, Prisma, and run the development server for your Next.js project. Adjust any specific instructions based on your project's actual configurations and requirements.
