import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type FormValues = z.infer<typeof schema>;

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await resetPassword(data.email);
      setSubmitted(true);
    } catch (e) {
      // toast handled inside resetPassword
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Helmet>
        <title>Reset your password — Redeemr</title>
        <meta name="description" content="Request a password reset link for your Redeemr account." />
        <link rel="canonical" href="https://redeemr.app/forgot-password" />
      </Helmet>
      <div className="w-full max-w-md px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Reset your password</h1>
        <Card>
          {submitted ? (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MailCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Check your inbox</CardTitle>
                <CardDescription>
                  If an account exists for that email, we've sent a link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to sign in
                  </Link>
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Forgot password?</CardTitle>
                <CardDescription>
                  Enter your email and we'll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3">
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="w-full">
                      <Link to="/auth">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to sign in
                      </Link>
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
