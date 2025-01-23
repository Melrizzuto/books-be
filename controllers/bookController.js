// const books = require("../models/examplesData");
const CustomError = require("../classes/CustomError");
const connection = require("../connection");

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


function show(req, res) {
    console.log("Richiesta ricevuta per ID:", req.params.id);
    const id = parseInt(req.params.id);

    // Controllo ID valido
    if (isNaN(id)) {
        return res.status(400).json({ error: "ID non valido" });
    }

    const sql = "SELECT * FROM books WHERE id = ?";
    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore nella query del database" });
        }

        const item = results[0];
        if (!item) {
            return res.status(404).json({ error: "Book non trovato" });
        }
        // Risposta con il book trovato
        res.json({ success: true, item });
    });
}

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
module.exports = { index, show, store, update, destroy };