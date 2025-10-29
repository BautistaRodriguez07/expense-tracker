"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldDescription, FieldGroup } from "@/components/ui/field";

import { CustomTitle } from "../custom/custom-title/CustomTitle";
import { IoLogoGoogle } from "react-icons/io5";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Separator } from "@/components/ui/separator";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-6 text-center", className)}
      {...props}
    >
      <Card className="card-container">
        <SignIn.Root>
          <SignIn.Step name="start">
            <CardHeader>
              <CardTitle>
                <CustomTitle
                  title="Expenso"
                  tag="h1"
                  className="text-2xl py-4"
                />
                <CustomTitle
                  title="Login in your account"
                  tag="h2"
                  className="text-xl txt-muted py-2"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Clerk.GlobalError className="block text-sm text-red-600" />
                <Clerk.Field name="identifier" className="group/field relative">
                  <Clerk.Input
                    type="email"
                    placeholder="Email address"
                    required
                    className="w-full p-1 border border-gray-300 rounded-lg"
                  />
                  <Clerk.FieldError className="mt-2 block text-xs text-red-600" />
                </Clerk.Field>
                <Clerk.Field name="password" className="group/field relative">
                  <Clerk.Input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full p-1 border border-gray-300 rounded-lg"
                  />
                  <Clerk.FieldError className="mt-2 block text-xs text-red-600" />
                </Clerk.Field>

                <SignIn.Action submit className="btn p-1 mt-3">
                  Sign In
                </SignIn.Action>

                <div className="flex items-center gap-3 ">
                  <Separator className="flex-1" />
                  <span className="text-sm text-gray-400">or</span>
                  <Separator className="flex-1" />
                </div>

                <Clerk.Connection
                  name="google"
                  className="btn flex items-center p-1 justify-center gap-2"
                >
                  <IoLogoGoogle />
                  Sign In with Google
                </Clerk.Connection>

                <Clerk.Link navigate="sign-up">
                  <FieldDescription className="text-center txt-muted py-4">
                    Don&apos;t have an account? <a href="#">Sign up</a>
                  </FieldDescription>
                </Clerk.Link>
              </FieldGroup>
            </CardContent>
          </SignIn.Step>
        </SignIn.Root>
      </Card>
    </div>
  );
}
