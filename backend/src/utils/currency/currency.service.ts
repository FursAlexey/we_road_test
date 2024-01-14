import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyService {
  convertToCents(price: number): number {
    return Math.round(price * 100);
  }

  convertToCurrency(price: number): number {
   return price / 100;
  }
}

export const currencyService = new CurrencyService();
