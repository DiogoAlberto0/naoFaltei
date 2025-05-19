"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@heroui/react";

export default function ContactSuccessPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full bg-success-600 flex items-center justify-center">
        <div className="absolute inset-0 bg-success-600/70 flex flex-col items-center justify-center gap-4 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Mensagem enviada com sucesso!
          </h1>
          <p className="text-xl text-success-100 max-w-2xl">
            Recebemos seu contato e em breve nossa equipe responderá.
          </p>
        </div>
      </div>

      {/* Confirmation Card */}
      <section className="max-w-3xl mx-auto py-16 px-6 md:px-20">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">
              Obrigado por nos enviar uma mensagem!
            </h2>
            <p className="text-default-500">
              Agradecemos pelo seu interesse. Seu formulário foi recebido e
              responderemos o mais rápido possível.
            </p>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-primary-500 text-lg">
              Enquanto isso, sinta-se à vontade para explorar nossas soluções de{" "}
              <strong>ponto eletrônico</strong> ou acessar a central de ajuda
              com respostas para as dúvidas mais comuns.
            </p>
          </CardBody>
          <Divider />
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              as="a"
              href="/"
              variant="ghost"
              color="default"
              endContent={<span className="i-heroicons-home-20-solid" />}
            >
              Voltar para o início
            </Button>
            <Button
              as="a"
              href="/faq"
              color="primary"
              variant="shadow"
              endContent={
                <span className="i-heroicons-question-mark-circle-20-solid" />
              }
            >
              Ver Central de Ajuda
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
