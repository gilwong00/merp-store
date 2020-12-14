import { ObjectType, Field } from 'type-graphql';
import {
  Entity,
  Column,
  // OneToMany,
  BeforeInsert,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from 'typeorm';
import { hash, genSaltSync } from 'bcryptjs';

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
    const salt = genSaltSync(10);
    this.password = await hash(this.password, salt);
  }
}

export default User;
