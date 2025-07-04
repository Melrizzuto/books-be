import mysql from "mysql2";

const connection = mysql.createConnection({
    host: 'switchback.proxy.rlwy.net',
    user: 'root',
    password: 'iqBuZRcGeQxGcBfpKLIqfThbkCGSFzjq',
    database: 'db_books',
    port: '33555'
});

connection.connect((err) => {
    if (err) {
        console.error('Errore di connessione al database:', err.message);
        return;
    }
    console.log('Connesso al database!');
});

export default connection;