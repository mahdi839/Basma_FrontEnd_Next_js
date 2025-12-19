import Link from 'next/link'
import { FaChevronRight } from 'react-icons/fa'
import styles from '../NavCategories.module.css'
import { useState } from 'react'

export default function NestedCategories({items,hoveredSub,setHoveredSub}) {
  const [nestedCatId,setNestedCatId] = useState(null)
  const handleMouseEnter = (itemId, e) => {
    e.stopPropagation()
    setNestedCatId(itemId)
  }

  return (
    <>
      {items.map(item => (
        <div
          key={item.id}
          className={styles.nestedItem}
        >
          <Link
            href={`/frontEnd/${item.slug}`}
            className={styles.subcategoryCard}
            onMouseEnter={(e) => handleMouseEnter(item.id, e)}
          >
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

          {item.children.length > 0 && nestedCatId === item.id && (
            <div 
              className={`${styles.deepNestedMenu} ${styles.megaMenuActive}`}
              onMouseEnter={(e) => {
                e.stopPropagation()
                setHoveredSub(item.id)
              }}
            >
              <div className={styles.megaMenuContent}>
                <div className={styles.subcategoriesGrid}>
                  <NestedCategories
                    items={item.children}
                    hoveredSub={hoveredSub}
                    setHoveredSub={setHoveredSub}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  )
}