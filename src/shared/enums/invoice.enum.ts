export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum Currency {
  BDT = 'BDT',
  USD = 'USD',
  EUR = 'EUR',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOBILE_BANKING = 'MOBILE_BANKING', // BKASH/NAGAD
  CARD = 'CARD',
  OTHER = 'OTHER',
}
