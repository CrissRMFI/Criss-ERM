import Nav from "../App";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
