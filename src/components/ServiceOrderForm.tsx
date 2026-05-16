import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Customer, ServiceOrderStatus } from '../types';

interface ServiceOrderFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { clienteId: string; descricao: string; status: ServiceOrderStatus; valorEstimado: number; dataEntrada: string }) => void;
  customers: Customer[];
}

const emptyForm = {
  clienteId: '',
  descricao: '',
  status: 'aguardando' as ServiceOrderStatus,
  valorEstimado: '',
  dataEntrada: new Date().toISOString().split('T')[0],
};

export function ServiceOrderForm({ open, onClose, onSave, customers }: ServiceOrderFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, dataEntrada: new Date().toISOString().split('T')[0] });
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  function validate() {
    const e: Record<string, string> = {};
    if (!form.clienteId) e.clienteId = 'Selecione um cliente';
    if (!form.descricao.trim()) e.descricao = 'Descricao e obrigatoria';
    if (form.valorEstimado && isNaN(Number(form.valorEstimado))) e.valorEstimado = 'Valor invalido';
    if (!form.dataEntrada) e.dataEntrada = 'Data de entrada e obrigatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      clienteId: form.clienteId,
      descricao: form.descricao.trim(),
      status: form.status,
      valorEstimado: form.valorEstimado ? Number(form.valorEstimado) : 0,
      dataEntrada: form.dataEntrada,
    });
    onClose();
  }

  function fieldClass(field: string) {
    return `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
        : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-400'
    }`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 animate-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Nova Ordem de Servico</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cliente <span className="text-red-400">*</span>
            </label>
            <select
              value={form.clienteId}
              onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
              className={fieldClass('clienteId')}
            >
              <option value="">Selecione um cliente</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
            {errors.clienteId && <p className="text-xs text-red-500 mt-1">{errors.clienteId}</p>}
            {customers.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">Cadastre um cliente primeiro na secao de Clientes.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descricao do Servico <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className={`${fieldClass('descricao')} resize-none`}
              rows={3}
              placeholder="Descreva o servico a ser realizado..."
            />
            {errors.descricao && <p className="text-xs text-red-500 mt-1">{errors.descricao}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ServiceOrderStatus })}
              className={fieldClass('status')}
            >
              <option value="aguardando">Aguardando</option>
              <option value="em_reparo">Em Reparo</option>
              <option value="pronto">Pronto</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valor Estimado</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">R$</span>
                <input
                  type="text"
                  value={form.valorEstimado}
                  onChange={(e) => setForm({ ...form, valorEstimado: e.target.value })}
                  className={`${fieldClass('valorEstimado')} pl-9`}
                  placeholder="0,00"
                />
              </div>
              {errors.valorEstimado && <p className="text-xs text-red-500 mt-1">{errors.valorEstimado}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Data de Entrada <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={form.dataEntrada}
                onChange={(e) => setForm({ ...form, dataEntrada: e.target.value })}
                className={fieldClass('dataEntrada')}
              />
              {errors.dataEntrada && <p className="text-xs text-red-500 mt-1">{errors.dataEntrada}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
