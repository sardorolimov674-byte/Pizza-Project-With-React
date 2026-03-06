import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { MdOutlineInventory2 } from "react-icons/md"
import { FaShoppingCart, FaUsers } from "react-icons/fa"
import Rodal from "rodal"
import "rodal/lib/rodal.css"

const linkClass = ({ isActive }: any) =>
  `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition
   ${
     isActive
       ? "bg-blue-100 text-blue-600"
       : "text-gray-600 hover:bg-gray-100"
   }`

export default function DashboardLayout() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  const goToStore = () => {
    setVisible(false)
    navigate("/")
  }

  return (
    <div className="flex">
      <header className="h-16 bg-white px-6 flex items-center fixed left-0 right-0 z-10 border-b border-gray-300">
        <div className="flex items-center gap-3 text-[24px] font-semibold text-blue-600">
          <img src="https://img.freepik.com/free-vector/business-user-shield_78370-7029.jpg?semt=ais_hybrid&w=740&q=80" className="w-12 h-12 rounded-full"alt="Admin"/>Admin Panel
        </div>
      </header>

      <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white px-4 py-6 shadow flex flex-col justify-between">
        <nav className="space-y-2">
          <NavLink to="/dashboard/products" className={linkClass} style={{textDecoration: "none"}}> 
            <MdOutlineInventory2 size={20} /> Products
          </NavLink>

          <NavLink to="/dashboard/orders" className={linkClass} style={{textDecoration: "none"}}>
            <FaShoppingCart size={18} /> Orders
          </NavLink>

          <NavLink to="/dashboard/delivery" className={linkClass} style={{textDecoration: "none"}}>
            <FaUsers size={18} /> Delivery
          </NavLink>
        </nav>

        <button onClick={() => setVisible(true)} className="h-[45px] rounded-pill bg-red-600 text-white font-semibold shadow hover:bg-red-700">Go to Store</button>
      </aside>

      <main className="ml-64 w-full pt-20 p-6"> 
        <Outlet />
      </main>

      <Rodal visible={visible} onClose={() => setVisible(false)} width={370} height={250} customStyles={{borderRadius: "30px", padding: "20px"}} animation="zoom" closeOnEsc closeMaskOnClick>
        <div className="flex flex-col h-full justify-between text-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Would you like to go to the store?</h3>
            <p className="text-sm text-gray-500 mt-2">You will exit the admin panel and go to the store page</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setVisible(false)} className="flex-1 h-[40px] rounded-pill border border-gray-300 text-gray-600 hover:bg-gray-100">No</button>
            <button onClick={goToStore} className="flex-1 h-[40px] rounded-pill bg-red-600 text-white hover:bg-red-700">Yes</button>
          </div>
        </div>
      </Rodal>
    </div>
  )
}
