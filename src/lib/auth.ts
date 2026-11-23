import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  user: {
    fields: { image: "avatarUrl" },
    additionalFields: {
      login: { type: "string", required: true },
    },
  },
  disabledPaths: ["/update-user"],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => ({ login: profile.login }),
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
