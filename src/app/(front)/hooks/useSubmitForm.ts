import { FetchError, InputError } from "@/src/Errors/errors";
import { addToast } from "@heroui/toast";
import { useState, FormEvent } from "react";

export const useSubmitForm = (
  handleSubmit: (formData: FormData) => Promise<void>,
  onUpdate?: () => void,
) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSumit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const form = e.currentTarget;
      const formData = new FormData(form);
      await handleSubmit(formData);
      if (onUpdate) onUpdate();
      form.reset(); // só acontece se não der erro`
    } catch (error: any) {
      // opcional: log, toast, etc.
      if (error instanceof FetchError || error instanceof InputError) {
        addToast({
          color: "danger",
          title: error.message,
          description: error.action,
        });
      } else {
        console.error("Erro ao enviar formulário:", error);
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onSumit,
  };
};
