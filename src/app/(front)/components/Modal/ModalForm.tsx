import {
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
import { FormEvent, ReactNode } from "react";

export interface IModalFormProps extends ModalProps {
  handlleSubmit: (formData: FormData) => Promise<boolean>;
  submitButtonText: string;
  isLoading?: boolean;
  openButton: (props: { onPress: () => void }) => ReactNode;
}

export const ModalForm = ({
  title,
  submitButtonText,
  isLoading = false,
  children,
  handlleSubmit,
  openButton,
  ...otherProps
}: IModalFormProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const success = await handlleSubmit(formData);
      if (success) form.reset(); // só acontece se não der erro
    } catch (error) {
      // opcional: log, toast, etc.
      console.error("Erro ao enviar formulário:", error);
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
        <Form onSubmit={handleSubmit}>
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
