"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Cancel = () => {
  const router = useRouter();

  useEffect(() => {
    toast.error("Payment Failed!");

    const timer = setTimeout(() => {
      router.push("/"); // redirect to home
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1>Payment Failed!</h1>
      <p>Redirecting to Home page...</p>
    </div>
  );
};

export default Cancel;
