import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryColumn({ name: 'order_code', type: 'text' })
  orderCode!: string;

  @Column({ type: 'text' })
  platform!: string;

  @Column({ type: 'text' })
  status!: 'completed' | 'cancelled';

  @Column({ name: 'product_price', type: 'integer' })
  productPrice!: number;

  @Column({ name: 'order_date', type: 'date' })
  orderDate!: Date;
}
