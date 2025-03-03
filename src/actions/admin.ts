"use server";

import { getEmployeeByEmail } from "@/data/admin";
import db from "@/lib/db";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";
import * as jose from "jose";

export const createUser = async (values: {
  email: string;
  password: string;
}) => {
  if (!values.email || !values.password) {
    return {
      error: "Email and password are required",
    };
  }

  try {
    const existingEmail = await getEmployeeByEmail(values.email);
    if (existingEmail) {
      return {
        error: "Email already exists",
      };
    }

    const hashedPassword = await bcryptjs.hash(values.password, 10);

    await db.admin.create({
      data: {
        email: values.email,
        password: hashedPassword,
      },
    });

    return {
      success: "Employee created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      error: "An error occurred. Please try again.",
    };
  }
};

export const loginUser = async (values: {
  email: string;
  password: string;
}) => {
  if (!values.email || !values.password) {
    return {
      error: "Email and password are required",
    };
  }

  try {
    const user = await getEmployeeByEmail(values.email);

    if (!user) {
      return {
        error: "No user found with this email",
      };
    }

    const validPassword = await bcryptjs.compare(
      values.password,
      user.password
    );

    if (!validPassword) {
      return {
        error: "Invalid password",
      };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(user.id)
      .sign(secret);

    (
      await // Set the cookie with the JWT
      cookies()
    ).set("Authorization", jwt, {
      httpOnly: true, // Set to true for security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 3, // Cookie expiration (3 days in seconds)
      sameSite: "strict", // Adjust according to your needs
      path: "/", // Adjust path as needed
    });

    return { token: jwt, user: user, success: "Login successful" };
  } catch (error) {
    console.error(error);
    return {
      error: "An error occurred. Please try again.",
    };
  }
};

export const logoutUser = async () => {
  (await cookies()).set("Authorization", "", { maxAge: 0, path: "/" });
};
