import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { Base } from '../../database/entities';
import { Travel } from '../../travels/entities';

@ObjectType()
@Entity({
  name: 'tours',
})
export class Tour extends Base {
  @Field(() => String)
  @Column({
    unique: true,
  })
  name: string;

  @Field(() => Date)
  @Column({
    name: 'starting_date',
    type: 'time with time zone',
  })
  startingDate: Date;

  @Field(() => Date)
  @Column({
    name: 'ending_date',
    type: 'time with time zone',
  })
  endingDate: Date;

  @Field(() => Int)
  @Column()
  price: number;

  @ManyToOne(() => Travel, (travel) => travel.tours, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'travel_id',
  })
  travel: Travel;
}
