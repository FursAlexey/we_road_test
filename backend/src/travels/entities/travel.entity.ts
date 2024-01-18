import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AfterLoad, BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import slugify from 'slugify';

import { Base } from '../../database/entities';
import { Tour } from '../../tours/entities';
import { Moods } from './moods.entity';

@ObjectType()
@Entity({
  name: 'travels',
})
export class Travel extends Base {
  @Field(() => Boolean)
  @Column({
    default: true,
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
  @Column()
  numberOfDays: number;

  @Field(() => Int, {
    middleware: [
      (ctx) => {
        const numberOfNights = ctx.source.numberOfDays - 1;
        return numberOfNights > 0 ? numberOfNights : 0;
      },
    ],
  })
  numberOfNights: number;

  @OneToMany(() => Tour, (tour) => tour.travel, {
    cascade: true,
  })
  tours: Tour[];

  @Field(() => Moods)
  @Column({
    type: 'jsonb',
  })
  moods: Moods;

  @BeforeInsert()
  slugifyName() {
    this.slug = slugify(this.name, {
      lower: true,
      remove: /[*+~.()'"!:@°]/g,
    });
  }

  @AfterLoad()
  calculateNumberOfNights() {
    const numberOfDays = this.numberOfDays - 1;
    this.numberOfNights = numberOfDays > 0 ? numberOfDays : 0;
  }
}
