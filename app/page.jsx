"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./style/Home.css";
import Silk from "../components/Silk";
import Navbar from "../src/components/Navbar/Navbar";
import headImage from "../public/homeImages/headImg1.jpg";
import oldbook from "../public/homeImages/oldbook.png";
import newbook from "../public/homeImages/newBook.png";
import ViewBooks from "../src/components/viewAllBooks/ViewBooks";
import GradientText from "@/src/components/ui/GradientText";
const page = () => {
  
  //   const [fixed, setFixed] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY >= 600) setFixed(true);
  //     else setFixed(false);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);
  return (
    <div className="home">
      <Navbar />
      <div className="bgSilk">
        <Silk
          speed={10}
          scale={1}
          color="#dc0ca8ff"
          noiseIntensity={1.5}
          rotation={0}
        />
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>

</div>
      </div>
      <div className="imageHead">
        {/* <Image
          className={`headImage `}//${fixed ? "fixed" : ""}`}
          src={headImage}
          alt="Book Image"
          width={800}
          height={600}
        /> */}
        <h1 className="headPera">
          <GradientText
            colors={[
              "#ccbd19ff",
              "#585814ff",
              "#d9e97fff",
              "#454411ff",
              "#645728ff",
            ]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class"
          >
            Discover Your Next Favorite Book All the Magic of Reading in One App
          </GradientText>
        </h1>
      </div>
      <div className="BookType">
        <div className="old">
          <Image id="old" src={oldbook} alt="" />
        </div>
        <div className="new">
          <Image id="new" src={newbook} alt="" />
        </div>
      </div>
      <ViewBooks />
    </div>
  );
};

export default page;
