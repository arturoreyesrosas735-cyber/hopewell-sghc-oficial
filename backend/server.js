const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos
const db = new sqlite3.Database("./database.db");

// Crear tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      edad INTEGER,
      genero TEXT,
      tipo TEXT
    )
  `);
});

// GET pacientes
app.get("/pacientes", (req, res) => {
  db.all("SELECT * FROM pacientes", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// POST pacientes
app.post("/pacientes", (req, res) => {
  const { nombre, edad, genero, tipo } = req.body;

  db.run(
    "INSERT INTO pacientes (nombre, edad, genero, tipo) VALUES (?, ?, ?, ?)",
    [nombre, edad, genero, tipo],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// Servidor
app.listen(3001, () => {
  console.log("✅ Servidor corriendo en http://localhost:3001");
});