import type { PrismaClient } from "@/generated/prisma/client";

const gitHubProviderId = "github";

export const createPrismaGitHubAccessTokenReader = (client: PrismaClient) => async (userId: string) => {
  const account = await client.account.findFirst({
    where: { userId, providerId: gitHubProviderId },
    select: { accessToken: true },
  });
  return account?.accessToken ?? null;
};
