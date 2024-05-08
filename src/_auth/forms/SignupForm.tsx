import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { createUserAccount } from "@/lib/appwrite/api";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validation";

import Button from "@/components/ui/button";
import Loader from "@/components/shared/Loader";

const SignupForm = () => {
  const isLoading = false;

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: ""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    // create user
    const newUser = await createUserAccount(values);
    console.log(newUser);
  }
  
  return (
    <Form {...form}>

      <div className = "sm:w-420 flex-center flex-col">
        <img src="/assets/images/timeline-high-resolution-logo-transparent.png" alt="brand"/>

        <h2 className = "h3-bold md:h2-bold pt-5 sm:pt-12">Create New Account</h2>
        <p className = "text-light-3 small-medium md:base-regular mt-2">Enter account details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col gap-5 w-full mt-4 mb-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder = "First Name" type = "text" {...field} className = "shad-input border border-cyan bg-primary-500 text-white"/>
                </FormControl>
                <FormMessage className = "text-red"/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder = "Last Name" type = "text" {...field} className = "shad-input border border-cyan bg-primary-500 text-white"/>
                </FormControl>
                <FormMessage className = "text-red"/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder = "Username" type = "text" {...field} className = "shad-input border border-cyan bg-primary-500 text-white"/>
                </FormControl>
                <FormMessage className = "text-red"/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder = "Email" type = "email" {...field} className = "shad-input border border-cyan bg-primary-500 text-white"/>
                </FormControl>
                <FormMessage className = "text-red"/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder = "Password" type = "password" {...field} className = "shad-input border border-cyan bg-primary-500 text-white"/>
                </FormControl>
                <FormMessage className = "text-red"/>
              </FormItem>
            )}
          />

          <Button type="submit" className = "shad-button_primary">
            {isLoading ? (
              <div className = "flex-center gap-2">
                <Loader />Loading...
              </div>
            ) : "Sign up"}
          </Button>

          <p className = "text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to = "/sign-in" className = "text-cyan text-small-semibold ml-1"> Log in</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm