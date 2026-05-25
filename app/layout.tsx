import type { Metadata } from "next";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "../styles.css";
import { Logo } from "../components/Logo";
import { assetPrefix, description } from "../config/constants";

export const metadata: Metadata = {
  title: {
    template: "%s – Reading notes",
    default: "Reading notes",
  },
  description,
  openGraph: { title: "Reading notes", description },
  appleWebApp: { title: "Reading notes" },
  icons: { icon: `${assetPrefix}/favicon.ico` },
  other: { "msapplication-TileColor": "#fff" },
};

const navbar = (
  <Navbar
    logo={<Logo />}
    projectLink="https://github.com/mkrtchian/reading-notes"
  />
);

const footer = <Footer>Made by Roman Mkrtchian</Footer>;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/mkrtchian/reading-notes/blob/main"
          feedback={{
            content: "Question? Give me feedback",
            labels: "feedback",
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
