import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalmZone - Seu espaço de apoio emocional",
  description: "Aplicativo de apoio emocional, desabafo anônimo e autocuidado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
