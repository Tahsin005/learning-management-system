"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Loader2, KeyRound, Lock, ArrowLeft } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
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

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const { resetPassword, isResettingPassword } = useAuth();
  const initialCode = searchParams.get("code") || "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: initialCode,
      password: "",
      passwordConfirmation: "",
    },
  });

  useEffect(() => {
    if (initialCode) {
      setValue("code", initialCode);
    }
  }, [initialCode, setValue]);

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPassword(values);
  };

  return (
    <Card className="border-border/70 shadow-lg">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg font-semibold">Set New Password</CardTitle>
        <CardDescription className="text-xs">
          Enter the verification code received by email and your new password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-xs font-medium">
              Reset Code
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="code"
                type="text"
                placeholder="Paste code from email"
                className="pl-9 font-mono text-sm"
                disabled={isResettingPassword}
                {...register("code")}
              />
            </div>
            {errors.code && (
              <p className="text-xs text-destructive">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                className="pl-9"
                disabled={isResettingPassword}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="passwordConfirmation" className="text-xs font-medium">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="passwordConfirmation"
                type="password"
                placeholder="Re-enter new password"
                className="pl-9"
                disabled={isResettingPassword}
                {...register("passwordConfirmation")}
              />
            </div>
            {errors.passwordConfirmation && (
              <p className="text-xs text-destructive">{errors.passwordConfirmation.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button
            type="submit"
            className="w-full gap-2 shadow-sm"
            disabled={isResettingPassword}
          >
            {isResettingPassword ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                Reset Password
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            <Link
              href="/login"
              className="font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
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
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a secure new password for your account
          </p>
        </div>

        <Suspense
          fallback={
            <Card className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
