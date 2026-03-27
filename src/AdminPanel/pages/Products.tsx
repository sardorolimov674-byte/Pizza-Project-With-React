import { useEffect, useState } from "react"
import Rodal from "rodal"
import "rodal/lib/rodal.css"
import type { Product } from "../../types/Product"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore"
import { db } from "../../firebase/firebase.config"

const typeNames = ["thin", "traditional"]

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState<Product>({
    id: "",
    imageUrl: "",
    title: "",
    types: [],
    sizes: [],
    price: 0,
    category: 0,
    rating: 5,
  })

  const getProducts = async () => {
    const snap = await getDocs(collection(db, "product"))

    const data: Product[] = snap.docs.map(d => {
      const raw = d.data()

      return {
        id: d.id,
        imageUrl: raw.imageUrl || "",
        title: raw.title || "",
        types: Array.isArray(raw.types) ? raw.types : [],
        sizes: Array.isArray(raw.sizes) ? raw.sizes : [],
        price: raw.price || 0,
        category: raw.category || 0,
        rating: raw.rating || 5,
      }
    })

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
      id: "",
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

  const saveProduct = async () => {
    if (!form.title) return alert("Fill all fields")

    const { id, ...data } = form

    if (editId) {
      await updateDoc(doc(db, "product", editId), data)
    } else {
      await addDoc(collection(db, "product"), data)
    }

    setOpen(false)
    getProducts()
  }

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
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[40px] px-4 border rounded-lg"
          />

          <button
            onClick={openAdd}
            className="px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {products
          .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
          .map(item => (
            <div key={item.id} className="bg-white p-3 rounded-xl shadow">

              <img src={item.imageUrl} className="h-[120px] w-full object-contain mb-2" />

              <p className="font-bold">{item.title}</p>

              <p className="text-sm text-gray-400">
                {item.types.map(t => typeNames[t]).join(", ")} · {item.sizes.join(", ")}
              </p>

              <p className="font-semibold mt-1">{item.price} $</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 bg-blue-500 text-white rounded-md h-[35px]"
                >
                  Edit
                </button>

                <button
                  onClick={() => openDelete(item.id)}
                  className="flex-1 bg-red-500 text-white rounded-md h-[35px]"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
      </div>

      <Rodal
        visible={open}
        onClose={() => setOpen(false)}
        width={480}
        height={700}
        customStyles={{ borderRadius: "16px", padding: "20px" }}
      >
        <div className="flex flex-col gap-4">

          <h2 className="text-xl font-bold text-center">
            {editId ? "Edit Product" : "Add Product"}
          </h2>

          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            className="p-2 border rounded-lg"
          />

          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="p-2 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: +e.target.value })}
            className="p-2 border rounded-lg"
          />

          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Category"
              value={form.category}
              onChange={e => setForm({ ...form, category: +e.target.value })}
              className="p-2 border rounded-lg w-full"
            />

            <input
              type="number"
              placeholder="Rating"
              value={form.rating}
              onChange={e => setForm({ ...form, rating: +e.target.value })}
              className="p-2 border rounded-lg w-full"
            />
          </div>

          <div>
            <p className="font-semibold">Types</p>
            {[0, 1].map(t => (
              <label key={t} className="mr-3">
                <input
                  type="checkbox"
                  checked={form.types.includes(t)}
                  onChange={() => toggleValue("types", t)}
                />
                {typeNames[t]}
              </label>
            ))}
          </div>

          <div>
            <p className="font-semibold">Sizes</p>
            {[26, 30, 40].map(s => (
              <label key={s} className="mr-3">
                <input
                  type="checkbox"
                  checked={form.sizes.includes(s)}
                  onChange={() => toggleValue("sizes", s)}
                />
                {s}
              </label>
            ))}
          </div>

          <div className="flex gap-3 mt-2">

            <button
              onClick={() => setOpen(false)}
              className="w-full h-[45px] border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={saveProduct}
              className="w-full h-[45px] bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Save
            </button>

          </div>

        </div>
      </Rodal>

      <Rodal visible={deleteOpen} onClose={() => setDeleteOpen(false)} width={300} height={200}>
        <div className="text-center">
          <p>Delete this product?</p>
          <button onClick={confirmDelete} className="bg-red-500 text-white px-4 mt-3">
            Yes
          </button>
        </div>
      </Rodal>
    </div>
  )
}