import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Customer } from '../types';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'criadoEm'>) => void;
}

const emptyForm = { nome: '', telefone: '', email: '', endereco: '' };

export function CustomerForm({ open, onClose, onSave }: CustomerFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  function validate() {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = 'Nome e obrigatorio';
    if (!form.telefone.trim()) e.telefone = 'Telefone e obrigatorio';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Email invalido';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
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
          <h3 className="text-lg font-semibold text-slate-800">Novo Cliente</h3>
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
              Nome <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className={fieldClass('nome')}
              placeholder="Nome completo"
              autoFocus
            />
            {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Telefone <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              className={fieldClass('telefone')}
              placeholder="(00) 00000-0000"
            />
            {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={fieldClass('email')}
              placeholder="email@exemplo.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Endereco</label>
            <input
              type="text"
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              className={fieldClass('endereco')}
              placeholder="Rua, numero, bairro, cidade"
            />
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
