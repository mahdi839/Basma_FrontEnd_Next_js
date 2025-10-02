import { getData } from '@/lib/api'
import React from 'react'
import FeatureClient from './featureClient'

export default async function Feature({BannerCatData}) {
  let data =[]
  try{
    data = await getData('api/product-slots_index/frontEndIndex')
  }catch(err){
    data = {error:err.message}
  }
 
  return (
    <FeatureClient homeCategories={data} BannerCatData={BannerCatData} />
  )
}
