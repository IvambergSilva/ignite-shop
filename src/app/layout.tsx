import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google"
import App from "@/app/_app";
import { CartContextProvider } from "@/context/context";

export const metadata: Metadata = {
    // title: "Ignite Shop",
    description: "Transforme seu visual, eleve sua confiança!",
};

const font = Roboto({
    weight: ['400', '700'],
    subsets: ['latin']
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={font.className}>
                <CartContextProvider>
                    <App>
                        {children}
                    </App>
                </CartContextProvider>
            </body>
        </html>
    );
}