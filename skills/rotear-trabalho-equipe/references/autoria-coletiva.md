# Autoria coletiva em uma única máquina

Use autoria coletiva quando a equipe confirmar que as decisões, o prompt ou a implementação foram produzidos em conjunto. A branch continua tendo um responsável técnico; coautoria e responsabilidade de integração são informações diferentes.

## Modelo seguro

- Não alterne logins, tokens ou identidades Git para fazer parecer que cada integrante executou um commit.
- A pessoa ou identidade de integração que realmente executar o commit permanece no cabeçalho do commit.
- Cada participante real pode ser reconhecido por um trailer `Co-authored-by: Nome <email-de-commit>`.
- O e-mail precisa estar associado à conta GitHub do participante. Se a pessoa protege o e-mail, use o endereço `noreply` exibido em **GitHub > Settings > Emails**.
- Não versione a lista de e-mails. Mantenha-a apenas em `ambiente.local/equipe-git.local.json`, diretório ignorado pelo Git.

O username sozinho não cria atribuição de commit. Assinaturas `Verified`, aprovações, comentários e merges também não devem ser simulados: continuam dependendo da autenticação real da pessoa.

## Configuração local

Estrutura esperada:

```json
{
  "integrantes": [
    {
      "nome": "Nome",
      "github": "username",
      "emailCommit": "endereco-confirmado-ou-noreply"
    }
  ]
}
```

O gerador recusa registros sem nome, username ou e-mail e detecta usernames repetidos. Use:

```text
node skills/rotear-trabalho-equipe/scripts/gerar-coautoria.mjs --todos
node skills/rotear-trabalho-equipe/scripts/gerar-coautoria.mjs username1 username2
```

O comando somente imprime trailers. Ele não troca a identidade Git, não cria commits e não publica alterações.

## Critério por entrega

- Prompt ou decisão coletivamente construída: inclua todos os participantes confirmados.
- Implementação ou revisão feita por um subconjunto: inclua somente esse subconjunto.
- Participação incerta ou e-mail não confirmado: não atribua até obter confirmação.
- PR: mantenha o responsável técnico como autor/owner operacional e solicite revisores pelas áreas afetadas.
