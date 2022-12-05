# Get Your Hands Dirty on Clean Architecture

## 1 - What’s Wrong With Layers?

- La **layered architecture** est tout à fait classique : 3 couches successives (web -> domain -> persistance).
  - Elle peut même permettre une bonne architecture qui laisse les options ouvertes (par exemple remplacer la persistance en ne touchant que cette couche-là).
- Le problème de la layered architecture c’est qu’**elle se détériore rapidement et encourage les mauvaises habitudes.**
  - Elle promeut le **database-driven design** : vu que la persistance est à la base, on part toujours depuis la modélisation de la structure de la DB.
    - Au lieu de ça on devrait mettre au centre le comportement, c’est-à-dire le code métier, et considérer la persistance comme périphérique.
    - Un des éléments qui pousse au database-driven design aussi c’est l’ORM, qui peut être utilisé depuis le layer domain, et introduit des considérations techniques dedans.
  - Elle encourage les **raccourcis** : quand un layer du dessus a besoin d’un élément du dessous, il suffit de le pousser vers le bas et il y aura accès.
    - La couche de persistance finit par grossir et devenir une énorme couche “utilitaire” qui contient la logique et les aspects techniques entremêlés.
  - Elle devient de plus en plus **difficile à tester** :
    - Le logique métier a tendance à fuiter vers la couche web, parce que la persistance y est directement utilisée.
    - Tester la couche web devient de plus en plus difficile parce qu’il faut mocker les deux autres, et parce que la logique y grossit.
  - Elle **cache les use cases** : la logique fuitant vers les autres layers, on ne sait pas où ajouter un nouveau use-case, ni où chercher un existant.
    - On peut ajouter à ça que vu qu’il n’y a pas de limite, la couche domain a des unités (services) qui grossissent au fil du temps, ce qui rend plus difficile de trouver où va chaque fonctionnalité.
  - Elle rend le **travail en parallèle** difficile :
    - Comme on fait du database-driven design, on doit toujours commencer par la couche de persistance, et on ne peut pas être plusieurs à la toucher.
    - Si en plus les services du domaine sont gros, on peut être en difficulté pour être plusieurs à modifier un gros service pour plusieurs raisons.

## 2 - Inverting dependencies

- Le **Single Responsibility Principle** (SRP) dit qu’un composant doit avoir une seule** raison de changer**.
  - Ça veut dire que si on change le logiciel pour n’importe quelle autre raison, il ne devrait pas changer.
  - Quand nos composants dépendent les uns des autres, ça leur donne autant de raisons à chaque fois de changer, si un des composants dont ils dépendent change lui aussi.
- La layered architecture fait que la couche web et la couche domain ont des raisons de changer liées à la couche de persistance. On n’a pas envie que la couche domain change pour d’autres raisons qu’elle-même, donc on va **inverser les dépendances** qu’elle a.
  - C’est le Dependency Inversion Principle (DIP).
  - On va copier les entities depuis la persistance vers la couche domain qui en a besoin aussi.
  - Et on va créer une interface de persistance dans le domaine, à laquelle va adhérer la couche persistance qui aura donc une dépendance vers le domaine plutôt que l’inverse.
- Selon Robert Martin la **clean architecture** doit garder le domaine séparé du reste (frameworks, infrastructure etc.), et les dépendances doivent être tournées vers le code du domaine pour que celui-ci n’en ait pas d’autres que lui-même.
  - Les **entities** du domaine sont au centre.
  - Ils sont utilisés par les **use cases**, qui représentent les services, mais impliquent d’avoir une granularité fine.
  - Cette séparation a un coût, qui est qu’il faut **dupliquer les entités** entre le domaine et l’infrastructure, notamment pour éviter que les entités du domaine soient polluées par la technique.
- L’**hexagonal architecture** est similaire à la clean architecture mais un peu moins “abstraite”, c’est la version d’Alistair Cockburn.
  - L’hexagone contient les entities et les use cases, et en dehors on trouve des adapters pour intégrer la communication avec l’extérieur.
  - On a deux types d’**adapters** :
    - Les adapteurs de gauche drivent l’hexagone, parce qu’ils appellent des fonctions exposées par l’hexagone.
      - Exemple : handlers HTTP.
    - Les adapters de droite sont drivées par l’hexagone, parce que l’hexagone appelle des méthodes sur eux.
      - Exemple : communication avec la DB.
  - Pour permettre la communication, l’hexagone définit des ports (interfaces), qui doivent être implémentés par les adapters.
    - C’est pour ça qu’on parle de Ports & Adapters.
- Quel que soit leur nom, tout l’intérêt de ces architectures c’est de permettre d’avoir un **domaine isolé**, dont on pourra gérer la complexité sans qu’il ait d’autres raisons de changer que lui-même.
