import Link from "next/link";
import { GithubSignIn } from "@/components/sign-in-buttons/GithubAuthButton";
import { GoogleSignIn } from "@/components/sign-in-buttons/GoogleAuthButton";
import { ResendSignIn } from "@/components/sign-in-buttons/ResendAuthButton";
import { Wallet } from "lucide-react";

export default async function Page() {
  return (
    <div className="w-full lg:grid lg:h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Wallet className="size-5" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-balance text-muted-foreground">
              Sign in to access your dashboard
            </p>
          </div>
          <div className="grid gap-4">
            <ResendSignIn />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <GithubSignIn />
            <GoogleSignIn />
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex lg:items-center lg:justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="flex size-24 items-center justify-center rounded-2xl bg-primary/10">
            <Wallet className="size-12 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground">RaylsFi</h2>
            <p className="mt-1 text-sm">Your Web3 Card Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
