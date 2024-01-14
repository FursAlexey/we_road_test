import {
  ObjectType,
  Field,
  Int,
  NextFn,
} from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  Unique,
} from 'typeorm';

import { Base } from '../../database/entities';
import { Travel } from '../../travels/entities';
import { currencyService } from '../../utils/currency';

@ObjectType()
@Entity({
  name: 'tours',
})
@Unique('uq_travel_id_name', ['name', 'travel'])
export class Tour extends Base {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Date)
  @Column({
    name: 'starting_date',
    type: 'timestamp with time zone',
  })
  startingDate: Date;

  @Field(() => Date)
  @Column({
    name: 'ending_date',
    type: 'timestamp with time zone',
  })
  endingDate: Date;

  @Field(() => Int, {
    middleware: [
      async (_, next: NextFn) => {
        const value = await next();
        return currencyService.convertToCurrency(value);
      },
    ],
  })
  @Column()
  price: number;

  @ManyToOne(() => Travel, (travel) => travel.tours, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'travel_id',
  })
  travel: Travel;

  @BeforeInsert()
  convertToCents() {
    this.price = currencyService.convertToCents(this.price);
  }
}
