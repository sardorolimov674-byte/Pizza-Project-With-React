import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { api } from "../../api/api"
import type { Product } from "../../types/Product"

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async () => {
    const res = await api.get<Product[]>("/Products")
    return res.data
  }
)

type ProductsState = {
  list: Product[]
  loading: boolean
}

const initialState: ProductsState = {
  list: [],
  loading: false,
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.list = action.payload
        state.loading = false
      })
  },
})

export default productsSlice.reducer
