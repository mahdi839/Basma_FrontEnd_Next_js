import { getData } from '@/lib/api'
import React, { Suspense } from 'react'
import FeatureClient from './featureClient'
import FeatureSkeleton from './components/FeatureSkeleton'


export default async function Feature({BannerCatData}) {
  let data = []
  try {
    // Fetch the data
    const response = await getData('api/product-slots_index/frontEndIndex?page=1')
    
    // FIXED: Pass the actual data structure the client expects
    data = {
      data: response.data || [],           // Categories array
      current_page: response.current_page,
      per_page: response.per_page,
      total: response.total,
      has_more: response.has_more
    }
  } catch(err) {
    data = {error: err.message, data: []}
  }
 
  return (
    <Suspense fallback={<FeatureSkeleton />}>
      <FeatureClient homeCategories={data} BannerCatData={BannerCatData} />
    </Suspense>
  )
}