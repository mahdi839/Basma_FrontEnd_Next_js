'use client'

import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import styles from './NavCategories.module.css'

export default function NavCategories({ isMobile = false }) {
  const [categories, setCategories] = useState([])
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [hoveredSub, setHoveredSub] = useState(null)

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/frontend/categories')
      .then(res => {
        const normalize = cats =>
          cats.map(c => ({
            ...c,
            children: c.all_children ? normalize(c.all_children) : []
          }))
        setCategories(normalize(res.data))
      })
  }, [])

  const Nested = ({ items }) => (
    <>
      {items.map(item => (
        <div
          key={item.id}
          className={styles.nestedItem}
          onMouseEnter={() => setHoveredSub(item.id)}
          onMouseLeave={() => setHoveredSub(null)}
        >
          <Link href={`/frontEnd/${item.slug}`} className={styles.subcategoryCard}>
            <div className={styles.subcategoryIcon}>
              {item.name[0]}
            </div>
            <div className={styles.subcategoryInfo}>
              <h5>{item.name}</h5>
              <span>View products</span>
            </div>
            {item.children.length > 0 && (
              <FaChevronRight className={styles.nestedChevron} />
            )}
          </Link>

          {item.children.length > 0 && hoveredSub === item.id && (
            <div className={`${styles.deepNestedMenu} ${styles.megaMenuActive}`}>
              <div className={styles.megaMenuContent}>
                <div className={styles.subcategoriesGrid}>
                  <Nested items={item.children} />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  )

  if (isMobile) {
    return categories.map(cat => (
      <li key={cat.id} className={styles.mobileCategory}>
        <Link href={`/frontEnd/${cat.slug}`}>{cat.name}</Link>
      </li>
    ))
  }

  return (
    <div className={styles.megaMenuWrapper}>
      <div className={styles.categoriesContainer}>
        {categories.map(cat => (
          <div
            key={cat.id}
            className={styles.categoryItem}
            onMouseEnter={() => setHoveredCategory(cat.id)}
            onMouseLeave={() => {
              setHoveredCategory(null)
              setHoveredSub(null)
            }}
          >
            <Link href={`/frontEnd/${cat.slug}`} className={styles.categoryLink}>
              {cat.name}
              {cat.children.length > 0 && <FaChevronRight />}
            </Link>

            {cat.children.length > 0 && (
              <div
                className={`${styles.megaMenu} ${
                  hoveredCategory === cat.id ? styles.megaMenuActive : ''
                }`}
              >
                <div className={styles.megaMenuContent}>
                  <div className={styles.subcategoriesGrid}>
                    <Nested items={cat.children} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
