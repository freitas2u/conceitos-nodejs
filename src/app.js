const express = require("express");
const cors = require("cors");

 const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.get("/repositories", (request, response) => {
  // Retornar todos os repositórios

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  //Obtêm os parâmetros vindos do client
  const {title, url, techs} = request.body;

  //cria um objeto para ser incluído no Array
  const repository = {
    id: uuid(),
    title, 
    url, 
    techs,
    likes: 0
  }

  //Adiciona o novo repositório ao Array Repositories
  repositories.push(repository);

  //Retorna 
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // Obtém o id a ser atualizado
  const { id } = request.params;

  //Obtêm os parâmetros a partir do corpo da requisição
  //A rota deve alterar apenas
  const {title, url, techs} = request.body;

  //Localiza o projeto a ser atualizado dentro do Array
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //Verifica se encontrou o repositório, se encontrou o índice é > 0
  if (repositoryIndex < 0 ) {
    return response.status(400).json({ error: "Repository not found." })
  }

  //Monta um novo objeto para ser retornado
  const repository = {
    id, //Query Param
    title, //Body Param
    url, //Body Param
    techs, //Body Param
    likes: repositories[repositoryIndex].likes, //Valor que não pode ser alterado
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;

  //Localiza o projeto a ser atualizado dentro do Array
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //Verifica se encontrou o repositório, se encontrou o índice é > 0
  if (repositoryIndex < 0 ) {
    return response.status(400).json({ error: "Repository not found." })
  }

  //Remove o item na posição selecionada
  repositories.splice(repositoryIndex, 1);

  //Retorna uma resposta vazia com status code 204;
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  //Obtém o id do repositório a partir do Rout Param
  const { id } = request.params;

  //Localiza o projeto a ser atualizado dentro do Array
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //Verifica se encontrou o repositório, se encontrou o índice é > 0
  if (repositoryIndex < 0 ) {
    return response.status(400).json({ error: "Repository not found." })
  }

  //Encontra o repositório no Array
  const repository = repositories.find(repository => repository.id === id);

  //Incrementa o like
  repository.likes += 1;

  //Retorna o repositório inteiro
  return response.json(repository);


});

module.exports = app;
