'use client'

import Image from "next/image";
import { useContext } from "react";
import { CartContext } from "@/context/context";
import { Button } from "./ui/button";
import Link from "next/link";

export function Cart() {
    const { totalItems, productList, handleRemoveFromCart, totalCartValue, handleBuyProduct, isCreatingCheckoutSession } = useContext(CartContext)

    return (
        <section>
            {totalItems > 0 ? (
                <>
                    <div className="flex gap-6 flex-col h-full max-h-[400px] overflow-y-scroll scrollbar-webkit pr-1">
                        {productList.map(({ item: {
                            product,
                            amount
                        } }, index) => {
                            return (
                                <div className="flex gap-5" key={index}>
                                    <Link
                                        href={`product/${product.id}`}
                                        prefetch={false}
                                    >
                                        <div className="bg-custom-gradient rounded-md flex justify-center items-center h-[94px] max-h-[94px]">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="object-cover min-h-[94px] min-w-[94px]"
                                                width={94}
                                                height={94}
                                            />
                                        </div>
                                    </Link>
                                    <div className="flex flex-col justify-between min-w-fit">
                                        <Link
                                            href={`product/${product.id}`}
                                            prefetch={false}
                                        >
                                            <p className="text-lg text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-44">{product.name}</p>
                                        </Link>

                                        <span className="font-bold text-lg">{new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }).format(product.price)}</span>

                                        <span className="text-xs">{amount} {amount !== 1 ? 'itens' : 'item'}</span>

                                        <div>
                                            <button
                                                className="text-base text-green-500 font-bold hover:bg-transparent hover:text-green-600"
                                                onClick={() => handleRemoveFromCart(product.id)}
                                            >Remover {amount !== 1 ? 'itens' : 'item'}</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="my-14 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-base">Quantidade</span>
                            <span className="text-lg">{totalItems} {totalItems !== 1 ? 'itens' : 'item'}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold">
                            <span className="text-lg">Valor total</span>
                            <span className="text-2xl">{new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(totalCartValue)}</span>
                        </div>
                    </div>
                    <Button
                        className="font-bold w-full"
                        onClick={handleBuyProduct}
                        disabled={isCreatingCheckoutSession}
                    >Finalizar compra</Button>
                </>
            ) : (
                <span className="text-zinc-300 italic">O carrinho está vazio...</span>
            )}
        </section>
    )
}
