import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, VirtualColumn } from 'typeorm';
import { Base } from '../../database/entities';
import { Tours } from '../../tours/entities';

@ObjectType()
@Entity()
export class Travels extends Base {
  @Field(() => Boolean)
  @Column({
    name: 'is_public',
  })
  isPublic: boolean;

  @Field(() => String)
  @Column({
    unique: true,
  })
  name: string;

  @Field(() => String)
  @Column()
  slug: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => Int)
  @Column({
    name: 'number_of_days',
  })
  numberOfDays: number;

  @Field(() => Int)
  @VirtualColumn({
    query: (alias) =>
      `
        SELECT (
          CASE
            WHEN "number_of_days" - 1 > 0 THEN "number_of_days" - 1
            ELSE 0
          END
        ) as "number_of_nights" FROM "travels"
        WHERE "id" = ${alias}.id
      `,
  })
  numberOfNights: number;

  @OneToMany(() => Tours, (tour) => tour.travel)
  tours: Tours[];
}
