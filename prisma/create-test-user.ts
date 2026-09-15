import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = "rahasia123";
  const passwordHash = await bcrypt.hash(password, 12);
  const passwordPlain = Buffer.from(password, "utf8").toString("base64");

  const user = await prisma.user.upsert({
    where: { email: "tester.qa@example.com" },
    update: { passwordHash, passwordPlain },
    create: {
      email: "tester.qa@example.com",
      name: "Tester Qa",
      passwordHash,
      passwordPlain,
    },
  });

  console.log("User dibuat:", user.email);
  console.log("passwordPlain (base64):", user.passwordPlain);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
