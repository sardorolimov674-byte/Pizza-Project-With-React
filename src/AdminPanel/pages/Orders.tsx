import { useEffect, useState } from "react"
import axios from "axios"

type OrderStatus = "delivered" | "cancelled" | "pending"

type Order = {
  id: string
  customer: {
    name: string
    address: string
    phone: string
  }
  items: {
    title: string
    size: number
    count: number
  }[]
  total: number
  status: OrderStatus
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])

  const getOrders = async () => {
    const res = await axios.get("http://localhost:8080/orders")
    setOrders(res.data)
  }

  useEffect(() => {
    getOrders()
  }, [])

  const setStatus = async (id: string, status: "delivered" | "cancelled") => {
    await axios.patch(`http://localhost:8080/orders/${id}`, { status })
    getOrders()
  }

  return (
    <div className="mt-[30px] ms-[70px]">
      <h2 className="text-2xl font-bold">Orders</h2>

      <div className="space-y-4 mt-10">
        {orders
          .filter(o => o.status !== "delivered")
          .map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow p-5 flex justify-between gap-6">
              <div className="w-[260px]">
                <p className="font-semibold text-lg">Name: {order.customer.name}</p>
                <p className="text-sm text-gray-500">Address: {order.customer.address}</p>
                <p className="text-sm text-gray-500">Phone: {order.customer.phone}</p>
              </div>

              <div className="flex-1">
                <p className="font-bold">Products:</p>
                {order.items.map((i, idx) => (
                  <p key={idx} className="text-sm">
                    {i.title} — {i.size}cm × {i.count}
                  </p>
                ))}
              </div>

              <div className="w-[120px] font-semibold text-lg">Total: <br /> {order.total} $</div>

              {order.status === "cancelled" && (
                <div className="w-[120px]">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">cancelled</span>
                </div>
              )}

              {order.status !== "cancelled" && (
                <div className="flex gap-2">
                  <button onClick={() => setStatus(order.id, "delivered")} className="w-[150px] h-[50px] rounded bg-green-500 text-white rounded-full">Mark Delivered</button>
                  <button onClick={() => setStatus(order.id, "cancelled")} className="w-[100px] h-[50px] rounded bg-red-500 text-white rounded-full">Cancelled</button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
