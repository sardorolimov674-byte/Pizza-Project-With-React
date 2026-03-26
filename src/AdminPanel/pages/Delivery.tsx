import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase.config"
import type { Order } from "../../types/Order"

export default function Delivery() {
  const [orders, setOrders] = useState<Order[]>([])

  const getDeliveredOrders = async () => {
    const snap = await getDocs(collection(db, "orders"))

    const data: Order[] = snap.docs
      .map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, "id">),
      }))
      .filter(o => o.status === "delivered")

    setOrders(data)
  }

  useEffect(() => {
    getDeliveredOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

            <div className="w-[120px] font-semibold text-lg">
              Total: <br /> {order.total} $
            </div>

            <div className="w-[120px]">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                delivered
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}