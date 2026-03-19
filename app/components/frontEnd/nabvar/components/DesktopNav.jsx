import Link from 'next/link'
import React from 'react'

export default function DesktopNav() {
    return (
        <nav className="header__menu">
            <ul className="d-flex justify-content-center align-items-center mb-0">

                <li className="mx-3">
                    <Link href="/">Home</Link>
                </li>

                <li className="mx-3">
                    <Link href="/frontEnd/shop">Shop</Link>
                </li>

                <li className="mx-3">
                    <Link href="/frontEnd/about_us">About Us</Link>
                </li>

            </ul>
        </nav>
    )
}
