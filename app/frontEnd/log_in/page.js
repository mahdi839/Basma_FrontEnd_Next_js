"use client";
import axios from "axios";
import { useRouter } from "next/navigation";


import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Admin_Log_in() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post("http://127.0.0.1:8000/api/logIn", {
        email,
        password,
      });

      if (response.data.status) {

        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.data.token);
        }
        
        toast.success("successfully log in");
        router.push('/dashboard')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An Error Occured");
    }
  };
  return (
    <div className="container my-5 border px-md-5 pb-md-3 p-sm-2 ">
      <h4 className="text-center mt-3 admin_log_in">Admin Sign In</h4>
      <form className=" " onSubmit={handleSubmit}>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            name="email"
            value={email}
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" class="btn">
          Submit
        </button>
      </form>
    </div>
  );
}
