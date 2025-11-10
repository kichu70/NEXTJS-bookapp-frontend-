"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, CardMedia, Rating, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import "./ViewAllBook.css"
import "./Responsive.css"
const ViewAllBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/Books");
        const idReplace = res.data.data.map(({ _id, ...rest }) => ({
          id: _id,
          ...rest,
        }));
        setBooks(idReplace);
      } catch (err) {
        console.log(err, "Error fetching books");
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <div className="section1-newbook">
        <div className="grids">
          {books.map((book) => (
            <div id="books" className="content" key={book.id}>
              <Card className="Card">
                <h4 className="bookname">{book.bookname}</h4>

                <CardContent>
                  <h3 className="price">₹ {book.price}</h3>

                  <Typography className="author" sx={{ color: "text.secondary" }}>
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
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAllBooks;
