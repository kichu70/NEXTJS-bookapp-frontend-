"use client"

import { Button, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import "./edit.css"
import axios from 'axios'
import { toast } from 'react-toastify'

const Admin_Edit = ({open,book,id,onClose}) => {
const notify3 = () => toast.dark("dataUpdated");
const editboxRef= useRef()
const [bookAuthor,setBookAuthor]=useState('')
const [bookName,setBookName]=useState('')
const [bookDescription,setBookDescription]=useState('')
const [bookPrice,setBookPrice]=useState('')
const token =localStorage.getItem("token")


useEffect(()=>{
  if(book){
    setBookAuthor(book.author||"")
    setBookName(book.book_name || "")
    setBookDescription(book.description || "")
    setBookPrice(book.price || "")
  }
},[book])
const UpdateBook = async()=>{
  try{
    const res =await axios.put(`${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/admin/book-update?id=${id}`,
      {
        author:bookAuthor,
        book_name:bookName,
        description:bookDescription,
        price:bookPrice
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )
    console.log(res,id)
    notify3()
    onClose(res.data.data)
    
  }
  catch(err){
    alert(err,"error is in the update ")
    console.log(err,"error is in the update ")
  }
}
useEffect(()=>{
  const handClickOutside=(event)=>{
    if(editboxRef.current && !editboxRef.current.contains(event.target)){
      onClose()
    }
  }
    document.addEventListener("mousedown",handClickOutside)
    return ()=>document.removeEventListener("mousedown",handClickOutside)
},[onClose])


  return (
     <div className='main-edit' ref={editboxRef}>
      {/* <Button variant='contained' className='closebtn'onClick={onClose}>X</Button> */}
      <div className="edit">
        <h1>Edit Product</h1>
        <div className="edit-colums">
          <TextField
            onChange={(e) => setBookAuthor(e.target.value)}
            value={bookAuthor}
            className='textEditField'
            type='text'
            label="Author"
            variant="filled"
            focused
          />

          <TextField
            onChange={(e) => setBookName(e.target.value)}
            value={bookName}
            className='textEditField'
            label="Book Name"
            variant="filled"
            focused
          />
          <TextField
            onChange={(e) => setBookDescription(e.target.value)}
            value={bookDescription}
            className='textEditField'
            label="Description"
            variant="filled"
            focused
            
          />
          <TextField
            onChange={(e) => setBookPrice(e.target.value)}
            value={bookPrice}
            className='textEditField'
            label="Price"
            variant="filled"
            type='number'
            focused
          />
          <Button className='updatebtn' onClick={()=>{UpdateBook()}} variant='contained'>update Product</Button>
        </div>
      </div>
    </div>
  )
}

export default Admin_Edit