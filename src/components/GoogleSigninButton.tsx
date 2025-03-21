import { signIn } from "@/auth";

import FcGoogle from "@/assets/googleIcon.svg"; // Importa o ícone do Google de react-icons
import Image from "next/image";
const GoogleSigninButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg transition-all bg-white text-gray-700 font-medium text-sm">
        <Image
          src={FcGoogle.src}
          className="w-5 h-5 mr-3"
          width={5}
          height={5}
          alt="Google icons"
        />{" "}
        {/* Logo do Google */}
        Sign in with Google
      </button>
    </form>
  );
};

export { GoogleSigninButton };
