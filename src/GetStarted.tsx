import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth, googleProvider } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";

import TopNav from "@/components/top-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  username: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(32, "Must be 32 characters or fewer")
    .regex(/^[a-zA-Z0-9.\-_@$#]+$/, {
      message: "Only a-z A-Z 0-9 . - _ @ $ # are allowed",
    }),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Must be at least 8 characters")
    .max(32, "Must be 32 characters or fewer")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/,
      "Needs 1 upper, 1 lower, 1 number & 1 special char"
    ),
});

type FormValues = z.infer<typeof schema>;

const GetStarted: React.FC = () => {
  const [showPwd, setShowPwd] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange", // validate as the user types
    defaultValues: { username: "", email: "", password: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async ({ email, password, username }: FormValues) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName: username });
      toast.success(`Account created successfully! Welcome, ${username}!`, {
        duration: 5000,
        description: "You can now sign in with your new account.",
      });
    } catch (err) {
      toast.error(
        `Error creating account: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        {
          duration: 5000,
          description:
            "Please try again or contact support if the issue persists.",
        }
      );
    }
  };

  return (
    <div className="min-h-screen w-full">
      <TopNav />

      <main className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl md:text-6xl font-bold text-blue-darkest dark:text-blue-lightest mb-2">
              Welcome to JourneyApp!
            </CardTitle>
            <CardDescription className="text-xl md:text-2xl text-blue-semi-dark dark:text-blue-lightest mb-2">
              Your Introspective Journey Begins Here
            </CardDescription>
          </CardHeader>
          <CardContent className="mb-4">
            <p className="max-w-3xl text-lg md:text-xl text-muted-foreground mb-8">
              Organise your thoughts, capture memories, and ignite creativity.
              Create your account below to get started!
            </p>

            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 text-left"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="skipparoo"
                          autoComplete="username"
                        />
                      </FormControl>
                      <FormDescription>
                        3–32 chars, letters, numbers, . - _ @ $ #
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
                          type="email"
                          placeholder="you@example.com"
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
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPwd ? "text" : "password"}
                            {...field}
                            placeholder="••••••••"
                            autoComplete="new-password"
                          />
                        </FormControl>

                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setShowPwd((v) => !v)}
                          className="absolute !bg-transparent inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                          aria-label={
                            showPwd ? "Hide password" : "Show password"
                          }
                        >
                          {showPwd ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </Button>
                      </div>

                      <FormDescription>
                        8–32 chars, incl. upper, lower, number, special
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <p className="text-muted-foreground mb-2 mt-4">
              Or sign up with Google for a quicker start!
            </p>

            <button
              className="gsi-material-button"
              onClick={async () => {
                try {
                  await signInWithPopup(auth, googleProvider);
                  toast.success("Signed up with Google!");
                } catch (e) {
                  // eslint-disable-next-line
                  // @ts-ignore
                  toast.error(e.message);
                }
              }}
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    style={{ display: "block" }}
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span
                  className="gsi-material-button-contents"
                  style={{ fontFamily: "Sour_Gummy", fontWeight: "bolder" }}
                >
                  Sign up with Google
                </span>
                <span
                  style={{
                    display: "none",
                    fontFamily: "Sour_Gummy",
                    fontWeight: "bolder",
                  }}
                >
                  Sign up with Google
                </span>
              </div>
            </button>
          </CardContent>
          <CardFooter className="flex justify-around items-center">
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">
                Already have an account?
              </p>
              <a
                href="/signin"
                className="text-foreground hover:text-blue-semi-dark dark:hover:text-blue-lightest"
              >
                Sign In here
              </a>
            </div>
            <Button
              asChild
              type="button"
              size="lg"
              disabled={isSubmitting || !isValid}
              onClick={form.handleSubmit(onSubmit)}
              className="bg-blue-semi-light hover:bg-blue-semi-dark text-white px-12 py-4 text-lg font-semibold shadow-lg"
            >
              <p className="font-bold">
                {isSubmitting ? "Submitting…" : "Submit"}
              </p>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default GetStarted;
