import { prisma } from "@/../prisma/prisma";

export async function GET() {
  const [{ max_connections }] = await prisma.$queryRaw<
    { max_connections: string }[]
  >`
    SELECT 
      setting AS max_connections
      FROM pg_settings
      WHERE name = 'max_connections';
  `;

  const [{ active_connections }] = await prisma.$queryRaw<
    { active_connections: string }[]
  >`
    SELECT
      COUNT(*)::TEXT AS active_connections
      FROM pg_stat_activity
      ;
  `;

  const [{ postgres_version }] = await prisma.$queryRaw<
    { postgres_version: string }[]
  >`
    SELECT split_part(version(), ' ', 2) AS postgres_version;
  `;

  return Response.json({
    status: {
      services: {
        postgres: {
          max_connections,
          active_connections,
          version: postgres_version,
        },
      },
    },
  });
}
