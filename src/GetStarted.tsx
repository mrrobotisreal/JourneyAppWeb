import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

const schema = z.object({
  username: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(32, "Must be 32 characters or fewer")
    .regex(/^[a-zA-Z0-9.\-_@$#]+$/, {
      message: "Only a-z A-Z 0-9 . - _ @ $ # are allowed",
    }),
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
    defaultValues: { username: "", password: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = (data: FormValues) => {
    // 🔒 TODO: plug in your auth / API call
    console.log("🚀 Submitted:", data);
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
