import { FilePlus, Search, Clock, Wrench, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Customer, ServiceOrder, ServiceOrderStatus } from '../types';

interface ServiceOrderListProps {
  orders: ServiceOrder[];
  customers: Customer[];
  onAdd: () => void;
  onStatusChange: (id: string, status: ServiceOrderStatus) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const statusConfig: Record<ServiceOrderStatus, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
  aguardando: { label: 'Aguardando', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  em_reparo: { label: 'Em Reparo', icon: Wrench, bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  pronto: { label: 'Pronto', icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
};

const statusFlow: ServiceOrderStatus[] = ['aguardando', 'em_reparo', 'pronto'];

function getCustomerName(customers: Customer[], clienteId: string) {
  return customers.find((c) => c.id === clienteId)?.nome ?? 'Cliente removido';
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function ServiceOrderList({
  orders,
  customers,
  onAdd,
  onStatusChange,
  statusFilter,
  onStatusFilterChange,
  search,
  onSearchChange,
}: ServiceOrderListProps) {
  const filtered = orders.filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = getCustomerName(customers, o.clienteId).toLowerCase();
      return (
        name.includes(q) ||
        o.descricao.toLowerCase().includes(q) ||
        String(o.numero).includes(q)
      );
    }
    return true;
  });

  const statusCounts = {
    all: orders.length,
    aguardando: orders.filter((o) => o.status === 'aguardando').length,
    em_reparo: orders.filter((o) => o.status === 'em_reparo').length,
    pronto: orders.filter((o) => o.status === 'pronto').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ordens de Servico</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {orders.length} {orders.length === 1 ? 'OS registrada' : 'OS registradas'}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
        >
          <FilePlus size={16} />
          Nova OS
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por numero, cliente ou descricao..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { value: '', label: 'Todas', count: statusCounts.all },
              { value: 'aguardando', label: 'Aguardando', count: statusCounts.aguardando },
              { value: 'em_reparo', label: 'Em Reparo', count: statusCounts.em_reparo },
              { value: 'pronto', label: 'Pronto', count: statusCounts.pronto },
            ].map(({ value, label, count }) => {
              const active = statusFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => onStatusFilterChange(value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    active
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            <ClipboardListIcon size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">
              {orders.length === 0
                ? 'Nenhuma ordem de servico registrada ainda.'
                : 'Nenhuma OS encontrada para esta busca.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    OS
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Cliente
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Descricao
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Valor
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Entrada
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Avancar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((order) => {
                  const cfg = statusConfig[order.status];
                  const currentIdx = statusFlow.indexOf(order.status);
                  const nextStatus = currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : null;
                  const nextCfg = nextStatus ? statusConfig[nextStatus] : null;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-slate-800">#{String(order.numero).padStart(4, '0')}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-slate-700">{getCustomerName(customers, order.clienteId)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-slate-600 line-clamp-2 max-w-[200px]">{order.descricao}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-sm font-medium text-slate-700">
                          {order.valorEstimado > 0 ? formatCurrency(order.valorEstimado) : '--'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-slate-600">{formatDate(order.dataEntrada)}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {nextStatus && nextCfg ? (
                          <button
                            onClick={() => onStatusChange(order.id, nextStatus)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${nextCfg.bg} ${nextCfg.text} hover:opacity-80`}
                            title={`Mover para ${nextCfg.label}`}
                          >
                            <ChevronRight size={12} />
                            {nextCfg.label}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Finalizado</span>
                        )}
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

function ClipboardListIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />
    </svg>
  );
}
