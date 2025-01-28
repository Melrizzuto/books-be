import connection from "../connection.js";
// import CustomError from "../classes/CustomError";

// Index - Leggi tutti i libri
function index(req, res) {
    const sql = "SELECT * FROM books";
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }

        console.log(results);

        const response = {
            info: {
                totalCount: results.length,
            },
            results: results,
        };

        res.json(response);
    });
}

// Show - Leggi un singolo libro
function show(req, res) {
    // Estrai l'ID dal parametro URL
    const id = parseInt(req.params.id);

    // Verifica che l'ID sia valido
    if (isNaN(id)) {
        return res.status(400).json({ error: "ID non valido" });
    }

    // Query per ottenere il libro con l'ID specificato, insieme alla media dei voti delle recensioni
    const sql = `
    SELECT books.*, AVG(reviews.vote) AS vote_average  
    FROM books 
    JOIN reviews ON reviews.book_id = books.id 
    WHERE books.id = ? 
    GROUP BY reviews.book_id
  `;

    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore nella query del database" });
        }

        const item = results[0];  // Prendi il primo risultato, che dovrebbe essere l'unico per ID
        if (!item) {
            return res.status(404).json({ error: "Libro non trovato" });
        }

        // Se il libro esiste, esegui una seconda query per ottenere le recensioni
        const sqlReviews = "SELECT * FROM reviews WHERE book_id = ?"; // Nota che qui uso 'book_id' come in precedenza
        connection.query(sqlReviews, [id], (error, reviews) => {
            if (error) {
                return res.status(500).json({ error: "Errore durante il recupero delle recensioni" });
            }

            // Aggiungi le recensioni all'oggetto del libro
            item.reviews = reviews;

            // Restituisci il libro con le recensioni e la media dei voti
            res.json({ success: true, item });
        });
    });
}

// Store - Crea un nuovo libro
function store(req, res) {
    let newId = 0;
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id > newId) {
            newId = posts[i].id;
        }
    }
    newId += 1;
    const newPost = { id: newId, ...req.body };
    posts.push(newPost);
    res.json({ success: true, item: newPost });
}

// Update - Modifica un libro esistente
function update(req, res) {
    const id = parseInt(req.params.id);
    const item = examples.find((item) => item.id === id);
    if (!item) {
        throw new CustomError("L'elemento non esiste", 404);
    }

    for (const key in item) {
        if (key !== "id") {
            item[key] = req.body[key];
        }
    }

    res.json(item);
}

// Destroy - Elimina un libro
function destroy(req, res) {
    const id = parseInt(req.params.id);
    const sql = "DELETE FROM books WHERE id = ?";

    connection.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Errore nella query di eliminazione" });
        }
        res.sendStatus(204);
    });
}

export { index, show, store, update, destroy };
