export interface Product {
  id: string
  name: string
  price: number
  quantity: number
}

export type TransactionType = "entrada" | "saida"

export interface Transaction {
  id: string
  productName: string
  quantity: number
  type: TransactionType
  price: number
  date: Date
}
