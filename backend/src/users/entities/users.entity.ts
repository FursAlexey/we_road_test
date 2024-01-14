import { ObjectType, Field } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Base } from '../../database/entities';
import { Roles } from '../../roles/entities';

@ObjectType()
@Entity()
export class Users extends Base {
  @Field(() => String)
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Field(() => [Roles])
  @ManyToMany(() => Roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
    },
  })
  roles: Roles[];

  @BeforeInsert()
  convertToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
