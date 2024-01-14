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
    name: 'is_public',
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
  @Column({
    name: 'number_of_days',
  })
  numberOfDays: number;

  @Field(() => Int)
  numberOfNights: number;

  @Field(() => [Tour])
  @OneToMany(() => Tour, (tour) => tour.travel)
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
