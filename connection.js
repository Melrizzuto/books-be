const mysql = require("mysql2"); // importo mysql2

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ciaociaociao!',
    database: 'db_blog',
});

connection.connect((err) => {
    if (err) {
        console.error('Errore di connessione al database:', err.message);
        return;
    }
    console.log('Connesso al database!');
});

module.exports = connection;