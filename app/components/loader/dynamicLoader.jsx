import React from 'react'
import { FaSpinner } from 'react-icons/fa'

export default function DynamicLoader() {
  return (
    <div className="text-center my-5 loader-icon"><FaSpinner size={30} style={{
        animation: 'spin 1s linear infinite',
      }} /></div>
  )
}
