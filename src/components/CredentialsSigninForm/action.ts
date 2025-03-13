"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const credentialsSigninAction = async (formData: FormData) => {
  try {
    await signIn("credentials", formData);
    redirect(`/dashboard`);
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.cause?.err?.message == "Invalid credentials.")
        redirect(`/signin?error=InvalidCredentials`);
    }
    throw error;
  }
};
