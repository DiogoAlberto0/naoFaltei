"use client";
import { useEffect, useState } from "react";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useCookiesConsent } from "../../../hooks/cookies";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const CookieConsentModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [hasConsent, setHasConsent] = useState(false);
  const { getConsent, setDenied, setGranted } = useCookiesConsent();

  useEffect(() => {
    const consent = getConsent();
    if (!consent) {
      onOpen();
    } else {
      setHasConsent(true);
    }
  }, [onOpen, getConsent]);

  const handleAccept = () => {
    setGranted();
    if (window.gtag)
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    setHasConsent(true);
    onClose();
  };

  const handleReject = () => {
    setDenied();
    setHasConsent(true);
    onClose();
  };

  if (hasConsent) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      className="z-10"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Queremos usar cookies 🍪</ModalHeader>
            <ModalBody className="text-sm space-y-2">
              <p>
                Usamos cookies para melhorar sua experiência, analisar dados e
                exibir anúncios relevantes.
              </p>
              <p>
                Ao aceitar, você nos ajuda a continuar oferecendo uma plataforma
                gratuita e de qualidade.
              </p>
              <p className="font-semibold text-green-700">
                Recomendamos aceitar para uma navegação mais personalizada e
                completa!
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={handleAccept}>
                Aceitar e continuar
              </Button>
              <Button
                variant="light"
                className="opacity-50 hover:opacity-70 transition-opacity"
                onPress={handleReject}
              >
                Rejeitar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
