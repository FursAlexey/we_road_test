import { ObjectType, Field, NextFn, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  Unique,
  BeforeUpdate,
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
    type: 'timestamp with time zone',
  })
  startingDate: Date;

  @Field(() => Date)
  @Column({
    type: 'timestamp with time zone',
  })
  endingDate: Date;

  @Field(() => Float, {
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
  @BeforeUpdate()
  beforeUpdate() {
    this.price = currencyService.convertToCents(this.price > 0 ? this.price : 0);
  }
}
