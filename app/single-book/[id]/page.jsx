"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import "./SingleBook.css";
import { useParams, useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Navbar from "../../../src/components/Navbar/Navbar";
import { Button, Rating } from "@mui/material";
import { toast } from "react-toastify";
import EditBook from "../../../src/components/edit/EditBook";
import Confirm from "../../../src/components/confirmDelete/Confirm";
import { useAuth } from "../../../lib/auth";
import { handlePayment } from "../../../src/components/payment/paymentButton";
const page = () => {
  const [book, setBook] = useState([]);
  const [userId, setUserId] = useState(null);
  const [newValue, setNewValue] = useState(0);
  
  const { addToCart } = useAuth();
  const { id } = useParams();
  
  const [editId, setEditId] = useState(null);
  const [selectBook, setSelectBook] = useState(null);
  const [openEdit, setopenEdit] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const{token,user}=useAuth()

  const route =useRouter()
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
            `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Books/single-book/?id=${id}`,
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
  }, [token, id]);

  console.log(book);

  const handleRating = async (event, newValuee) => {
    setNewValue(newValuee);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Books/add-rating/?id=${id}`,
        {
          rating: newValuee,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.dark("Rating added successfull !!");
      setBook(res.data.data);
    } catch (err) {
      console.log(err, "error is adding rating");
      toast.error("You have already given rating ");
    }
  };

  // -------------delete book ----------

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const onhandledelete = (id) => {
    if (!deleteId) return;
    try {
      const dltdata = async () => {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Books/delete-book/?id=${deleteId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        route.push("/")
        console.log(res.data, "deleted");
        toast.success("book have been deleted");
      };
      dltdata();
    } catch (err) {
      console.log(err, "error is in the delete function");
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
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
      <Navbar />
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
            {book.user === userId && (
              <div className="btns">
                <Button
                  className="dltbtn"
                  variant="contained"
                  size="small"
                  onClick={() => handleDeleteClick(book._id)}
                >
                  delete
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
            )}
            {book.user !== userId && (
              <div className="buybtn">
                <Button
                  onClick={() => handlePayment([book])}
                  className="buynow"
                  variant="contained"
                >
                  Buy Now
                </Button>
                <Button
                  className="add-to-cart"
                  variant="contained"
                  onClick={() => addToCart(book)}
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
          <div className="add-rating">
            <p>Give Rating</p>
            <Rating
              name="new-rating"
              value={newValue}
              onChange={handleRating}
              precision={0.5}
            />
          </div>
        </div>
      </div>
      {openEdit && (
        <EditBook
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
      <Confirm
        open={openConfirm}
        onConfirm={onhandledelete}
        onCancel={() => {
          setOpenConfirm(false);
          toast.dark("book not deleted");
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default page;
