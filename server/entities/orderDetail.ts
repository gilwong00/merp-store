import { OrderHeader, Product } from '.';
import { ObjectType, Field } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn
  // OneToOne
} from 'typeorm';

@ObjectType()
@Entity('order_details')
class OrderDetail extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ name: 'order_header_id' })
  orderHeaderId: number;

  @Field()
  @Column({ name: 'product_id' })
  productId: number;

  @Field()
  @Column()
  quantity: number;

  @ManyToOne(() => OrderHeader, order => order.items)
  // @JoinColumn({ name: 'order_header_id' })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  order: OrderHeader;

  // this might actually be a one to one relationship
  @ManyToOne(() => Product)
  // @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  product: Product;
}

export default OrderDetail;
