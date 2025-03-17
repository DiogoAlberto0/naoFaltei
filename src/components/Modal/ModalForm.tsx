import {
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
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
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
  return (
    <Modal
      size="4xl"
      className={`max-h-[80vh] overflow-auto ${className}`}
      {...otherProps}
    >
      <Form onSubmit={handleSubmit}>
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
