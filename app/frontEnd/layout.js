import React from "react";
import Navbar from "@/app/components/frontEnd/nabvar/navber";
import Footer from "@/app/components/footer/footer";
import ScrollToTop from "../components/frontEnd/scrollToTop/ScrollToTop";


export default function FrontEndLayout({ children }) {
  
  return (
    <div className="frontEndLayout">
      <Navbar />
      <main className="frontMain">{children}</main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
