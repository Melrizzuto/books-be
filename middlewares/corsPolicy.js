// corsPolicy è un middleware per gestire la politica CORS (Cross-Origin Resource Sharing) in un'applicazione Node.js, solitamente usata con Express. Serve a controllare quali risorse possono essere accessibili da domini diversi rispetto a quello del server.

function corsPolicy(req, res, next) {
    // WEBSITE YOU WISH TO ALLOW TO CONNECT
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8888");

    // REQUEST METHODS YOU WISH TO ALLOW
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // REQUEST HEADERS YOU WISH TO ALLOW
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With, Content-Type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Proceed to the next middleware
    next();
}

// Export the middleware
export default corsPolicy;