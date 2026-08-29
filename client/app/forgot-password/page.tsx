"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { GraduationCap, Loader2, Mail, Send, ArrowLeft, CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/use-auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const { forgotPassword, isRequestingReset, isForgotPasswordSuccess } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword(values);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/20 selection:bg-primary/20">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span>Scholler</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Forgot Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your registered email address to receive reset instructions
          </p>
        </div>

        <Card className="border-border/70 shadow-lg">
          {isForgotPasswordSuccess ? (
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold">Instructions Sent</h2>
              <p className="text-sm text-muted-foreground">
                If an account exists with that email, we have dispatched a password reset link or code.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/reset-password"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                  Enter Reset Code
                </Link>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-lg font-semibold">Password Recovery</CardTitle>
                <CardDescription className="text-xs">
                  We will send a reset code to your email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      className="pl-9"
                      disabled={isRequestingReset}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button
                  type="submit"
                  className="w-full gap-2 shadow-sm"
                  disabled={isRequestingReset}
                >
                  {isRequestingReset ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending instructions...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Reset Instructions
                    </>
                  )}
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Return to Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
