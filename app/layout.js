import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/authContext";
import QueryProvider from "@/lib/providers/QueryProvider";
import { WebSocketProvider } from "@/app/providers/WebSocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LSG Academy - Management System",
  description: "School management and evaluation system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <WebSocketProvider>{children}</WebSocketProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
