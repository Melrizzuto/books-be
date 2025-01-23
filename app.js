// import express in app.js
import express from ("express");
// create a server instance
import app from express();

// set costant to port
import port from process.env.PORT || 3000;

//other imports
import errorHandler from ("./middlewares/errorsHandler")
import notFound from ("./middlewares/notFound")
import corsPolicy from ("./middlewares/corsPolicy")
import booksRouter from ("./routers/booksRouter")

//define static assets path
//create piblic directory inside root directory mkdir public
app.use(express.static("public")); //middleware per indicare al node quale cartella usare per i file statici. (unica cartella pubblica) Va usata prima di ogni rotta.


//add root route
app.get("/", (req, res) => {
    res.send("Home Page");
});

//Other routes
app.use("/books", booksRouter)

app.use(corsPolicy);
//rotta per errore generale del server
app.use(errorHandler);
//rotta per risorsa non trovata
app.use(notFound);
// server must listen on your host and your port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})