import { ObjectType, Field } from 'type-graphql';
import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  BeforeInsert
} from 'typeorm';
import shortId from 'shortid';

@ObjectType()
@Entity('products')
class Product extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Field()
  @Column({ unique: true })
  name!: string;

  @Index()
  @Field()
  @Column({ unique: true })
  sku!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column()
  price: number;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  last_updated: Date;

  @BeforeInsert()
  async generateSku() {
    this.sku = shortId.generate();
  }
}

export default Product;
