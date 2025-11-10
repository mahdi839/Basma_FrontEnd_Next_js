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

  let socialLinksData = [];
  try{
    socialLinksData = await getData(`api/social-links-first`);
  }catch(err){
    socialLinksData = {error:err.message}
  }
   console.log(socialLinksData)
  return (
    <>
    <Products product={data.data} socialLinksData={socialLinksData} />
    </>
  )
}
