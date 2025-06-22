"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import type { Product, Transaction, TransactionType } from "@/types/product"
import ProductList from "@/components/ProductList"
import TransactionForm from "@/components/TransactionForm"
import Dashboard from "@/components/Dashboard"
import Header from "@/components/layout/Header"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Notebook Dell", price: 2500.0, quantity: 10 },
    { id: "2", name: "Mouse Logitech", price: 85.5, quantity: 25 },
    { id: "3", name: "Teclado Mecânico", price: 350.0, quantity: 8 },
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([])

  const handleTransaction = (productName: string, quantity: number, type: TransactionType, price?: number) => {
    const existingProductIndex = products.findIndex((p) => p.name.toLowerCase() === productName.toLowerCase())

    if (type === "entrada") {
      if (existingProductIndex >= 0) {
        const updatedProducts = [...products]
        updatedProducts[existingProductIndex].quantity += quantity
        if (price) {
          updatedProducts[existingProductIndex].price = price
        }
        setProducts(updatedProducts)
      } else {
        if (!price) return
        const newProduct: Product = {
          id: Date.now().toString(),
          name: productName,
          price,
          quantity,
        }
        setProducts([...products, newProduct])
      }
    } else {
      if (existingProductIndex >= 0) {
        const updatedProducts = [...products]
        if (updatedProducts[existingProductIndex].quantity >= quantity) {
          updatedProducts[existingProductIndex].quantity -= quantity
          setProducts(updatedProducts)
        } else {
          alert("Quantidade insuficiente em estoque!")
          return
        }
      } else {
        alert("Produto não encontrado no estoque!")
        return
      }
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      productName,
      quantity,
      type,
      price: price || products[existingProductIndex]?.price || 0,
      date: new Date(),
    }
    setTransactions([newTransaction, ...transactions])
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Gerenciamento de Estoque - Entrada e Saída de Produtos</p>
        </div>

        <Dashboard products={products} transactions={transactions} />

        <Tabs defaultValue="estoque" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
            <TabsTrigger value="entrada">Entrada</TabsTrigger>
            <TabsTrigger value="saida">Saída</TabsTrigger>
          </TabsList>

          <TabsContent value="estoque" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos em Estoque</CardTitle>
                <CardDescription>Lista completa de produtos disponíveis no estoque</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductList products={products} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entrada" className="mt-6">
            <ProtectedRoute requiredRole="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Entrada de Produtos</CardTitle>
                  <CardDescription>Registre a entrada de novos produtos ou reposição de estoque</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionForm type="entrada" onSubmit={handleTransaction} products={products} />
                </CardContent>
              </Card>
            </ProtectedRoute>
          </TabsContent>

          <TabsContent value="saida" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Saída de Produtos</CardTitle>
                <CardDescription>Registre a saída de produtos do estoque</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionForm type="saida" onSubmit={handleTransaction} products={products} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
