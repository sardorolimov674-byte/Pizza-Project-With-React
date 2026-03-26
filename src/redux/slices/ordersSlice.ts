import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase.config"

export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  async () => {
    const snapshot = await getDocs(collection(db, "orders"))

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
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