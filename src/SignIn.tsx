import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

type FormValues = z.infer<typeof schema>;

const SignIn: React.FC = () => {
  const [showPwd, setShowPwd] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async ({ email, password }: FormValues) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success(
        "Successfully signed in! Redirecting to your journal's home page...",
        {
          duration: 3000,
          onDismiss: () => {
            window.location.href = "/app/home";
          },
        }
      );
    } catch (err) {
      toast.error(
        `Error signing in: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        {
          duration: 5000,
          action: {
            label: "Try Again",
            onClick: () => form.reset(),
          },
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
              Sign In to JourneyApp
            </CardTitle>
            <CardDescription className="text-xl md:text-2xl text-blue-semi-dark dark:text-blue-lightest mb-2">
              Welcome back!
            </CardDescription>
          </CardHeader>
          <CardContent className="mb-4">
            <p className="max-w-3xl text-lg md:text-xl text-muted-foreground mb-8">
              Organise your thoughts, capture memories, and ignite creativity.
              Sign in below to continue on your introspective journey!
            </p>

            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 text-left"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <p className="text-muted-foreground mb-2 mt-4">
              Or sign in with Google
            </p>

            <button
              className="gsi-material-button"
              onClick={async () => {
                try {
                  await signInWithPopup(auth, googleProvider);
                  toast.success("Signed in with Google!");
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
                  Sign in with Google
                </span>
                <span
                  style={{
                    display: "none",
                    fontFamily: "Sour_Gummy",
                    fontWeight: "bolder",
                  }}
                >
                  Sign in with Google
                </span>
              </div>
            </button>
          </CardContent>
          <CardFooter className="flex justify-around items-center">
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">
                Don't have an account yet?
              </p>
              <a
                href="/get-started"
                className="text-foreground hover:text-blue-semi-dark dark:hover:text-blue-lightest"
              >
                Sign Up here
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
                {isSubmitting ? "Signing In…" : "Sign In"}
              </p>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default SignIn;

// import React from "react";
// import { Button } from "./components/ui/button";

// const SignIn: React.FC = () => {
//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//         <h1 className="text-2xl font-bold mb-4">Sign In</h1>
//         <form>
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-2" htmlFor="email">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label
//               className="block text-sm font-medium mb-2"
//               htmlFor="password"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <Button
//             type="submit"
//             className="w-full bg-blue-600 text-white hover:bg-blue-700"
//           >
//             Sign In
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignIn;
