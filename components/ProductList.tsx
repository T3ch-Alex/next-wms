import type { Product } from "@/types/product"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Sem Estoque", variant: "destructive" as const }
    if (quantity <= 5) return { label: "Estoque Baixo", variant: "secondary" as const }
    return { label: "Em Estoque", variant: "default" as const }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum produto cadastrado no estoque.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Preço Unitário</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const status = getStockStatus(product.quantity)
            const totalValue = product.price * product.quantity

            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{formatCurrency(totalValue)}</TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
