import React from 'react'

export default function Button({children,  onClick,className,type}) {
  return (
    <button
      className={` primary-btn ${className || ''}`}
      onClick={onClick}
      type ={type}
      // style={{padding:'7px 30px',outline:'none',border:'none',background:''}}
    >
      {children}
    </button>
  )
}
