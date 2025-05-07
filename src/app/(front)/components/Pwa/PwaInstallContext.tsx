"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface PwaInstallContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isAlreadyInstalled: boolean;
  supportsBeforeInstallPrompt: boolean;
  isPwaInstallDismissed: boolean;
  setIsPwaInstallDismissed: (value: boolean) => void;
}

const PwaInstallContext = createContext<PwaInstallContextType | undefined>(
  undefined,
);

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  }
};

const verifyIfInstallDismissed = () => {
  const stored = localStorage.getItem("pwaInstallDismissed");
  return stored === "true";
};

const verifyIsAlreadyInstalled = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as any).standalone === true;

const verifIfSupportsInstallPrompt = () =>
  typeof window !== "undefined" && "BeforeInstallPromptEvent" in window;

export const PwaInstallProvider = ({ children }: { children: ReactNode }) => {
  const [supportsBeforeInstallPrompt, setSupportsBeforeInstallPrompt] =
    useState(false);
  const [isPwaInstallDismissed, setIsPwaInstallDismissed] = useState(true);
  const setIsPwaDismissedStorageAndState = (value: boolean) => {
    localStorage.setItem("pwaInstallDismissed", String(value));
    setIsPwaInstallDismissed(value);
  };
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    registerServiceWorker();

    setSupportsBeforeInstallPrompt(verifIfSupportsInstallPrompt());
    setIsAlreadyInstalled(verifyIsAlreadyInstalled());
    setIsPwaInstallDismissed(verifyIfInstallDismissed());

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  return (
    <PwaInstallContext.Provider
      value={{
        deferredPrompt,
        isAlreadyInstalled,
        isPwaInstallDismissed,
        setIsPwaInstallDismissed: setIsPwaDismissedStorageAndState,
        supportsBeforeInstallPrompt,
      }}
    >
      {children}
    </PwaInstallContext.Provider>
  );
};

export const usePwaInstallContext = () => {
  const ctx = useContext(PwaInstallContext);
  if (!ctx)
    throw new Error(
      "usePwaInstallContext must be used within a PwaInstallProvider",
    );
  return ctx;
};
