import React, { useState } from 'react'

export default function useProductLogics() {
    const [selectedColor,setSelectedColor] = useState(null);
    const [selectedSize,setSelectedSize] = useState(null);
   function handleSelectedColor (colorImage){
      setSelectedColor(colorImage)
   }
   function handleSelectedSize (sizeId){
      setSelectedSize(sizeId)
   }
   return {handleSelectedColor,selectedColor,handleSelectedSize,selectedSize};
}
