import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import img1 from "../assets/headerImg.png"
import { FaShoppingCart } from "react-icons/fa"

type CartItem = {
  price: number
  count: number
}

const Header = () => {
  const location = useLocation()
  const isCart = location.pathname === "/CartPage"

  const [totalPrice, setTotalPrice] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const update = () => {
      const cart: CartItem[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      )
  
      let price = 0
      let count = 0
  
      cart.forEach(item => {
        price += item.price * item.count
        count += item.count
      })
  
      setTotalPrice(price)
      setTotalCount(count)
    }
  
    update()
    window.addEventListener("cartUpdate", update)
  
    return () => window.removeEventListener("cartUpdate", update)
  }, [])  

  return (
    <div>
      <div className="flex items-center gap-2 mt-[49px] ms-[77px]">
        <img src={img1} alt="Pizza logo" className="w-[38px] h-[38px]" />

        <div>
          <p className="m-0 text-[24px] font-extrabold leading-none">REACT PIZZA</p>
          <p className="m-0 text-[16px] text-gray-500 leading-snug">The most delicious pizza in the universe</p>
        </div>

        {!isCart && (
          <Link to="/CartPage" style={{ marginLeft: "740px", textDecoration: "none" }}className="flex items-center h-[50px] bg-orange-500 text-white font-semibold gap-2 p-3 rounded-full">
            <span>{totalPrice} $</span>
            <span className="w-[1px] h-[18px] bg-orange-300"></span>
            <div className="flex items-center gap-1">
              <FaShoppingCart size={18} />
              <span>{totalCount}</span>
            </div>
          </Link>
        )}

        {!isCart && (
          <Link to="/login" style={{ textDecoration: "none" }} className="flex items-center h-[50px] bg-red-500 text-white font-semibold gap-2 p-3 rounded-full">Admin Panel</Link>
        )}
      </div>
      <div className="w-full border border-gray-100 mt-[40px]"></div>
    </div>
  )
}

export default Header
