"use client"
import React from 'react'

export default function Pagination({page,setPage,pagination}) {
    const gotoPage = (p)=>{
      if(p>=1 && p<=pagination.last_page){
        setPage(p)
      }
    }
   const renderPageNumbers = ()=>{
      const pages = [];
      for(let i=1;i<=pagination.last_page;i++){
         pages.push(
            <li className='page-item'>  <button key={i} className={`page-link  ${i==pagination.current_page?"bg-info text-white":""}`}
            onClick={()=> gotoPage(i)}>
           {i}
       </button> </li>
           
         )
      }
      return pages;
   }
  return (
    <nav aria-label="Page navigation example " className='mt-2'>
         <ul className ="pagination">
        <li className ="page-item" > <button className='page-link' disabled={page==1} onClick={()=> gotoPage(page-1)}>Prev</button></li>
        {renderPageNumbers()}
        <li className ="page-item"> <button className='page-link' disabled={page==pagination.last_page} onClick={()=> gotoPage(page+1)}>Next</button></li>
        </ul>
    </nav>
  )
}
