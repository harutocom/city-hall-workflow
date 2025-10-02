import Header from "./../../componets/header";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
    </>
  );
}
