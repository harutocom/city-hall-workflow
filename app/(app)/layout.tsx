<<<<<<< HEAD
import Header from "./../../components/header";
=======
import Header from "../../components/header";
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3

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
