export interface Customer {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  criadoEm: string;
}

export type ServiceOrderStatus = 'aguardando' | 'em_reparo' | 'pronto';

export interface ServiceOrder {
  id: string;
  numero: number;
  clienteId: string;
  descricao: string;
  status: ServiceOrderStatus;
  valorEstimado: number;
  dataEntrada: string;
}

export type StockCategory = 'pneus_cameras' | 'freios' | 'transmissao' | 'acessorios' | 'lubrificantes' | 'outros';

export interface StockItem {
  id: string;
  nome: string;
  categoria: StockCategory;
  quantidade: number;
  quantidadeMinima: number;
  precoCusto: number;
  precoVenda: number;
}

export const STOCK_CATEGORIES: { value: StockCategory; label: string }[] = [
  { value: 'pneus_cameras', label: 'Pneus e Camaras' },
  { value: 'freios', label: 'Freios' },
  { value: 'transmissao', label: 'Transmissao' },
  { value: 'acessorios', label: 'Acessorios' },
  { value: 'lubrificantes', label: 'Lubrificantes' },
  { value: 'outros', label: 'Outros' },
];

export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao_debito' | 'cartao_credito';

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'Pix' },
  { value: 'cartao_debito', label: 'Cartao Debito' },
  { value: 'cartao_credito', label: 'Cartao Credito' },
];

export interface SaleItem {
  stockItemId: string;
  quantidade: number;
  precoVenda: number;
}

export interface Sale {
  id: string;
  clienteId: string;
  itens: SaleItem[];
  formaPagamento: PaymentMethod;
  total: number;
  data: string;
}

export type Page = 'painel' | 'clientes' | 'ordens' | 'estoque' | 'vendas';
