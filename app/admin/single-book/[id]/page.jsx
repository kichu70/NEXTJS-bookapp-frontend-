"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./admin_single_book.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button, Rating } from "@mui/material";
import { toast } from "react-toastify";
import Admin_navbar from "../../components/admin-nav/Admin_navbar";
import Admin_Edit from "../../components/admin-edit/Admin_Edit"
import { useAuth } from "@/lib/auth";
const page = () => {
  const [book, setBook] = useState([]);
  const [userId, setUserId] = useState(null);

  const [refresh, setRefresh] = useState(false);

  const { id } = useParams();

  const [editId, setEditId] = useState(null);
  const [selectBook, setSelectBook] = useState(null);
  const [openEdit, setopenEdit] = useState(false);
  const {token,user}=useAuth()

  // =========get token from localstorage=============

  useEffect(() => {
    // ---------get user id from token---------
    if (token) {
      try {
        setUserId(user.id);
      } catch (err) {
        console.log(err, "error is in the taking id from token");
      }
    }
  }, [token]);

  // --------------------------------

  // ==============get book ==============

  useEffect(() => {
    if (!token) {
      return;
    } else {
      const fetchbook = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/admin/single-book/?id=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const bookdata = res.data.data;
          setBook(bookdata[0]);
          console.log(bookdata);
        } catch (err) {
          console.log(err, "error is in the single book fetching ");
        }
      };
      fetchbook();
    }
  }, [token, id, refresh]);

  console.log(book);

  const DeleteBook = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Admin/book-delete?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh((p) => (p = !p));
    } catch (err) {
      console.log(err, "error is in the delet user admin fr");
    }
  };

  // -----------update book------------------------

  const handleUpdate = (id, books) => {
    setEditId(id);
    setSelectBook(books);
    setopenEdit(true);
  };

  return (
    <div className="body-singlebook">
      <Admin_navbar />
      <div className="single-book">
        <div className="singleBook-section1">
          <div className="singleBook-cnt1">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 5000,
                }),
              ]}
            >
              <CarouselContent>
                {book.image?.map((img, i) => (
                  <CarouselItem className="basis-1/1" key={i}>
                    <img
                      src={`${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/${img}`}
                      alt={i}
                      className="w-full h-[70vh] object-contain"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="singleBook-cnt2">
            <Rating
              size="small"
              name="read-only-rating"
              value={book.avarage_rating || 0}
              precision={0.1}
              readOnly
            />

            <h1 className="price">
              ₹<span>{book.price}</span>
            </h1>
            <h1 className="bookName">{book.book_name}</h1>
            <h1 className="author">
              Author : <span>{book.author}</span>
            </h1>
            <h1 className="description">{book.description}</h1>

            <div className="btns">
              <Button
                className="dltbtn"
                variant="contained"
                size="small"
                onClick={() => DeleteBook(book._id)}
              >
                {book.is_deleted ? "Active" : "Delete"}
              </Button>
              <Button
                className="editbtn"
                variant="contained"
                size="small"
                onClick={() => handleUpdate(book._id, book)}
              >
                edit
              </Button>
            </div>
          </div>
        </div>
      </div>
      {openEdit && (
        <Admin_Edit
          open={openEdit}
          book={selectBook}
          id={editId}
          onClose={(updateBook) => {
            setopenEdit(false);
           if (updateBook) {
                setBook(updateBook);
              }
          }}
        />
      )}
    </div>
  );
};

export default page;
