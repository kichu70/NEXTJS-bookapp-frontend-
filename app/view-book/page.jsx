import React from "react";
import "./ViewBook.css"
import Navbar from "../../src/components/Navbar/Navbar" 
import ViewAllBooks from "../../src/components/viewAllBooks/ViewAllBooks";

const page =() => {
  return(
  <div className="bg">
  <Navbar/>
  <ViewAllBooks/>

  </div>
  )
};
export default page;
