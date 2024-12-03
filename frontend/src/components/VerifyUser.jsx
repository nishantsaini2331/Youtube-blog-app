import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

function VerifyUser() {
  const { verificationToken } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function verifyUser() {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/verify-email/${verificationToken}`
        );

        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        navigate("/signin");
      }
    }
    verifyUser();
  }, [verificationToken]);
  return <div>VerifyUser</div>;
}

export default VerifyUser;