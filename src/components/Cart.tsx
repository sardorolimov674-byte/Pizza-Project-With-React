import { useState } from "react"
import type { Product } from "../types/Product"
import { FiShoppingCart } from "react-icons/fi"
import { FaXmark } from "react-icons/fa6"
import { GoTrash } from "react-icons/go"
import img2 from "../assets/cartImg.png"
import { IoIosArrowBack } from "react-icons/io"
import "rodal/lib/rodal.css"
import Rodal from "rodal"
import axios from "axios"
import { useNavigate } from "react-router-dom"

type CartItem = Product & {
  count: number
  size: number
  type: number
}

const Cart = () => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")

  const navigate = useNavigate()

  const [items, setItems] = useState<CartItem[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  )

  const confirmOrder = async () => {
    if (!name || !address || !phone) {
      alert("Please fill in all fields!")
      return
    }

    const order = {
      customer: { name, address, phone },
      items,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    await axios.post("http://localhost:8080/orders", order)

    localStorage.removeItem("cart")
    setItems([])
    setName("")
    setAddress("")
    setPhone("")
    setOpen(false)

    window.dispatchEvent(new Event("cartUpdate"))
    navigate("/")
  }

  const update = (id: string, val: number) => {
    const updated = items.map(p =>
      p.id === id
        ? { ...p, count: Math.max(1, p.count + val) }
        : p
    )

    setItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
    window.dispatchEvent(new Event("cartUpdate"))
  }

  const remove = (id: string) => {
    const updated = items.filter(p => p.id !== id)

    setItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
    window.dispatchEvent(new Event("cartUpdate"))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cart")
    window.dispatchEvent(new Event("cartUpdate"))
  }

  const total = items.reduce((s, i) => s + i.price * i.count, 0)

  const totalPizzas = items.reduce((sum, item) => sum + item.count, 0)

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto mt-[70px] text-center">
        <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't ordered any pizza yet.<br />To order pizza, go back to the main page.</p>
        <img src={img2} alt="Empty cart" className="mx-auto mb-8 w-[300px]" />
        <button onClick={() => window.history.back()} className="w-[210px] h-[50px] rounded-pill bg-black text-white p-2 rounded-full">Go back</button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="flex text-3xl font-bold">
          <FiShoppingCart className="mt-1" />
          <span className="ms-4">Cart</span>
        </h1>
        <button onClick={clearCart} className="flex items-center gap-2 text-gray-400"><GoTrash /> <span>Clear cart</span></button>
      </div>

      <div className="border-b mb-6"></div>

      {items.map(item => (
        <div key={item.id} className="grid grid-cols-[520px_400px_270px_80px] items-center justify-end border-b py-6">
          <div className="flex items-center gap-4">
            <img src={item.imageUrl} alt={item.title} className="w-20" />
            <div>
              <b>{item.title}</b>
              <p className="text-sm text-gray-500">
                {item.type === 0 ? "thin" : "traditional"}, {item.size} cm
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button onClick={() => update(item.id, -1)} className="w-8 h-8 rounded-pill border flex items-center justify-center">-</button>
            <b>{item.count}</b>
            <button onClick={() => update(item.id, 1)} className="w-8 h-8 rounded-pill border flex items-center justify-center">+</button>
          </div>

          <div className="text-center font-bold">{item.price * item.count} $</div>
          <div className="flex justify-center">
            <button onClick={() => remove(item.id)} className="w-10 h-10 rounded-pill border flex items-center justify-center"><FaXmark /></button>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-10 text-lg mb-5">
        <div>
          <p>Total pizzas: <b>{totalPizzas}</b></p>
          <button onClick={() => window.history.back()} className="flex items-center gap-2 w-[180px] h-[50px] px-6 rounded-pill bg-gray-700 text-white font-medium shadow-md transition-all duration-200 hover:bg-gray-800 hover:shadow-lg active:scale-95">
            <IoIosArrowBack className="text-lg" />
            <span>Go back</span>
          </button>

        </div>
        <div>
          <p>Order total:{" "} <b className="text-orange-500">{total} $</b></p>
          <button onClick={() => setOpen(true)} className="w-[200px] h-[50px] rounded-pill bg-orange-500 text-white font-semibold">Pay now</button>
        </div>
      </div>

      <Rodal visible={open} onClose={() => setOpen(false)} width={400} height={380}>
        <h2 className="text-xl font-bold text-center mb-4">Order info</h2>
        <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="w-full h-[40px] mb-3 border px-3 rounded"/>
        <input type="text" placeholder="Your address" value={address} onChange={e => setAddress(e.target.value)} className="w-full h-[40px] mb-3 border px-3 rounded"/>
        <input type="number" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full h-[40px] mb-4 border px-3 rounded"/>
        <button onClick={confirmOrder} className="w-full h-[45px] bg-orange-500 text-white rounded-pill font-semibold">Confirm</button>
      </Rodal>
    </div>
  )
}

export default Cart
