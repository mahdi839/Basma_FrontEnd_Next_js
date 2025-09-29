import React from 'react'
import CategoryTable from './components/CategoryTable'
import Button from '@/app/components/dashboard/components/button/Button'
import Link from 'next/link'
import { getData } from '@/lib/api';

export default async function page() {
    let categories = [];
    const url = 'api/categories'
    try{
        categories = await getData(url) || [];
        
    }catch(err){
        return <p className="text-center text-danger">Error loading categories.</p>;
    }
  return (
    <div className="container-fluid my-5">
    <Link href="/dashboard/category/add">
      <Button className='mb-3'>Add Category</Button>
    </Link>

    {/* Pass sizes as props to the client component */}
    <CategoryTable categories={categories} />
  </div>
  )
}
