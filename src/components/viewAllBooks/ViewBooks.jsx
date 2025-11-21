"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import "./ViewBooks.css";
import "./Responsive.css";
import Confirm from "../confirmDelete/Confirm";
import { toast } from "react-toastify";
import EditBook from "../edit/EditBook";
import { useAuth } from "../../../lib/auth";
import CategoryOfBooks from "../bookCategorys/CategoryOfBooks";
import { useRouter } from "next/navigation";
import { handlePayment } from "../payment/paymentButton";
import Footer from "../Footer/Footer"

const ViewAllBooks = () => {
  const { addToCart, token, user ,reusebleFunction} = useAuth();

  const router = useRouter();

  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState(null);
  const[role,setRole]=useState(null)
  const [refresh, setRefresh] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [editId, setEditId] = useState(null);
  const [selectBook, setSelectBook] = useState(null);
  const [openEdit, setopenEdit] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  // ---------gting token from localstorage------

  useEffect(() => {
    if (token) {
      try {
        setUserId(user.id);
        setRole(user.role)
      } catch (err) {
        console.log(err, "error is in the taking id from token");
      }
    }
  }, [token]);

  // -----------------get all book------------

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Books/?page=${page}&limit=8`
        );
        const idReplace = res.data.data.map(({ _id, ...rest }) => ({
          id: _id,
          ...rest,
        }));
        setBooks(idReplace);
        setTotalPage(res.data.totalPage);
        console.log(idReplace);
      } catch (err) {
        console.log(err, "Error fetching books");
      }
    };

    fetchBooks();
  }, [page]);

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
        setBooks((prev) => prev.filter((p) => p.id !== deleteId));
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
  console.log(role,"role*******")



  return (
    <div>
      <CategoryOfBooks />
      <div className="section1-newbook1">
        <div className="grids1">
          {books.map((book) => (
            <div id="books" className="content1" key={book.id}>
              <Card className="Card1"
                onClick={() => router.push(`/single-book/${book.id}`)}
              >
                <h4 className="bookname1">{book.bookname}</h4>

                {(Array.isArray(book.image[0])
                  ? book.image
                  : [book.image[0]]
                )?.map((img, index) => (
                  <CardMedia
                    key={img}
                    className="CardMedia1"
                    sx={{ width: "100%", objectFit: "contain" }}
                    height="240px"
                    image={`${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/${img}`}
                    component="img"
                    title={`${book.bookname} - ${index + 1}`}
                  />
                ))}

                <CardContent>
                  <Rating
                    size="small"
                    name="read-only-rating"
                    value={book.avarage_rating || 0}
                    precision={0.1}
                    readOnly
                  />
                  <h3 className="price1">₹ {book.price}</h3>

                  <Typography
                    className="author1"
                    sx={{ color: "text.secondary" }}
                  >
                    {book.author}
                  </Typography>

                  <Typography
                    className="discription1"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    {book.description}
                  </Typography>
                </CardContent>

                {book.user === userId && (
                  <div className="btns1">
                    <Button
                      className="dltbtn1"
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        reusebleFunction(() => handleDeleteClick(book.id));
                      }}
                    >
                      delete
                    </Button>
                    <Button
                      className="editbtn1"
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        reusebleFunction(()=>
                          handleUpdate(book.id, book)
                        )
                      }}
                    >
                      edit
                    </Button>
                  </div>
                )}
                {book.user !== userId && (
                  <div className="buybtn1">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        reusebleFunction(()=>{
                          handlePayment([book])
                        })
                      }}
                      className="buynow1"
                      variant="contained"
                    >
                      Buy Now
                    </Button>
                    <Button
                      className="add-to-cart1"
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        reusebleFunction(()=>{
                          addToCart(book)
                        })
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>

        <Confirm
          open={openConfirm}
          onConfirm={onhandledelete}
          onCancel={() => {
            setOpenConfirm(false);
            toast.dark("book not deleted");
            setDeleteId(null);
          }}
        />
        {openEdit && (
          <EditBook
            open={openEdit}
            book={selectBook}
            id={editId}
            onClose={(updateBook) => {
              setopenEdit(false);
              if (updateBook) {
                setBooks((prev) =>
                  prev.map((p) =>
                    p.id === updateBook._id
                      ? { id: updateBook._id, ...updateBook }
                      : p
                  )
                );
              }
            }}
          />
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default ViewAllBooks;
