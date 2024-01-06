import NextAuth from "next-auth/next";
import { OPTIONS } from "./options";

const handler = NextAuth(OPTIONS);

// Export the uppercase method name
export { handler as GET, handler as POST, OPTIONS };
