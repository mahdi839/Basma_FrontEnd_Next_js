import React from 'react'

export default function Button({children,  onClick,className,type}) {
  return (
    <button
      className={`btn btn-hover ${className || ''}`}
      onClick={onClick}
      type ={type}
    >
      {children}
    </button>
  )
}
