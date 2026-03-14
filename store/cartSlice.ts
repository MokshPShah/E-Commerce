import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  _id: string
  name: string
  price: number
  image: string
  slug: string
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(
        item => item._id === action.payload._id
      )
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find(item => item._id === action.payload)
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item._id !== action.payload)
        } else {
          existingItem.quantity -= 1
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload)
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
    }
  }
})

export const { addToCart, decreaseQuantity, removeFromCart, setCart } = cartSlice.actions
export default cartSlice.reducer
