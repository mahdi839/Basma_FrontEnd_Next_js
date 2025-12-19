import { useState } from 'react'
import Link from 'next/link'
import { FaChevronRight } from 'react-icons/fa'
import NestedCategories from './NestedCategories'
import styles from '../NavCategories.module.css'

export default function DesktopCategories({ categories }) {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [hoveredSub, setHoveredSub] = useState(null)

  return (
    <div className={styles.megaMenuWrapper}>
      <div className={styles.categoriesContainer}>
        {categories.map(cat => (
          <div
            key={cat.id}
            className={styles.categoryItem}
            onMouseEnter={() => setHoveredCategory(cat.id)}
        
          >
            <Link href={`/frontEnd/${cat.slug}`} className={styles.categoryLink}>
              {cat.name}
              {cat.children.length > 0 && <FaChevronRight />}
            </Link>

            {cat.children.length > 0 && hoveredCategory === cat.id && (
              <div
                className={`${styles.megaMenu} ${styles.megaMenuActive}`}
                // onMouseLeave={() => setHoveredSub(null)}
              >
                <div className={styles.megaMenuContent}>
                  <div className={styles.subcategoriesGrid}>
                    <NestedCategories
                      items={cat.children}
                      hoveredSub={hoveredSub}
                      setHoveredSub={setHoveredSub}
                    />
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