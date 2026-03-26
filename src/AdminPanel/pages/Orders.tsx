import { useEffect, useState } from "react"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/firebase.config"
import type { Order } from "../../types/Order"

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])

  const getOrders = async () => {
    const snap = await getDocs(collection(db, "orders"))

    const data: Order[] = snap.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Order, "id">),
    }))

    setOrders(data)
  }

  useEffect(() => {
    getOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setStatus = async (id: string, status: Order["status"]) => {
    await updateDoc(doc(db, "orders", id), { status })
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

              <div className="w-[120px] font-semibold text-lg">
                Total: <br /> {order.total} $
              </div>

              {order.status === "cancelled" && (
                <div className="w-[120px]">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    cancelled
                  </span>
                </div>
              )}

              {order.status !== "cancelled" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus(order.id, "delivered")}
                    className="w-[150px] h-[50px] rounded bg-green-500 text-white rounded-full"
                  >
                    Mark Delivered
                  </button>
                  <button
                    onClick={() => setStatus(order.id, "cancelled")}
                    className="w-[100px] h-[50px] rounded bg-red-500 text-white rounded-full"
                  >
                    Cancelled
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}