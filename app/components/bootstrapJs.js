"use client"
import { useEffect } from 'react';

export default function BootstrapJS() {
  useEffect(() => {
    // Dynamically load Bootstrap's JavaScript on the client-side
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return null; // This component doesn't render anything
}