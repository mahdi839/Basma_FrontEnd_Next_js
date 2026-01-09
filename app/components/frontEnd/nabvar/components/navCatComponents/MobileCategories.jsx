'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import './mobileCategories.css'

export default function MobileCategories({ categories, onClick }) {
  const [expandedCategories, setExpandedCategories] = useState({})

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const handleLinkClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const renderCategory = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories[category.id]

    return (
      <li key={category.id} className={`mobile-category-item level-${level}`}>
        <div className="mobile-category-header">
          <Link 
            href={`/frontEnd/${category.slug}`}
            className="mobile-category-link"
            onClick={handleLinkClick}
          >
            {category.name}
          </Link>
          
          {hasChildren && (
            <button
              className="mobile-toggle-btn"
              onClick={() => toggleCategory(category.id)}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <ul className="mobile-subcategory-list">
            {category.children.map(child => renderCategory(child, level + 1))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <ul className="mobile-categories-wrapper">
      {categories.map(category => renderCategory(category))}
    </ul>
  )
}