import { getData } from "@/lib/api"
import CtgProductsLogic from "./components/ctgProductsLogic"

export default async function page({ params }) {
  let products = []

  try {
    const data = await getData(`api/products?slug=${params.category}`)
    products = data.data ?? []  // <-- SAFE fallback!
  } catch (err) {
    products = { error: err.message } // <-- passes error instead
  }

  return (
    <>
      <CtgProductsLogic products={products} />
    </>
  )
}
