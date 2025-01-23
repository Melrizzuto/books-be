// Import express
import express from "express";
// Create a server instance
const app = express();

// Set the port
const port = process.env.PORT || 3000;

// Other imports
import errorHandler from "./middlewares/errorsHandler.js";
import notFound from "./middlewares/notFound.js";
import corsPolicy from "./middlewares/corsPolicy.js";
import booksRouter from "./routers/booksRouter.js";

// Define static assets path
// Create public directory inside the root directory (mkdir public)
app.use(express.static("public")); // Middleware to define the public folder for static files, must be set before routes

// Add root route
app.get("/", (req, res) => {
    res.send("Home Page");
});

// Other routes
app.use("/books", booksRouter);

// Add middleware for CORS policy
app.use(corsPolicy);

// Middleware for general server errors
app.use(errorHandler);

// Middleware for resource not found
app.use(notFound);

// Server must listen on the specified host and port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});