// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import App from "./App";

export const metadata: Metadata = {
  title: "Criss ERM",
  description: "Sistema Criss ERM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <App />
        <div className="page active">{children}</div>
      </body>
    </html>
  );
}
