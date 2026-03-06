import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Filters from "./components/Filters"
import ProductList from "./components/ProductList"
import Cart from "./components/Cart"
import Login from "./AdminPanel/pages/Login"

import DashboardLayout from "./AdminPanel/layout/DashboardLayout"
import Products from "./AdminPanel/pages/Products"
import Orders from "./AdminPanel/pages/Orders"
import Delivery from "./AdminPanel/pages/Delivery"
import PrivateRoute from "./components/PrivateRouter"
import { useState } from "react"

function App() {
  const location = useLocation()
  const [category, setCategory] = useState(0)
  const [sort, setSort] = useState("popularity")

  const hideHeader =
    location.pathname === "/login" ||
    location.pathname.startsWith("/dashboard")

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Filters
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
              />
              <ProductList category={category} sort={sort} />
            </>
          }
        />

        <Route path="/CartPage" element={<Cart />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="products" />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="delivery" element={<Delivery />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
