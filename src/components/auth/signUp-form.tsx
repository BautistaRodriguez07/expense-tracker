"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { CustomTitle } from "../custom/custom-title/CustomTitle";
import { IoLogoGoogle } from "react-icons/io5";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { Separator } from "@/components/ui/separator";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-6 text-center", className)}
      {...props}
    >
      <Card className="card-container">
        <SignUp.Root>
          {/* Step 1: Registro */}
          <SignUp.Step name="start">
            <CardHeader>
              <CardTitle>
                <CustomTitle
                  title="Expenso"
                  tag="h1"
                  className="text-2xl py-4"
                />
                <CustomTitle
                  title="Create an account"
                  tag="h2"
                  className="text-xl txt-muted py-2"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Clerk.GlobalError className="block text-sm text-red-600" />

                {/* Email */}
                <Clerk.Field
                  name="emailAddress"
                  className="group/field relative"
                >
                  <Clerk.Input
                    type="email"
                    placeholder="Email address"
                    required
                    className="w-full p-1 border border-gray-300 rounded-lg"
                  />
                  <Clerk.FieldError className="mt-2 block text-xs text-red-600" />
                </Clerk.Field>

                {/* Password */}
                <Clerk.Field name="password" className="group/field relative">
                  <Clerk.Input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full p-1 border border-gray-300 rounded-lg"
                  />
                  <Clerk.FieldError className="mt-2 block text-xs text-red-600" />
                </Clerk.Field>

                <SignUp.Action submit className="btn p-1 mt-3">
                  Sign Up
                </SignUp.Action>

                {/* 
                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-sm text-gray-400">or</span>
                  <Separator className="flex-1" />
                </div>


                <Clerk.Connection
                  name="google"
                  className="btn flex items-center p-1 justify-center gap-2"
                >
                  <IoLogoGoogle />
                  Sign Up with Google
                </Clerk.Connection> */}

                <Clerk.Link navigate="sign-in">
                  <FieldDescription className="text-center txt-muted py-4">
                    Already have an account? <a href="#">Sign in</a>
                  </FieldDescription>
                </Clerk.Link>
              </FieldGroup>
            </CardContent>
          </SignUp.Step>

          <SignUp.Step name="verifications">
            <CardHeader>
              <CardTitle>
                <h2 className="text-xl txt">Verify your email</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Clerk.GlobalError className="block text-sm text-red-600" />
              <SignUp.Strategy name="email_code">
                <Clerk.Field name="code" className="group/field relative">
                  <Clerk.Input
                    type="text"
                    placeholder="Enter verification code"
                    required
                    className="w-full p-1 my-3 border border-gray-300 rounded-lg"
                  />
                  <Clerk.FieldError className="mt-2 block text-xs text-red-600" />
                </Clerk.Field>
                <SignUp.Action submit className="btn p-2 mt-4">
                  Finish Registration
                </SignUp.Action>
              </SignUp.Strategy>
            </CardContent>
          </SignUp.Step>
        </SignUp.Root>
      </Card>
    </div>
  );
}
