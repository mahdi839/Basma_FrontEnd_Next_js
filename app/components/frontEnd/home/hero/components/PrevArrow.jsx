import React from 'react'
import { FaChevronLeft } from 'react-icons/fa';

export default function PrevArrow(props) {
    const { className, onClick } = props;
  return (
    <div
    className={`${className} ${style.customArrow} ${style.leftArrow}`}
    onClick={onClick}
  >
    <FaChevronLeft />
  </div>
  )
}
