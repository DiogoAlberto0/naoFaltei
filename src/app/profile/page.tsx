import { auth } from "@/auth";

import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) return <h1>Usuário não autenticado</h1>;

  return (
    <div>
      <Image
        width={64}
        height={64}
        src={`${session.user.image}`}
        alt="profile image"
      />
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
    </div>
  );
}
