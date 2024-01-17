import { Test } from '@nestjs/testing';
import { CurrencyService } from './currency.service';

describe('Currency service', () => {
  let currencyService: CurrencyService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CurrencyService],
    }).compile();

    currencyService = moduleRef.get<CurrencyService>(CurrencyService);
  });

  describe('convertToCents', () => {
    it('should convert a price to cents', () => {
      const price = 12.34;

      const result = currencyService.convertToCents(price);

      expect(result).toEqual(1234);
    });

    it('should handle zero correctly', () => {
      const price = 0;

      const result = currencyService.convertToCents(price);

      expect(result).toEqual(0);
    });

    it('should handle negative values correctly', () => {
      const price = -5.67;

      const result = currencyService.convertToCents(price);

      expect(result).toEqual(-567);
    });
  });

  describe('convertToCurrency', () => {
    it('should convert a price to currency', () => {
      const price = 1234;

      const result = currencyService.convertToCurrency(price);

      expect(result).toEqual(12.34);
    });

    it('should handle zero correctly', () => {
      const price = 0;

      const result = currencyService.convertToCurrency(price);

      expect(result).toEqual(0);
    });

    it('should handle negative values correctly', () => {
      const price = -567;

      const result = currencyService.convertToCurrency(price);

      expect(result).toEqual(-5.67);
    });
  });
});
