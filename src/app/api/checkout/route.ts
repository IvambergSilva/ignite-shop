import { CartContext, CartProps } from "@/context/context";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { useContext } from "react";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({
            error: 'Method not allowed'
        })
    }

    const { items } = await req.json()

    if (!items) {
        return NextResponse.json({
            error: 'Price not found',
        })
    }

    console.log(items);

    const success_url = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancel_url = `${process.env.NEXT_URL}/`

    interface Items {
        priceId: string;
        quantity: number;
    }

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: items.map((product: Items) => ({
                price: product.priceId,
                quantity: product.quantity
            })),
            cancel_url: cancel_url,
            success_url: success_url
        })

        return NextResponse.json({
            checkoutUrl: checkoutSession.url,
        })
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: error }
        )
    }
}