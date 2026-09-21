import Link from "next/link";
import { Banner } from "@/components/Banner";
import { LoginForm } from "@/components/client-only";

export default function LoginPage() {
  return (
    <>
      <Banner />
      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-16">
        <LoginForm />
        <Link
          href="/kunci"
          className="mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-brand hover:bg-white hover:shadow-sm"
        >
          🔑 Lihat Kunci Jawaban
        </Link>
      </main>
    </>
  );
}
