import type { Product, Transaction } from "@/types/product"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface DashboardProps {
  products: Product[]
  transactions: Transaction[]
}

export default function Dashboard({ products, transactions }: DashboardProps) {
  const totalProducts = products.length
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0)
  const totalValue = products.reduce((sum, product) => sum + product.price * product.quantity, 0)

  const recentTransactions = transactions.slice(0, 5)
  const lowStockProducts = products.filter((p) => p.quantity <= 5 && p.quantity > 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">Produtos cadastrados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Itens em Estoque</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground">Unidades disponíveis</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">Valor do estoque</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockProducts.length}</div>
          <p className="text-xs text-muted-foreground">Produtos com estoque ≤ 5</p>
        </CardContent>
      </Card>

      {recentTransactions.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        transaction.type === "entrada" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium">{transaction.productName}</span>
                    <span className="text-sm text-muted-foreground">
                      {transaction.type === "entrada" ? "+" : "-"}
                      {transaction.quantity}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(transaction.price)}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(transaction.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
