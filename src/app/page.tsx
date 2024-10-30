'use client'

import Image from "next/image"
import { useState, useEffect } from "react"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loadStripe } from '@stripe/stripe-js'

const products = {
  "Coffee Exfoliating": {
    description: "Ground coffee beans gently exfoliate dead skin cells, promoting circulation and a healthy glow. Combined with caster oil, coconut oil, and shea butter, this soap moisturizes and revitalizes, making your skincare routine a delightful experience.",
    price: 11.99,
    stripePriceId: "price_1QEyVWA1NILWJa6ME3PB3qq7",
    picture: "/assets/white.jpg",
  },
  "Minty Fresh": {
    description: "Infused with pure peppermint oil, this soap not only revitalizes your skin but also uplifts your spirit. Crafted with a nourishing blend of coconut oil, avocado oil, and shea butter, it provides deep hydration while leaving a refreshing minty scent.",
    price: 11.99,
    stripePriceId: "price_1QEyOfA1NILWJa6MEA6sExXh",
    picture: "/assets/blue.jpg",
  },
  "Charcoal Detox": {
    description: "Activated charcoal works effectively to draw out impurities & toxins from your skin. Enriched with olive oil, apricot oil, and shea butter, this soap balances purification with intense moisturization, leaving your skin feeling clean and rejuvenated.",
    price: 11.99,
    stripePriceId: "price_1QExyEA1NILWJa6MWKb6GF8V",
    picture: "/assets/black.jpg",
  },
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Component() {
  const [quantities, setQuantities] = useState<{[key: string]: number}>({})

  useEffect(() => {
    const storedQuantities = localStorage.getItem('productQuantities')
    if (storedQuantities) {
      setQuantities(JSON.parse(storedQuantities))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('productQuantities', JSON.stringify(quantities))
  }, [quantities])

  const handleQuantityChange = (productName: string, change: number) => {
    setQuantities(prev => {
      const newQuantity = Math.max((prev[productName] || 0) + change, 0)
      return { ...prev, [productName]: newQuantity }
    })
  }

  const totalItems = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0)
  const totalPrice = Object.entries(quantities).reduce((sum, [productName, quantity]) => 
    sum + (products[productName as keyof typeof products].price * quantity), 0
  )

  const handleCheckout = async () => {
    const body = JSON.stringify(Object.entries(quantities).map(([productName, quantity]) => ({ stripePriceId: products[productName as keyof typeof products].stripePriceId, quantity })))
    const response = await fetch('/api/stripe', {
      method: 'POST',
      body: body,
    })
    const { sessionId } = await response.json()

    const stripe = await stripePromise
    stripe?.redirectToCheckout({ sessionId })
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(products).map(([name, product]) => (
            <Card key={name} className="overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="p-0">
                <div className="relative h-64 w-full">
                  <Image
                    src={product.picture}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{name}</CardTitle>
                <CardDescription className="text-sm mb-4">{product.description}</CardDescription>
                <p className="text-lg font-semibold mb-4">${product.price.toFixed(2)}</p>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(name, -1)}
                    disabled={!quantities[name]}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold">{quantities[name] || 0}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(name, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Cart Summary</h2>
            <ShoppingCart className="h-6 w-6" />
          </div>
          <p className="text-lg mb-2">Total Items: {totalItems}</p>
          <p className="text-lg font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
          <div className="-mt-8 self-end">
            <Button variant="default" onClick={handleCheckout}>Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  )
}