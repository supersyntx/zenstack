"use client";

import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@space/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@space/ui/components/form";
import { Input } from "@space/ui/components/input";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export default function SignupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    mutation.mutate(values);
  }

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      // Simulate an API call
      return await authClient.signUp.email(data);
    },
    onSuccess: (data) => {
      console.log("Account created successfully:", data);
      // Redirect to home or show success message
      form.reset();
      router.push("/dashboard"); // redirect to dashboard page
    },
    onError: (error) => {
      console.error("Error creating account:", error);
      // Handle error, show message to user
      form.setError("root", {
        type: "manual",
        message: "Failed to create account. Please try again.",
      });
    },
  });

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="max-w-92 m-auto h-fit w-full">
        <div className="p-6">
          <div>
            <Link href="/" aria-label="go home">
              {/* <LogoIcon /> */}
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Create an Account
            </h1>
            <p>Fill in the details to create an account</p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 my-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Dohn Joe"
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
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
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your email address.
                    </FormDescription>
                    <FormMessage />
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
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your account password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
                variant={"outline"}
              >
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account
              </Button>
            </form>
          </Form>
        </div>

        <p className="text-accent-foreground text-center text-sm">
          Already have an account?
          <Button asChild variant="link" className="px-2">
            <Link href="/">Signin</Link>
          </Button>
        </p>
      </div>
    </section>
  );
}
