import React from 'react'
import Products from '../components/Products'
import { getData } from '@/lib/api'
export default async function page({params}) {
  const {id} = params;
  let data =[]
    try{
      data = await getData(`api/products/${id}`)
    }catch(err){
      data = {error:err.message}
    }
   
  return (
    <>
    <Products product={data.data} />
    </>
  )
}
