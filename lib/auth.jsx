"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { setCookie } from "./cookies/setCookie";
import { clearCookie } from "./cookies/clearCookie";
import { getCookie } from "./cookies/getCookie";

const AuthContext = createContext();

export const AuthProvider = ({ children, cookieData }) => {
  const router = useRouter();

  const [token, setToken] = useState(cookieData?.token || null);
  const [user, setUser] = useState(cookieData?.user || null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {}, [token]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // const storedToken = localStorage.getItem("token");
      // const storedUser = localStorage.getItem("user");
      const storedCart = localStorage.getItem("cartItems");

      // if (storedToken) setToken(storedToken);
      // if (storedUser) setUser(JSON.parse(storedUser));
      if (cookieData) {
        setToken(cookieData.token);
        setUser(cookieData.user);
      }
      if (storedCart) setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems");
    }
  }, [cartItems]);
  // ----------addcart--------

  const addToCart = (book) => {
    const exists = cartItems.find((item) => item.id === book.id);
    if (exists) {
      toast.info("you already added to cart");
      return;
    } else {
      setCartItems((prev) => [...prev, book]);
      toast.success("book added to cart");
    }
  };

  // --------remove from cart -------------

  const removeFromCart = (bookId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== bookId));
    toast.info("Book removed from cart");
  };

  // ---------------login----------------

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/user/login`,
        {
          email,
          password,
        }
      );
      console.log("Full backend response:", res.data);
      const token1 = res.data.AccessToken;
      const userData = res.data.userData;

      setToken(token1);
      setUser(userData);
      const role = userData.role;

      setCookie(token1, userData);
      // localStorage.setItem("token", token1);
      // localStorage.setItem("user", JSON.stringify(userData));
      if (token1) {
        if (role === "Admin") {
          router.push("/admin");
          toast.success("login admin");
        } else if (role === "User") {
          toast.success("login user");
          router.push("/");
          console.log("ok**");
        }
      } else {
        return;
      }
    } catch (err) {
      console.log(err, "error is in the login fr", { email, password });
      toast.error("invalid email or password");
    }
  };

  // ---------------logout -------------

  const logout = () => {
    setToken(null);
    setUser(null);
    setCartItems([]);

    clearCookie();
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    // localStorage.removeItem("cartItems");

    toast.success("logout successfully");
  };

  // ------------adding token on register ----------

  const setAuthState = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken && newUser) {
      setCookie(newToken, newUser);
      router.push("/");
    } else {
      clearCookie();
    }
  };

  // -------reuseble function------

  const reusebleFunction = (callback) => {
    if (!token) {
      toast.dark("Login to access this");

      router.push("/login");
      return;
    }
    if (user.role === "Admin") {
      toast.info("Admin can't use this functions");
      return;
    }
    callback();
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <AuthContext.Provider
        value={{
          user,
          token,
          login,
          logout,
          cartItems,
          addToCart,
          removeFromCart,
          setAuthState,
          reusebleFunction,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
export const useAuth = () => useContext(AuthContext);
