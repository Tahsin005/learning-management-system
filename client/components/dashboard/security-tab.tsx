"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/lib/validations/auth";
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

interface SecurityTabProps {
  onChangePassword: (values: ChangePasswordFormValues) => Promise<void>;
  isChangingPassword: boolean;
}

export function SecurityTab({
  onChangePassword,
  isChangingPassword,
}: SecurityTabProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await onChangePassword(values);
      reset();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="max-w-xl">
      <Card className="border-border/80 bg-card shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription className="text-xs">
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className="text-xs font-medium">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                disabled={isChangingPassword}
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isChangingPassword}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="passwordConfirmation" className="text-xs font-medium">
                Confirm New Password
              </Label>
              <Input
                id="passwordConfirmation"
                type="password"
                placeholder="••••••••"
                disabled={isChangingPassword}
                {...register("passwordConfirmation")}
              />
              {errors.passwordConfirmation && (
                <p className="text-xs text-destructive">{errors.passwordConfirmation.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="gap-2 bg-primary text-white"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
