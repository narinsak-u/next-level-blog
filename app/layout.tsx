import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import "./globals.css";
import "@/styles/notion-custom.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

import type { Metadata } from "next";
import { jetBrains_mono } from "./fonts";
import { siteMetadata } from "@/site/siteMetadata";
// import { ogHomeImage } from "@/site/data";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css";

// used for rendering equations (optional)
import "katex/dist/katex.min.css";

import MantineProviders from "@/components/providers/MantineProviders";
import ClientComponent from "@/components/common/ClientComponent";
import { QueryProvider } from "@/components/providers/query-provider";

export const metadata: Metadata = {
  metadataBase: siteMetadata.metadataBase,
  title: `${siteMetadata.title} — ${siteMetadata.homeTitle}`,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  // openGraph: {
  //   images: [ogHomeImage],
  //   type: "website",
  // },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      {...mantineHtmlProps}
      suppressHydrationWarning
    >
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body
        className={`${jetBrains_mono.className} relative`}
        suppressHydrationWarning
      >
        <ClientComponent>
          <MantineProviders>
            <QueryProvider>{children}</QueryProvider>
          </MantineProviders>
        </ClientComponent>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
