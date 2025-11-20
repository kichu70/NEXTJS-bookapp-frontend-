"use client";

import React, { useState } from "react";
import "./login.css";
import { Button, TextField } from "@mui/material";
import GradientText from "../../src/components/ui/GradientText";
import { useAuth } from "../../lib/auth";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    if (!email.trim() || !password || password.length < 8) {
      setError(true);
      return;
    } else {
      setError(false);
      login(email, password);
    }
    e.preventDefault();
  };
  return (
    <form action="">
      <div className="login">
        &nbsp;
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
              Login
            </GradientText>
            <TextField
              className="text"
              label="email"
              color="secondary"
              onChange={(e) => setEmail(e.target.value)}
              // focused
              error={
                error &&
                (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
              }
              helperText={
                error && !email.trim()
                  ? "Email is Requierd"
                  : error && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "Invalide email formate"
                  : ""
              }
              required
            />
            <TextField
              className="text"
              label="password"
              type="password"
              color="secondary"
              onChange={(e) => setPassword(e.target.value)}
              error={error && (!password || password.length < 8)}
              helperText={
                error && !password
                  ? "Password is Requierd"
                  : error && password.length < 8
                  ? "Password must contain at least 8 charecter"
                  : ""
              }
              required
            />
            <Button type="submit" className="submit" onClick={handleLogin}>
              submit
            </Button>
            <div>
              <p>
                create account <Button href="/register">signup</Button>
              </p>
            </div>
          </div>
        </div>
        &nbsp;
      </div>
    </form>
  );
};

export default login;
