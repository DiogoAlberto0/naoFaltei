import { auth } from "@/auth";

export default async function Profile() {
  const profile = await auth();
  return <pre>{JSON.stringify(profile, null, 2)}</pre>;
}
