import React from "react";
import Navbar from "@/app/components/frontEnd/nabvar/navber";
import Footer from "@/app/components/footer/footer";

export default function FrontEndLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
