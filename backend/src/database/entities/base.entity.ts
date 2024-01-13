import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Base {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    select: false,
  })
  updatedAt: Date;

  @Field(() => Date)
  @DeleteDateColumn({
    select: false,
  })
  deletedAt: Date;
}
