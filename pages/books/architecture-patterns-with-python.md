# Architecture Patterns with Python

## Introduction

- Le chaos dans l’architecture logicielle se caractérise par l’homogénéité : chaque partie du code a des responsabilités de toutes sortes.
  - Le logiciel tend naturellement vers ce chaos, qu’on appelle _big ball of mud_.
- Parmi les techniques pour **éviter le chaos** :
  - L’**encapsulation** et l’**abstraction** permettent de simplifier la compréhension du code, et d’améliorer sa maintenabilité.
    - L’abstraction peut passer par une _Abstract Base Class_ (ABC), mais en Python on va souvent utiliser un objet ou une fonction qui sert directement d’API publique.
  - Le **layering** permet de créer des zones où le code est classé, et où il y a des règles de dépendances, pour limiter celles-ci.
    - Le layering le plus connu est celui en 3 couches : présentation, business et data.
  - La **dependency inversion** (DIP) consiste à ce que :
    - Le code métier (haut niveau) ne dépende pas du code d’infrastructure (bas niveau), mais que les deux dépendent d’abstractions. La raison est qu’on veut changer les deux indépendamment, et avec un rythme différent.
    - Les abstractions ne dépendent pas des détails d’implémentation, mais plutôt l’inverse.
- L’un des problèmes principaux qui émerge au cours du temps, c’est **l’éparpillement du code du domaine** au travers de la codebase. Il faut mettre en place des techniques pour l’empêcher.

## 1 - Domain Modeling

- Le **domain** **model** est une représentation simplifiée (model) du problème qu’on essaye de résoudre (domain).
  - Il apparaît naturellement dès qu’on travaille sur un problème, et se traduit par exemple par un langage spécifique qui émerge petit à petit, et qui permet d’exprimer des processus complexes en peu de mots.
  - Le concept de _domain modeling_ n’est pas issu du blue book d’Eric Evans, mais remonte par exemple à :
    - **_Object Design_** de Rebecca WirfsBrock et Alan McKean, qui parle de responsibility-driven design.
    - Les livres d’Ivar Jacobson et Grady Booch, qui datent des années 80.
- Les auteurs prennent l’**exemple** de leur propre entreprise, qui fait de l’achat-vente de biens.
  - Il y a 4 _bounded contexts_ :
    - Les clients utilisent l’**app d’e-commerce (1)** pour commander, et de l’autre côté l’équipe d’achat utilise l’**app d’achat (2)** pour acheter ce qui est nécessaire pour approvisionner les stocks.
    - Ces deux apps communiquent avec le **module d’allocation (3)** qui met à jour les besoins et disponibilités, et communique les instructions au **module de warehouse (4)** pour qu’il envoie les biens.
  - Ils veulent mettre en place le fait d’indiquer des produits disponibles avec un plus long délai de livraison, dès qu’ils sont commandés par l’équipe d’achat. De cette manière, la plupart des produits seront marqués comme disponibles.
  - Les auteurs parlent avec les **domain experts**, pour mettre au clair des règles business. Ils les écrivent **accompagnés d’exemples** pour enlever l’ambiguïté.
    - Exemple : “On ne peut pas allouer la même ligne deux fois”
      - Si on a un batch de 10 BLUE_VASE, et qu’on alloue une ligne de 2 BLUE_VASE.
      - Si on réalloue la même ligne, le batch ne changera pas, et restera à 8 BLUE_VASE.
