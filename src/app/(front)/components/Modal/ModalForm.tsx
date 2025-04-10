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
import { FormEvent, ReactNode } from "react";

export interface IModalFormProps extends ModalProps {
  handleSubmit?: (formData: FormData) => Promise<void>;
  action?: (formData: FormData) => void;
  submitButtonText: string;
  openButton: (props: { onPress: () => void }) => ReactNode;
}
export const ModalForm = ({
  handleSubmit,
  action,
  title,
  submitButtonText,
  children,
  openButton,
  ...otherProps
}: IModalFormProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (handleSubmit) await handleSubmit(formData);

      form.reset();
    } catch (error: any) {
      if (error instanceof InputError || error instanceof FetchError) {
        addToast({
          color: "danger",
          title: error.message,
          description: error.action,
        });
      } else throw error;
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
      >
        <Form onSubmit={handleSubmit && onSubmit} action={action}>
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
                  <Button color="primary" type="submit">
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
