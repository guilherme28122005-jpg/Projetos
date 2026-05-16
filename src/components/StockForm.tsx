import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { StockCategory } from '../types';
import { STOCK_CATEGORIES } from '../types';

interface StockFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { nome: string; categoria: StockCategory; quantidade: number; quantidadeMinima: number; precoCusto: number; precoVenda: number }) => void;
}

const emptyForm = {
  nome: '',
  categoria: '' as StockCategory | '',
  quantidade: '',
  quantidadeMinima: '',
  precoCusto: '',
  precoVenda: '',
};

export function StockForm({ open, onClose, onSave }: StockFormProps) {
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
    if (!form.categoria) e.categoria = 'Selecione uma categoria';
    if (form.quantidade === '' || isNaN(Number(form.quantidade)) || Number(form.quantidade) < 0)
      e.quantidade = 'Quantidade invalida';
    if (form.quantidadeMinima === '' || isNaN(Number(form.quantidadeMinima)) || Number(form.quantidadeMinima) < 0)
      e.quantidadeMinima = 'Quantidade minima invalida';
    if (form.precoCusto && (isNaN(Number(form.precoCusto)) || Number(form.precoCusto) < 0))
      e.precoCusto = 'Preco invalido';
    if (form.precoVenda && (isNaN(Number(form.precoVenda)) || Number(form.precoVenda) < 0))
      e.precoVenda = 'Preco invalido';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      nome: form.nome.trim(),
      categoria: form.categoria as StockCategory,
      quantidade: Number(form.quantidade),
      quantidadeMinima: Number(form.quantidadeMinima),
      precoCusto: form.precoCusto ? Number(form.precoCusto) : 0,
      precoVenda: form.precoVenda ? Number(form.precoVenda) : 0,
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
          <h3 className="text-lg font-semibold text-slate-800">Novo Item de Estoque</h3>
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
              Nome do Produto <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className={fieldClass('nome')}
              placeholder="Ex: Camara de ar 26 polegadas"
              autoFocus
            />
            {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Categoria <span className="text-red-400">*</span>
            </label>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value as StockCategory })}
              className={fieldClass('categoria')}
            >
              <option value="">Selecione uma categoria</option>
              {STOCK_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {errors.categoria && <p className="text-xs text-red-500 mt-1">{errors.categoria}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quantidade <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.quantidade}
                onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
                className={fieldClass('quantidade')}
                placeholder="0"
              />
              {errors.quantidade && <p className="text-xs text-red-500 mt-1">{errors.quantidade}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Qtd. Minima <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.quantidadeMinima}
                onChange={(e) => setForm({ ...form, quantidadeMinima: e.target.value })}
                className={fieldClass('quantidadeMinima')}
                placeholder="0"
              />
              {errors.quantidadeMinima && <p className="text-xs text-red-500 mt-1">{errors.quantidadeMinima}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preco de Custo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">R$</span>
                <input
                  type="text"
                  value={form.precoCusto}
                  onChange={(e) => setForm({ ...form, precoCusto: e.target.value })}
                  className={`${fieldClass('precoCusto')} pl-9`}
                  placeholder="0,00"
                />
              </div>
              {errors.precoCusto && <p className="text-xs text-red-500 mt-1">{errors.precoCusto}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preco de Venda</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">R$</span>
                <input
                  type="text"
                  value={form.precoVenda}
                  onChange={(e) => setForm({ ...form, precoVenda: e.target.value })}
                  className={`${fieldClass('precoVenda')} pl-9`}
                  placeholder="0,00"
                />
              </div>
              {errors.precoVenda && <p className="text-xs text-red-500 mt-1">{errors.precoVenda}</p>}
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
