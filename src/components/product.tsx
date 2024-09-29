'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { useContext, useState } from "react";
import { CartContext, ProductProps } from "@/context/context";

interface ProductDetailsProps {
    product: ProductProps
}

export function Product({ product }: ProductDetailsProps) {
    const { handleAddToCart } = useContext(CartContext)

    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="flex flex-col bg-custom-gradient rounded-xl overflow-hidden py-5 px-1 active:cursor-grabbing group max-h-[480px]">
            <Link href={`product/${product.id}`}
                className="flex justify-center items-center flex-col"
                prefetch={false}
            >
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover"
                    width={480}
                    height={480}
                />
            </Link>

            <footer className="p-5 rounded-lg bg-zinc-800 w-full flex items-center justify-between transform translate-y-[110%] group-hover:translate-y-[calc(-100%+4px)] transition-transform duration-300">
                <div className="flex flex-col gap-1">
                    <strong className="text-lg">{product.name}</strong>
                    <span className="text-xl text-green-400 font-semibold">{new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(product.price)}</span>
                </div>
                <Button
                    size="icon"
                    onClick={() => handleAddToCart(product)}
                >
                    <ShoppingBag size={32} />
                </Button>
            </footer>
        </div>
    )
}
