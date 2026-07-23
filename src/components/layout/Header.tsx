import LogoutButton from "@/components/LogoutButton";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-8">

      <h2 className="text-xl font-semibold">
        Connect Circle
      </h2>

      <LogoutButton />

    </header>
  );
}