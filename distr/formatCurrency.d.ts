export declare const CURRENCY_DEFAULT_PRECISION = 2;
export declare const PRECISIONS_BY_TICKER: {
    BTC: number;
    LTC: number;
};
export declare const CURRENCY_COLLATION: {
    USD: string;
    EUR: string;
    RUB: string;
    GBP: string;
    CHF: string;
    JPY: string;
    CNY: string;
    UAH: string;
    BYN: string;
    KRW: string;
    BTC: string;
    LTC: string;
};
export declare function formatCurrency(value: string | number | undefined, precision?: number, negative?: boolean, showPositiveSign?: boolean): string;
