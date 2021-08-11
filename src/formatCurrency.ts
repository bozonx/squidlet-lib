export const CURRENCY_DEFAULT_PRECISION = 2
export const PRECISIONS_BY_TICKER = {
  // USD: 2,
  // EUR: 2,
  // RUB: 2,
  // GBP: 2,
  // CHF: 2,
  // JPY: 2,
  // CNY: 2,
  // UAH: 2,
  // KRW: 2,
  BTC: 8,
  LTC: 8,
}
export const CURRENCY_COLLATION = {
  USD: '$',
  EUR: '€',
  RUB: '₽',
  GBP: '£',
  CHF: '₣',
  JPY: '¥',
  CNY: 'Ұ',
  // гривна
  UAH: '₴',
  // белорусский рубль
  BYN: 'Br',
  // вона
  KRW: '￦',
  BTC: '₿',
  LTC: 'Ł',
}


function precise(value: number, precision: number): string {
  return Number(value).toFixed(precision);
}


export function formatCurrency(
  value: string | number | undefined,
  precision: number = 2,
  negative: boolean = false,
  showPositiveSign: boolean = false
): string {
  if (!value) {
    return precise(0, precision);
  }

  let finalValue: number = parseInt(value as string);

  if (negative && finalValue > 0) finalValue = finalValue - (finalValue * 2);

  let result = precise(finalValue, precision);

  if (showPositiveSign && !negative &&  finalValue > 0) result = `+${result}`;

  return result;
}
