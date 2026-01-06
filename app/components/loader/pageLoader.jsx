import { FaSpinner } from "react-icons/fa";

// app/loading.js
export default function PageLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
     
      <span className="ms-3 loader-icon"><FaSpinner size={30}   style={{
          animation: 'spin 1s linear infinite',
        }}/></span>
    </div>
  )
}