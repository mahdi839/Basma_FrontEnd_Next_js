
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
  title: "Eyara Fashion",
  description: "Best Online Shop For Foreign Products",
  icons: {
    icon: "/img/logo.png",
  },
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


