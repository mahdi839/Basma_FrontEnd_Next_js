import { getData } from '@/lib/api'
import React, { Suspense } from 'react'
import FeatureClient from './featureClient'
import FeatureSkeleton from './components/FeatureSkeleton'


export default async function Feature({BannerCatData}) {
  let data = []
  try {
    // Add ?page=1 to get first page of data
    data = await getData('api/product-slots_index/frontEndIndex?page=1')
  } catch(err) {
    data = {error: err.message}
  }

  return (
    <Suspense fallback={<FeatureSkeleton />}>
      <FeatureClient homeCategories={data} BannerCatData={BannerCatData} />
    </Suspense>
  )
}