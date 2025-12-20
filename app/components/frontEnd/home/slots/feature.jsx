import { getData } from '@/lib/api'
import React from 'react'
import FeatureClient from './featureClient'

export default async function Feature({BannerCatData}) {
  let data = []
  try {
    // Add ?page=1 to get first page of data
    data = await getData('api/product-slots_index/frontEndIndex?page=1')
  } catch(err) {
    data = {error: err.message}
  }

console.log(data);
  return (
    <FeatureClient homeCategories={data} BannerCatData={BannerCatData} />
  )
}