import CtgProductsLogic from "./components/CtgProductsLogic"
import Link from "next/link"

export default async function Page({ params, searchParams }) {
  let products = []
  let paginationData = null
  const category = params?.category
  const page = searchParams?.page || 1

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/products?slug=${category}&page=${page}`,
      {
        cache: 'no-store', // Disable caching for production
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )

    if (!res.ok) {
      throw new Error("Failed to fetch products")
    }

    const data = await res.json()
    
    // Extract products array from paginated response
    products = data.data?.data ?? []
    
    // Extract pagination info
    paginationData = {
      current_page: data.data?.current_page || 1,
      last_page: data.data?.last_page || 1,
      per_page: data.data?.per_page || 8,
      total: data.data?.total || 0
    }

  } catch (err) {
    console.error("Fetch error:", err)
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

      <CtgProductsLogic 
        products={products} 
        category={category}
        pagination={paginationData}
      />
    </>
  )
}