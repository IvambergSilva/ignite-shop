'use client'

import axios from "axios";
import { createContext, ReactNode, useReducer, useState } from "react";

export interface ProductProps {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    description: string | null;
    defaultPriceId: string;
}

interface CartContextProps {
    totalItems: number;
    totalCartValue: number;
    isCreatingCheckoutSession: boolean;
    productList: CartProps['productList'];
    handleAddToCart: (product: ProductProps) => void;
    handleRemoveFromCart: (productId: string) => void;
    handleBuyProduct: () => void;
}

export const CartContext = createContext({} as CartContextProps)

interface CartContextProviderProps {
    children: ReactNode;
}

export interface CartProps {
    productList: {
        item: {
            product: ProductProps;
            amount: number;
        }
    }[],
    totalItems: number;
    totalCartValue: number;
}

export function CartContextProvider({ children }: CartContextProviderProps) {
    const [cart, dispatch] = useReducer(
        (state: CartProps, action: { type: string; payload: any }) => {
            switch (action.type) {
                case "ADD_TSHIRT_TO_CART": {
                    const productExist = state.productList.find(({ item }) => item.product.id === action.payload.id);

                    let totalItems = state.totalItems;

                    let updateTotalCartValue;

                    if (productExist) {
                        return {
                            ...state,
                            productList: state.productList.map(({ item }) => {
                                if (item.product.id === action.payload.id) {
                                    return {
                                        item: {
                                            ...item,
                                            amount: item.amount + 1,
                                        },
                                    };
                                }
                                return { item };
                            }),
                            totalItems: totalItems + 1,
                            totalCartValue: calculateTotalCartValue(state.productList)
                        }
                    }

                    updateTotalCartValue = [
                        ...state.productList,
                        {
                            item: {
                                product: action.payload,
                                amount: 1
                            },
                        }
                    ]

                    return {
                        ...state,
                        productList: updateTotalCartValue,
                        totalItems: totalItems + 1,
                        totalCartValue: calculateTotalCartValue(updateTotalCartValue)
                    };
                }

                case "REMOVE_TSHIRT_FROM_CART": {
                    const updateProductList = state.productList.filter(({ item }) => item.product.id !== action.payload)

                    const updateTotalItems = updateProductList.reduce((acc, product) => acc += product.item.amount, 0)

                    const updateTotalCartValue = calculateTotalCartValue(updateProductList)

                    return {
                        ...state,
                        productList: updateProductList,
                        totalItems: updateTotalItems,
                        totalCartValue: updateTotalCartValue
                    };
                }

                default:
                    return state;
            }
        },
        {
            productList: [],
            totalItems: 0,
            totalCartValue: 0
        }
    );

    function handleAddToCart(product: ProductProps) {
        dispatch({
            type: "ADD_TSHIRT_TO_CART",
            payload: product
        })
    }

    function handleRemoveFromCart(productId: string) {
        dispatch({
            type: "REMOVE_TSHIRT_FROM_CART",
            payload: productId
        })
    }

    function calculateTotalCartValue(productList: CartProps['productList']) {
        return productList.reduce((acc, { item }) => acc += (item.amount * item.product.price), 0)
    }

    const { productList, totalItems, totalCartValue } = cart

    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

    async function handleBuyProduct() {
        try {
            setIsCreatingCheckoutSession(true)

            const response = await axios.post('/api/checkout', {
                items: productList.map(({ item }) => {
                    return {
                        priceId: item.product.defaultPriceId,
                        quantity: item.amount
                    }
                })
            })
            const { checkoutUrl } = response.data

            window.location.href = checkoutUrl
        } catch (error) {
            alert('Falha ao redirecionar ao checkout!')
            setIsCreatingCheckoutSession(false)
        }
    }


    return (
        <CartContext.Provider value={{
            totalItems,
            totalCartValue,
            handleAddToCart,
            productList,
            handleRemoveFromCart,
            handleBuyProduct,
            isCreatingCheckoutSession
        }}>
            {children}
        </CartContext.Provider>
    )
}