"use client";

import { useEffect } from "react";
import { Button, Card } from "@heroui/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; action?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log de erros ou outras ações
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-6 max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-500">{error.message}</h1>
        <p className="mt-4 text-gray-700">{error.action}</p>
        <Button className="mt-6" color="primary" onPress={reset}>
          Tentar novamente
        </Button>
      </Card>
    </div>
  );
}
