"use client"
import React, { useEffect} from 'react'

export default function HeroBgImage({ bgImages, setCurrentImageIndex }) {
    
    useEffect(() => {
        const interval = setInterval(()=>{
            setCurrentImageIndex((prevIndex)=> (prevIndex+1) % bgImages.length)
        },3000)

        return ()=>clearInterval(interval)
      }, [bgImages.length,setCurrentImageIndex]);
  return (
     null
  )
}
