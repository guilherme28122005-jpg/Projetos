import { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Customer, StockItem, PaymentMethod, SaleItem } from '../types';
import { PAYMENT_METHODS } from '../types';

interface SaleFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { clienteId: string; itens: SaleItem[]; formaPagamento: PaymentMethod }) => void;
  customers: Customer[];
  stockItems: StockItem[];
}

interface FormItem {
  key: string;
  stockItemId: string;
  quantidade: string;
}

const emptyItem = (): FormItem => ({
  key: crypto.randomUUID(),
  stockItemId: '',
  quantidade: '1',
});

export function SaleForm({ open, onClose, onSave, customers, stockItems }: SaleFormProps) {
  const [clienteId, setClienteId] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<PaymentMethod | ''>('');
  const [itens, setItens] = useState<FormItem[]>([emptyItem()]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setClienteId('');
      setFormaPagamento('');
      setItens([emptyItem()]);
      setErrors({});
    }
  }, [open]);

  const resolvedItens = useMemo(() => {
    return itens.map((fi) => {
      const stock = stockItems.find((s) => s.id === fi.stockItemId);
      const qty = Number(fi.quantidade) || 0;
      const preco = stock?.precoVenda ?? 0;
      return { ...fi, stock, qty, preco, subtotal: qty * preco };
    });
  }, [itens, stockItems]);

  const total = resolvedItens.reduce((sum, i) => sum + i.subtotal, 0);

  if (!open) return null;

  function addItem() {
    setItens((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index: number) {
    setItens((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: 'stockItemId' | 'quantidade', value: string) {
    setItens((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!clienteId) e.clienteId = 'Selecione um cliente';
    if (!formaPagamento) e.formaPagamento = 'Selecione a forma de pagamento';
    const validItens = resolvedItens.filter((i) => i.stockItemId && i.qty > 0);
    if (validItens.length === 0) e.itens = 'Adicione ao menos um item';
    for (const ri of resolvedItens) {
      if (!ri.stockItemId) continue;
      if (ri.qty <= 0) {
        e.itens = 'Quantidade deve ser maior que zero';
        break;
      }
      if (ri.stock && ri.qty > ri.stock.quantidade) {
        e.itens = `Estoque insuficiente para ${ri.stock.nome} (disponivel: ${ri.stock.quantidade})`;
        break;
      }
    }
    const usedIds = resolvedItens.filter((i) => i.stockItemId).map((i) => i.stockItemId);
    if (new Set(usedIds).size !== usedIds.length) {
      e.itens = 'Nao repita o mesmo item';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    const saleItens: SaleItem[] = resolvedItens
      .filter((i) => i.stockItemId && i.qty > 0)
      .map((i) => ({
        stockItemId: i.stockItemId,
        quantidade: i.qty,
        precoVenda: i.preco,
      }));
    onSave({
      clienteId,
      itens: saleItens,
      formaPagamento: formaPagamento as PaymentMethod,
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

  const availableStock = stockItems.filter((s) => s.quantidade > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-lg font-semibold text-slate-800">Nova Venda</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cliente <span className="text-red-400">*</span>
                </label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className={fieldClass('clienteId')}
                >
                  <option value="">Selecione um cliente</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                {errors.clienteId && <p className="text-xs text-red-500 mt-1">{errors.clienteId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Forma de Pagamento <span className="text-red-400">*</span>
                </label>
                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value as PaymentMethod)}
                  className={fieldClass('formaPagamento')}
                >
                  <option value="">Selecione</option>
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm.value} value={pm.value}>{pm.label}</option>
                  ))}
                </select>
                {errors.formaPagamento && <p className="text-xs text-red-500 mt-1">{errors.formaPagamento}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Itens <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <Plus size={14} />
                  Adicionar item
                </button>
              </div>

              <div className="space-y-2">
                {resolvedItens.map((ri, index) => (
                  <div key={ri.key} className="flex items-center gap-2">
                    <select
                      value={ri.stockItemId}
                      onChange={(e) => updateItem(index, 'stockItemId', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                    >
                      <option value="">Selecione o produto</option>
                      {availableStock.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nome} (Est: {s.quantidade}) - R$ {s.precoVenda.toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      max={ri.stock?.quantidade ?? 999}
                      value={ri.quantidade}
                      onChange={(e) => updateItem(index, 'quantidade', e.target.value)}
                      className="w-20 px-3 py-2 text-sm text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                    />
                    <span className="w-24 text-right text-sm font-medium text-slate-700">
                      {ri.subtotal > 0 ? `R$ ${ri.subtotal.toFixed(2)}` : '--'}
                    </span>
                    {itens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.itens && <p className="text-xs text-red-500 mt-1">{errors.itens}</p>}
            </div>

            <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Total</span>
              <span className="text-xl font-bold text-slate-800">
                R$ {total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
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
              Confirmar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
