"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Success = () => {
  const router = useRouter();

  useEffect(() => {
    toast.success("Payment Successful 🎉");

    const timer = setTimeout(() => {
      router.push("/"); // redirect after 3 seconds
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1>✅ Payment Successful!</h1>
      <p>Redirecting to Home page...</p>
    </div>
  );
};

export default Success;
