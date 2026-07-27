import ChangePasswordForm from "./change-password-form";
import CustomerNavbar from "@/components/customer-navbar";

export default function ChangePasswordPage() {
  return (
    <>             <CustomerNavbar />

    <main className="mx-auto max-w-2xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Change Password
      </h1>

      <ChangePasswordForm />
    </main>
    </>
  );
}