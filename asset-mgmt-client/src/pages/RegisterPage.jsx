import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.1";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const { register } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    await register(email, password, "User");
    alert("Registered. Please login.");
    nav("/login");
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit">Register</button>
    </form>
  );
}
