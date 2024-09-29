'use client'

import { Product } from "@/components/product";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductProps } from "@/context/context";
import { stripe } from "@/lib/stripe";
import { useEffect, useState } from "react";
import Stripe from "stripe";

export default function Home() {
    const [products, setProducts] = useState<ProductProps[]>();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await stripe.products.list({
                    expand: ['data.default_price']
                })

                const products = response.data.map(product => {
                    const price = product.default_price as Stripe.Price

                    const unitAmount = price.unit_amount !== null ? price.unit_amount : 0

                    return {
                        id: product.id,
                        name: product.name,
                        imageUrl: product.images[0],
                        price: unitAmount / 100,
                        description: product.description,
                        defaultPriceId: price.id
                    }
                })

                setProducts(products)
            } catch (error) {
                console.log(error)
            }
        }

        fetchProducts()
    }, [])

    return (
        <>
            <div className="flex items-center w-full">
                <main className="flex max-w-[calc(100vw-((100vw-1180px)/2)) ml-auto overflow-hidden px-10 ">
                    <Carousel
                        opts={{
                            align: "end",
                            loop: true,
                        }}
                    >
                        <CarouselContent>
                            {products ? (
                                products.map((product) => {
                                    return (
                                        <CarouselItem
                                            key={product.id}
                                            className="basis-1/2 pl-4"
                                        >
                                            <Product
                                                product={product}
                                            />
                                        </CarouselItem>
                                    )
                                })
                            ) : (
                                Array.from({ length: 2 }).map((_, index) => {
                                    return (
                                        <CarouselItem
                                            key={index}
                                            className="basis-1/2 pl-4 flex gap-4"
                                        >
                                            <Skeleton
                                                className="w-[460px] h-[480px]"
                                            />
                                        </CarouselItem>
                                    )
                                })
                            )}
                        </CarouselContent>
                    </Carousel>
                </main>
            </div>
        </>
    );
}