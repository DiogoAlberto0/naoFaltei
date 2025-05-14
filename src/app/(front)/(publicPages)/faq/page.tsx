import {
  Button,
  Link,
  Chip,
  Spacer,
  Accordion,
  AccordionItem,
} from "@heroui/react";

export default function FAQSection() {
  const faqItems = [
    {
      id: "cadastro-funcionarios",
      question: "Como cadastrar meus funcionários?",
      answer: (
        <>
          <p>Para cadastrar seus funcionários:</p>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>Acesse a seção "Funcionários" no menu principal</li>
            <li>Clique em "Adicionar Funcionário"</li>
            <li>Preencha os dados básicos (nome, e-mail, CPF)</li>
            <li>Defina a escala de trabalho do colaborador</li>
            <li>Clique em "Salvar" para finalizar o cadastro</li>
          </ol>
          <Spacer y={4} />
          <p>
            <strong>Dica:</strong> Você pode importar uma planilha com vários
            funcionários de uma só vez usando nossa ferramenta de importação.
          </p>
        </>
      ),
    },
    {
      id: "requisitos-sistema",
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
            ser adicionado à tela inicial como um PWA (Progressive Web App).
          </p>
        </>
      ),
    },
    {
      id: "resetar-senha",
      question: "Como faço para resetar minha senha?",
      answer: (
        <>
          <p>Siga estes passos para resetar sua senha:</p>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>Na página de login, clique em "Esqueci minha senha"</li>
            <li>Informe o e-mail cadastrado na sua conta</li>
            <li>Acesse seu e-mail e clique no link de redefinição</li>
            <li>Crie uma nova senha segura</li>
            <li>Confirme a nova senha</li>
          </ol>
          <Spacer y={4} />
          <p className="text-warning-500">
            <strong>Atenção:</strong> O link de redefinição expira em 24 horas
            por questões de segurança.
          </p>
        </>
      ),
    },
    {
      id: "funcionamento-offline",
      question: "O sistema funciona offline?",
      answer: (
        <>
          <p>Sim, parcialmente. O Não Faltei possui funcionalidades offline:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              Registro de ponto (os dados são sincronizados quando a conexão
              voltar)
            </li>
            <li>Consulta de escalas e horários</li>
            <li>Visualização de registros recentes</li>
          </ul>
          <Spacer y={4} />
          <p>
            <strong>Limitações offline:</strong> Algumas funcionalidades como
            relatórios completos e atualização de cadastros requerem conexão com
            a internet.
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
            <strong>Como adicionar:</strong> No menu principal, acesse "Minhas
            Empresas" → "Adicionar Empresa".
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
            <li>Registros de ponto (entrada e saída)</li>
            <li>Banco de horas acumulado</li>
          </ul>
          <Spacer y={4} />
          <p>
            <strong>Personalização:</strong> Você pode configurar regras
            específicas para:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Chip color="primary" variant="flat">
              Horas diárias
            </Chip>
            <Chip color="primary" variant="flat">
              Horas semanais
            </Chip>
            <Chip color="primary" variant="flat">
              Adicionais noturnos
            </Chip>
            <Chip color="primary" variant="flat">
              Feriados
            </Chip>
          </div>
        </>
      ),
    },
  ];

  return (
    <section id="faq" className="py-16 bg-gray-50">
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
                <div className="px-4 pb-4 text-default-600">
                  {item.answer}
                  <Spacer y={4} />
                  <div className="flex justify-end">
                    <Link
                      href={`#${item.id}`}
                      color="primary"
                      size="sm"
                      showAnchorIcon
                    >
                      Link direto para esta pergunta
                    </Link>
                  </div>
                </div>
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
            href="/contato"
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
