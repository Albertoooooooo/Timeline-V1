import * as z from "zod";

export const SignupValidation = z.object({
    name: z.string().min(2, { message: "Name is too short" }).max(30, { message: "Name is too long" }),
    username: z.string().min(2, { message: "Username is too short" }).max(20, { message: "Username is too long" }),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(100, { message: "Dude. what are you trying? Too long!"})
})

export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(100, { message: "Dude. what are you trying? Too long!"})
})

export const PostValidation = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
})

export const CommentValidation = z.object({
  caption: z.string().min(5).max(2200)
})

export const NoteValidation = z.object({
  caption: z.string().min(5).max(2200)
})

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
})

export const SnippetValidation = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(5).max(100),
})