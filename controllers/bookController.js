import connection from "../connection.js";

// INDEX - Leggi tutti i libri
function index(req, res) {
    const sql = "SELECT * FROM books";
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Errore nella query:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        const response = {
            info: {
                totalCount: results.length,
            },
            results: results,
        };

        res.json(response);
    });
}

// SHOW - Leggi un singolo libro con le recensioni
function show(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID non valido" });
    }

    const sql = `
      SELECT books.*, COALESCE(AVG(reviews.vote), 0) AS vote_average  
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
                console.error("Errore recuperando le recensioni:", error);
                return res.status(500).json({ error: "Errore durante il recupero delle recensioni" });
            }

            item.reviews = reviews || [];
            res.json({ success: true, item });
        });
    });
}

// STORE - Crea un nuovo libro
function store(req, res) {
    const { title, author, abstract, image } = req.body;

    if (!title || !author || !abstract || !image) {
        return res.status(400).json({ error: "Dati mancanti per creare il libro." });
    }

    const sql = "INSERT INTO books (title, author, abstract, image) VALUES (?, ?, ?, ?)";
    connection.query(sql, [title, author, abstract, image], (err, result) => {
        if (err) {
            console.error("Errore durante l'inserimento:", err);
            return res.status(500).json({ error: "Errore nella creazione del libro" });
        }

        res.status(201).json({
            success: true,
            item: { id: result.insertId, title, author, abstract, image }
        });
    });
}

// STORE REVIEW - Aggiunge una recensione a un libro
function storeReview(req, res) {
    const { id } = req.params;
    const { text, name, vote } = req.body;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid book ID" });
    }

    if (!text || !name || vote === undefined || isNaN(parseFloat(vote))) {
        return res.status(400).json({ error: "Invalid input." });
    }

    const sql = "INSERT INTO reviews (text, name, vote, book_id) VALUES (?, ?, ?, ?)";

    connection.query(sql, [text, name, vote, id], (err, results) => {
        if (err) {
            console.error("Errore durante l'inserimento recensione:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        res.status(201).json({
            message: "Review added",
            id: results.insertId,
        });
    });
}

// UPDATE - Modifica un libro (da completare se ti serve davvero)
function update(req, res) {
    const id = parseInt(req.params.id);
    const { title, author, abstract, image } = req.body;

    if (!title || !author || !abstract || !image) {
        return res.status(400).json({ error: "Dati mancanti per aggiornare il libro." });
    }

    const sql = "UPDATE books SET title = ?, author = ?, abstract = ?, image = ? WHERE id = ?";
    connection.query(sql, [title, author, abstract, image, id], (err, result) => {
        if (err) {
            console.error("Errore durante l'aggiornamento:", err);
            return res.status(500).json({ error: "Errore durante l'aggiornamento del libro" });
        }

        res.json({ success: true, message: "Libro aggiornato correttamente." });
    });
}

// DESTROY - Elimina un libro
function destroy(req, res) {
    const id = parseInt(req.params.id);

    const sql = "DELETE FROM books WHERE id = ?";
    connection.query(sql, [id], (err) => {
        if (err) {
            console.error("Errore nella query di eliminazione:", err);
            return res.status(500).json({ error: "Errore nella query di eliminazione" });
        }
        res.sendStatus(204);
    });
}

export { index, show, store, storeReview, update, destroy };
