# GerenciamentoRH
Este é um projeto de sistema de cadastro de funcionários que permite gerar informações cadastrais, gerar PDFs, realizar alterações cadastrais e muito mais.

## Funcionalidades Principais

- Adição de funcionários
- Cadastro de funcionários com informações detalhadas.
- Geração de PDF com os dados cadastrais dos funcionários.
- Edição e atualização das informações cadastrais.
- Histórico: junto as informações do funcionario, aparecerá o histórico de alterações cadastrais dele. *(atualizado)*
- Dashboard Administrativa: Exibir todos os salários dos funcionários. *(atualizado)*
- Futuras atualizações planejadas:
  - **Dashboard Administrativa**: Número de funcionários e outras métricas relevantes.
  - **Menu Lateral**: Navegação facilitada para acessar as páginas dos funcionários e outras seções do sistema.

## Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [Yup](https://github.com/jquense/yup)
- [React Hook Form](https://react-hook-form.com/)
- [Material UI](https://mui.com/)
- DDD
- microserviço(PDF) *esse esta desativado pois é um microsserviço que nao está ativo no momento*

## Instalação e Uso

Para executar este projeto localmente, siga estas etapas:

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-projeto.git

Acesse o diretório do projeto:

bash
Copy code
cd seu-projeto
Instale as dependências:

```bash
npm install
```
##Configure suas credenciais Firebase em um arquivo .env ou em seu ambiente:

REACT_APP_FIREBASE_API_KEY=seu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=seu-project-id
# Adicione outras variáveis de ambiente necessárias aqui

## Inicie o aplicativo:

```bash
npm run dev
````
O aplicativo estará disponível em http://localhost:3000.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas (issues) e enviar pull requests para melhorar este projeto.

## Licença
Este projeto está sob a licença LICENSE.



