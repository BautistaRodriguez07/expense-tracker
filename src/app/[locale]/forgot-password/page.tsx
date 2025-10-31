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
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then(_ => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch(err => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then(result => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({
            session: result.createdSessionId,
            navigate: async ({ session }) => {
              if (session?.currentTask) {
                // Check for tasks and navigate to custom UI to help users resolve them
                // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
                console.log(session?.currentTask);
                return;
              }

              router.push("/");
            },
          });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch(err => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
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
                  className="w-full p-1 my-5 border border-gray-300 rounded-lg"
                  type="email"
                  placeholder="e.g john@doe.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Button className="btn">Send password reset code</Button>
                {error && <p className="text-red-500">{error}</p>}
              </>
            )}
            {successfulCreation && (
              <div className="text-left txt-muted font-medium">
                <label htmlFor="password">Enter your new password</label>
                <input
                  className="w-full p-1 mb-5 border border-gray-300 rounded-lg"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <label htmlFor="code">
                  Enter the password reset code that was sent to your email
                </label>
                <input
                  className="w-full p-1 mb-5 border border-gray-300 rounded-lg"
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
                <Button className="btn w-full">Reset</Button>
                {error && <p className="text-red-500 py-4">{error}</p>}
              </div>
            )}
            {secondFactor && (
              <p>2FA is required, but this UI does not handle that</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
