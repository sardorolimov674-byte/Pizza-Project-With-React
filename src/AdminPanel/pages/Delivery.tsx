import { useEffect, useState } from "react"
import axios from "axios"

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
  status: "delivered"
}

export default function Delivery() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    axios
      .get("http://localhost:8080/orders?status=delivered")
      .then(res => setOrders(res.data))
  }, [])

  return (
    <div className="mt-[30px] ms-[70px]">
      <h2 className="text-2xl font-bold">Delivered Orders</h2>

      <div className="space-y-4 mt-10">
        {orders.map(order => (
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
            <div className="w-[120px]">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">delivered</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
