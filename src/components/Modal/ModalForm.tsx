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
} from "@heroui/react";
import { FormEvent } from "react";

export interface IModalFormProps extends ModalProps {
  handleSubmit: (formData: FormData) => Promise<void>;
  submitButtonText: string;
}
export const ModalForm = ({
  className,
  handleSubmit,
  title,
  submitButtonText,
  children,
  ...otherProps
}: IModalFormProps) => {
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await handleSubmit(formData);

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
    <Modal
      size="4xl"
      className={`max-h-[80vh] overflow-auto ${className}`}
      {...otherProps}
    >
      <Form onSubmit={onSubmit}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
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
  );
};
