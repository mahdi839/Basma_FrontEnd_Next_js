"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowAltCircleRight, FaSignInAlt } from "react-icons/fa";
import { MdAssignmentInd } from "react-icons/md";
export default function LogButtons() {
  const router = useRouter()
  const [token,setToken] = useState(null)
  useEffect(() => {
    
    let myToken = localStorage.getItem('token')
    setToken(myToken)

  }, []);

   const logOut = (e)=>{
      e.preventDefault()
      localStorage.removeItem("token")
      setToken(null)
      router.push('/log_in')
   }

  return <>
           {
                token ?  (
                  <button className="dropdown-item"  onClick={logOut}>
                  <FaSignInAlt  style={{ fontSize: '20px', color: '#DB3340' }}/> <span  className="ml-2"> Log Out</span>
                  </button>
                )
                :
               (
                <>
                <li >
               <Link className="dropdown-item" href="/frontEnd/log_in">
               <MdAssignmentInd  style={{ fontSize: '20px', color: '#DB3340' }}/> <span  className="ml-2"> Log In</span>
               </Link>
               </li>
               
               <li>
               <Link className="dropdown-item" href="#">
                <FaArrowAltCircleRight style={{ fontSize: '20px', color: '#DB3340' }}  /> <span className="ml-2">  Register </span>
               </Link>
             </li>
                </>
               )

             

           }
        </>;
}
