import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { loginSuccess } from "../../redux/slices/authSlice"
import { FaPizzaSlice } from "react-icons/fa6"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase.config"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const snap = await getDocs(collection(db, "login"))

      const users = snap.docs.map(doc => doc.data())

      const found = users.find(
        (u: any) =>
          u.username === email && u.password === password
      )

      if (found) {
        dispatch(loginSuccess({ email }))
        setError("")
        navigate("/dashboard")
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      console.log(err)
      setError("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <form
        onSubmit={submit}
        className={`w-[440px] bg-white rounded-lg shadow-lg px-8 py-8 transition-all ${
          error ? "min-h-[550px]" : "min-h-[500px]"
        }`}
      >
        <div className="flex justify-center mb-4 text-3xl">
          <FaPizzaSlice size={"50px"} />
        </div>

        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Pizza Admin
        </h1>
        <p className="text-center text-gray-500 mt-1 text-sm">
          Management Panel
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your username"
              className="mt-1 w-full px-4 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-gray-500"
            />
          </div>

          {error && (
            <div className="border border-gray-300 bg-gray-100 text-gray-700 text-sm rounded px-3 py-2">
              {error}
            </div>
          )}

          <button className="w-full mt-2 py-2.5 rounded bg-gray-800 hover:bg-gray-900 text-white font-medium transition">
            Sign In
          </button>

          <div className="mt-4 text-xs text-gray-500 text-center">
            UserName: <b>admin</b> <br />
            Password: <b>admin123</b>
          </div>
        </div>
      </form>
    </div>
  )
}