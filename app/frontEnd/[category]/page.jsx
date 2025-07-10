import { getData } from "@/lib/api"
import CtgProductsLogic from "./components/CtgProductsLogic"
import Link from "next/link"

export default async function page({ params }) {
  let products = []

  try {
    const data = await getData(`api/products?slug=${params?.category}`)
    products = data.data ?? []  // <-- SAFE fallback!
  } catch (err) {
    products = { error: err.message } // <-- passes error instead
  }
  let category = params?.category
  
  return (
    <>
     <div className="container">
     <p><Link href='/'>Home /</Link> <strong>{category?.charAt(0).toUpperCase() + category?.slice(1)}</strong> </p>
     </div>
      <CtgProductsLogic products={products}  />
    </>
  )
}
