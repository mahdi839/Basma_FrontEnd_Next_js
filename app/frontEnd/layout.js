import React from "react";
import Navbar from "@/app/components/frontEnd/nabvar/navber";
import Footer from "@/app/components/footer/footer";
import ScrollToTop from "../components/frontEnd/scrollToTop/ScrollToTop";
import BottomMenu from "../components/frontEnd/bottom_sticky_menu/BottomMenu";


export default function FrontEndLayout({ children }) {
  
  return (
    <div className="frontEndLayout">
      <Navbar />
      <main className="frontMain"  style={{ paddingBottom: "80px" }}>{children}</main>
      <ScrollToTop />
      <BottomMenu />
      <Footer />
    </div>
  );
}
