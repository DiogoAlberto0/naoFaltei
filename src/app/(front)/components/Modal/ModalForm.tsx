import { FetchError, InputError } from "@/src/Errors/errors";
import {
  addToast,
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  useDisclosure,
} from "@heroui/react";
import { FormEvent, ReactNode, useState } from "react";

export interface IModalFormProps extends ModalProps {
  handleSubmit: (formData: FormData) => Promise<void>;
  submitButtonText: string;
  isLoading?: boolean;
  openButton: (props: { onPress: () => void }) => ReactNode;
}

export const ModalForm = ({
  title,
  submitButtonText,
  children,
  handleSubmit,
  openButton,
  ...otherProps
}: IModalFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSumit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const form = e.currentTarget;
      const formData = new FormData(form);
      await handleSubmit(formData);
      form.reset(); // só acontece se não der erro
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
  return (
    <>
      {openButton({ onPress: onOpen })}
      <Modal
        size="4xl"
        scrollBehavior="outside"
        {...otherProps}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Form onSubmit={onSumit}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {title}
                </ModalHeader>
                <ModalBody>{children}</ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit" isLoading={isLoading}>
                    {submitButtonText}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </Modal>
    </>
  );
};
