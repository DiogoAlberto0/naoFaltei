import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export const ComponentError = ({
  message,
  action,
}: {
  message?: string;
  action?: string;
}) => {
  const router = useRouter();
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-4 text-center bg-red-50 rounded-xl border border-red-300 shadow-sm">
      <h1 className="text-xl font-semibold text-red-600">
        Erro ao carregar últimos registros
      </h1>
      {message && <p className="text-red-500 mt-2">{message}</p>}
      {action && <p className="text-red-500 mt-2">{action}</p>}
      <Button
        className="mt-4"
        color="danger"
        variant="ghost"
        onPress={() => router.refresh()}
      >
        Tentar novamente
      </Button>
    </div>
  );
};
