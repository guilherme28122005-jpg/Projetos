import { PackagePlus, Search, AlertTriangle, Trash2 } from 'lucide-react';
import type { StockItem, StockCategory } from '../types';
import { STOCK_CATEGORIES } from '../types';

interface StockListProps {
  items: StockItem[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

function getCategoryLabel(cat: StockCategory) {
  return STOCK_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcMargem(precoCusto: number, precoVenda: number) {
  if (precoCusto <= 0) return null;
  return ((precoVenda - precoCusto) / precoCusto) * 100;
}

export function StockList({ items, onAdd, onDelete, categoryFilter, onCategoryFilterChange, search, onSearchChange }: StockListProps) {
  const filtered = items.filter((item) => {
    if (categoryFilter && item.categoria !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.nome.toLowerCase().includes(q) ||
        getCategoryLabel(item.categoria).toLowerCase().includes(q)
      );
    }
    return true;
  });

  const lowStockCount = items.filter((i) => i.quantidade < i.quantidadeMinima).length;

  const categoryCounts: Record<string, number> = {};
  items.forEach((i) => {
    categoryCounts[i.categoria] = (categoryCounts[i.categoria] || 0) + 1;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Estoque</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {items.length} {items.length === 1 ? 'item cadastrado' : 'itens cadastrados'}
            {lowStockCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-red-600">
                <AlertTriangle size={12} />
                {lowStockCount} {lowStockCount === 1 ? 'abaixo do minimo' : 'abaixo do minimo'}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
        >
          <PackagePlus size={16} />
          Novo Item
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou categoria..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onCategoryFilterChange('')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                categoryFilter === '' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                categoryFilter === '' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {items.length}
              </span>
            </button>
            {STOCK_CATEGORIES.map(({ value, label }) => {
              const count = categoryCounts[value] || 0;
              if (count === 0) return null;
              const active = categoryFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => onCategoryFilterChange(active ? '' : value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    active ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <PackageIcon size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">
              {items.length === 0
                ? 'Nenhum item de estoque cadastrado ainda.'
                : 'Nenhum item encontrado para esta busca.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Produto
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Categoria
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Qtd.
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Min.
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Preco Custo
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Preco Venda
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Margem
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const isLow = item.quantidade < item.quantidadeMinima;
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${isLow ? 'bg-red-50/60 hover:bg-red-50' : 'hover:bg-slate-50/50'}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {isLow && <AlertTriangle size={14} className="text-red-500 shrink-0" />}
                          <span className={`text-sm font-medium ${isLow ? 'text-red-700' : 'text-slate-800'}`}>
                            {item.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          {getCategoryLabel(item.categoria)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-sm font-semibold ${isLow ? 'text-red-600' : 'text-slate-700'}`}>
                          {item.quantidade}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="text-sm text-slate-500">{item.quantidadeMinima}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-sm font-medium text-slate-700">
                          {item.precoCusto > 0 ? formatCurrency(item.precoCusto) : '--'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-sm font-medium text-slate-700">
                          {item.precoVenda > 0 ? formatCurrency(item.precoVenda) : '--'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {(() => {
                          const margem = calcMargem(item.precoCusto, item.precoVenda);
                          if (margem === null) return <span className="text-sm text-slate-400">--</span>;
                          const isPositive = margem >= 0;
                          return (
                            <span className={`text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                              {isPositive ? '+' : ''}{margem.toFixed(1)}%
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onDelete(item.id)}
                          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Excluir
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
    </div>
  );
}

function PackageIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  );
}
