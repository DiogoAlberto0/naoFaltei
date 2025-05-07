import { Alert, Button } from "@heroui/react";
import { usePwaInstallContext } from "./PwaInstallContext";

export const ManualInstallNotice = () => {
  const {
    setIsPwaInstallDismissed,
    isAlreadyInstalled,
    isPwaInstallDismissed,
    supportsBeforeInstallPrompt,
  } = usePwaInstallContext();

  if (
    !supportsBeforeInstallPrompt &&
    !isPwaInstallDismissed &&
    !isAlreadyInstalled
  )
    return (
      <Alert
        color="warning"
        className="absolute top-0 left-0 z-50"
        title="Instale nosso app:"
        description="Parece que seu navegador não suporta instalação automática. Para
        instalar manualmente:"
        endContent={
          <Button
            color="warning"
            size="sm"
            variant="flat"
            className="min-w-min"
            onPress={() => setIsPwaInstallDismissed(true)}
          >
            Não quero instalar
          </Button>
        }
      >
        <ul className="list-disc list-inside mt-2 text-sm">
          <li>
            No Android: abra o menu do navegador (⋮) e toque em &#34;Adicionar à
            tela inicial&#34;.
          </li>
          <li>
            No iOS (Safari): toque no botão <strong>Compartilhar</strong> e
            depois em &#34;Adicionar à tela de início&#34;.
          </li>
          <li>
            Caso não veja essas opções, tente acessar o app pelo{" "}
            <strong>Google Chrome</strong> para ter suporte à instalação.
          </li>
        </ul>
      </Alert>
    );

  return null;
};
