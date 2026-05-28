export interface ICartItem {
  product: string;
  variant?: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  subtotal: number;
  updatedAt: string;
}
