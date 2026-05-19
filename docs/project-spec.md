# Ragnarok LATAM Leveling Assistant - Especificacao inicial

Data: 2026-05-19

## Objetivo

Construir um produto para jogadores de Ragnarok Online LATAM calcularem quantos monstros precisam matar para evoluir seus niveis de base e classe.

O produto comeca com uma calculadora por mapa. O jogador informa seu nivel, percentual atual, buffs de experiencia e tamanho do grupo. A aplicacao usa dados importados da DivinePride para listar os monstros do mapa, calcular a experiencia efetiva por abate e destacar quais monstros rendem mais experiencia.

## Publico-alvo

Jogadores de Ragnarok Online LATAM que querem tomar decisoes praticas de progressao:

- escolher onde upar;
- entender o impacto de buffs e grupo;
- comparar monstros dentro de um mapa;
- saber quantos monstros precisam matar para evoluir.

## Stack tecnica

Backend:

- NestJS;
- TypeScript;
- PostgreSQL;
- Prisma;
- Jest.

Frontend futuro:

- React;
- TypeScript.

Infra local:

- Docker Compose para banco e servicos auxiliares.

Documentacao:

- Markdown dentro de `docs/`.

## Principios de desenvolvimento

O projeto sera construido com Clean Code e Clean Architecture de forma pragmatica.

As regras do jogo devem ficar isoladas do framework, banco de dados e API externa. Isso permite testar calculos de experiencia sem subir NestJS, PostgreSQL ou chamadas HTTP.

Cada camada tera uma responsabilidade clara:

- `domain`: regras puras do jogo e modelos centrais;
- `application`: casos de uso;
- `infrastructure`: banco, Prisma, clientes HTTP e integracoes externas;
- `presentation`: controllers, DTOs e rotas REST.

O objetivo nao e criar abstracoes por formalidade. Vamos abstrair quando isso melhorar teste, leitura, troca de implementacao ou organizacao.

## Escopo do MVP

### Importacao DivinePride

Criar a base para importar e normalizar dados da DivinePride.

Primeiros dados:

- mapas;
- monstros;
- associacao entre mapa e monstros;
- nivel do monstro;
- experiencia base;
- experiencia de classe.

Fluxo desejado:

```txt
DivinePride API
  -> client HTTP
  -> normalizador
  -> caso de uso de importacao
  -> PostgreSQL
  -> nossa API
  -> frontend
```

### Calculo de experiencia

O MVP deve calcular progressao simultanea de base e classe.

Entradas do jogador:

- nivel base atual;
- porcentagem atual de base;
- nivel de classe atual;
- porcentagem atual de classe;
- tipo de progressao de base;
- tipo de progressao de classe;
- mapa selecionado;
- tamanho do grupo, de 1 a 12;
- buffs de experiencia;
- bonus customizado de experiencia, quando necessario.

Saidas por monstro:

- experiencia base original;
- experiencia de classe original;
- multiplicador de penalidade ou bonus por diferenca de nivel;
- multiplicador de grupo;
- bonus de buffs aplicados;
- experiencia base efetiva por abate;
- experiencia de classe efetiva por abate;
- quantidade de monstros para evoluir base;
- quantidade de monstros para evoluir classe;
- quantidade de monstros para evoluir ambos.

Resultado do mapa:

- listar todos os monstros do mapa;
- destacar monstros que dao mais experiencia;
- destacar o melhor monstro para evoluir base;
- destacar o melhor monstro para evoluir classe;
- destacar o melhor monstro combinado para evoluir ambos.

O criterio principal para "melhor combinado" sera a menor quantidade de abates necessaria para atingir os dois proximos niveis, considerando base e classe.

## Regras de experiencia suportadas

### Tabelas de experiencia

Base EXP:

- classe nao transcendental, niveis 1 a 99;
- classe transcendental, niveis 1 a 99;
- classe 3 ou expandida, niveis 100 a 200.

Job EXP:

- aprendiz;
- classe 1;
- classe 2;
- classe 2 transcendental;
- classe 3.

Classe 4 e Classe 4 Expandida ficam fora do MVP.

### Penalidade e bonus por diferenca de nivel

A experiencia recebida varia de acordo com a diferenca entre o nivel base do jogador e o nivel do monstro.

Regra interpretada:

```txt
diferenca = nivel do monstro - nivel base do jogador
```

Exemplos:

- monstro 10 niveis acima: 140%;
- monstro no mesmo nivel: 100%;
- monstro 6 a 10 niveis abaixo: 95%;
- monstro 31 ou mais niveis abaixo: 10%;
- monstro 16 ou mais niveis acima: 40%.

Essa regra deve ser implementada como funcao pura e testada com os limites da tabela.

### Grupo

Ao dividir experiencia em grupo, existe bonus total por quantidade de membros e divisao por membro.

Tabela inicial:

| Membros | EXP total | EXP por membro |
| --- | ---: | ---: |
| 1 | 100% | 100% |
| 2 | 120% | 60% |
| 3 | 140% | 47% |
| 4 | 160% | 40% |
| 5 | 180% | 36% |
| 6 | 200% | 33% |
| 7 | 220% | 31% |
| 8 | 240% | 30% |
| 9 | 260% | 29% |
| 10 | 280% | 28% |
| 11 | 300% | 27% |
| 12 | 320% | 27% |

No MVP, o usuario informa apenas a quantidade de membros. A validacao completa de diferenca maxima de 15 niveis entre membros pode entrar depois, quando houver cadastro de membros do grupo.

### Buffs de experiencia

O MVP tera presets de buffs conhecidos e tambem campos customizados.

Assinaturas:

- Caixa VIP: +20% EXP;
- VIP Kafra: +50% EXP.

Consumiveis:

- Manual de Combate: +50% EXP;
- Grimorio de Combate: +100% EXP;
- Manual de Combate de Classe: +50% EXP de classe.

Habilidade:

- Banquete de Njord nivel 1: +20% EXP;
- Banquete de Njord nivel 2: +30% EXP;
- Banquete de Njord nivel 3: +40% EXP;
- Banquete de Njord nivel 4: +50% EXP;
- Banquete de Njord nivel 5: +60% EXP.

Campos customizados:

- bonus adicional de EXP base;
- bonus adicional de EXP de classe;
- bonus adicional aplicado a ambos.

Consumiveis serao considerados como bonus percentual no MVP. Duracao, tempo estimado para upar, kills por minuto e quantidade de manuais consumidos ficam fora do escopo inicial.

## Fora do MVP

- elementos e propriedades;
- calculo de dano;
- raca e tamanho;
- classe 4;
- recomendacao automatica de mapas;
- estimativa de tempo;
- kills por minuto;
- catalogo completo de consumiveis;
- duracao de buffs;
- cadastro completo de membros de grupo.

## Estrutura inicial sugerida

```txt
src/
  modules/
    divine-pride/
      domain/
      application/
      infrastructure/
      presentation/
    monsters/
      domain/
      application/
      infrastructure/
      presentation/
    maps/
      domain/
      application/
      infrastructure/
      presentation/
    exp/
      domain/
      application/
      presentation/
  shared/
    domain/
    infrastructure/
```

O modulo `exp` deve depender apenas de dados de entrada e tabelas internas. Ele nao deve depender de DivinePride, Prisma ou controllers.

## Estrategia de testes

Testes unitarios prioritarios:

- tabela de penalidade por diferenca de nivel;
- calculo de experiencia por grupo;
- selecao de buffs;
- calculo final de EXP base por abate;
- calculo final de EXP de classe por abate;
- calculo de monstros necessarios para evoluir;
- normalizacao de respostas externas da DivinePride.

Testes de integracao futuros:

- importacao salvando no PostgreSQL;
- endpoint de listagem de mapas;
- endpoint de listagem de monstros por mapa;
- endpoint de calculo por mapa.

## Forma de aprendizado

O projeto sera construido em ciclos pequenos.

Em cada ciclo:

1. explicar o objetivo da camada ou arquivo;
2. criar o codigo junto;
3. explicar as decisoes;
4. escrever testes quando fizer sentido;
5. rodar testes;
6. documentar o aprendizado importante.

O foco e aprender a construir uma aplicacao real, nao apenas copiar codigo pronto.

## Fases do projeto

### Fase 1 - Fundacao do backend

- criar projeto NestJS;
- configurar TypeScript, lint e testes;
- configurar PostgreSQL com Docker Compose;
- configurar Prisma;
- criar estrutura inicial de modulos.

### Fase 2 - Dominio de experiencia

- implementar tabelas de EXP;
- implementar penalidade por diferenca de nivel;
- implementar regra de grupo;
- implementar buffs;
- implementar calculo de kills para evoluir base e classe;
- cobrir regras principais com testes unitarios.

### Fase 3 - DivinePride importer

- criar client HTTP;
- estudar endpoints necessarios;
- criar normalizadores;
- persistir mapas e monstros;
- criar testes para normalizacao.

### Fase 4 - API propria

- listar mapas;
- listar monstros por mapa;
- calcular experiencia por mapa;
- retornar destaque dos melhores monstros.

### Fase 5 - Frontend

- criar interface em React + TypeScript;
- formulario de jogador;
- selecao de mapa;
- selecao de buffs;
- tabela de resultado por monstro;
- destaque visual dos melhores monstros.

## Questoes em aberto

- confirmar a formula exata de stacking dos buffs de EXP no Ragnarok LATAM;
- confirmar se DivinePride LATAM fornece todos os dados necessarios de mapa e monstro;
- validar na pratica os resultados comparando com personagens low level no jogo;
- decidir futuramente como representar classes e tipos de progressao no frontend.

## Proxima decisao

Depois da aprovacao deste documento, o proximo passo sera criar um plano de implementacao detalhado para a Fase 1, antes de gerar o primeiro projeto NestJS.
