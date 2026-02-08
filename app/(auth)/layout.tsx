import Header from "../../components/header";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="">{children}</main>
    </>
  );
}
