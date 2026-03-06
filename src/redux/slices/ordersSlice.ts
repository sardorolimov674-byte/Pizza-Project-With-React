import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { api } from "../../api/api"

export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  async () => {
    const res = await api.get("/orders")
    return res.data
  }
)

const ordersSlice = createSlice({
  name: "orders",
  initialState: [],
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchOrders.fulfilled, (_, action) => {
      return action.payload
    })
  },
})

export default ordersSlice.reducer
