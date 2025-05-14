"use client";

import { Button } from "@heroui/button";

//printscreens
import { Chip, Link } from "@heroui/react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full">
        <div className="absolute inset-0 bg-primary-600/70 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Sobre o Não Faltei
          </h1>
        </div>
      </div>

      {/* About Section */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20 flex flex-col gap-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Nossa Missão</h2>
          <p className="text-primary-500 text-lg">
            O Não Faltei nasceu com o objetivo de simplificar o controle de
            ponto para pequenas empresas. Oferecemos uma solução moderna,
            acessível e intuitiva, permitindo que empregadores e funcionários
            gerenciem suas presenças com transparência e segurança.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Tecnologia e Acessibilidade
          </h2>
          <p className="text-primary-500 text-lg">
            Desenvolvido com tecnologias de ponta, o Não Faltei é acessível em
            qualquer dispositivo com acesso à internet. Nossa plataforma
            prioriza a experiência do usuário, garantindo facilidade de uso
            tanto para administradores quanto para colaboradores.
          </p>
        </div>
      </section>

      {/* Screens Section */}
      {/* FAQ Preview */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-20 text-center text-black">
          <Chip variant="flat" color="primary">
            Dúvidas Frequentes
          </Chip>
          <h2 className="text-3xl font-bold mt-4 mb-6">
            Precisa de ajuda rápida?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {[
              "Como cadastrar meus funcionários?",
              "Quais os requisitos para usar o aplicativo?",
              "Como faço para resetar minha senha?",
              "O sistema funciona offline?",
              "Posso usar em mais de uma empresa?",
              "Como funciona o cálculo de horas extras?",
            ].map((question, index) => (
              <Link
                key={index}
                href="/ajuda"
                color="primary"
                className="flex items-center gap-2 hover:text-primary-500 transition-colors"
              >
                <span className="i-heroicons-question-mark-circle-20-solid text-primary-500" />
                {question}
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="bg-primary-500 py-16 flex flex-col items-center text-center gap-6 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Quer conhecer mais? Crie sua conta gratuita agora!
        </h2>
        <Button
          as="a"
          color="secondary"
          variant="shadow"
          size="lg"
          href="/signin"
        >
          Começar agora
        </Button>
      </section>
    </div>
  );
}
