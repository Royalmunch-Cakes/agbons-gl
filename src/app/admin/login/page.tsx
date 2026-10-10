import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { LoginForm } from "@/app/admin/login/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { brandMedia } from "@/content/site";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage(props: PageProps<"/admin/login">) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Image
            src={brandMedia.logo.src}
            alt={brandMedia.logo.alt}
            width={350}
            height={100}
            priority
            className="mx-auto h-12 w-auto"
          />
          <CardTitle className="mt-4 font-heading text-2xl font-normal">
            Admin dashboard
          </CardTitle>
          <CardDescription>Sign in to edit the website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm searchParams={props.searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
