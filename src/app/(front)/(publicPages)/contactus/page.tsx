"use client";
import { EmailIcon } from "@/assets/icons/EmailIcon";
import { WhatsAppIcon } from "@/assets/icons/WhatsAppIcon";
import { phoneUtils } from "@/src/utils/phone";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Avatar,
  Spacer,
} from "@heroui/react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full bg-primary-600 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary-600/70 flex flex-col items-center justify-center gap-4 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Fale com a nossa equipe
          </h1>
          <p className="text-xl text-primary-200 max-w-2xl">
            Tem dúvidas, sugestões ou precisa de suporte? Estamos aqui para
            ajudar!
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Nossos canais de atendimento
            </h2>
            <p className="text-primary-500 text-lg">
              Escolha a forma mais conveniente para entrar em contato conosco.
            </p>
          </div>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <EmailIcon size={40} />
                <h3 className="text-xl font-semibold">E-mail</h3>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-primary-500">
                Nosso tempo médio de resposta é de 24 horas úteis.
              </p>
              <Spacer y={2} />
              <Button
                as="a"
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                variant="light"
                color="primary"
                fullWidth
                startContent={
                  <span className="i-heroicons-envelope-20-solid" />
                }
              >
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
              </Button>
            </CardBody>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <WhatsAppIcon size={40} />
                <h3 className="text-xl font-semibold">WhatsApp</h3>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-primary-500">
                Atendimento rápido pelo WhatsApp em horário comercial.
              </p>
              <Spacer y={2} />
              <Button
                as="a"
                href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_WHATS_APP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                color="success"
                variant="shadow"
                fullWidth
                startContent={
                  <span className="i-heroicons-chat-bubble-bottom-center-text-20-solid" />
                }
              >
                {phoneUtils.format(
                  `${process.env.NEXT_PUBLIC_CONTACT_WHATS_APP_NUMBER}`,
                )}
              </Button>
            </CardBody>
            <CardFooter>
              <p className="text-sm text-default-400">
                Segunda a Sexta: 9h às 18h | Sábado: 9h às 12h
              </p>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar
                  src="/icons/help-icon.svg"
                  alt="Ajuda"
                  className="bg-purple-100"
                />
                <h3 className="text-xl font-semibold">Central de Ajuda</h3>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-primary-500">
                Consulte nossa base de conhecimento com perguntas frequentes.
              </p>
              <Spacer y={2} />
              <Button
                as="a"
                href="/faq"
                variant="flat"
                color="secondary"
                fullWidth
                startContent={
                  <span className="i-heroicons-question-mark-circle-20-solid" />
                }
              >
                Acessar Central de Ajuda
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="sticky top-24 h-full">
          <CardHeader className="flex flex-col">
            <h2 className="text-2xl font-bold">Envie sua mensagem</h2>
            <p className="text-default-500">
              Preencha o formulário e entraremos em contato o mais breve
              possível.
            </p>
          </CardHeader>
          <Divider />
          <CardBody>
            <form
              className="h-full gap-6 flex flex-col justify-evenly"
              action={`https://formsubmit.co/${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
              method="POST"
            >
              <input
                type="hidden"
                name="_next"
                value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/contactSuccess`}
              />
              <Input
                name="name"
                label="Nome completo"
                labelPlacement="outside"
                placeholder="Seu nome"
                isRequired
                variant="bordered"
                size="lg"
                startContent={
                  <span className="i-heroicons-user-20-solid text-default-400" />
                }
              />

              <div className="flex max-sm:flex-col gap-6">
                <Input
                  name="email"
                  label="E-mail"
                  labelPlacement="outside"
                  type="email"
                  placeholder="seu@email.com"
                  isRequired
                  variant="bordered"
                  size="lg"
                  startContent={
                    <span className="i-heroicons-envelope-20-solid text-default-400" />
                  }
                />

                <Input
                  name="phone"
                  label="Telefone"
                  labelPlacement="outside"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  variant="bordered"
                  size="lg"
                  startContent={
                    <span className="i-heroicons-phone-20-solid text-default-400" />
                  }
                />
              </div>

              <Input
                name="_subject"
                label="Assunto"
                labelPlacement="outside"
                placeholder="Qual o assunto da sua mensagem?"
                isRequired
                variant="bordered"
                size="lg"
                startContent={
                  <span className="i-heroicons-tag-20-solid text-default-400" />
                }
              />

              <Textarea
                name="message"
                label="Mensagem"
                labelPlacement="outside"
                placeholder="Escreva sua mensagem aqui..."
                isRequired
                variant="bordered"
                size="lg"
                minRows={4}
                startContent={
                  <span className="i-heroicons-chat-bubble-bottom-center-text-20-solid text-default-400" />
                }
              />

              <Button
                type="submit"
                color="primary"
                variant="shadow"
                size="lg"
                fullWidth
                endContent={
                  <span className="i-heroicons-paper-airplane-20-solid" />
                }
              >
                Enviar Mensagem
              </Button>
            </form>
          </CardBody>
          <Divider />
          <CardFooter>
            <p className="text-sm text-default-500">
              Ao enviar este formulário, você concorda com nossa{" "}
              <Link href="/privacityPolitics" color="primary">
                Política de Privacidade
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-500 py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para simplificar seu controle de ponto?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              as="a"
              href="/signin"
              color="secondary"
              variant="shadow"
              size="lg"
              endContent={<span className="i-heroicons-arrow-right-20-solid" />}
            >
              Criar conta gratuita
            </Button>
            <Button
              as="a"
              href="/demonstracao"
              color="default"
              variant="ghost"
              size="lg"
              className="text-white"
              endContent={<span className="i-heroicons-play-circle-20-solid" />}
            >
              Ver demonstração
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
