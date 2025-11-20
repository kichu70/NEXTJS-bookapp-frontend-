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
import "./ViewAllBook.css";
import "./Responsive.css";
import Confirm from "../confirmDelete/Confirm";
import { toast } from "react-toastify";
import EditBook from "../edit/EditBook";
import { useAuth } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import { handlePayment } from "../payment/paymentButton";

const ViewAllBooks = () => {
  const { addToCart, user, token, reusebleFunction } = useAuth();

  const router = useRouter();

  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [editId, setEditId] = useState(null);
  const [selectBook, setSelectBook] = useState(null);
  const [openEdit, setopenEdit] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();

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

  // -----------------get all book------------

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Books/?page=${page}&limit=9`
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

  return (
    <div>
      <div className="section1-newbook0">
        <div className="grids0">
          {books.map((book) => (
            <div id="books" className="content0" key={book.id}>
              <Card
                className="Card0"
                onClick={() => router.push(`/single-book/${book.id}`)}
              >
                <h4 className="bookname0">{book.bookname}</h4>

                {(Array.isArray(book.image[0])
                  ? book.image
                  : [book.image[0]]
                )?.map((img, index) => (
                  <CardMedia
                    key={img}
                    className="CardMedia0"
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
                  <h3 className="price0">₹ {book.price}</h3>

                  <Typography
                    className="author0"
                    sx={{ color: "text.secondary" }}
                  >
                    {book.author}
                  </Typography>

                  <Typography
                    className="discription0"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    {book.description}
                  </Typography>
                </CardContent>
                {book.user === userId && (
                  <div className="btns0">
                    <Button
                      className="dltbtn0"
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
                      className="editbtn0"
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        reusebleFunction(() => handleUpdate(book.id, book));
                      }}
                    >
                      edit
                    </Button>
                  </div>
                )}
                {book.user !== userId && (
                  <div className="buybtn0">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        reusebleFunction(() => handlePayment([book]));
                      }}
                      className="buynow0"
                      variant="contained"
                    >
                      Buy Now
                    </Button>
                    <Button
                      className="add-to-cart0"
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        reusebleFunction(() => addToCart(book));
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

      <div className="pagination0">
        <button
          className="pages0"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          {page} / {totalPage}
        </span>

        <button
          className="pages0"
          onClick={() => setPage((p) => Math.min(p + 1, totalPage))}
          disabled={page === totalPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewAllBooks;
