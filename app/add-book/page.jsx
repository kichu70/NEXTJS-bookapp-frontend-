"use client"

import React, { useEffect, useState } from "react";
import "./AddBook.css";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import GradientText from '../../src/components/ui/GradientText';
import { useRouter } from "next/navigation";


const AddBook = () => {
  const [book_name, setBookName] = useState("");
  const [author, setBookAuthor] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [bookCategory, setBookCategory] = useState("");
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [error, setError] = useState(false);
  const [token,setToken]=useState(null)
  const router = useRouter();

  useEffect(()=>{
    const storedToken =localStorage.getItem("token")
    setToken(storedToken)
  },[])
  const addBook = async (req, res) => {
    if (
      !book_name ||
      !author ||
      !bookDescription ||
      !bookPrice ||
      !bookCategory
    ) {
      setError(true);
      toast.error("Please fill all fields before submitting!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("author", author);
      formData.append("book_name", book_name);
      formData.append("description", bookDescription);
      formData.append("price", bookPrice);
      formData.append("category", bookCategory);
      image.forEach((img) => {
        formData.append("image", img);
      });
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Books/add-book`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      setBookAuthor("");
      setBookName("");
      setBookPrice("");
      setBookDescription("");
      setBookCategory("");
      setImage([]);
    //   navigate("/");
    router.push("/");
    } catch (err) {
      if (err.response) {
        const errors = err.response.data;
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            toast.error(errors[key]);
          }
        }
      } else {
        toast.error("something went wrong in the adding product");
        console.log(err, "error is in the adding book frontend");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImage((prev) => [...prev, ...files]);
    const newPreview = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...newPreview]);
  };
  const removeImage = (index) => {
    setImage((prev) => prev.filter((currentElement, i) => i !== index));
    setImagePreview((prev) => prev.filter((currentElement, i) => i !== index));
  };

  return (
    <div className="AddBook">
      &nbsp;
      <div className="add-main">
        <div className="addbook-head">
          <Button id="close" href='/'>
            X
          </Button>
        <GradientText
            colors={[
              "#9f31b5ff",
              "#e70ba8ff",
              "#803c50ff",
              "#d23591ff",
              "#4e0879ff",
            ]}
            animationSpeed={4}
            showBorder={false}
            className="custom-class"
          >
            Add Book
          </GradientText>
          <div className="addbook-content">
            <div className="addbook-grid1">
              <TextField
                onChange={(e) => setBookAuthor(e.target.value)}
                value={author}
                className="textEditField"
                label="Author"
                variant="filled"
                focused
                error={error && (!author || author.length < 3)}
                helperText={
                  error && !author
                    ? "Author name is required"
                    : error && author.length < 3
                    ? "Author must be at least 3 characters"
                    : ""
                }
              />
              <TextField
                onChange={(e) => setBookName(e.target.value)}
                value={book_name}
                className="textEditField"
                label="Book Name"
                variant="filled"
                focused
                error={error && (!book_name || book_name.length < 3)}
                helperText={
                  error && !book_name
                    ? "Book Name  is required"
                    : error && book_name.length < 3
                    ? "Book Name must be at least 3 characters"
                    : ""
                }
              />
              <TextField
                onChange={(e) => setBookPrice(e.target.value)}
                value={bookPrice}
                className="textEditField"
                label="price"
                type="Number"
                variant="filled"
                focused
                error={error && (!bookPrice || bookPrice.length < 3)}
                helperText={
                  error && !book_name
                    ? "price is required"
                    : error && bookPrice <= 0
                    ? "Price  must be  greater than 0"
                    : ""
                }
              />
              <select
                id="category"
                name="category"
                value={bookCategory}
                onChange={(e) => setBookCategory(e.target.value)}
                required
                
              >
                <option value="">Seclect category</option>
                <option value="New">New Book</option>
                <option value="Used">Old Book</option>
              </select>
            </div>
            <div className="addbook-grid2">
              <TextField
                onChange={(e) => setBookDescription(e.target.value)}
                value={bookDescription}
                className="textEditField"
                label="Description"
                variant="filled"
                focused
                error={error && (!bookDescription || bookDescription.length < 3)}
                helperText={
                  error && !bookDescription
                    ? "price is required"
                    : error && bookDescription.length < 3
                    ? "Book Description must be at least 3 characters"
                    : ""
                }
              />
              <input
                type="file"
                accept="image/*"
                className="textEditField"
                onChange={handleImageChange}
              />

              <div className="imagePreview">
                {imagePreview.map((src, idx) => (
                  <div className="imgPrev2" key={idx}>
                    <img
                      key={idx}
                      src={src}
                      alt={`preview-${idx}`}
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                      }}
                    />
                    <button id="xBtn" onClick={() => removeImage(idx)}>
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button variant="contained" onClick={addBook} disabled={loading}>
            {" "}
            {loading ? "Uploading..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddBook;