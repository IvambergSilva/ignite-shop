import { ReactNode } from "react";
import { Header } from "../components/header";

interface AppProps {
    children: ReactNode;
}

export default function App({ children }: AppProps) {
    return (
        <div className="flex flex-col justify-center min-h-screen gap-3">
            <Header />
            <div>
                {children}
            </div>
        </div>
    )
}
