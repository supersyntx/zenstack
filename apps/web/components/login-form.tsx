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
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export default function LoginForm() {
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
      return await authClient.signIn.email(data);
    },
    onSuccess: (data) => {
      console.log("Account created successfully:", data);
      // Redirect to home or show success message
      form.reset();
      router.push("/dashboard"); // redirect to dashboard page
    },
    onError: (error) => {
      console.error("Error creating account:", error);
      toast.error(
        "Failed to sign in. Please check your credentials and try again."
      );
      // Handle error, show message to user
      form.setError("root", {
        type: "manual",
        message: "Failed to sign in. Please try again.",
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
              Sign In to ZenStack
            </h1>
            <p>Welcome back! Sign in to continue</p>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              <span>Google</span>
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">
              Or continue With
            </span>
            <hr className="border-dashed" />
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 my-6"
            >
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
                Signin
              </Button>
            </form>
          </Form>
        </div>

        <p className="text-accent-foreground text-center text-sm">
          Don't have an account?
          <Button asChild variant="link" className="px-2">
            <Link href="/signup">Create account</Link>
          </Button>
        </p>
      </div>
    </section>
  );
}
