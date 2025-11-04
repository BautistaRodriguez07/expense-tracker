"use client";
import React, { useEffect, useState } from "react";
import { useAuth, useClerk, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { CustomTitle } from "@/components";
import { Button } from "@/components/ui/button";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const clerk = useClerk();

  useEffect(() => {
    if (isSignedIn) router.push("/");
  }, [isSignedIn, router]);

  if (!isLoaded) return null;

  /** STEP 1: Enviar el código al correo */
  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      console.error("Create reset error:", err);
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Failed to send reset email. Please try again.";
      setError(message);
    }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (!result) throw new Error("No response from Clerk");

      if (result.status === "needs_second_factor") {
        setSecondFactor(true);
        return;
      }

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
        return;
      }

      console.log("Unexpected result:", result);
    } catch (err: any) {
      console.error("Reset error:", err);
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Failed to reset password. Please check your code and try again.";
      setError(message);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="card-container text-center">
          <CustomTitle title="Expenso" tag="h1" className="text-2xl py-4" />
          <CustomTitle
            title="Forgot password?"
            tag="h2"
            className="text-xl txt-muted py-2"
          />

          <form onSubmit={!successfulCreation ? create : reset}>
            {!successfulCreation && (
              <>
                <input
                  className="w-full p-2 my-5 border border-gray-300 rounded-lg"
                  type="email"
                  placeholder="e.g. john@doe.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="btn w-full">
                  Send password reset code
                </Button>
                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              </>
            )}
            {successfulCreation && (
              <div className="text-left txt-muted font-medium">
                <label htmlFor="password" className="block mb-2">
                  Enter your new password
                </label>
                <input
                  className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />

                <label htmlFor="code" className="block mb-2">
                  Enter the reset code sent to your email
                </label>
                <input
                  className="w-full p-2 mb-5 border border-gray-300 rounded-lg"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                />

                <Button type="submit" className="btn w-full">
                  Reset password
                </Button>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              </div>
            )}

            {secondFactor && (
              <p className="text-yellow-600 mt-3">
                2FA is required, but this UI does not handle that.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
