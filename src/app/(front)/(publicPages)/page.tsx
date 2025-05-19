//next
import Image from "next/image";

//heroui
import { Button } from "@heroui/button";

//assets
import backgroundImage from "@/assets/workersBackground.jpg";

//icons
import { CheckCircleIcon } from "@/assets/icons/CheckCircleIcon";
import { redirect } from "next/navigation";
import { verifyIfUserIsWorker } from "../hooks/worker/verifyIfUserIsWorker";

const BenefitsList = () => {
  const benefits = [
    {
      text: "Cadastro rápido e sem burocracia",
      icon: <CheckCircleIcon className="h-6 w-6 text-primary-500" />,
    },
    {
      text: "Acesso em qualquer lugar pelo celular",
      icon: <CheckCircleIcon className="h-6 w-6 text-primary-500" />,
    },
    {
      text: "Relatórios claros e organizados",
      icon: <CheckCircleIcon className="h-6 w-6 text-primary-500" />,
    },
    {
      text: "Atualizações automáticas e gratuitas",
      icon: <CheckCircleIcon className="h-6 w-6 text-primary-500" />,
    },
    {
      text: "Suporte dedicado via e-mail",
      icon: <CheckCircleIcon className="h-6 w-6 text-primary-500" />,
    },
    {
      text: "Sem necessidade de instalação",
      icon: <CheckCircleIcon className="h-6 w-6 text-primary-500" />,
    },
  ];
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Benefícios de usar o Não Faltei
        </h2>
        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center text-lg text-gray-700">
              {benefit.icon}
              <span className="ml-3">{benefit.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const FeaturesList = () => {
  const features = [
    {
      text: "Geolocalização do funcionário",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    },
    {
      text: "Sem limites de funcionários",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    },
    {
      text: "Cálculo de banco de horas",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    },
    {
      text: "Atestados e faltas",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    },
    {
      text: "Status do funcionário em tempo real",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    },
    {
      text: "Sem limites de empresas",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    },
  ];
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Principais Funcionalidades
        </h2>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-lg text-gray-700">
              {feature.icon}
              <span className="ml-3">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const PresentationPage = async () => {
  const isWorker = await verifyIfUserIsWorker();
  if (isWorker === true) redirect("/worker");

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Hero section */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={backgroundImage}
          alt="Funcionários em ação"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center p-5">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Não Faltei
          </h1>
          <h2 className="text-lg md:text-2xl text-primary-500 font-semibold mb-6">
            Controle de ponto gratuito para pequenas empresas.
          </h2>
          <p className="text-base md:text-lg font-semibold mb-6">
            O Não Faltei é um sistema de ponto eletrônico online desenvolvido
            para pequenas empresas que buscam controle de presença eficiente e
            acessível. Com ele, é possível registrar e acompanhar os horários
            dos funcionários em tempo real, usando geolocalização, relatórios
            detalhados e funcionalidades gratuitas. Ideal para quem precisa de
            um sistema de ponto simples, moderno e sem complicações.
          </p>
          <Button
            as="a"
            href="/signin"
            color="primary"
            variant="shadow"
            size="lg"
          >
            Começar agora
          </Button>
        </div>
      </div>

      {/* Funcionalidades */}
      <div className="flex flex-col items-center gap-10 py-16 px-6 md:px-20">
        <div className="text-center max-w-2xl">
          <h3 className="text-3xl font-bold mb-4">
            Por que escolher o Não Faltei?
          </h3>
          <p className="text-secondary-500">
            Criado especialmente para pequenas empresas que precisam de uma
            solução completa, moderna e gratuita para gerenciar a frequência dos
            seus colaboradores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeaturesList />
          <div className="bg-gray-100 py-12 flex flex-col items-center text-center gap-6 px-6">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              Simples, Rápido e Eficiente
            </h3>
            <p className="text-secondary-500 max-w-2xl">
              O Não Faltei oferece uma interface intuitiva e ferramentas
              poderosas para facilitar o controle de ponto. É ideal para quem
              precisa de uma solução ágil e sem complicação, com total suporte
              ao gerenciamento remoto e flexível.
            </p>
            <Button
              as="a"
              color="primary"
              variant="shadow"
              size="lg"
              href="/aboutus"
            >
              Saiba mais
            </Button>
          </div>
          <BenefitsList />
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-primary-500 py-16 flex flex-col items-center text-center gap-6 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Comece a usar gratuitamente hoje mesmo!
        </h2>
        <Button
          as="a"
          color="secondary"
          variant="shadow"
          size="lg"
          href="/signin"
        >
          Criar minha conta gratuita
        </Button>
      </div>
    </div>
  );
};

export default PresentationPage;
