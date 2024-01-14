import { ObjectType, Field } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { Base } from '../../database/entities';
import { Role } from '../../roles/entities';

@ObjectType()
@Entity({
  name: 'users',
})
export class User extends Base {
  @Field(() => String)
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Field(() => [Role])
  @ManyToMany(() => Role, {
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
  roles: Role[];

  @BeforeInsert()
  convertToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
