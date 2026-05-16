import { LayoutDashboard, Users, ClipboardList, Package, ShoppingCart, Bike } from 'lucide-react';
import type { Page } from '../types';

const menuItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'painel', label: 'Painel', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'ordens', label: 'Ordens de Servico', icon: ClipboardList },
  { id: 'estoque', label: 'Estoque', icon: Package },
  { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50">
        <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
          <Bike size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">BikeChumbo</h1>
          <p className="text-[11px] text-slate-400 -mt-0.5">Gestao de Bicicletaria</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700/50">
        <p className="text-[11px] text-slate-500 text-center">v1.0.0</p>
      </div>
    </aside>
  );
}
