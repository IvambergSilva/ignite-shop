'use client'

import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import Head from "next/head";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CartContext, ProductProps } from "@/context/context";
import { Skeleton } from "@/components/ui/skeleton";

type Params = {
    id: string;
}

export default function Product() {
    const [product, setProduct] = useState<ProductProps>();

    const { id: productId } = useParams<Params>();

    const { handleAddToCart, isCreatingCheckoutSession } = useContext(CartContext)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await stripe.products.retrieve(productId, {
                    expand: ['default_price']
                })

                const price = response.default_price as Stripe.Price

                const unitAmount = price.unit_amount !== null ? price.unit_amount : 0

                const product = {
                    id: response.id,
                    name: response.name,
                    imageUrl: response.images[0],
                    price: unitAmount / 100,
                    description: response.description,
                    defaultPriceId: price.id
                }

                setProduct(product)
            } catch (error) {
                console.log(error);
            }
        }
        fetchProducts()
    }, [productId])

    return (
        <>
            <Head>
                <title>{product?.name} | Ignite Shop</title>
            </Head>
            <section className="grid grid-cols-2 gap-16 max-w-[1180px] mx-auto px-4">
                {product && product.imageUrl ? (
                    <div className="bg-custom-gradient rounded-md flex justify-center items-center">
                        <Image
                            src={product.imageUrl || ''}
                            alt={product.name || 'Produto'}
                            className="object-cover"
                            width={480}
                            height={520}
                        />
                    </div>
                ) : (
                    <Skeleton
                        className="w-[295px] h-[328px]"
                    />
                )}
                <div className="flex flex-col justify-between">
                    <div>
                        {product ? (
                            <h1 className="text-3xl text-gray-200 font-semibold">{product.name}</h1>
                        ) : (
                            <Skeleton
                                className="w-[295px] h-[72px]"
                            />
                        )}

                        {product ? (
                            <span className="text-3xl text-green-400 mb-10 mt-4 block">{new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(product.price)}</span>
                        ) : (
                            <Skeleton
                                className="mb-10 mt-4 w-[295px] h-[36px]"
                            />
                        )}

                        {product ? (
                            <p className="text-gray-200 leading-relaxed line-clamp-4 overflow-hidden mb-5">{product.description}</p>
                        ) : (
                            <Skeleton
                                className="w-[295px] h-[104px]"
                            />
                        )}
                    </div>
                    {product ? (
                        <Button
                            type="button"
                            variant="default"
                            className="w-full font-semibold"
                            onClick={() => handleAddToCart(product)}
                            disabled={isCreatingCheckoutSession}
                        >Adicionar à sacola</Button>
                    ) : (
                        <Skeleton
                            className="w-[295px] h-[24px]"
                        />
                    )}
                </div>
            </section>
        </>
    )
}