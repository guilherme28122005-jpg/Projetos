import { Users, ClipboardList, Package, ShoppingCart, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

interface DashboardProps {
  customerCount: number;
  activeOrders: number;
  totalOrders: number;
  totalStockItems: number;
  lowStockCount: number;
  salesThisMonth: number;
  totalRevenue: number;
}

export function Dashboard({ customerCount, activeOrders, totalOrders, totalStockItems, lowStockCount, salesThisMonth, totalRevenue }: DashboardProps) {
  const stats = [
    { label: 'Clientes', value: customerCount, icon: Users, color: 'emerald' },
    { label: 'Ordens Ativas', value: activeOrders, icon: ClipboardList, color: 'blue' },
    { label: 'Produtos em Estoque', value: totalStockItems, icon: Package, color: 'amber' },
    { label: 'Vendas no Mes', value: salesThisMonth, icon: ShoppingCart, color: 'rose' },
  ];

  const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', text: 'text-emerald-700' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500', text: 'text-blue-700' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-500', text: 'text-amber-700' },
    rose: { bg: 'bg-rose-50', icon: 'text-rose-500', text: 'text-rose-700' },
  };

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Painel</h2>
        <p className="text-sm text-slate-500 mt-0.5">Visao geral da BikeChumbo</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => {
          const c = colorMap[color];
          return (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-500">{label}</span>
                <div className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center`}>
                  <Icon size={18} className={c.icon} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
            </div>
          );
        })}
      </div>

      {totalRevenue > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-emerald-500" />
            <h3 className="text-sm font-semibold text-emerald-700">Faturamento Total</h3>
          </div>
          <p className="text-2xl font-bold text-emerald-700">{formatCurrency(totalRevenue)}</p>
        </div>
      )}

      {lowStockCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h3 className="text-sm font-semibold text-red-700">Alerta de Estoque Baixo</h3>
          </div>
          <p className="text-sm text-red-600">
            {lowStockCount} {lowStockCount === 1 ? 'item esta' : 'itens estao'} abaixo da quantidade minima. Verifique o modulo de Estoque.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">Atividade Recente</h3>
        </div>
        {totalOrders === 0 && customerCount === 0 && totalStockItems === 0 && salesThisMonth === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            Nenhuma atividade registrada ainda. Comece cadastrando seus clientes!
          </p>
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">
            {totalOrders} {totalOrders === 1 ? 'ordem de servico registrada' : 'ordens de servico registradas'} no total.
          </p>
        )}
      </div>
    </div>
  );
}
