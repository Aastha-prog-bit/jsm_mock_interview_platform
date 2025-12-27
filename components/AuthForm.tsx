"use client";

import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Form } from '@/components/ui/form';
import FormFieldCustom from "@/components/FormField"; // Renamed to avoid conflict with shadcn FormField
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/FireBase/client";
import { signUp, signIn } from "@/lib/action/auth.action";

// 1. Define the FormType properly
type FormType = 'sign-in' | 'sign-up';

// 2. Fix the schema to handle the conditional 'name' field correctly
const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3, "Name must be at least 3 characters") : z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message || "Sign up failed");
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push('/sign-in');
      } else {
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error('Sign in failed');
          return;
        }

        await signIn({ email, idToken });
        toast.success('Signed in successfully');
        router.push('/');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An error occurred during authentication');
    }
  }

  const isSignIn = type === 'sign-in';

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10 bg-white shadow-sm rounded-xl">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100 font-bold text-2xl">Prepwise</h2>
        </div>
        <h3 className="text-center text-gray-600">Practice job interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4"
          >
            {!isSignIn && (
              <FormFieldCustom
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}

            <FormFieldCustom
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email Address"
            />

            <FormFieldCustom
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter Your Password"
              type="password"
            />

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : isSignIn ? 'Sign in' : 'Create an account'}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="inline text-gray-500">
            {isSignIn ? 'No account yet?' : 'Have an account already?'}
          </p>
          <Link
            href={isSignIn ? '/sign-up' : '/sign-in'}
            className="font-bold text-primary ml-1 hover:underline"
          >
            {isSignIn ? 'Sign up' : 'Sign in'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForm; // Corrected export