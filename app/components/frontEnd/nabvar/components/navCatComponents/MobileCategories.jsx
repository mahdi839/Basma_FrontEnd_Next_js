import Link from 'next/link'
import styles from '../NavCategories.module.css'

export default function MobileCategories({ categories }) {
  return categories.map(cat => (
    <li key={cat.id} className={styles.mobileCategory}>
      <Link href={`/frontEnd/${cat.slug}`}>{cat.name}</Link>
    </li>
  ))
}
