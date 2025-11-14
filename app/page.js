// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export const dynamic = "force-dynamic";

// export default async function Page() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("authTokens")?.value;

//   if (!token) {
//     redirect("/login");
//   }

//   let role = null;
//   try {
//     const parts = token.split(".");
//     if (parts.length >= 2) {
//       const payloadStr = Buffer.from(parts[1], "base64").toString("utf8");
//       role = JSON.parse(payloadStr)?.role ?? null;
//     }
//   } catch (e) {
//     role = null;
//   }

//   if (role === "super-admin") {
//     redirect("/dashboard");
//   } else if (role === "school-admin") {
//     redirect("/school-dashboard");
//   } else {
//     redirect("/login");
//   }
// }

"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authTokens");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length >= 2) {
        const payloadStr = atob(parts[1]);
        const role = JSON.parse(payloadStr)?.role ?? null;

        if (role === "super-admin") router.replace("/dashboard");
        else if (role === "school-admin") router.replace("/school-dashboard");
        else router.replace("/login");
      } else {
        router.replace("/login");
      }
    } catch (err) {
      router.replace("/login");
    }
  }, [router]);

  return null;
}