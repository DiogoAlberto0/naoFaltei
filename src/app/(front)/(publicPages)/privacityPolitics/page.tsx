export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-muted-foreground">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Política de Privacidade
        </h1>
        <p className="text-sm">Última atualização: 14 de maio de 2025</p>
      </div>

      {/* Introdução */}
      <p className="mb-8">
        A sua privacidade é importante para nós. Esta Política de Privacidade
        descreve como o aplicativo <strong>{'"Não Faltei"'}</strong> coleta, usa
        e protege suas informações pessoais.
      </p>

      {/* 1. Informações que coletamos */}
      <section className="space-y-4 mb-12">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">
            1. Informações que coletamos
          </h2>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Dados de geolocalização</strong>: coletados no momento do
            registro de ponto.
          </li>
          <li>
            <strong>Informações de dispositivo</strong>: modelo, sistema
            operacional, idioma e identificadores únicos.
          </li>
          <li>
            <strong>Dados de uso</strong>: interação com o app, horários e telas
            acessadas.
          </li>
          <li>
            <strong>Dados de autenticação</strong>: e-mail e nome para login.
          </li>
          <li>
            <strong>Endereço IP e cookies</strong>: usados para segurança,
            métricas e anúncios.
          </li>
        </ul>
      </section>

      {/* 2. Como usamos seus dados */}
      <section className="space-y-4 mb-12">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">2. Como usamos seus dados</h2>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li>Validar sua presença física.</li>
          <li>Gerar relatórios para gestores.</li>
          <li>Exibir anúncios personalizados (Google AdSense ou outro).</li>
          <li>Melhorar a experiência de uso.</li>
          <li>Atender obrigações legais e prevenir fraudes.</li>
        </ul>
      </section>

      {/* 3. Compartilhamento de dados */}
      <section className="space-y-4 mb-12">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">
            3. Compartilhamento de dados
          </h2>
        </div>
        <p>Seus dados não são vendidos. Compartilhamos apenas com:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Serviços de hospedagem e armazenamento (ex: Vercel, Neon).</li>
          <li>Provedores de anúncios (ex: Google Ads).</li>
          <li>Autoridades legais, quando exigido.</li>
        </ul>
      </section>

      {/* 4. Armazenamento e segurança */}
      <section className="space-y-4 mb-12">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">
            4. Armazenamento e segurança
          </h2>
        </div>
        <p>
          Seus dados são armazenados em servidores seguros e criptografados.
          Usamos HTTPS, autenticação segura e controle de acesso.
        </p>
      </section>

      {/* 5. Seus direitos */}
      <section className="space-y-4 mb-12">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">5. Seus direitos</h2>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li>Solicitar acesso ou exclusão dos seus dados.</li>
          <li>Revogar a permissão de localização a qualquer momento.</li>
          <li>
            Entrar em contato pelo e-mail{" "}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
              className="underline"
            >
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
            </a>
            .
          </li>
        </ul>
      </section>

      {/* 🍪 Política de Cookies */}
      <section className="space-y-4 mb-12 py-14" id="cookiesPolitics">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Política de Cookies
          </h2>
        </div>
        <p>
          O {'"Não Faltei"'} usa cookies e tecnologias similares para melhorar
          sua experiência e exibir anúncios relevantes.
        </p>
        <h3 className="font-semibold">O que são cookies?</h3>
        <p>
          Pequenos arquivos de texto que reconhecem suas preferências e
          comportamento de navegação.
        </p>
        <h3 className="font-semibold">Por que usamos cookies?</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Essenciais:</strong> manter login e funcionamento básico.
          </li>
          <li>
            <strong>Analíticos:</strong> entender o uso do app.
          </li>
          <li>
            <strong>Publicidade:</strong> mostrar anúncios relevantes.
          </li>
        </ul>
        <h3 className="font-semibold">Gerenciamento de cookies</h3>
        <p>
          Você pode bloquear ou apagar cookies nas configurações do seu
          navegador. Isso pode afetar o funcionamento do app.
        </p>
      </section>

      {/* 📘 Termos de Uso */}
      <section className="space-y-4 mb-12 py-14" id="termsOfUse">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Termos de Uso
          </h2>
        </div>
        <p>
          O uso do aplicativo {'"Não Faltei"'} está sujeito aos seguintes
          termos:
        </p>

        <h3 className="font-semibold">1. Sobre o serviço</h3>
        <p>
          Ferramenta gratuita de controle de ponto eletrônico com base em
          geolocalização e anúncios.
        </p>

        <h3 className="font-semibold">2. Elegibilidade</h3>
        <p>
          Uso permitido a maiores de 18 anos com internet e localização ativa.
        </p>

        <h3 className="font-semibold">3. Uso permitido</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Fornecer dados reais.</li>
          <li>Usar o app de forma legal e profissional.</li>
          <li>Permitir uso de localização no ponto.</li>
        </ul>

        <h3 className="font-semibold">4. Proibições</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Fraudar localização (ex: GPS spoofing).</li>
          <li>Fazer engenharia reversa.</li>
          <li>Compartilhar conta.</li>
        </ul>

        <h3 className="font-semibold">5. Modificações no serviço</h3>
        <p>
          Podemos alterar ou encerrar o serviço a qualquer momento, com ou sem
          aviso.
        </p>

        <h3 className="font-semibold">6. Limitação de responsabilidade</h3>
        <p>
          Fornecemos o app {'"como está"'}, sem garantias. Não nos
          responsabilizamos por falhas técnicas ou perda de dados.
        </p>

        <h3 className="font-semibold">7. Contato</h3>
        <p>
          Em caso de dúvidas, escreva para{" "}
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
            className="underline"
          >
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>

      <div className="text-center text-sm text-muted-foreground mt-12">
        © 2025 Não Faltei. Todos os direitos reservados.
      </div>
    </div>
  );
}
