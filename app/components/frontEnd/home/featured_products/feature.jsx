import { getData } from '@/lib/api'
import React from 'react'
import FeatureClient from './featureClient'

export default async function Feature() {
  let data =[]
  try{
    data = await getData('api/product-slots_index/frontEndIndex')
  }catch(err){
    data = {error:err.message}
  }
console.log(data)
  
  return (
    <FeatureClient products={data} />
  )
}
