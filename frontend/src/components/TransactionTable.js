import React, { useState } from 'react';

function TransactionTable({ transactions, onEdit, onDelete, filters, setFilters }) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getRowClass = (categoria) => {
    if (!categoria) return '';
    const cat = categoria.toLowerCase();
    if (cat.includes('error')) return 'bg-red-200';
    if (cat.includes('procesado')) return 'bg-blue-200';
    return '';
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Buscar por cualquier campo"
          value={searchInput}
          onChange={handleSearchChange}
          className="border p-2 rounded flex-grow min-w-[200px]"
        />
        <input
          type="text"
          name="proveedor"
          placeholder="Filtrar por Proveedor"
          value={filters.proveedor}
          onChange={handleFilterChange}
          className="border p-2 rounded min-w-[150px]"
        />
        <input
          type="text"
          name="cuit"
          placeholder="Filtrar por CUIT"
          value={filters.cuit}
          onChange={handleFilterChange}
          className="border p-2 rounded min-w-[150px]"
        />
        <input
          type="date"
          name="startDate"
          placeholder="Fecha inicio"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="endDate"
          placeholder="Fecha fin"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
      </div>
      <div className="overflow-x-auto max-h-[500px]">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border p-2">Nro Cheque</th>
              <th className="border p-2">Proveedor</th>
              <th className="border p-2">CUIT</th>
              <th className="border p-2">Entregó</th>
              <th className="border p-2">Importe</th>
              <th className="border p-2">Vto</th>
              <th className="border p-2">Fecha Acreditación</th>
              <th className="border p-2">Fecha Liquidación</th>
              <th className="border p-2">Días</th>
              <th className="border p-2">Tasa</th>
              <th className="border p-2">Tasa Efectiva + Gastos</th>
              <th className="border p-2">Intereses</th>
              <th className="border p-2">Saldo</th>
              <th className="border p-2">Utilidad</th>
              <th className="border p-2">Categoría</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan="16" className="text-center p-4">No hay registros</td>
              </tr>
            )}
            {transactions.map((tx) => (
              <tr key={tx.id} className={getRowClass(tx.categoria)}>
                <td className="border p-2">{tx.nro_cheque}</td>
                <td className="border p-2">{tx.proveedor}</td>
                <td className="border p-2">{tx.cuit}</td>
                <td className="border p-2">{tx.entrego}</td>
                <td className="border p-2">{tx.importe}</td>
                <td className="border p-2">{tx.vto}</td>
                <td className="border p-2">{tx.fecha_acreditacion}</td>
                <td className="border p-2">{tx.fecha_liquidacion}</td>
                <td className="border p-2">{tx.dias}</td>
                <td className="border p-2">{tx.tasa}</td>
                <td className="border p-2">{tx.tasa_efectiva_mas_gastos}</td>
                <td className="border p-2">{tx.intereses}</td>
                <td className="border p-2">{tx.saldo}</td>
                <td className="border p-2">{tx.utilidad}</td>
                <td className="border p-2">{tx.categoria}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => onEdit(tx)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
