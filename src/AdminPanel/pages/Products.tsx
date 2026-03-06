import { useEffect, useState } from "react"
import axios from "axios"
import Rodal from "rodal"
import "rodal/lib/rodal.css"
import type { Product } from "../../types/Product"

const typeNames = ["thin", "traditional"]

const typeOptions = [
  { id: 0, label: "Thin" },
  { id: 1, label: "Traditional" },
]

const sizeOptions = [26, 30, 40]

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  // DELETE STATE
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
    const res = await axios.get("http://localhost:8080/Products")
    setProducts(res.data)
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
    setForm({
      imageUrl: p.imageUrl,
      title: p.title,
      types: p.types,
      sizes: p.sizes,
      price: p.price,
      category: p.category,
      rating: p.rating,
    })
    setOpen(true)
  }

  const saveProduct = async () => {
    if (
      !form.imageUrl ||
      !form.title ||
      !form.types.length ||
      !form.sizes.length ||
      !form.price
    ) {
      alert("Please fill in all fields!")
      return
    }

    if (editId) {
      await axios.put(`http://localhost:8080/Products/${editId}`, form)
    } else {
      await axios.post("http://localhost:8080/Products", form)
    }

    setOpen(false)
    setEditId(null)
    getProducts()
  }

  // DELETE FLOW
  const openDelete = (id: string) => {
    setDeleteId(id)
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    await axios.delete(`http://localhost:8080/Products/${deleteId}`)
    setDeleteOpen(false)
    setDeleteId(null)
    getProducts()
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
            <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 text-center">
              <img src={item.imageUrl} className="w-full h-[110px] object-contain mb-2" />
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                {item.types.map(t => typeNames[t]).join(", ")} · {item.sizes.join(", ")} cm
              </p>
              <p className="font-semibold text-sm mt-2">{item.price} $</p>

              <div className="flex justify-center gap-2 mt-2">
                <button
                  onClick={() => openEdit(item)}
                  className="border-1 w-[70px] h-[45px] rounded bg-blue-500 text-xs text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDelete(item.id)}
                  className="border-1 w-[80px] h-[45px] rounded text-xs bg-red-500 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* ADD / EDIT MODAL */}
      <Rodal
        visible={open}
        onClose={() => setOpen(false)}
        width={450}
        height={620}
        customStyles={{ borderRadius: "16px", padding: "24px" }}
      >
        <h3 className="text-lg font-bold text-center mb-4">
          {editId ? "Edit Product" : "Add Product"}
        </h3>

        <div className="flex flex-col gap-3 text-sm">
          <input className="border px-3 h-[38px] rounded" placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
          <input className="border px-3 h-[38px] rounded" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />

          <div>
            <p className="font-medium mb-1">Types</p>
            {typeOptions.map(t => (
              <label key={t.id} className="flex gap-2 ms-2">
                <input type="checkbox" checked={form.types.includes(t.id)} onChange={() => toggleValue("types", t.id)} />
                {t.label}
              </label>
            ))}
          </div>

          <div>
            <p className="font-medium mb-1">Sizes</p>
            {sizeOptions.map(s => (
              <label key={s} className="flex gap-2 ms-2">
                <input type="checkbox" checked={form.sizes.includes(s)} onChange={() => toggleValue("sizes", s)} />
                {s} cm
              </label>
            ))}
          </div>

          <input type="number" className="border px-3 h-[38px] rounded" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} />

          <button onClick={saveProduct} className="mt-3 h-[40px] bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition">
            {editId ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </Rodal>

      <Rodal visible={deleteOpen} onClose={() => setDeleteOpen(false)} width={400} height={250} customStyles={{ borderRadius: "16px", padding: "30px",  }}>
        <h3 className="text-sm font-bold text-center mt-4">
          Do you want to delete this product?
        </h3>

        <div className="flex justify-center gap-4 mt-3">
          <button onClick={confirmDelete} className="px-6 h-[45px] bg-red-500 text-white rounded-pill font-semibold hover:bg-red-600 transition">Yes</button>
          <button onClick={() => setDeleteOpen(false)} className="px-6 h-[45px] bg-gray-200 rounded-pill font-semibold hover:bg-gray-300 transition">No</button>
        </div>
      </Rodal>
    </div>
  )
}
