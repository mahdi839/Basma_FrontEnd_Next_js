import CtgProductsLogic from "./components/CtgProductsLogic"
import Link from "next/link"

export default async function Page({ params }) {
  let products = []
  const category = params?.category

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/products?slug=${category}`,
      {
        next: {
          tags: ["products"],
        },
      }
    )

    if (!res.ok) {
      throw new Error("Failed to fetch products")
    }

    const data = await res.json()
    products = data.data ?? []
  } catch (err) {
    products = { error: err.message }
  }

  return (
    <>
      <div className="container">
        <p>
          <Link href="/">Home /</Link>{" "}
          <strong>
            {category?.charAt(0).toUpperCase() + category?.slice(1)}
          </strong>
        </p>
      </div>

      <CtgProductsLogic products={products} />
    </>
  )
}
