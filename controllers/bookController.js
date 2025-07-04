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
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID non valido" });
    }

    const sql = `
      SELECT books.*, AVG(reviews.vote) AS vote_average  
      FROM books 
      LEFT JOIN reviews ON reviews.book_id = books.id 
      WHERE books.id = ? 
      GROUP BY books.id
    `;

    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Errore nella query:", err);
            return res.status(500).json({ error: "Errore nella query del database" });
        }

        const item = results[0];
        if (!item) {
            return res.status(404).json({ error: "Libro non trovato" });
        }

        const sqlReviews = "SELECT * FROM reviews WHERE book_id = ? ORDER BY created_at DESC";
        connection.query(sqlReviews, [id], (error, reviews) => {
            if (error) {
                return res.status(500).json({ error: "Errore durante il recupero delle recensioni" });
            }

            item.reviews = reviews;
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

function storeReview(req, res) {
    // recuperiamo i parametri dalla richiesta
    const { id } = req.params;

    // verifica che l'ID sia valido
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid book ID" });
    }

    // Recuperiamo il body
    const { text, name, vote } = req.body;

    // Validazione del body
    if (!text || !name || vote === undefined || isNaN(parseFloat(vote))) {
        return res.status(400).json({
            error: "Invalid input.",
        });
    }

    // Prepariamo la query
    const sql = "INSERT INTO reviews (text, name, vote, book_id) VALUES (?, ?, ?, ?)"; //prepared statement

    // Eseguiamo la query devo matchare nella posizione 
    connection.query(sql, [text, name, vote, id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        res.status(201).json({
            message: "Review added",
            id: results.insertId,
        });
    });
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

export { index, show, store, storeReview, update, destroy };
