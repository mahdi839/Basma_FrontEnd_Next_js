import React from "react";
import Navbar from "../frontEnd/nabvar/navber";
import Footer from "../footer/footer";
import CartIcon from "../frontEnd/components/CartIcon";

export default function FrontEndLayout({ children }) {
  return (
    <>
      <Navbar />
      <CartIcon />
      <main>{children}</main>
      <Footer />
    </>
  );
}
