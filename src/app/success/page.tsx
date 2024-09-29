"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import Head from "next/head";
import { Skeleton } from "@/components/ui/skeleton";

interface CheckoutSuccessProps {
    customerName: string | null | undefined;
    items: {
        name: string;
        imageUrl: string;
        quantity: number | null;
    }[] | undefined
}

export default function Success() {
    const seacrh = useSearchParams();
    const sessionId = seacrh.get('session_id')
    const router = useRouter()

    const [products, setProducts] = useState<CheckoutSuccessProps>()

    useEffect(() => {
        const fetchProducts = async () => {
            if (sessionId) {
                try {
                    const response = await stripe.checkout.sessions.retrieve(sessionId, {
                        expand: ['line_items', 'line_items.data.price.product'],
                    })

                    const customerName = response.customer_details?.name

                    const session = {
                        customerName,
                        items: response.line_items?.data.map((product) => {
                            const currentProduct = product.price?.product as Stripe.Product

                            return {
                                name: product.description || "",
                                imageUrl: currentProduct.images[0],
                                quantity: product.quantity
                            }
                        }),
                    }

                    setProducts(session)
                } catch (error) {
                    console.log(error);

                    router.push('/')
                }
            } else {
                router.push('/')
            }
        }
        fetchProducts()
    }, [sessionId, router])

    return (
        <>
            <Head>
                <title>Compra efetuada | Ignite Shop</title>
                <meta name="robots" content="noindex" />
            </Head>
            <div className="flex justify-center items-center flex-col px-5">
                <h2 className="mb-10 text-4xl font-bold">Compra efetuada!</h2>
                {products?.items ? (
                    products.items.length > 1
                        ? (
                            <>
                                <div className="flex">
                                    {products?.items && products?.items.map((product) => {
                                        return (
                                            <div className="bg-custom-gradient flex justify-center items-center h-36 w-36 rounded-full ml-[-52px] border-4 border-card-foreground relative">
                                                {product.imageUrl && (
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name || ''}
                                                        className="object-cover w-auto h-auto"
                                                        width={127}
                                                        height={118}
                                                    />
                                                )}
                                                {product.quantity && product.quantity > 1 && (
                                                    <span className="absolute -bottom-3 bg-slate-300 text-zinc-900 font-semibold rounded-full py-0.5 px-2 border-1 border-card-foreground">{product.quantity} itens</span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-custom-gradient rounded-md flex justify-center items-center h-36 w-36">
                                    {products?.items && products?.items[0].imageUrl && (
                                        <Image
                                            src={products?.items[0].imageUrl}
                                            alt={products?.items[0].name || ''}
                                            className="object-cover"
                                            width={127}
                                            height={118}
                                        />
                                    )}
                                </div>
                            </>
                        )
                ) : (
                    <Skeleton className="w-[118px] h-[127px]"/>
                )}
                <p className="max-w-[590px] text-center mt-8 mb-10 text-gray-300 text-2xl">Uhuul <strong className="text-stone-400 first-letter:uppercase">{products?.customerName}</strong>{products?.items && products?.items?.length > 1 ? (
                    <>, sua compra de {products?.items?.length} camisetas já está a caminho da sua casa. </>
                ) : (
                    <>, sua compra <strong className="text-stone-400">{products?.items && products?.items[0].name}</strong> já está a caminho da sua casa.</>
                )}</p>

                <Link href="/" className="text-green-500 text-xl">Voltar ao catálogo</Link>
            </div>
        </>
    )
}