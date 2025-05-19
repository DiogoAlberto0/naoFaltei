"use client";
import { Button, Chip, Spacer, Accordion, AccordionItem } from "@heroui/react";

export default function FAQSection() {
  const faqItems = [
    {
      id: "managerSignin",
      question: "Como posso me cadastrar como gerente?",
      answer: (
        <>
          <p>Para se cadastrar na nossa plataforma:</p>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>
              Aperte o botão &quot;
              <strong className="text-primary">Entrar</strong>&quot; no menu
              principal
            </li>
            <li>
              Clique no botão&quot;Login com o{" "}
              <span className="text-blue-500">G</span>
              <span className="text-red-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>&quot;
            </li>
            <li>Você sera refirecionado para a página do google</li>
            <li>Siga os passos indicados por ele</li>
            <li>Pronto, você já estará no painel do gerente</li>
          </ol>
        </>
      ),
    },
    {
      id: "registerEstablishment",
      question: "Como cadastrar meus estabelecimento?",
      answer: (
        <>
          <p>Para cadastrar seus estabelecimentos:</p>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>
              Acesse o menu localizado na lateral caso esteja no{" "}
              <strong>Computador</strong> ou inferior caso esteja no{" "}
              <strong>Celular</strong>
            </li>
            <li>
              Clique em &quot;
              <strong className="text-success">
                Adicionar Estabelecimento
              </strong>
              &quot;
            </li>
            <li>Preencha todos os dados (nome, e-mail, telefone, cep ...)</li>
            <li>
              Clique em &quot; <strong className="text-success">Salvar</strong>
              &quot; para finalizar o cadastro
            </li>
          </ol>
          <Spacer y={4} />
          <p>
            <strong>Dica:</strong> Você não tem limites de estabelecimentos,
            pode cadastrar quantos quiser.
          </p>
        </>
      ),
    },
    {
      id: "registerWorker",
      question: "Como cadastrar meus funcionários?",
      answer: (
        <>
          <p>Para cadastrar seus funcionários:</p>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>
              Acesse o menu localizado na lateral caso esteja no{" "}
              <strong>Computador</strong> ou inferior caso esteja no{" "}
              <strong>Celular</strong>
            </li>
            <li>
              Clique no estabelecimento que deseja cadastrar o funcionário
            </li>
            <li>
              Role a tela até encontrar uma tabela com o título de
              &quot;Funcionários&quot;
            </li>
            <li>
              Clique no botão com o simbolo de &quot;
              <strong className="text-success">+</strong>&quot;
            </li>
            <li>Preencha o formulário com todos os dados do seu funcionário</li>
            <li>
              Clique em &quot;<strong className="text-success">Salvar</strong>
              &quot;
            </li>
          </ol>
          <Spacer y={4} />
          <p>
            <strong>Dica:</strong> Seu funcionário poderá trocar o login e a
            senha posteriormente
          </p>
        </>
      ),
    },
    {
      id: "systemRequirements",
      question: "Quais os requisitos para usar o aplicativo?",
      answer: (
        <>
          <p>O Não Faltei funciona em qualquer dispositivo com:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Navegador moderno (Chrome, Firefox, Safari, Edge)</li>
            <li>Conexão com internet (para sincronização dos dados)</li>
            <li>GPS habilitado (para registro de ponto com geolocalização)</li>
          </ul>
          <Spacer y={4} />
          <p>
            <strong>Versão mobile:</strong> Nosso sistema é responsivo e pode
            ser adicionado à tela inicial do seu smartphone como um Aplicativo.
          </p>
        </>
      ),
    },
    {
      id: "resetPassword",
      question: "Como faço para resetar minha senha?",
      answer: (
        <>
          <p>Siga estes passos para resetar sua senha:</p>
          <p className="text-warning-500">
            <strong>Atenção:</strong> Todo o nosso sistema de autenticação de
            gestor, é feito pelo google, então escolha um email do seu uso, e
            cadastre todas as opções de recuperação de senha do google, como
            telefone, e-mail secundário e etc. Caso você esqueça a senha do seu
            email do google o processo de alteração deverá ser feito por lá.
          </p>
        </>
      ),
    },
    {
      id: "offlineUse",
      question: "O sistema funciona offline?",
      answer: (
        <>
          <p>
            Ainda não funciona offline, mas estamos trabalhando nisso para
            oferecer a melhor experiência para nossos usuários...
          </p>
        </>
      ),
    },
    {
      id: "multiempresas",
      question: "Posso usar em mais de uma empresa?",
      answer: (
        <>
          <p>Sim! O Não Faltei permite que você gerencie múltiplas empresas:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Cada empresa tem seu cadastro independente</li>
            <li>Você pode alternar entre empresas com um clique</li>
            <li>Relatórios são gerados separadamente para cada empresa</li>
          </ul>
          <Spacer y={4} />
          <p>
            <strong>Como adicionar:</strong> No menu principal, clique em →
            &quot;<strong className="text-success">Adicionar Empresa</strong>
            &quot;.
          </p>
        </>
      ),
    },
    {
      id: "calculo-horas-extras",
      question: "Como funciona o cálculo de horas extras?",
      answer: (
        <>
          <p>
            Nosso sistema calcula automaticamente as horas extras com base em:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Jornada de trabalho configurada para cada funcionário</li>
            <li>
              Você configura o horário de entrada e saída do funcionário para
              cada dia da semana e com base nisso o sistema calcula
            </li>
            <li>
              Você pode adicionar um período em que o funcionário esteve de
              atestado, esses dias não entrarão no calculo de banco de horas
            </li>
            <li>Registros de ponto (entrada e saída)</li>
            <li>Banco de horas acumulado</li>
          </ul>
          <Spacer y={4} />
          <p>
            <strong>Personalização:</strong> Você pode configurar regras
            específicas para:
          </p>
        </>
      ),
    },
  ];

  return (
    <section id="faq" className="py-16 ">
      <div className="max-w-4xl mx-auto px-6 md:px-20">
        <div className="text-center mb-12">
          <Chip color="primary" variant="shadow" size="lg">
            FAQ
          </Chip>
          <h2 className="text-3xl font-bold mt-4 mb-4">Perguntas Frequentes</h2>
          <p className="text-primary-500 max-w-2xl mx-auto">
            Encontre respostas rápidas para as dúvidas mais comuns sobre o Não
            Faltei.
          </p>
        </div>

        <div className="space-y-4">
          <Accordion variant="splitted" selectionMode="multiple">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                id={item.id}
                aria-label={item.question}
                title={item.question}
                className="group"
                startContent={
                  <span className="i-heroicons-question-mark-circle-20-solid text-primary-500 group-data-[open=true]:hidden" />
                }
              >
                <div className="px-4 pb-4 text-default-600">{item.answer}</div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-default-500 mb-6">
            Não encontrou o que procurava?
          </p>
          <Button
            as="a"
            href="/contactus"
            color="primary"
            variant="shadow"
            size="lg"
            endContent={<span className="i-heroicons-arrow-right-20-solid" />}
          >
            Fale conosco
          </Button>
        </div>
      </div>
    </section>
  );
}
