import { QueryResultRow } from 'pg';

export interface Order {
  orderCode: string;
  platform: string;
  status: 'completed' | 'cancelled';
  productPrice: number;
  orderDate: Date;
}

export interface OrderRow extends QueryResultRow {
  order_code: string;
  platform: string;
  status: 'completed' | 'cancelled';
  product_price: number | string;
  order_date: Date;
}
