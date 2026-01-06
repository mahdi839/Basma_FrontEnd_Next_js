"use client"
import { useEffect } from 'react';

export default function Bootstrap_js() {

    useEffect(() => {
        // Dynamically import bootstrap JavaScript
        require('bootstrap/dist/js/bootstrap.min.js');
         
      }, []);
  return (
    null
  )
}
