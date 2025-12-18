'use client'
import axios from 'axios';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { FaChevronRight } from 'react-icons/fa';
import styles from './NavCategories.module.css';

export default function NavCategories({ onClick, isMobile = false }) {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);

  async function fetchCategories() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + 'api/frontend/categories'
    try {
      const { data } = await axios.get(url)
      console.log('Categories loaded:', data);
      
      // Transform all_children to children for easier access
      const transformCategories = (cats) => {
        return cats.map(cat => ({
          ...cat,
          children: cat.all_children ? transformCategories(cat.all_children) : []
        }));
      };
      
      const transformedData = transformCategories(data);
      console.log('Transformed categories:', transformedData);
      setCategories(transformedData)
    } catch (err) {
      toast.error(err.message)
      console.error('Error fetching categories:', err);
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Recursive function to flatten nested categories for mobile
  const flattenCategories = (categories, level = 0) => {
    let result = [];
    categories.forEach(cat => {
      result.push({ ...cat, level });
      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children, level + 1));
      }
    });
    return result;
  };

  // Mobile version - hierarchical accordion
  if (isMobile) {
    const flatCats = flattenCategories(categories);
    return (
      <>
        {flatCats.map((category) => (
          <li key={category.id} className={styles.mobileCategory} style={{ paddingLeft: `${category.level * 20}px` }}>
            <Link href={`/frontEnd/${category.slug}`} onClick={onClick}>
              {category.level > 0 && '└─ '}{category.name}
            </Link>
          </li>
        ))}
      </>
    )
  }

  // Recursive component for nested subcategories
  const NestedSubcategories = ({ children, parentId }) => {
    if (!children || children.length === 0) return null;

    return (
      <div className={styles.nestedSubcategories}>
        {children.map((child) => (
          <div 
            key={child.id}
            className={styles.nestedItem}
            onMouseEnter={() => setHoveredSubcategory(child.id)}
            onMouseLeave={() => setHoveredSubcategory(null)}
          >
            <Link
              href={`/frontEnd/${child.slug}`}
              className={styles.subcategoryCard}
            >
              <div className={styles.subcategoryIcon}>
                {child.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.subcategoryInfo}>
                <h5>{child.name}</h5>
                <span>View products</span>
              </div>
              {child.children && child.children.length > 0 && (
                <FaChevronRight className={styles.nestedChevron} />
              )}
            </Link>

            {/* Nested children appear to the right */}
            {child.children && child.children.length > 0 && hoveredSubcategory === child.id && (
              <div className={`${styles.deepNestedMenu} ${styles.megaMenuActive}`}>
                <div className={styles.megaMenuContent}>
                  <div className={styles.megaMenuHeader}>
                    <h4>{child.name}</h4>
                    <p>Subcategories</p>
                  </div>
                  <div className={styles.subcategoriesGrid}>
                    <NestedSubcategories children={child.children} parentId={child.id} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Desktop version - mega menu with nested support
  return (
    <div className={styles.megaMenuWrapper}>
      <div className={styles.categoriesContainer}>
        {categories?.map((category) => (
          <div
            key={category.id}
            className={styles.categoryItem}
            onMouseEnter={() => {
              console.log('Hovering category:', category.name, 'Children:', category.children);
              setHoveredCategory(category.id);
            }}
            onMouseLeave={(e) => {
              const relatedTarget = e.relatedTarget;
              if (!relatedTarget || !relatedTarget.closest(`.${styles.megaMenu}`)) {
                setHoveredCategory(null);
                setHoveredSubcategory(null);
              }
            }}
          >
            <Link 
              href={`/frontEnd/${category.slug}`} 
              className={`${styles.categoryLink} ${hoveredCategory === category.id ? styles.active : ''}`}
            >
              <span>{category.name}</span>
              {category.children && category.children.length > 0 && (
                <FaChevronRight className={styles.chevron} />
              )}
            </Link>

            {/* First Level Mega Menu */}
            {category.children && category.children.length > 0 && (
              <div 
                className={`${styles.megaMenu} ${hoveredCategory === category.id ? styles.megaMenuActive : ''}`}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => {
                  setHoveredCategory(null);
                  setHoveredSubcategory(null);
                }}
              >
                <div className={styles.megaMenuContent}>
                  <div className={styles.megaMenuHeader}>
                    <h4>{category.name}</h4>
                    <p>Explore all subcategories</p>
                  </div>
                  <div className={styles.subcategoriesGrid}>
                    <NestedSubcategories children={category.children} parentId={category.id} />
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