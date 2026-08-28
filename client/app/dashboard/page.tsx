"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyRound,
  Loader2,
  CheckCircle2,
  Calendar,
  Mail,
  User,
  Shield,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/lib/validations/auth";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const {
    user,
    role,
    roleType,
    changePassword,
    isChangingPassword,
    isLoggingOut,
  } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "security">("overview");

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

  const onChangePasswordSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword(values);
      reset();
    } catch {
      // Error handled by mutation
    }
  };

  const getRoleBadge = () => {
    switch (roleType) {
      case "admin":
        return <Badge variant="default" className="bg-amber-600 hover:bg-amber-700 text-xs">Admin</Badge>;
      case "content_manager":
        return <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs">Content Manager</Badge>;
      case "instructor":
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/5 text-xs">Instructor</Badge>;
      case "student":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">Student</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">User</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!user || isLoggingOut) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

        <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Hello, {user?.username}
                </h1>
                {getRoleBadge()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {user?.email} • ID: <code className="text-xs font-mono bg-muted/60 text-zinc-300 px-1.5 py-0.5 rounded border border-border/40">{user?.documentId || user?.id}</code>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === "overview" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("overview")}
              >
                Dashboard Overview
              </Button>
              <Button
                variant={activeTab === "security" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("security")}
                className="gap-1.5"
              >
                <KeyRound className="h-4 w-4" />
                Security & Password
              </Button>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card border-border/80 shadow-sm flex flex-col justify-between">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <span className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                      Assigned Role
                    </span>
                    {getRoleBadge()}
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-2xl font-bold text-foreground capitalize">
                      {role?.name || roleType || "Standard User"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {role?.description || "Platform access role"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border/80 shadow-sm flex flex-col justify-between">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <span className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                      Member Since
                    </span>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-2xl font-bold text-foreground">
                      {formatDate(user?.createdAt)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Account created
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <Card className="border-border/80 bg-card shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">User Profile Information</CardTitle>
                      <CardDescription className="text-xs">
                        Details of your authenticated account in the system
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            <span>Username</span>
                          </div>
                          <p className="font-semibold text-foreground">{user?.username}</p>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            <span>Email Address</span>
                          </div>
                          <p className="font-semibold text-foreground">{user?.email}</p>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Shield className="h-3.5 w-3.5" />
                            <span>Assigned Role</span>
                          </div>
                          <p className="font-semibold text-foreground capitalize">{role?.name || roleType || "Standard User"}</p>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Last Updated</span>
                          </div>
                          <p className="font-semibold text-foreground">{formatDate(user?.updatedAt)}</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg bg-muted/30 border border-border/50">
                        <span className="text-xs font-semibold text-muted-foreground tracking-wider">Role Permissions Summary:</span>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {role?.description || "Your account has access based on your assigned system role."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="max-w-xl">
              <Card className="border-border/80 bg-card shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Change Password</CardTitle>
                  <CardDescription className="text-xs">
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onChangePasswordSubmit)}>
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
                        placeholder="At least 6 characters"
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
                        placeholder="Re-enter new password"
                        disabled={isChangingPassword}
                        {...register("passwordConfirmation")}
                      />
                      {errors.passwordConfirmation && (
                        <p className="text-xs text-destructive">{errors.passwordConfirmation.message}</p>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button type="submit" disabled={isChangingPassword} className="gap-2 bg-primary text-white">
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
          )}
        </main>
      </div>
  );
}
