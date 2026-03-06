import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "../../types/Product"

type CartItem = Product & {
  count: number
  size: number
  type: number
}

const initialState: CartItem[] =
  JSON.parse(localStorage.getItem("cart") || "[]")

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const found = state.find(
        i =>
          i.id === action.payload.id &&
          i.size === action.payload.size &&
          i.type === action.payload.type
      )

      if (found) found.count++
      else state.push(action.payload)

      localStorage.setItem("cart", JSON.stringify(state))
    },

    removeFromCart(state, action: PayloadAction<string>) {
      const updated = state.filter(i => i.id !== action.payload)
      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    },

    clearCart() {
      localStorage.removeItem("cart")
      return []
    },
  },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
