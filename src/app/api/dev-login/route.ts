import { NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  console.log("[dev-login] Email:", email);

  if (!email) {
    return NextResponse.redirect(new URL("/login?error=missing-email", "http://localhost:3000"));
  }

  try {
    const result = await signIn("credentials", {
      email,
      redirect: false,
    });

    console.log("[dev-login] signIn result:", result);
    console.log("[dev-login] result type:", typeof result);
    console.log("[dev-login] result headers:", result?.headers);

    const response = NextResponse.redirect(new URL("/home", "http://localhost:3000"));

    if (result && typeof result === "object" && "headers" in result) {
      const setCookieHeaders = result.headers.getSetCookie?.() ?? [];
      for (const cookie of setCookieHeaders) {
        response.headers.append("Set-Cookie", cookie);
      }
      const rawCookie = result.headers.get("Set-Cookie");
      if (rawCookie) {
        response.headers.set("Set-Cookie", rawCookie);
      }
    }

    return response;
  } catch (error: any) {
    console.log("[dev-login] ERROR:", error?.message);
    console.log("[dev-login] ERROR digest:", error?.digest);
    console.log("[dev-login] ERROR headers:", error?.headers);
    console.log("[dev-login] ERROR keys:", Object.keys(error || {}));

    if (error?.digest?.includes?.("NEXT_REDIRECT")) {
      return NextResponse.redirect(new URL("/home", "http://localhost:3000"));
    }

    return NextResponse.redirect(new URL("/login?error=auth-failed", "http://localhost:3000"));
  }
}
