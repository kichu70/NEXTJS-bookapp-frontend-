"use client"
import React, { useEffect } from 'react'
import "./notAuthorized.css"
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar/Navbar';
import Admin_navbar from '../components/admin-nav/Admin_navbar';
const page = () => {


    const router = useRouter();
  
    useEffect(() => {
      // toast.error("not Authorized");
  
      const timer = setTimeout(() => {
        router.push("/admin"); // redirect to home
      }, 3500);
  
      return () => clearTimeout(timer);
    }, [router]);
  return (
    <div className='notAuthorized'>
      <Admin_navbar/>
      <h1>not authorized</h1>
    </div>
  )
}

export default page
