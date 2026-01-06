import React from 'react'
import { FaChevronRight } from 'react-icons/fa';
import style from '../'
export default function NextArrow(props) {
    const { className, onClick } = props;
    return (
      <div
        className={`${className} ${style.customArrow} ${style.rightArrow}`}
        onClick={onClick}
      >
        <FaChevronRight />
      </div>
    )
}
