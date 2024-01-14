import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Base } from '../../database/entities';
import { UserRole } from '../constants';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity()
export class Roles extends Base {
  @Field(() => UserRole)
  @Column({
    unique: true,
    type: 'enum',
    enum: UserRole,
  })
  name: UserRole;
}
