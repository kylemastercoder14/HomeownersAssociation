"use client";

import Link from "next/link";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AdminValidation } from "@/validators/admin";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginUser } from "@/actions/admin";
import { Eye, EyeClosed } from "lucide-react";
import SubmitButton from "@/components/globals/submit-button";
import Image from "next/image";

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof AdminValidation>>({
    resolver: zodResolver(AdminValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof AdminValidation>) => {
    try {
      const res = await loginUser(values);
      if (res.success) {
        toast.success(res.success);
        if (res.user.role === "Admin") {
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 1000);
        } else {
          setTimeout(() => {
            router.push("/employee/dashboard");
          }, 1000);
        }
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <div className="max-w-md w-full mx-auto">
      <Image
        className="mb-5"
        alt="Logo"
        src="/assets/logo.png"
        width={200}
        height={200}
      />
      <h1 className="font-semibold">Login to HOA-HRMS</h1>
      <p className="text-sm mt-1 text-muted-foreground">
        Please enter your email and password to login.
      </p>
      <Form {...form}>
        <form
          autoComplete="off"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mt-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email Address <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    type="email"
                    placeholder="juandelacruz@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>
                  Password <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    type={showPassword ? "text" : "password"}
                    placeholder="--------"
                    {...field}
                  />
                </FormControl>
                <Button
                  onClick={handleShowPassword}
                  disabled={isSubmitting}
                  type="button"
                  className="absolute top-6 right-1 hover:bg-transparent text-muted-foreground"
                  size="icon"
                  variant="ghost"
                >
                  {showPassword ? <Eye /> : <EyeClosed />}
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            label="Continue"
            loading={isSubmitting}
            className="w-full"
          />
        </form>
      </Form>
      <div className="text-sm text-muted-foreground mt-5">
        Forgot your password?{" "}
        <Link
          href="/forgot-password"
          className="text-green-800 hover:underline"
        >
          Reset password
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
