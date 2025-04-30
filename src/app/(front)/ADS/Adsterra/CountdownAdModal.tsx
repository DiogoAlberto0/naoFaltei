"use client";
import { CloseIcon } from "@/assets/icons/CloseIcon";
//heroui components
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import Script from "next/script";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useState,
} from "react";
import { AdBanner } from "./AdBanner";

const CloseButton = ({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  const [time, setTime] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevState) => {
        if (prevState <= 0) {
          clearInterval(interval);
          return 0;
        } else return prevState - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <button
      className={`
      ${className} 
      border-secondary-500 
      ${time < 4 && "border-r-2"} ${time < 3 && "border-b-2"} ${time < 2 && "border-l-2"} ${time < 1 && "border-t-2"}
      ${time > 0 ? "bg-default" : "bg-primary"}
      `}
      {...props}
      disabled={time > 0}
    >
      <CloseIcon />
    </button>
  );
};
export const CountdownAdModal = () => {
  const { isOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="full"
      closeButton={<CloseButton />}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody className="overflow-auto flex justify-center items-center">
              <Script
                async
                data-cfasync="false"
                src="//pl26519059.profitableratecpm.com/a5ebb9f612314b53a34a114942a1200e/invoke.js"
              />
              <div
                id="container-a5ebb9f612314b53a34a114942a1200e"
                className="flex"
              />

              <Script
                type="text/javascript"
                src="//pl26520367.profitableratecpm.com/44/af/eb/44afeb0e2b5b037db21ec387ac151363.js"
              />

              <div className="bg-red-500 flex justify-center items-center">
                <AdBanner />
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
