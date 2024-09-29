"use client"
import Image from "next/image";
import Logo from "../assets/Logo.svg";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge, ShoppingBag } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "@/context/context";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Cart } from "./cart";

export function Header() {
    const { totalItems } = useContext(CartContext)

    return (
        <>
            <header className="w-full p-5 max-w-[1180px] mx-auto flex justify-between">
                <Link href={"/"}
                    className="flex w-fit">
                    <Image src={Logo} alt="Ignite Shop" />
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <div className="relative">
                            <Button
                                size="icon"
                                variant="ghost"
                                className={`w-12 h-12 ${totalItems > 0 ? 'text-zinc-100' : 'text-slate-400'}`}
                            >
                                <ShoppingBag size={24} />
                            </Button>
                            {totalItems > 0 && (
                                <span className="absolute bg-green-400 text-sm rounded-full w-6 h-6 flex justify-center items-center top-[-12px] right-[-12px] font-bold">{totalItems}</span>
                            )}
                        </div>
                    </SheetTrigger>
                    <SheetContent className="w-3/4 border border-zinc-700 bg-gray-900" aria-describedby={undefined}>
                        <SheetHeader>
                            <SheetTitle className="mb-8 text-xl font-bold">Sacola de compras</SheetTitle>
                        </SheetHeader>
                        <Cart />
                    </SheetContent>
                </Sheet>
            </header>
        </>
    )
}
