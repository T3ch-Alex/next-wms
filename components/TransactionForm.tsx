"use client"

import type React from "react"

import { useState } from "react"
import type { Product, TransactionType } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface TransactionFormProps {
  type: TransactionType
  onSubmit: (productName: string, quantity: number, type: TransactionType, price?: number) => void
  products: Product[]
}

export default function TransactionForm({ type, onSubmit, products }: TransactionFormProps) {
  const [productName, setProductName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [isNewProduct, setIsNewProduct] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!productName || !quantity) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    if (type === "entrada" && isNewProduct && !price) {
      alert("Para produtos novos, o preço é obrigatório.")
      return
    }

    const quantityNum = Number.parseInt(quantity)
    const priceNum = price ? Number.parseFloat(price) : undefined

    if (quantityNum <= 0) {
      alert("A quantidade deve ser maior que zero.")
      return
    }

    if (priceNum !== undefined && priceNum <= 0) {
      alert("O preço deve ser maior que zero.")
      return
    }

    onSubmit(productName, quantityNum, type, priceNum)

    // Reset form
    setProductName("")
    setQuantity("")
    setPrice("")
    setIsNewProduct(false)
  }

  const handleProductSelect = (value: string) => {
    if (value === "new") {
      setIsNewProduct(true)
      setProductName("")
    } else {
      setIsNewProduct(false)
      setProductName(value)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produto</Label>
            {type === "entrada" ? (
              <div className="space-y-2">
                <Select onValueChange={handleProductSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto ou adicione novo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">+ Novo Produto</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.name}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isNewProduct && (
                  <Input
                    placeholder="Nome do novo produto"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                )}
              </div>
            ) : (
              <Select onValueChange={setProductName}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products
                    .filter((p) => p.quantity > 0)
                    .map((product) => (
                      <SelectItem key={product.id} value={product.name}>
                        {product.name} (Estoque: {product.quantity})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              placeholder="Digite a quantidade"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {type === "entrada" && (isNewProduct || productName) && (
            <div className="space-y-2">
              <Label htmlFor="price">
                Preço Unitário (R$) {isNewProduct && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          )}

          <Button type="submit" className="w-full">
            {type === "entrada" ? "Registrar Entrada" : "Registrar Saída"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
