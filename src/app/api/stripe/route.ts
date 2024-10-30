import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const body = await req.json()
      console.log(body)
      // Build line items based on the items received
      const lineItems = body.map((item: { stripePriceId: string, quantity: number }) => ({
        price: item.stripePriceId,
        quantity: item.quantity,
      }))

      // Create a Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/success`,
        cancel_url: `${req.headers.get('origin')}/`,
      })

      return NextResponse.json({ sessionId: session.id })
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return NextResponse.json({ error: 'An error occurred, please try again later.' })
    }
  } else {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
  }
}
