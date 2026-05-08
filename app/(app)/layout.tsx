import Nav from "../App";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SessionProviderWrapper from "../components/SessionProviderWrapper";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <SessionProviderWrapper>
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </SessionProviderWrapper>
  );
}
