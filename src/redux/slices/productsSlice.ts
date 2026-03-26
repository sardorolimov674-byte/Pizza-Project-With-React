import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase.config"
import type { Product } from "../../types/Product"

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async () => {
    const snapshot = await getDocs(collection(db, "product"))

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
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