"use client";

import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./AddtoCart.css";
import axios from "axios";
import { useAuth } from "../../lib/auth";
import { toast } from "react-toastify";
import {  red } from "@mui/material/colors";
import { handlePayment } from "../../src/components/payment/paymentButton";

const AddtoCart = () => {
  const { cartItems, removeFromCart } = useAuth();
  const [cart, setcart] = useState([]);
  const [selectedBook, setSeletedBook] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setcart("no iteam in the cart ");
    }
  }, [cartItems]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setSeletedBook(cartItems.map((item) => item.id));
    }
  }, [cartItems]);
  useEffect(() => {
    const totalPrice = cartItems
      .filter((item) => selectedBook.includes(item.id))
      .reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    setTotal(totalPrice);
  }, [selectedBook, cartItems]);

  const handleCheckBox = (bookId) => {
    setSeletedBook((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const onOpen = () => {
    const show = document.getElementById("cart-products");
    show.classList.add("show");
    document.body.classList.add("no-scroll");
  };
  const onClose = () => {
    const hide = document.getElementById("cart-products");
    hide.classList.remove("show");
  };
  useEffect(() => {
    const handleClickOutseide = (event) => {
      const panel = document.getElementById("cart-products");
      if (
        panel &&
        panel.classList.contains("show") &&
        !panel.contains(event.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutseide);
    return () => document.removeEventListener("mousedown", handleClickOutseide);
  }, []);

  return (
    <>
      <div className="cart-main">
        <button onClick={onOpen} className="Open-details"></button>
        <div className="cart-main1">
          <div className="cart-products" id="cart-products">
            <button onClick={onClose} className="close-details">
              X
            </button>
            <h1>Books & Price</h1>
            <div className="details">
              <ol type="1">
                {cartItems.map((book ,i) => (
                  <li  key={i}>
                    <div className="list">
                      <div className="detalis-names">
                        <h2 className="name">
                          {book.bookname}&nbsp;
                          <br />
                          <p>₹ {book.price}</p>
                        </h2>
                      </div>
                      <Checkbox
                        checked={selectedBook.includes(book.id)}
                        onChange={() => handleCheckBox(book.id)}
                        sx={{
                          color: red[800],
                          "&.Mui-checked": {
                            color: red[600],
                          },
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
              <h1>
                Total: <span> ₹{total}</span>
              </h1>
              <Button
                onClick={() => {
                  if (selectedBook.length === 0) {
                    toast.info("Please select at least one book to buy");
                    return;
                  }

                  const selectedBooks = cartItems.filter((b) =>
                    selectedBook.includes(b.id)
                  );

                  handlePayment(selectedBooks);
                }}
                className="buynow"
                variant="contained"
              >
                Buy
              </Button>
            </div>
          </div>
          <div className="cart-cnt">
            <h1 className="noItems">{cart}</h1>
            {cartItems.map((book) => (
              <div className="content" key={book.id}>
                <Card className="Card">
                  <h4 className="bookname">{book.bookname}</h4>
                  {(Array.isArray(book.image[0])
                    ? book.image
                    : [book.image[0]]
                  )?.map((img, index) => (
                    <CardMedia
                      key={img}
                      className="CardMedia"
                      sx={{ width: "100%", objectFit: "contain" }}
                      height="240px"
                      image={`${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/${img}`}
                      component="img"
                      title={`${book.bookname} - ${index + 1}`}
                    />
                  ))}

                  <CardContent>
                    <h3 className="price">₹ {book.price}</h3>

                    <Typography
                      className="author"
                      sx={{ color: "text.secondary" }}
                    >
                      {book.author}
                    </Typography>
                    <Typography
                      className="discription"
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {book.description}
                    </Typography>
                  </CardContent>
                  <Button
                    onClick={() => handlePayment([book])}
                    className="buynow"
                    variant="contained"
                  >
                    buy
                  </Button>
                  <Button
                    color="error"
                    className="removebtn"
                    variant="contained"
                    onClick={() => removeFromCart(book.id)}
                  >
                    Remove
                  </Button>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddtoCart;
