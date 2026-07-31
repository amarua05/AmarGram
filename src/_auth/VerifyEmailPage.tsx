import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { verifyUserEmail } from "@/lib/appwrite/api";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (!userId || !secret) {
      setStatus("error");
      setMessage("The verification link is missing required information.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await verifyUserEmail(userId, secret);
        setStatus("success");
        setMessage("Your email has been successfully verified.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "This verification link is invalid or has expired."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  if (status === "checking") {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="rounded-[30px] border border-dark-4 bg-dark-2 p-8 text-center">
          <p className="text-light-2">{message}</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md rounded-[30px] border border-dark-4 bg-dark-2 p-8 text-center">
          <h2 className="h3-bold text-light-1">Verification failed</h2>
          <p className="mt-3 text-light-3">{message}</p>
          <Link to="/sign-in" className="mt-6 inline-block">
            <Button className="shad-button_primary">Back to sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-md rounded-[30px] border border-dark-4 bg-dark-2 p-8 text-center">
        <h2 className="h3-bold text-light-1">Email verified</h2>
        <p className="mt-3 text-light-3">{message}</p>
        <Link to="/sign-in" className="mt-6 inline-block">
          <Button className="shad-button_primary">Continue</Button>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
