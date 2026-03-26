import { useEffect, useState } from "react"
import Rodal from "rodal"
import "rodal/lib/rodal.css"
import type { Product } from "../../types/Product"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "../../firebase/firebase.config"

const typeNames = ["thin", "traditional"]

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState({
    imageUrl: "",
    title: "",
    types: [] as number[],
    sizes: [] as number[],
    price: 0,
    category: 0,
    rating: 5,
  })

  const getProducts = async () => {
    const snap = await getDocs(collection(db, "product"))

    const data: Product[] = snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<Product, "id">),
    }))

    setProducts(data)
  }

  useEffect(() => {
    getProducts()
  }, [])
  
  const toggleValue = (key: "types" | "sizes", value: number) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }))
  }

  const openAdd = () => {
    setEditId(null)
    setForm({
      imageUrl: "",
      title: "",
      types: [],
      sizes: [],
      price: 0,
      category: 0,
      rating: 5,
    })
    setOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditId(p.id)
    setForm(p)
    setOpen(true)
  }

  // 🔥 SAVE
  const saveProduct = async () => {
    if (!form.title) return alert("Fill all fields")

    if (editId) {
      await updateDoc(doc(db, "product", editId), form)
    } else {
      await addDoc(collection(db, "product"), form)
    }

    setOpen(false)
    getProducts()
  }

  // 🔥 DELETE
  const confirmDelete = async () => {
    if (!deleteId) return
    await deleteDoc(doc(db, "product", deleteId))
    setDeleteOpen(false)
    getProducts()
  }

  const openDelete = (id: string) => {
    setDeleteId(id)
    setDeleteOpen(true)
  }

  return (
    <div className="mt-[30px] ms-[70px]">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Products</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 h-[40px] w-[270px] px-4 rounded-lg border text-sm outline-none focus:border-orange-500"
          />

          <button
            onClick={openAdd}
            className="px-4 h-[45px] bg-orange-500 text-white rounded-pill font-semibold hover:bg-orange-600 transition"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {products
          .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
          .map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-3 text-center">
              <img src={item.imageUrl} className="w-full h-[110px] object-contain mb-2" />

              <p className="font-semibold text-sm">{item.title}</p>

              <p className="text-xs text-gray-400 mt-1">
                {Array.isArray(item.types) ? item.types.map(t => typeNames[t]).join(", ") : ""}
                {" · "}
                {Array.isArray(item.sizes) ? item.sizes.join(", ") : ""} cm
              </p>

              <p className="font-semibold text-sm mt-2">{item.price} $</p>

              <div className="flex justify-center gap-2 mt-2">
                <button
                  onClick={() => openEdit(item)}
                  className="w-[70px] h-[45px] bg-blue-500 text-white text-xs"
                >
                  Edit
                </button>

                <button
                  onClick={() => openDelete(item.id)}
                  className="w-[80px] h-[45px] bg-red-500 text-white text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      <Rodal visible={open} onClose={() => setOpen(false)} width={450} height={620}>
        <h3 className="text-lg font-bold text-center mb-4">
          {editId ? "Edit Product" : "Add Product"}
        </h3>

        <div className="flex flex-col gap-3">
          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
          />

          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <button
            onClick={saveProduct}
            className="bg-orange-500 text-white h-[40px]"
          >
            Save
          </button>
        </div>
      </Rodal>

      <Rodal visible={deleteOpen} onClose={() => setDeleteOpen(false)} width={400} height={250}>
        <h3 className="text-center">Delete?</h3>
        <button onClick={confirmDelete}>Yes</button>
      </Rodal>
    </div>
  )
}