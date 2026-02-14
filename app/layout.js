
import "bootstrap/dist/css/bootstrap.min.css";
import "../app/styles/globals.scss";
import "../app/styles/css/bootstrap.min.css";
import "../app/styles/css/style.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-medium-image-zoom/dist/styles.css";
import Bootstrap_js from "./components/bootstrapJs/Bootstrap_js";
import Providers from "./Providers";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const metadata = {
  title: "Eyara Fashion - Your Gateway to Global Footwear Elegance",
  description: "Eyara Fashion offers premium shoes, bags, and fashion accessories. Shop women's shoes, men's footwear, and stylish bags. Call: +8801614477721",
  keywords: "shoes online Bangladesh, women's shoes, men's shoes, bags, fashion accessories, Eyara Fashion",
  authors: [{ name: "Eyara Fashion" }],
  icons: {
    icon: "/img/favicon.png",
  },
  openGraph: {
    title: "Eyara Fashion - Your Gateway to Global Footwear Elegance",
    description: "Shop premium shoes and fashion accessories at Eyara Fashion",
    url: "https://eyarafashion.xyz",
    siteName: "Eyara Fashion",
    images: [
      {
        url: "/img/favicon.png",
        
      },
    ],
    locale: "en_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eyara Fashion",
    description: "Your Gateway to Global Footwear Elegance",
    images: ["/img/favicon.png"],
  },
  // verification: {
  //   google: "your-google-verification-code", // Add after Google Search Console setup
  // },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <Providers>
        <div className="gradient-bg">
        <Bootstrap_js />
        <ToastContainer />
        {children}
        </div>
        </Providers>        
      </body>
    </html>
  );
}


