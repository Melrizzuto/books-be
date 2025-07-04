// Importa express
import express from "express";
// Crea un'istanza del server
const app = express();

// Imposta la porta
const port = process.env.PORT || 3000;

// Altri import
import errorHandler from "./middlewares/errorsHandler.js";
import notFound from "./middlewares/notFound.js";
const cors = require('cors');
import booksRouter from "./routers/booksRouter.js";

// Middleware per la gestione della politica CORS
app.use(cors({
    origin: ['http://localhost:5173', 'https://melrizzuto.github.io']
}));

// Middleware per il parsing dei body in formato JSON (utile per richieste POST/PUT)
app.use(express.json());

// Definisci il percorso per i file statici
// Crea una directory "public" nella directory principale (mkdir public)
app.use(express.static("public")); // Serve i file statici dalla cartella "public"

// Aggiungi la route principale
app.get("/", (req, res) => {
    res.send("Home Page");
});

// Aggiungi altre route
app.use("/books", booksRouter);

// Middleware per la gestione degli errori generali del server
app.use(errorHandler);

// Middleware per risorse non trovate (404)
app.use(notFound);

// Il server ascolta sull'host e sulla porta specificati
app.listen(port, () => {
    console.log(`Il server è in esecuzione su http://localhost:${port}`);
});
