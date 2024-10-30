'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Success() {
    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-8 text-center">Thank you for your purchase!</h1>
                <Button asChild variant="link">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </div>
    )
}
