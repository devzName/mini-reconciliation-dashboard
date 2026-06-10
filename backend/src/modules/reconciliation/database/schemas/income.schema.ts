import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'income' })
export class Income {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'order_code', type: 'text', unique: true })
  orderCode!: string;

  @Column({ name: 'settlement_date', type: 'date' })
  settlementDate!: Date;

  @Column({ name: 'gross_revenue', type: 'integer' })
  grossRevenue!: number;

  @Column({ name: 'refund_amount', type: 'integer' })
  refundAmount!: number;

  @Column({ name: 'fee_total', type: 'integer' })
  feeTotal!: number;

  @Column({ name: 'net_received', type: 'integer' })
  netReceived!: number;
}
