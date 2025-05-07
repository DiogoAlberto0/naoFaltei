"use client";

import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useEffect } from "react";
import { usePwaInstallContext } from "./PwaInstallContext";

export const InstallModal = () => {
  const {
    deferredPrompt,
    setIsPwaInstallDismissed,
    isAlreadyInstalled,
    isPwaInstallDismissed,
    supportsBeforeInstallPrompt,
  } = usePwaInstallContext();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (deferredPrompt) {
      onOpen();
    }
  }, [deferredPrompt, onOpen]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    const result = await deferredPrompt.prompt();
    const { outcome } = result;

    if (outcome === "accepted") {
      addToast({
        color: "success",
        title: "Aplicativo instalado com sucesso",
        description: "Verifique no seu menu de aplicativos.",
      });
    } else {
      addToast({
        color: "danger",
        title: "Instalação recusada",
        description: "Recarregue a página ou instale manualmente.",
      });
    }

    setIsPwaInstallDismissed(true);
    onClose();
  };

  if (
    !isAlreadyInstalled &&
    !isPwaInstallDismissed &&
    supportsBeforeInstallPrompt
  )
    return (
      <Modal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Instale nosso aplicativo!</ModalHeader>
              <ModalBody>
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>
                    Para uma melhor experiência, instale o aplicativo no seu
                    dispositivo.
                  </li>
                  <li>
                    Você poderá instalar em outro momento clicando no menu
                  </li>
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={handleInstall}>
                  Instalar
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setIsPwaInstallDismissed(true);
                    onClose();
                  }}
                >
                  Não quero
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );

  return null;
};
