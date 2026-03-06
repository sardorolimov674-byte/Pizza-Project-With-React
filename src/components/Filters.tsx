type Props = {
  category: number
  setCategory: (id: number) => void
  sort: string
  setSort: (v: string) => void
}

const Filters = ({ category, setCategory, sort, setSort }: Props) => {
  const btnClass = (id: number) =>
    `w-[140px] h-[50px] font-semibold rounded-[20px] transition-all duration-300 rounded-pill
     ${
       category === id
         ? "bg-black text-white"
         : "bg-gray-200 text-gray-800 hover:bg-black hover:text-white"
     }`

  return (
    <div className="flex justify-between items-center my-4 flex-wrap gap-3 px-16">
      <div className="flex flex-wrap gap-3 mt-10">
        <button onClick={() => setCategory(0)} className={btnClass(0)}>All</button>
        <button onClick={() => setCategory(1)} className={btnClass(1)}>Meat</button>
        <button onClick={() => setCategory(2)} className={btnClass(2)}>Vegetarian</button>
        <button onClick={() => setCategory(3)} className={btnClass(3)}>Grill</button>
        <button onClick={() => setCategory(4)} className={btnClass(4)}>Spicy</button>
        <button onClick={() => setCategory(5)} className={btnClass(5)}>Closed</button>
      </div>

      <div className="text-sm flex items-center gap-2 mt-10">
        <span className="text-gray-600">Sort by:</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}className="bg-transparent text-orange-500 font-semibold border-0 border-b border-dashed border-orange-500 cursor-pointer outline-none">
          <option value="popularity">Popularity</option>
          <option value="price">By price</option>
          <option value="alphabet">Alphabetically</option>
        </select>
      </div>
    </div>
  )
}

export default Filters
