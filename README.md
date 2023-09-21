# Meu Front

Este projeto faz parte do material diático da Disciplina **Desenvolvimento Full Stack Básico**/ 
**Desenvolvimento Back-end Avançado** 

O objetivo aqui é desenvolver um ERP de Automação Comercial.

---
## Como executar

Basta fazer o download do projeto e depois executar o arquivo login.html no seu browser e se não estiver o cadastro de usuário e só clicar em cadastre-se.

---

## API Externa

O cadastro de Pessoas está executando uma API externa( ViaCEP ) com a seguinte rota: [https://viacep.com.br/ws/01001000/json/].
 
A API viaCep tem a sua licença de uso gratuita.


## Como executar através do Docker

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile no terminal.
Execute **como administrador** o seguinte comando para construir a imagem Docker:

```
$ docker build -t gescom-web .
```

Uma vez criada a imagem, para executar o container basta executar, **como administrador**, seguinte o comando:

```
$ docker run --rm -p 8080:80 gescom-web
```

Uma vez executando, para acessar o front-end, basta abrir o [http://localhost:8080/login.html](http://localhost:8080/login.html) no navegador.

