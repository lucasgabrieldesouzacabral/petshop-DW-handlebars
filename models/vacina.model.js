const db = require('../database');

const Vacina = {
    listar() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM vacinas", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    criar(data) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO vacinas (nome, dataAplicacao, proximaDose, animal, veterinario)
                 VALUES (?, ?, ?, ?, ?)`,
                 [data.nome, data.dataAplicacao, data.proximaDose, data.animal, data.veterinario],
                 function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                 }
            );
        });
    },

    buscar(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM vacinas WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    atualizar(id, data) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE vacinas SET nome=?, dataAplicacao=?, proximaDose=?, animal=?, veterinario=?
                 WHERE id=?`,
                 [data.nome, data.dataAplicacao, data.proximaDose, data.animal, data.veterinario, id],
                 function(err) {
                     if (err) reject(err);
                     else resolve();
                 }
            );
        });
    },

    excluir(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM vacinas WHERE id = ?`, [id], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};

module.exports = Vacina;