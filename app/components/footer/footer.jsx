import React from 'react'
import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  return (
    <div className='d-full bg-black'>
       <div className='container d-flex gap-3 py-5'>
           <div className='address'>
            <Link href="#"><Image src="/img/logo3.png" alt="" width={200} height={30} /></Link>
            <p>Address: Mirpur-02, Dhaka</p>
            <p>Phone: +65 11.188.888</p>
            <p>Email: hello@colorlib.com</p>
           </div>
           <div className='address'></div>
           <div className='address'></div>
       </div>
    </div>
  )
}
