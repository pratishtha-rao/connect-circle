import { Suspense } from "react";
import LoginForm from "./LoginForm";
import PublicNavbar from "@/components/PublicNavbar";

export default function LoginPage() {
  return (
      <>
      <PublicNavbar />
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
    </>
  );
}