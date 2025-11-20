"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, MenuItem, Select } from "@mui/material";
import "./View.css";
import Admin_navbar from "./components/admin-nav/Admin_navbar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export interface UserType {
  _id: string;
  name: string;
  is_deleted: boolean;
  role: string;
  email: string;
  verify: boolean;
}

const View = () => {
  const [user, setUser] = useState<UserType[]>([]);
  const [refresh, setRefresh] = useState<Boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const router = useRouter();
  const {token}=useAuth()


  // ----------------get datas---------
  useEffect(() => {
    const fetchdata = async () => {
      if (!token) return;
      try {
        let url = `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Admin/user`;

        if (filter !== "") {
          url += `?is_deleted=${filter}`;
        }
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.data;
        setUser(data);
      } catch (err) {
        console.log("error is in the fr admin view", err);
      }
    };
    fetchdata();
  }, [token, refresh, filter]);

  // ------------------delete or active user---------------

  const DeleteUser = async (id: string) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Admin/delete?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh((p) => !p);
    } catch (err) {
      console.log(err, "error is in the delete user admin fr");
    }
  };

  // -------------verify user-----------------------

  const verifyUser = async (id: string) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Admin/verify-user?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh((p) => !p);
    } catch (err) {
      console.log(err, "error is in the verify user");
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
            <MenuItem value="">All User</MenuItem>
            <MenuItem value="false">Active</MenuItem>
            <MenuItem value="true">InAcitive</MenuItem>
          </Select>
          <h1>
            {filter === ""
              ? "all user"
              : filter === "false"
              ? "active user"
              : "inactive user"}
          </h1>
        </div>
      </div>
      <div className="admin-view">
        <table border={1} className="lines-table">
          <thead>
            <tr>
              <th>No:</th>
              <th>Name</th>
              <th>Email</th>
              <th>User status</th>
              <th>Delete/Active</th>
              <th>Verify/User</th>
            </tr>
          </thead>
          <tbody>
            {user.map((u, i) => (
              <tr key={i}>
                <td onClick={()=>router.push(`/admin/user-books/${u._id}`)} >{i + 1}</td>
                <td onClick={()=>router.push(`/admin/user-books/${u._id}`)} >{u.name}</td>
                <td onClick={()=>router.push(`/admin/user-books/${u._id}`)} >{u.email}</td>
                <td>
                  {u.role === "User"
                    ? u.is_deleted
                      ? "Deleted"
                      : "Active"
                    : ""}
                </td>
                <td>
                  {u.role === "User" && (
                    <div className="btnsOfAdmin">
                      <Button
                        variant="contained"
                        className="btn"
                        onClick={() => DeleteUser(u._id)}
                      >
                        {u.is_deleted ? "Active" : "Deleted"}
                      </Button>
                      <Button
                        className="btn-mbl"
                        variant="contained"
                        onClick={() => DeleteUser(u._id)}
                      >
                        {u.is_deleted ? "✅" : "🗑️"}
                      </Button>
                    </div>
                  )}
                </td>
                <td>
                  {u.role === "User" && (
                    <div className="btnsOfAdmin">
                      <Button
                        variant="contained"
                        className="btn"
                        onClick={() => verifyUser(u._id)}
                      >
                        {u.verify ? "verified" : " NotVerified"}
                      </Button>
                      <Button
                        className="btn-mbl"
                        variant="contained"
                        onClick={() => verifyUser(u._id)}
                      >
                        {u.is_deleted ? "✅" : "🗑️"}
                      </Button>
                    </div>
                  )}
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
