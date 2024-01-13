import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Base } from '../../database/entities';
import { UserRole } from '../constants';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity()
export class Role extends Base {
  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
  })
  name: UserRole;
}
