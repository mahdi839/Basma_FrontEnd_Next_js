import React from "react";
import Navbar from "../frontEnd/nabvar/navber";
import Footer from "../footer/footer";

export default function FrontEndLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
