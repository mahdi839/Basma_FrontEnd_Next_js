import Link from 'next/link'
import React from 'react'

export default function NavCategories({isClient,style,category}) {
  return (
      <ul className={isClient?style.category_list:null}>
        {category?.data?.map((categ)=>(
        <li key={categ.id}>
        <Link href={`/frontEnd/${categ.slug}`}>{categ.name}</Link>
        </li>
        ))}
      </ul>
  )
}
