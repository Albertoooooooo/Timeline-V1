import * as z from "zod";

export const SignupValidation = z.object({
    firstName: z.string().min(2, { message: "Name is too short" }).max(20, { message: "Name is too long" }),
    lastName: z.string().min(2, { message: "Name is too short" }).max(20, { message: "Name is too long" }),
    username: z.string().min(2, { message: "Username is too short" }).max(20, { message: "Username is too long" }),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(100, { message: "Dude. what are you trying? Too long!"})
  })