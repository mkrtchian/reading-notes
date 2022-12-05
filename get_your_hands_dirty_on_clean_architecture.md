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

## 3 - Organizing Code

- On peut organiser le code **par couches** : le classique web, domain et persistance, mais avec une inversion de la persistance vers le domain.
  ```yaml
  - web
  - AccountController
  - domain
  - Account
  - AccountService
  - AccountRepositoryPort
  - persistance
  - AccountRepositoryImpl
  ```
  - Mais cette organisation est sous-optimale pour 3 raisons :
    - Il n’y a pas de séparation sous forme de dossiers ou de packages pour les fonctionnalités. Donc elles vont vite s’entre-mêler au sein de chaque couche.
    - Comme les services sont gros, on peut difficilement repérer la fonctionnalité exacte qu’on cherche tout de suite.
    - On ne voit pas au premier coup d'œil quelle partie de la persistance implémente quel port côté domain. L’architecture ne saute pas aux yeux.
- On peut ensuite organiser le code **par features** : les limites de dossier/package sont définies par les features qui contiennent un fichier par couche.
  ```yaml
  - account
  - Account
  - AccountController
  - AccountRepository
  - AccountRepositoryImpl
  - SendMoneyService
  ```
  - On a nos features visibles immédiatement (`Account -> SendMoneyService`), ce qui fait qu’on est dans le cadre d’une **screaming architecture**.
  - Par contre, nos couches techniques sont très peu protégées, et le code du domaine n’est plus protégé du reste par des séparations fortes.
- On peut enfin organiser le code dans une architecture **expressive**, reprenant le meilleur des deux autres :
  - Une séparation initiale par features majeures.
  - Puis une séparation par couches à l’intérieur de ces features majeures.
  - Et enfin la séparation explicite des ports et adapters, en explicitant leur nature entrante ou sortante.
  ```yaml
  - account
  - adapter
    - in
    - web
    - AccountController
    - out
    - persistance
    - AccountPersistanceAdapter
  - domain
    - Account
  - application
    - SendMoneyService
    - port
    - in
    - SendMoneyUseCase
    - out
    - LoadAccountPort
    - UpdateAccountStatePort
  ```
  - Le fait que l’architecture soit alignée avec la structure en packages fait que nous avons moins de chances d’en dévier. Elle est incarnée de manière très concrète dans le code.
  - Le domaine étant isolé, on peut très bien en faire ce qu’on veut, y compris y appliquer les patterns tactiques du DDD.
  - Côté visibilité des packages :
    - Les adapters peuvent rester privés, puisqu’ils ne sont appelés qu’à travers les ports.
    - Les ports doivent être publics pour être accessibles par les adapters.
    - Les objets du domaine doivent être publics pour être accessibles depuis les services et les adapters.
    - Les services peuvent rester privés parce qu’ils sont appelés à travers les ports primaires.
- Concernant la manière dont fonctionne l’**inversion de dépendance** ici :
  - Pour les adpaters entrants il n’y a pas besoin d’inversion puisqu’ils sont déjà entrants vers l’hexagone. On peut, au besoin, quand même protéger l’hexagone derrière des ports quand même.
  - Pour les adapters sortants par contre il faut inverser la dépendance, en les faisant respecter le port de l’hexagone, puis en les instanciant et les donnant à l’hexagone.
  - Il faut donc un **composant tiers neutre** qui instancie les adapters sortants pour les donner à l’hexagone, et instancie l’hexagone pour le donner aux adapters entrants.
    - Il s’agit de l’**injection de dépendance**.
