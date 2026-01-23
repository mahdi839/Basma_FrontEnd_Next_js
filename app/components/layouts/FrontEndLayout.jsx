import React from "react";
import Navbar from "../frontEnd/nabvar/navber";
import Footer from "../footer/footer";
import ScrollToTop from "../frontEnd/scrollToTop/ScrollToTop";


export default function FrontEndLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ScrollToTop />
      <Footer />
    </>
  );
}
