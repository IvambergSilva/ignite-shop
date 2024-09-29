import Stripe from "stripe"

const STRIPE_SECRET_KEY = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
    appInfo: {
        name: "Ignite Shop"
    },
    timeout: 1000
})