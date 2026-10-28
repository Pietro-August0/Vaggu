import { Link } from "react-router-dom"
import { Brand } from "@/components/brand"

const contato = "elisagommes@outlook.com"
const linkClass = "text-yellow-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300"

/** Aviso público e instruções de direitos, sem exigir autenticação ou abrir conversa no bot. */
export function PrivacidadePage({ exclusao = false }: { exclusao?: boolean }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-6 px-6 py-8">
        <Brand inverted />
        <Link className={linkClass} to="/">Voltar ao início</Link>
      </header>
      <main id="conteudo" className="mx-auto max-w-4xl px-6 pb-16">
        <p className="mb-3 text-sm text-yellow-300">VAGGU · Atualizado em 28/10/2026</p>
        <h1 className="mb-8 text-3xl font-semibold tracking-tight sm:text-5xl">{exclusao ? "Exclusão de dados" : "Política de Privacidade"}</h1>
        <div className="space-y-8 text-base leading-7 text-neutral-300 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_p+p]:mt-3">
          <section aria-labelledby="responsavel">
            <h2 id="responsavel">Responsável e contato</h2>
            <p>A VAGGU é um projeto acadêmico de gestão de estacionamentos de shoppings. A responsável informada pelo projeto para este aviso e para solicitações sobre dados pessoais é Elisa Gomes Teixeira.</p>
            <p>Entre em contato por <a className={linkClass} href={`mailto:${contato}`}>{contato}</a>. Você não precisa ter conta na VAGGU ou conversar com o bot para fazer uma solicitação.</p>
          </section>
          {exclusao ? <>
            <section aria-labelledby="solicitar">
              <h2 id="solicitar">Como solicitar a exclusão</h2>
              <ol className="list-decimal space-y-3 pl-6">
                <li>Envie um e-mail ao contato acima com o assunto “Exclusão de dados — VAGGU”.</li>
                <li>Informe se o pedido se refere ao site, ao atendimento no WhatsApp ou a ambos. Indique o e-mail da conta ou número usado na conversa, apenas quando necessário para localizar os dados.</li>
                <li>Descreva o que deseja excluir. Não envie senhas, chaves de equipamentos ou documentos de identidade na solicitação inicial.</li>
              </ol>
              <p>A equipe analisará o pedido e poderá solicitar uma confirmação proporcional de identidade para evitar excluir dados de outra pessoa. A resposta informará a providência adotada ou os motivos que impeçam a exclusão, inclusive eventual obrigação de conservação. O envio do e-mail não executa exclusão automática.</p>
            </section>
            <section aria-labelledby="alcance">
              <h2 id="alcance">Alcance do pedido</h2>
              <p>A análise abrange os dados sob responsabilidade da VAGGU. Dados operacionais e históricos que precisem ser preservados serão avaliados separadamente dos dados pessoais identificáveis. A exclusão na VAGGU não apaga automaticamente cópias ou registros mantidos pela Meta, pelo WhatsApp ou pelo próprio participante; pedidos a esses serviços seguem os canais deles.</p>
              <p>O pedido é gratuito. A equipe responderá pelo contato informado, observando os prazos aplicáveis e explicando qualquer necessidade de complementação.</p>
            </section>
          </> : <>
            <section aria-labelledby="dados">
              <h2 id="dados">Quais dados são tratados e para quê</h2>
              <p>No atendimento pelo WhatsApp, recebemos o número do remetente, identificador, tipo e conteúdo da mensagem para interpretar a solicitação e responder ao menu. O registro técnico do bot no banco da VAGGU guarda identificador da mensagem, tipo, estado de processamento, tentativas, datas e eventual código de erro; não constitui um arquivo completo das conversas.</p>
              <p>Informações enviadas voluntariamente durante o atendimento, como nome, shopping e cidade, podem ser utilizadas para esclarecer dúvidas, organizar uma demonstração ou prestar suporte. Evite enviar dados sensíveis, senhas e chaves de equipamentos.</p>
              <p>Nas áreas autenticadas, tratamos dados de identificação e acesso dos usuários, vínculo com o shopping, sessão e registros operacionais para permitir a gestão e proteger o isolamento entre unidades. A navegação também envolve dados técnicos processados pela infraestrutura, como endereço de rede e registros de acesso.</p>
            </section>
            <section aria-labelledby="fornecedores">
              <h2 id="fornecedores">Serviços envolvidos</h2>
              <p>O atendimento utiliza a Plataforma do WhatsApp Business da Meta; a aplicação é hospedada no Render e utiliza PostgreSQL no Neon. Esses serviços participam do processamento conforme sua função e podem utilizar infraestrutura fora do Brasil. O tratamento realizado por cada fornecedor também está sujeito aos seus próprios termos e avisos.</p>
            </section>
            <section aria-labelledby="sessao">
              <h2 id="sessao">Sessão e segurança</h2>
              <p>A aplicação utiliza cookie de sessão para manter o acesso autenticado e armazenamento do navegador para preferências da interface. Controles de acesso e validação de origem das mensagens ajudam a proteger o sistema. Não informe credenciais pelo WhatsApp nem por pedidos de privacidade.</p>
            </section>
            <section aria-labelledby="conservacao">
              <h2 id="conservacao">Conservação e direitos</h2>
              <p>Os dados são utilizados conforme a finalidade do atendimento ou da operação. Este aviso não estabelece eliminação automática em prazo fixo: a necessidade de conservação, obrigações aplicáveis e pedidos de exclusão são analisados pela responsável.</p>
              <p>Você pode solicitar confirmação de tratamento, acesso, correção, informações sobre compartilhamento e, quando aplicável, anonimização, bloqueio, eliminação ou revogação de consentimento. Os pedidos são avaliados de acordo com a situação e a legislação aplicável, sem custo ao titular.</p>
              <p>Veja <Link className={linkClass} to="/exclusao-de-dados">como solicitar exclusão de dados</Link>. Para informações gerais sobre direitos, consulte a <a className={linkClass} href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares" target="_blank" rel="noreferrer">orientação da ANPD (abre em nova aba)</a>.</p>
            </section>
          </>}
          <nav aria-label="Informações sobre dados pessoais" className="border-t border-white/15 pt-6">
            <Link className={linkClass} to={exclusao ? "/privacidade" : "/exclusao-de-dados"}>{exclusao ? "Ler a Política de Privacidade" : "Instruções de exclusão de dados"}</Link>
          </nav>
        </div>
      </main>
    </div>
  )
}
