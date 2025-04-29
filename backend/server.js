const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Database setup
const db = new sqlite3.Database(path.resolve(__dirname, 'transactions.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create transactions table if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nro_cheque TEXT,
    proveedor TEXT,
    cuit TEXT,
    entrego TEXT,
    importe REAL,
    vto TEXT,
    fecha_acreditacion TEXT,
    fecha_liquidacion TEXT,
    dias INTEGER,
    tasa REAL,
    tasa_efectiva_mas_gastos REAL,
    intereses REAL,
    saldo REAL,
    utilidad REAL,
    categoria TEXT
  )`);
});

const transactionsRouter = require('./routes/transactions');

app.use('/api/transactions', transactionsRouter);

app.get('/', (req, res) => {
  res.send('Financial Transactions Backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { app, db };
