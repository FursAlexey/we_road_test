import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

import { Base } from '../../database/entities';
import { UserRole } from '../constants';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity({
  name: 'roles',
})
export class Role extends Base {
  @Field(() => UserRole)
  @Column({
    unique: true,
    type: 'enum',
    enum: UserRole,
  })
  name: UserRole;
}
