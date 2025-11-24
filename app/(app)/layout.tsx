import Header from "../../components/header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <Header />
      </header>
      <main className="pt-16">{children}</main>
    </>
  );
}
