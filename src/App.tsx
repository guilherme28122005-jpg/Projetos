import { useState } from 'react';
import type { Customer, Page, ServiceOrder, ServiceOrderStatus, StockItem, StockCategory, Sale, SaleItem, PaymentMethod } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CustomerList } from './components/CustomerList';
import { CustomerForm } from './components/CustomerForm';
import { ServiceOrderList } from './components/ServiceOrderList';
import { ServiceOrderForm } from './components/ServiceOrderForm';
import { StockList } from './components/StockList';
import { StockForm } from './components/StockForm';
import { SaleList } from './components/SaleList';
import { SaleForm } from './components/SaleForm';

export default function App() {
  const [page, setPage] = useState<Page>('painel');

  // Customers
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  // Service Orders
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [nextOrderNumber, setNextOrderNumber] = useState(1);

  // Stock
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockFormOpen, setStockFormOpen] = useState(false);
  const [stockSearch, setStockSearch] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('');

  // Sales
  const [sales, setSales] = useState<Sale[]>([]);
  const [saleFormOpen, setSaleFormOpen] = useState(false);
  const [saleSearch, setSaleSearch] = useState('');

  function handleAddCustomer(data: Omit<Customer, 'id' | 'criadoEm'>) {
    const newCustomer: Customer = {
      ...data,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    setCustomers((prev) => [newCustomer, ...prev]);
  }

  function handleDeleteCustomer(id: string) {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  function handleAddOrder(data: { clienteId: string; descricao: string; status: ServiceOrderStatus; valorEstimado: number; dataEntrada: string }) {
    const newOrder: ServiceOrder = {
      id: crypto.randomUUID(),
      numero: nextOrderNumber,
      ...data,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setNextOrderNumber((prev) => prev + 1);
  }

  function handleStatusChange(id: string, status: ServiceOrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function handleAddStockItem(data: { nome: string; categoria: StockCategory; quantidade: number; quantidadeMinima: number; precoCusto: number; precoVenda: number }) {
    const newItem: StockItem = {
      id: crypto.randomUUID(),
      ...data,
    };
    setStockItems((prev) => [newItem, ...prev]);
  }

  function handleDeleteStockItem(id: string) {
    setStockItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleAddSale(data: { clienteId: string; itens: SaleItem[]; formaPagamento: PaymentMethod }) {
    const total = data.itens.reduce((sum, i) => sum + i.quantidade * i.precoVenda, 0);
    const newSale: Sale = {
      id: crypto.randomUUID(),
      ...data,
      total,
      data: new Date().toISOString(),
    };
    setSales((prev) => [newSale, ...prev]);

    // Deduct stock
    setStockItems((prev) =>
      prev.map((item) => {
        const soldItem = data.itens.find((si) => si.stockItemId === item.id);
        if (soldItem) {
          return { ...item, quantidade: Math.max(0, item.quantidade - soldItem.quantidade) };
        }
        return item;
      })
    );
  }

  const activeOrders = orders.filter((o) => o.status !== 'pronto').length;
  const totalStockItems = stockItems.length;
  const lowStockCount = stockItems.filter((i) => i.quantidade < i.quantidadeMinima).length;
  const salesThisMonth = sales.filter((s) => {
    const d = new Date(s.data);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

  function renderPage() {
    switch (page) {
      case 'painel':
        return (
          <Dashboard
            customerCount={customers.length}
            activeOrders={activeOrders}
            totalOrders={orders.length}
            totalStockItems={totalStockItems}
            lowStockCount={lowStockCount}
            salesThisMonth={salesThisMonth}
            totalRevenue={totalRevenue}
          />
        );
      case 'clientes':
        return (
          <CustomerList
            customers={customers}
            onAdd={() => setCustomerFormOpen(true)}
            onDelete={handleDeleteCustomer}
            search={customerSearch}
            onSearchChange={setCustomerSearch}
          />
        );
      case 'ordens':
        return (
          <ServiceOrderList
            orders={orders}
            customers={customers}
            onAdd={() => setOrderFormOpen(true)}
            onStatusChange={handleStatusChange}
            statusFilter={orderStatusFilter}
            onStatusFilterChange={setOrderStatusFilter}
            search={orderSearch}
            onSearchChange={setOrderSearch}
          />
        );
      case 'estoque':
        return (
          <StockList
            items={stockItems}
            onAdd={() => setStockFormOpen(true)}
            onDelete={handleDeleteStockItem}
            categoryFilter={stockCategoryFilter}
            onCategoryFilterChange={setStockCategoryFilter}
            search={stockSearch}
            onSearchChange={setStockSearch}
          />
        );
      case 'vendas':
        return (
          <SaleList
            sales={sales}
            customers={customers}
            stockItems={stockItems}
            onAdd={() => setSaleFormOpen(true)}
            search={saleSearch}
            onSearchChange={setSaleSearch}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main className="ml-64 p-8">
        {renderPage()}
      </main>
      <CustomerForm open={customerFormOpen} onClose={() => setCustomerFormOpen(false)} onSave={handleAddCustomer} />
      <ServiceOrderForm open={orderFormOpen} onClose={() => setOrderFormOpen(false)} onSave={handleAddOrder} customers={customers} />
      <StockForm open={stockFormOpen} onClose={() => setStockFormOpen(false)} onSave={handleAddStockItem} />
      <SaleForm open={saleFormOpen} onClose={() => setSaleFormOpen(false)} onSave={handleAddSale} customers={customers} stockItems={stockItems} />
    </div>
  );
}
