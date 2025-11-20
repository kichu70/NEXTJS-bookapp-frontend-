"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, MenuItem, Select } from "@mui/material";
import "./book.css";
import Admin_navbar from "../components/admin-nav/Admin_navbar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export interface BookType {
  _id: string;
  book_name: string;
  author: string;
  image: string[];
  description: string;
  is_deleted: boolean;
  price: number;
  user: string;
  avarage_rating: number;
}

const View = () => {

  const router = useRouter();
  
  const [book, setBook] = useState<BookType[]>([]);
  const [refresh, setRefresh] = useState<Boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const {token}=useAuth()


  // ----------------get datas---------
  useEffect(() => {
    const fetchdata = async () => {
      if (!token) return;
      try {
        let url = `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Admin/book`;

        if (filter !== "") {
          url += `?is_deleted=${filter}`;
        }
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.data;
        setBook(data);
      } catch (err) {
        console.log("error is in the fr admin view", err);
      }
    };
    fetchdata();
  }, [token, refresh, filter]);

  // ------------------delete or active user---------------

  const DeleteBook = async (id: string) => {
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

  return (
    <div>
      <Admin_navbar />
      <div className="view-head">
        <div></div>
        <div className="head2">
          <Select
            className="custom-select"
            defaultValue=""
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="">All books</MenuItem>
            <MenuItem value="false">Active</MenuItem>
            <MenuItem value="true">InAcitive</MenuItem>
          </Select>
          <h1>
            {filter === ""
              ? "all book"
              : filter === "false"
              ? "active book"
              : "inactive book"}
          </h1>
        </div>
      </div>
      <div className="admin-view">
        <table border={1} className="lines-table">
          <thead>
            <tr>
              <th>No:</th>
              <th>Book Name</th>
              <th>Authours</th>
              <th>Book status</th>
              <th>Delete/Active</th>
            </tr>
          </thead>
          <tbody >
            {book.map((b, i) => (
              <tr key={i}>
                <td onClick={() => router.push(`/admin/single-book/${b._id}`)}>{i + 1}</td>
                <td onClick={() => router.push(`/admin/single-book/${b._id}`)}>{b.book_name}</td>
                <td onClick={() => router.push(`/admin/single-book/${b._id}`)}>{b.author}</td>
                <td onClick={() => router.push(`/admin/single-book/${b._id}`)}>{b.is_deleted ? "Deleted" : "Active"}</td>
                <td>
                  <Button className="btn" variant="contained" onClick={() => DeleteBook(b._id)}>
                    {b.is_deleted ? "Active" : "Delete"}
                  </Button>
                  <Button className="btn-mbl" variant="contained" onClick={() => DeleteBook(b._id)}>
                    {b.is_deleted ? "✅":"🗑️"  }
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default View;
