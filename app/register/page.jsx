"use client"
import { Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "../login/login.css";
import axios from "axios";
import GradientText from "../../src/components/ui/GradientText";

const page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conformpassword, setConformpassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");

  const [token,setToken] =useState(null)

  const [error, setError] = useState(false);


//   -------------taking token from localstorage--------

useEffect(()=>{
    const storedToken =localStorage.getItem("token")
    setToken(storedToken)
},[])
  // --------add user------------------


  const addUser = async (e) => {
    try {
      e.preventDefault()
      if (
        !name.trim() ||
        !email.trim() ||
        !password ||
        password.length < 8 ||
        password !== conformpassword
      ) {
        setError(true)
        return;

      }
      else{
        setError(false);
      }
      if(password !==conformpassword){
        setError(true);
        toast.error("password not match");
        return;
      }
      else{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/user/add-user`,
            {name,email,password}
        )
        console.log("added user",res.data);
        toast.success("user Created!!");
        setConformpassword("");
        setEmail("");
        setUsername("");
        setPassword("");
        setSavedPassword("");
      }
    } catch (err) {
      if(err.response){
        if(err.response.data.message){
          toast.error(err.response.data.message);
        }
        else if(err.response.data.msg){
          const errors =err.response.data.msg;
          for(const key in errors){
            if(errors.hasOwnProperty(key)){
              toast.error(errors[key])
            }
          }
        }
      }else{
        toast.error(err,"something went wrong in signup page")
        console.log(err, "error is in the registration fr");
      }
    }
  };

  return (
    <form action="">
      <div className="login">
        &nbsp;
        <ToastContainer theme="colored" />
        <div className="section">
          <div className="cnt1">
             <GradientText
                        colors={[
                          "#ccbd19ff",
                          "#585814ff",
                          "#d9e97fff",
                          "#454411ff",
                          "#645728ff",
                        ]}
                        animationSpeed={8}
                        showBorder={false}
                        className="custom-class"
                      >
                        signup
                      </GradientText>
            <TextField
              className="text"
              label="name"
              value={name}
              color="secondary"
            //   focused
              error={error && !name.trim()}
              helperText={
                error && !name.trim() ? "Username is required" : ""
              }
              required
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              className="text"
              label="email"
              color="secondary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            //   focused
              error={
                error &&
                (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
              }
              helperText={
                error && !email.trim()
                  ? "Email is required"
                  : error && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "Invalid email format"
                  : ""
              }
              required
            />
            <TextField
              className="text"
              label="password"
              color="secondary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            //   focused
              error={error && (!password || password.length < 8)}
              helperText={
                error && !password
                  ? "Password is required"
                  : error && password.length < 8
                  ? "Password must be at least 8 characters"
                  : ""
              }
              required
            />
            <TextField
              className="text"
              label="Conform-Password"
              color="secondary"
              value={conformpassword}
              onChange={(e) => setConformpassword(e.target.value)}
            //   focused
              error={Boolean(
                error && password !== conformpassword
                  ? "Passwords do not match"
                  : ""
              )}
              helperText={
                error &&
                (password !== conformpassword ? "Passwords do not match" : "")
              }
              required
            />
            <Button
              type="submit"
              className="submit"
              variant="contained"
              onClick={addUser}
            >
              submit
            </Button>
            <Typography variant="body2" className="signin-text">
              Already have an account?<Button href='/login'>login</Button>
            </Typography>
          </div>
        </div>
      </div>
    </form>
  );
};

export default page;
