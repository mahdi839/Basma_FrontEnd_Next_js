import React from "react";
import Navbar from "@/app/components/frontEnd/nabvar/navber";
import Footer from "@/app/components/footer/footer";
import CartIcon from "../components/frontEnd/components/CartIcon";

export default function FrontEndLayout({ children }) {
  return (
    <div className="frontEndLayout">
      <Navbar />
      <CartIcon />
      <main className="frontMain">{children}</main>
      <Footer />
    </div>
  );
}
