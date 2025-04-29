const express = require('express');
const router = express.Router();
const { db } = require('../server');

// Helper function to calculate days difference
function calculateDays(vto, fecha_liquidacion) {
  const dateVto = new Date(vto);
  const dateLiquidacion = new Date(fecha_liquidacion);
  const diffTime = dateLiquidacion - dateVto;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Helper function to calculate interests, saldo, utilidad
function calculateFinancials(importe, dias, tasa, tasa_efectiva_mas_gastos) {
  // Simple interest calculation example
  const intereses = (importe * tasa * dias) / 36000;
  const saldo = importe + intereses;
  const utilidad = (importe * tasa_efectiva_mas_gastos * dias) / 36000;
  return { intereses, saldo, utilidad };
}

// Get all transactions with optional filters and search
router.get('/', (req, res) => {
  let { search, proveedor, cuit, startDate, endDate } = req.query;
  let query = 'SELECT * FROM transactions WHERE 1=1';
  let params = [];

  if (search) {
    query += ' AND (nro_cheque LIKE ? OR proveedor LIKE ? OR cuit LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam);
  }
  if (proveedor) {
    query += ' AND proveedor = ?';
    params.push(proveedor);
  }
  if (cuit) {
    query += ' AND cuit = ?';
    params.push(cuit);
  }
  if (startDate) {
    query += ' AND vto >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND vto <= ?';
    params.push(endDate);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add new transaction
router.post('/', (req, res) => {
  const {
    nro_cheque,
    proveedor,
    cuit,
    entrego,
    importe,
    vto,
    fecha_acreditacion,
    fecha_liquidacion,
    tasa,
    tasa_efectiva_mas_gastos,
    categoria
  } = req.body;

  const dias = calculateDays(vto, fecha_liquidacion);
  const { intereses, saldo, utilidad } = calculateFinancials(importe, dias, tasa, tasa_efectiva_mas_gastos);

  const sql = `INSERT INTO transactions 
    (nro_cheque, proveedor, cuit, entrego, importe, vto, fecha_acreditacion, fecha_liquidacion, dias, tasa, tasa_efectiva_mas_gastos, intereses, saldo, utilidad, categoria)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    nro_cheque,
    proveedor,
    cuit,
    entrego,
    importe,
    vto,
    fecha_acreditacion,
    fecha_liquidacion,
    dias,
    tasa,
    tasa_efectiva_mas_gastos,
    intereses,
    saldo,
    utilidad,
    categoria || null
  ];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Update transaction by id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    nro_cheque,
    proveedor,
    cuit,
    entrego,
    importe,
    vto,
    fecha_acreditacion,
    fecha_liquidacion,
    tasa,
    tasa_efectiva_mas_gastos,
    categoria
  } = req.body;

  const dias = calculateDays(vto, fecha_liquidacion);
  const { intereses, saldo, utilidad } = calculateFinancials(importe, dias, tasa, tasa_efectiva_mas_gastos);

  const sql = `UPDATE transactions SET
    nro_cheque = ?,
    proveedor = ?,
    cuit = ?,
    entrego = ?,
    importe = ?,
    vto = ?,
    fecha_acreditacion = ?,
    fecha_liquidacion = ?,
    dias = ?,
    tasa = ?,
    tasa_efectiva_mas_gastos = ?,
    intereses = ?,
    saldo = ?,
    utilidad = ?,
    categoria = ?
    WHERE id = ?`;

  const params = [
    nro_cheque,
    proveedor,
    cuit,
    entrego,
    importe,
    vto,
    fecha_acreditacion,
    fecha_liquidacion,
    dias,
    tasa,
    tasa_efectiva_mas_gastos,
    intereses,
    saldo,
    utilidad,
    categoria || null,
    id
  ];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ updatedID: id });
    }
  });
});

// Delete transaction by id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM transactions WHERE id = ?';
  db.run(sql, id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ deletedID: id });
    }
  });
});

module.exports = router;
