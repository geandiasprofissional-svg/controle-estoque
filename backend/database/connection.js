const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const caminhoBanco = path.join(
    __dirname,
    "database.db"
);

const db = new sqlite3.Database(
    caminhoBanco,
    (erro) => {

        if (erro) {

            console.error(
                "Erro ao conectar ao banco de dados:",
                erro.message
            );

        } else {

            console.log(
                "Banco de dados conectado com sucesso!"
            );

            console.log(
                "Banco utilizado:",
                caminhoBanco
            );

        }

    }
);

db.run(
    "PRAGMA foreign_keys = ON"
);

module.exports = db;