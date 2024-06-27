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
