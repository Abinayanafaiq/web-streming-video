import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Client } from "pg";

const name = process.argv[2];
if (!name) {
  console.error("Usage: tsx prisma/apply-migration.ts <migration_name>");
  process.exit(1);
}

async function main() {
  const path = `prisma/migrations/${name}/migration.sql`;
  const sql = readFileSync(path, "utf8");
  const checksum = createHash("sha256").update(sql).digest("hex");

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query(
      `INSERT INTO "_prisma_migrations"
        (id, checksum, finished_at, migration_name, applied_steps_count)
       VALUES (gen_random_uuid()::text, $1, now(), $2, 1)
       ON CONFLICT DO NOTHING`,
      [checksum, name],
    );
    await client.query("COMMIT");
    console.log(`Migrasi '${name}' diterapkan.`);
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error("ERR:", e.message);
  process.exit(1);
});
