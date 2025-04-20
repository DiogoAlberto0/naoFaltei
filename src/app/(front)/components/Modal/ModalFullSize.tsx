import { ReactNode } from "react";

//heroui components
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

export const ModalFullSize = ({
  title,
  children,
  openButton,
}: {
  title: string;
  openButton: (props: { onPress: () => void }) => ReactNode;
  children: ReactNode;
}) => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <>
      {openButton({ onPress: onOpen })}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody className="overflow-auto">{children}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
