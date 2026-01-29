'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import './mobileCategories.css'

export default function MobileCategories({ categories, onClick }) {
  const [expandedCategories, setExpandedCategories] = useState({})

  // Helper function to find category by ID
  const findCategoryById = (cats, id) => {
    for (const cat of cats) {
      if (cat.id === id) return cat
      if (cat.children) {
        const found = findCategoryById(cat.children, id)
        if (found) return found
      }
    }
    return null
  }

  const toggleCategory = (categoryId, level = 0) => {
    setExpandedCategories(prev => {
      const newState = { ...prev }
      
      // If clicking on a top-level parent category (level 0)
      if (level === 0) {
        // Get all top-level category IDs
        const topLevelIds = categories.map(cat => cat.id)
        
        // Close all other top-level categories and their children
        topLevelIds.forEach(id => {
          if (id !== categoryId) {
            // Recursively close the parent and all its children
            const closeChildren = (catId) => {
              delete newState[catId]
              const category = findCategoryById(categories, catId)
              if (category?.children) {
                category.children.forEach(child => closeChildren(child.id))
              }
            }
            closeChildren(id)
          }
        })
      }
      
      // Toggle the clicked category
      newState[categoryId] = !prev[categoryId]
      
      return newState
    })
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
              onClick={() => toggleCategory(category.id, level)}
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