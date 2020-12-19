import { OrderDetail } from 'entities';
import { ObjectType, Field } from 'type-graphql';
import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  AfterLoad
} from 'typeorm';

@ObjectType()
@Entity('order_headers')
class OrderHeader extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ name: 'total_cost' })
  totalCost: number;

  @Field()
  @Column({ name: 'order_by' })
  orderedBy!: number;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrderDetail, detail => detail.order, { onDelete: 'CASCADE' })
  items: Array<OrderDetail>;

  itemCount: number;

  @AfterLoad()
  getTotalItems() {
    this.itemCount = this.items.length > 0 ? this.items.length : 0;
  }
}

export default OrderHeader;
