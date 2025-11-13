"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import GradientText from "../ui/GradientText";
import SparkleNavbar from "../ui/SparkleNavbar";
import Link from "next/link";
import { Button } from "@mui/material";
const Navbar = () => {
  const navRef = useRef(null)
  return (
    <div>
      
      <div className="navbar">
        
        <GradientText
          colors={[
            "#c619ccff",
            "#2a62abff",
            "#d9e97fff",
            "#ad14adff",
            "#1e57b2ff",
          ]}
          animationSpeed={3}
          showBorder={false}
          className="custom-class"
        >   
          Book App
        </GradientText>
        {/* <h1 className="navHead" >Book app</h1> */}
        <div className="navSection1" ref={navRef}>
          <Link href={"/"}><button variant="contained">home</button></Link>
          <Link href={"/view-book"}><button variant="contained">All book</button></Link>
          <Link href={"/add-book"}><button variant="contained">addbook</button></Link>
          <Link href={"/add-cart"}><button variant="contained">cart</button></Link>
          <Link href={"/login"}><button variant="contained">login</button></Link>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
