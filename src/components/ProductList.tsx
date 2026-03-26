import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

type Props = {
  category: number;
  sort: string;
};

const typeNames = ["thin", "traditional"];

const ProductList = ({ category, sort }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<{ [key: string]: number }>({});
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: number }>({});

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const size = selectedSizes[product.id];
    const type = selectedTypes[product.id];
    const price = calcPrice(product.price, size);

    const found = cart.find(
      (i: any) => i.id === product.id && i.size === size && i.type === type
    );

    if (found) {
      found.count++;
    } else {
      cart.push({
        ...product,
        price,
        size,
        type,
        count: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdate"));

    toast.success("Product added to cart    ");
  };

  const getProduct = async () => {
    const snap = await getDocs(collection(db, "product"));

    const data: Product[] = snap.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    }));

    setProducts(data);

    const initialTypes: { [key: string]: number } = {};
    const initialSizes: { [key: string]: number } = {};

    data.forEach((product) => {
      initialTypes[product.id] = product.types[0];
      initialSizes[product.id] = product.sizes[0];
    });

    setSelectedTypes(initialTypes);
    setSelectedSizes(initialSizes);
  };

  useEffect(() => {
    getProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTypeClick = (productId: string, type: number) => {
    setSelectedTypes((prev) => ({ ...prev, [productId]: type }));
  };

  const handleSizeClick = (productId: string, size: number) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const calcPrice = (basePrice: number, size: number) => {
    if (size === 26) return basePrice;
    if (size === 30) return Math.round(basePrice * 1.3);
    if (size === 40) return Math.round(basePrice * 1.3 * 1.3);
    return basePrice;
  };

  return (
    <div className="bg-white py-8">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="ms-[67px] text-[32px] font-bold text-gray-800 mb-6">
          All Pizzas
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-[35px]">
          {products
            .filter((p) => category === 0 || p.category === category)
            .sort((a, b) => {
              if (sort === "price") return a.price - b.price;
              if (sort === "alphabet") return a.title.localeCompare(b.title);
              return b.rating - a.rating;
            })
            .map((item) => (
              <div key={item.id} className="text-center">
                <img src={item.imageUrl} alt={item.title} className="w-full max-w-[230px] mx-auto"/>
                <p className="text-[20px] font-bold mt-11 text-gray-900">{item.title}</p>
                <div className="bg-gray-100 rounded-lg p-1 mt-[22px] flex flex-col gap-1 max-w-[280px] mx-auto">
                  <div className="flex">
                  {Array.isArray(item.types) && item.types.map((type) => (
                      <button key={type} onClick={() => handleTypeClick(item.id, type)} style={{ borderRadius: "10px", fontSize: "14px" }} className={`flex-1 py-1.5 font-medium transition ${selectedTypes[item.id] === type ? "bg-white text-gray-900 shadow-sm" : "bg-transparent text-gray-500"}`}>{typeNames[type]}</button>
                    ))}
                  </div>

                  <div className="flex">
                  {Array.isArray(item.sizes) && item.sizes.map((size) => (
                      <button key={size} onClick={() => handleSizeClick(item.id, size)} style={{ borderRadius: "10px", fontSize: "14px" }} className={`flex-1 py-1.5 rounded-md font-medium transition ${selectedSizes[item.id] === size ? "bg-white text-gray-900 shadow-sm" : "bg-transparent text-gray-500"}`}>{size} cm</button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-[24px] max-w-[260px] mx-auto">
                  <span className="font-bold text-[22px]">from {calcPrice(item.price, selectedSizes[item.id])} $</span>
                  <button onClick={() => addToCart(item)} className="px-3 h-[40px] font-semibold rounded-pill bg-gray-200 !text-gray-800 hover:bg-[orange] hover:!text-white transition-all duration-400">+add</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;