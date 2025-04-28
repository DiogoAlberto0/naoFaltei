"use client";

import Image from "next/image";
import { Button } from "@heroui/button";

//printscreens
import workerHomePage from "@/assets/screens/workerHomePage.png";
import workersTable from "@/assets/screens/workersTable.png";
import lastRegistersTable from "@/assets/screens/lastRegitersTable.png";
import workerSchedule from "@/assets/screens/workerSchedule.png";
import timeSheetTable from "@/assets/screens/timeSheetTable.png";

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
      <section className="bg-gray-50 py-16 flex flex-col gap-16">
        <div className="max-w-7xl mx-auto px-6 md:px-20 flex flex-col gap-24">
          {/* Tela Principal do Funcionário */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={workerHomePage}
                alt="Tela Principal do Funcionário"
                className="rounded-2xl border border-gray-200 w-64 md:w-80"
              />
            </div>
            <div className="text-center md:text-left flex flex-col gap-4 md:w-1/2">
              <h3 className="text-2xl font-bold text-default-100">
                Tela Principal do Funcionário
              </h3>
              <p className="text-primary-500 text-lg">
                Página inicial otimizada para dispositivos móveis, exibindo
                localização no mapa, distância até o estabelecimento, registros
                recentes e botão de novo ponto.
              </p>
            </div>
          </div>

          {/* Tabela de Funcionários com Status */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={workersTable}
                alt="Tabela de Funcionários com Status"
                className="rounded-2xl border border-gray-200 w-64 md:w-80"
              />
            </div>
            <div className="text-center md:text-right flex flex-col gap-4 md:w-1/2">
              <h3 className="text-2xl font-bold text-default-100">
                Tabela de Funcionários
              </h3>
              <p className="text-primary-500 text-lg">
                Visualize todos os funcionários com seus status em tempo real:
                ativo, ausente ou fora da área. Gerencie e acompanhe a presença
                da equipe de forma centralizada.
              </p>
            </div>
          </div>

          {/* Últimos Registros do Estabelecimento */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={lastRegistersTable}
                alt="Últimos Registros do Estabelecimento"
                className="rounded-2xl border border-gray-200 w-64 md:w-80"
              />
            </div>
            <div className="text-center md:text-left flex flex-col gap-4 md:w-1/2">
              <h3 className="text-2xl font-bold text-default-100">
                Últimos Registros
              </h3>
              <p className="text-primary-500 text-lg">
                Acompanhe as últimas entradas e saídas feitas no
                estabelecimento, com informações detalhadas como tipo de
                registro, funcionário e horário.
              </p>
            </div>
          </div>

          {/* Tabela de Escala do Funcionário */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={workerSchedule}
                alt="Tabela de Escala do Funcionário"
                className="rounded-2xl border border-gray-200 w-64 md:w-80"
              />
            </div>
            <div className="text-center md:text-right flex flex-col gap-4 md:w-1/2">
              <h3 className="text-2xl font-bold text-default-100">
                Escala de Trabalho
              </h3>
              <p className="text-primary-500 text-lg">
                Consulte a escala semanal do colaborador, com horários de
                entrada, saída e tempo de descanso por dia da semana, tudo de
                forma organizada e fácil de editar.
              </p>
            </div>
          </div>

          {/* Tabela de Registros por Período */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={timeSheetTable}
                alt="Tabela de Registros por Período"
                className="rounded-2xl border border-gray-200 w-64 md:w-80"
              />
            </div>
            <div className="text-center md:text-left flex flex-col gap-4 md:w-1/2">
              <h3 className="text-2xl font-bold text-default-100">
                Registros por Período
              </h3>
              <p className="text-primary-500 text-lg">
                Analise os registros detalhados do funcionário em um intervalo
                específico, com total de faltas, atestados e banco de horas
                acumulado.
              </p>
            </div>
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
