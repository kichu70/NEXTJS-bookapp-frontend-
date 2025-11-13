"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
const router = useRouter();

  const safeParse = (key) => {
    try {
      const value = localStorage.getItem(key);
      if (!value || value === "undefined" || value === "null") return null;
      return JSON.parse(value);
    } catch (err) {
      console.log(err, `Error parsing key "${key}"`);
      return null;
    }
  };
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState(
    () => safeParse("cartItems") || []
  );

  useState(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedCart = localStorage.getItem("cartItems");

      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedCart) setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
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
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== bookId);
      if (updated.length > 0) {
        localStorage.setItem("catItems", JSON.stringify(updated));
      } else {
        localStorage.removeItem("cartItems");
      }
      toast.info("Book removed from cart");
      return updated;
    });
  };

  // ---------------login----------------

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/user/login`, {
        email,
        password,
      });
      console.log("Full backend response:", res.data);
      const token1 = res.data.AccesToken;
      const userData = res.data.userData;

      setToken(token1);
      setUser(userData);

      localStorage.setItem("token", token1);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log(token1);
      if (token) {
        router.push("/");
        console.log("ok**");
      }

      toast("logined successfull!");
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

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");

    toast.success("logout successfully");
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
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
export const useAuth = () => useContext(AuthContext);
