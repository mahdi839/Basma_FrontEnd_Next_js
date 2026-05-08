import React from "react";
import Navbar from "../frontEnd/nabvar/navber";
import Footer from "../footer/footer";
import ScrollToTop from "../frontEnd/scrollToTop/ScrollToTop";
import BottomMenu from "../frontEnd/bottom_sticky_menu/BottomMenu";


export default function FrontEndLayout({ children }) {
  return (
    <div className="frontEndLayout">
      <Navbar />
      <main className="frontMain" style={{ paddingBottom: "80px" }}>{children}</main>
      <ScrollToTop />
      <BottomMenu />
      <Footer />
    </div>
  );
}
