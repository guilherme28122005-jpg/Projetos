import { ShoppingCart, Plus, Search, Eye, X } from 'lucide-react';
import type { Customer, Sale, StockItem, PaymentMethod } from '../types';
import { PAYMENT_METHODS } from '../types';
import { useState } from 'react';

interface SaleListProps {
  sales: Sale[];
  customers: Customer[];
  stockItems: StockItem[];
  onAdd: () => void;
  search: string;
  onSearchChange: (value: string) => void;
}

function getCustomerName(customers: Customer[], id: string) {
  return customers.find((c) => c.id === id)?.nome ?? 'Cliente removido';
}

function getPaymentLabel(method: PaymentMethod) {
  return PAYMENT_METHODS.find((pm) => pm.value === method)?.label ?? method;
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR');
}

const paymentColors: Record<PaymentMethod, { bg: string; text: string }> = {
  dinheiro: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  pix: { bg: 'bg-blue-50', text: 'text-blue-700' },
  cartao_debito: { bg: 'bg-amber-50', text: 'text-amber-700' },
  cartao_credito: { bg: 'bg-rose-50', text: 'text-rose-700' },
};

export function SaleList({ sales, customers, stockItems, onAdd, search, onSearchChange }: SaleListProps) {
  const [detailSale, setDetailSale] = useState<Sale | null>(null);

  const filtered = sales.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      getCustomerName(customers, s.clienteId).toLowerCase().includes(q) ||
      getPaymentLabel(s.formaPagamento).toLowerCase().includes(q) ||
      formatCurrency(s.total).toLowerCase().includes(q)
    );
  });

  const totalVendas = sales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vendas</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {sales.length} {sales.length === 1 ? 'venda registrada' : 'vendas registradas'}
            {sales.length > 0 && (
              <span className="ml-2 text-emerald-600 font-medium">
                Total: {formatCurrency(totalVendas)}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
        >
          <Plus size={16} />
          Nova Venda
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, pagamento ou valor..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingCart size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">
              {sales.length === 0
                ? 'Nenhuma venda registrada ainda.'
                : 'Nenhuma venda encontrada para esta busca.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Data
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Cliente
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Pagamento
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Total
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Detalhes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((sale) => {
                  const pc = paymentColors[sale.formaPagamento];
                  return (
                    <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-slate-700">{formatDate(sale.data)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-slate-800">
                          {getCustomerName(customers, sale.clienteId)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${pc.bg} ${pc.text}`}>
                          {getPaymentLabel(sale.formaPagamento)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-sm font-semibold text-slate-800">{formatCurrency(sale.total)}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => setDetailSale(sale)}
                          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 transition-colors px-2 py-1 rounded hover:bg-emerald-50"
                        >
                          <Eye size={14} />
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detailSale && (
        <SaleDetailModal
          sale={detailSale}
          customers={customers}
          stockItems={stockItems}
          onClose={() => setDetailSale(null)}
        />
      )}
    </div>
  );
}

function SaleDetailModal({ sale, customers, stockItems, onClose }: {
  sale: Sale;
  customers: Customer[];
  stockItems: StockItem[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Detalhes da Venda</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Data</span>
              <p className="font-medium text-slate-800">{formatDate(sale.data)}</p>
            </div>
            <div>
              <span className="text-slate-500">Cliente</span>
              <p className="font-medium text-slate-800">{getCustomerName(customers, sale.clienteId)}</p>
            </div>
            <div>
              <span className="text-slate-500">Pagamento</span>
              <p className="font-medium text-slate-800">{getPaymentLabel(sale.formaPagamento)}</p>
            </div>
            <div>
              <span className="text-slate-500">Total</span>
              <p className="font-bold text-emerald-700">{formatCurrency(sale.total)}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Itens</h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">Produto</th>
                    <th className="text-center px-3 py-2 text-xs font-semibold text-slate-500">Qtd.</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-slate-500">Unit.</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-slate-500">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sale.itens.map((item, i) => {
                    const name = stockItems.find((s) => s.id === item.stockItemId)?.nome ?? 'Produto removido';
                    return (
                      <tr key={i}>
                        <td className="px-3 py-2 text-slate-700">{name}</td>
                        <td className="px-3 py-2 text-center text-slate-600">{item.quantidade}</td>
                        <td className="px-3 py-2 text-right text-slate-600">{formatCurrency(item.precoVenda)}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-800">
                          {formatCurrency(item.quantidade * item.precoVenda)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
