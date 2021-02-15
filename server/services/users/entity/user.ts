import { ObjectType, Field } from 'type-graphql';
import {
  Entity,
  Column,
  BeforeInsert,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from 'typeorm';
import { hash } from 'argon2';

@ObjectType()
@Entity('users')
class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Field()
  @Column({ unique: true })
  username!: string;

  @Index()
  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column()
  password: string;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  last_updated: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }
}

export default User;
