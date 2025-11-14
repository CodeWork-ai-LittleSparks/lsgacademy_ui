import AuthGuard from "@/components/AuthGuard";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
