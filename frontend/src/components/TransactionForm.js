import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialFormState = {
  nro_cheque: '',
  proveedor: '',
  cuit: '',
  entrego: '',
  importe: '',
  vto: '',
  fecha_acreditacion: '',
  fecha_liquidacion: '',
  tasa: '',
  tasa_efectiva_mas_gastos: '',
  categoria: ''
};

function TransactionForm({ transaction, onClose }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction && transaction.id) {
      setFormData({
        nro_cheque: transaction.nro_cheque || '',
        proveedor: transaction.proveedor || '',
        cuit: transaction.cuit || '',
        entrego: transaction.entrego || '',
        importe: transaction.importe || '',
        vto: transaction.vto || '',
        fecha_acreditacion: transaction.fecha_acreditacion || '',
        fecha_liquidacion: transaction.fecha_liquidacion || '',
        tasa: transaction.tasa || '',
        tasa_efectiva_mas_gastos: transaction.tasa_efectiva_mas_gastos || '',
        categoria: transaction.categoria || ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [transaction]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nro_cheque) newErrors.nro_cheque = 'Número de Cheque es requerido';
    if (!formData.proveedor) newErrors.proveedor = 'Proveedor es requerido';
    if (!formData.cuit) newErrors.cuit = 'CUIT es requerido';
    if (!formData.importe || isNaN(formData.importe)) newErrors.importe = 'Importe válido es requerido';
    if (!formData.vto) newErrors.vto = 'Fecha de Vencimiento es requerida';
    if (!formData.fecha_liquidacion) newErrors.fecha_liquidacion = 'Fecha de Liquidación es requerida';
    if (!formData.tasa || isNaN(formData.tasa)) newErrors.tasa = 'Tasa válida es requerida';
    if (!formData.tasa_efectiva_mas_gastos || isNaN(formData.tasa_efectiva_mas_gastos)) newErrors.tasa_efectiva_mas_gastos = 'Tasa efectiva válida es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (transaction && transaction.id) {
        await axios.put(`http://localhost:5000/api/transactions/${transaction.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/transactions', formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">{transaction && transaction.id ? 'Editar Registro' : 'Nuevo Registro'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Número de Cheque</label>
            <input
              type="text"
              name="nro_cheque"
              value={formData.nro_cheque}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.nro_cheque ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.nro_cheque && <p className="text-red-500 text-sm">{errors.nro_cheque}</p>}
          </div>
          <div>
            <label className="block font-semibold">Proveedor</label>
            <input
              type="text"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.proveedor ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.proveedor && <p className="text-red-500 text-sm">{errors.proveedor}</p>}
          </div>
          <div>
            <label className="block font-semibold">CUIT</label>
            <input
              type="text"
              name="cuit"
              value={formData.cuit}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.cuit ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.cuit && <p className="text-red-500 text-sm">{errors.cuit}</p>}
          </div>
          <div>
            <label className="block font-semibold">Entregó</label>
            <input
              type="text"
              name="entrego"
              value={formData.entrego}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-300"
            />
          </div>
          <div>
            <label className="block font-semibold">Importe</label>
            <input
              type="number"
              name="importe"
              value={formData.importe}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.importe ? 'border-red-500' : 'border-gray-300'}`}
              step="0.01"
            />
            {errors.importe && <p className="text-red-500 text-sm">{errors.importe}</p>}
          </div>
          <div>
            <label className="block font-semibold">Fecha de Vencimiento</label>
            <input
              type="date"
              name="vto"
              value={formData.vto}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.vto ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.vto && <p className="text-red-500 text-sm">{errors.vto}</p>}
          </div>
          <div>
            <label className="block font-semibold">Fecha de Acreditación</label>
            <input
              type="date"
              name="fecha_acreditacion"
              value={formData.fecha_acreditacion}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-300"
            />
          </div>
          <div>
            <label className="block font-semibold">Fecha de Liquidación</label>
            <input
              type="date"
              name="fecha_liquidacion"
              value={formData.fecha_liquidacion}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.fecha_liquidacion ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.fecha_liquidacion && <p className="text-red-500 text-sm">{errors.fecha_liquidacion}</p>}
          </div>
          <div>
            <label className="block font-semibold">Tasa</label>
            <input
              type="number"
              name="tasa"
              value={formData.tasa}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.tasa ? 'border-red-500' : 'border-gray-300'}`}
              step="0.01"
            />
            {errors.tasa && <p className="text-red-500 text-sm">{errors.tasa}</p>}
          </div>
          <div>
            <label className="block font-semibold">Tasa efectiva más gastos</label>
            <input
              type="number"
              name="tasa_efectiva_mas_gastos"
              value={formData.tasa_efectiva_mas_gastos}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.tasa_efectiva_mas_gastos ? 'border-red-500' : 'border-gray-300'}`}
              step="0.01"
            />
            {errors.tasa_efectiva_mas_gastos && <p className="text-red-500 text-sm">{errors.tasa_efectiva_mas_gastos}</p>}
          </div>
          <div>
            <label className="block font-semibold">Categoría / Etiqueta</label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-300"
              placeholder="Ej: error, procesado"
            />
          </div>
          <div className="col-span-full flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;
