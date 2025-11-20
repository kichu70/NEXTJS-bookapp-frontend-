"use client";
import React, { use, useEffect, useState } from "react";
import "./userBook.css";
import { Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import Admin_navbar from "../../components/admin-nav/Admin_navbar";
import axios from "axios";
import { useAuth } from "@/lib/auth";
const page = () => {
  const [book, setBook] = useState([]);
  const [userId, setUserId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const {token,user} =useAuth()


  // =========get token from localstorage=============
  
  useEffect(() => {

    if (token) {
      try {
        setUserId(user.id);
      } catch (err) {
        console.log(err, "error is in the taking id from token");
      }
    }
  }, [token]);

  // ------getbook-----
useEffect(()=>{
  if(!token){
    return
  }
  const fetchuserBook =async()=>{
    try{
      const res =await axios.get(`${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Admin/user-books?id=${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
      })
      console.log(res.data.data)
      setBook(res.data.data)
    }
    catch(err){
      console.log(err,"error is in the fetch userdata")
    }
  }
  fetchuserBook()
},[refresh,token,id])


  return (
    <div className="clr">

      <Admin_navbar/>
      <div className="userBook">
        {book?.length>0 ?(
        <table border={1} className="lines-table">
          <thead>
            <tr>
              <th>No:</th>
              <th>Book Name</th>
              <th>Book status</th>
              <th>Delete/Active</th>
              <th>price</th>
            </tr>
          </thead>
          <tbody>
            {book.map((b, i) => (
              <tr key={i}>
                <td onClick={() => router.push(`/admin/single-book/${b._id}`)}>
                  {i + 1}
                </td>
                <td onClick={() => router.push(`/admin/single-book/${b._id}`)}>
                  {b.book_name}
                </td>
                <td onClick={() => router.push(`/admin/single-book/${b._id}`)}>
                  {b.author}
                </td>
                <td onClick={() => router.push(`/admin/single-book/${b._id}`)}>
                  {b.is_deleted ? "Deleted" : "Active"}
                </td>
                <td>₹{b.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ):(
        <h1 className="Nobooks">NO BOOKS FOR THIS USER</h1>
      )}
      </div>
    </div>
  );
};

export default page;
