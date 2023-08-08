# Get Your Hands Dirty on Clean Architecture

## 1 - What's Wrong With Layers?

- La **layered architecture** est tout à fait classique : 3 couches successives (web -> domain -> persistance).
  - Elle peut même permettre une bonne architecture qui laisse les options ouvertes (par exemple remplacer la persistance en ne touchant que cette couche-là).
- Le problème de la layered architecture c'est qu'**elle se détériore rapidement et encourage les mauvaises habitudes.**
  - Elle promeut le **database-driven design** : vu que la persistance est à la base, on part toujours depuis la modélisation de la structure de la DB.
    - Au lieu de ça on devrait mettre au centre le comportement, c'est-à-dire le code métier, et considérer la persistance comme périphérique.
    - Un des éléments qui pousse au database-driven design aussi c'est l'ORM, qui peut être utilisé depuis le layer domain, et introduit des considérations techniques dedans.
  - Elle encourage les **raccourcis** : quand un layer du dessus a besoin d'un élément du dessous, il suffit de le pousser vers le bas et il y aura accès.
    - La couche de persistance finit par grossir et devenir une énorme couche “utilitaire” qui contient la logique et les aspects techniques entremêlés.
  - Elle devient de plus en plus **difficile à tester** :
    - Le logique métier a tendance à fuiter vers la couche web, parce que la persistance y est directement utilisée.
    - Tester la couche web devient de plus en plus difficile parce qu'il faut mocker les deux autres, et parce que la logique y grossit.
  - Elle **cache les use cases** : la logique fuitant vers les autres layers, on ne sait pas où ajouter un nouveau use-case, ni où chercher un existant.
    - On peut ajouter à ça que vu qu'il n'y a pas de limite, la couche domain a des unités (services) qui grossissent au fil du temps, ce qui rend plus difficile de trouver où va chaque fonctionnalité.
  - Elle rend le **travail en parallèle** difficile :
    - Comme on fait du database-driven design, on doit toujours commencer par la couche de persistance, et on ne peut pas être plusieurs à la toucher.
    - Si en plus les services du domaine sont gros, on peut être en difficulté pour être plusieurs à modifier un gros service pour plusieurs raisons.

## 2 - Inverting dependencies

- Le **Single Responsibility Principle** (SRP) dit qu'un composant doit avoir une seule **raison de changer**.
  - Ça veut dire que si on change le logiciel pour n'importe quelle autre raison, il ne devrait pas changer.
  - Quand nos composants dépendent les uns des autres, ça leur donne autant de raisons à chaque fois de changer, si un des composants dont ils dépendent change lui aussi.
- La layered architecture fait que la couche web et la couche domain ont des raisons de changer liées à la couche de persistance. On n'a pas envie que la couche domain change pour d'autres raisons qu'elle-même, donc on va **inverser les dépendances** qu'elle a.
  - C'est le Dependency Inversion Principle (DIP).
  - On va copier les entities depuis la persistance vers la couche domain qui en a besoin aussi.
  - Et on va créer une interface de persistance dans le domaine, à laquelle va adhérer la couche persistance qui aura donc une dépendance vers le domaine plutôt que l'inverse.
- Selon Robert Martin la **clean architecture** doit garder le domaine séparé du reste (frameworks, infrastructure etc.), et les dépendances doivent être tournées vers le code du domaine pour que celui-ci n'en ait pas d'autres que lui-même.
  - Les **entities** du domaine sont au centre.
  - Ils sont utilisés par les **use cases**, qui représentent les services, mais impliquent d'avoir une granularité fine.
  - Cette séparation a un coût, qui est qu'il faut **dupliquer les entités** entre le domaine et l'infrastructure, notamment pour éviter que les entités du domaine soient polluées par la technique.
- L'**hexagonal architecture** est similaire à la clean architecture mais un peu moins “abstraite”, c'est la version d'Alistair Cockburn.
  - L'hexagone contient les entities et les use cases, et en dehors on trouve des adapters pour intégrer la communication avec l'extérieur.
  - On a deux types d'**adapters** :
    - Les adapteurs de gauche drivent l'hexagone, parce qu'ils appellent des fonctions exposées par l'hexagone.
      - Exemple : handlers HTTP.
    - Les adapters de droite sont drivées par l'hexagone, parce que l'hexagone appelle des méthodes sur eux.
      - Exemple : communication avec la DB.
  - Pour permettre la communication, l'hexagone définit des ports (interfaces), qui doivent être implémentés par les adapters.
    - C'est pour ça qu'on parle de Ports & Adapters.
- Quel que soit leur nom, tout l'intérêt de ces architectures c'est de permettre d'avoir un **domaine isolé**, dont on pourra gérer la complexité sans qu'il ait d'autres raisons de changer que lui-même.

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
    - Il n'y a pas de séparation sous forme de dossiers ou de packages pour les fonctionnalités. Donc elles vont vite s'entre-mêler au sein de chaque couche.
    - Comme les services sont gros, on peut difficilement repérer la fonctionnalité exacte qu'on cherche tout de suite.
    - On ne voit pas au premier coup d'œil quelle partie de la persistance implémente quel port côté domain. L'architecture ne saute pas aux yeux.
- On peut ensuite organiser le code **par features** : les limites de dossier/package sont définies par les features qui contiennent un fichier par couche.
  ```yaml
  - account
  - Account
  - AccountController
  - AccountRepository
  - AccountRepositoryImpl
  - SendMoneyService
  ```
  - On a nos features visibles immédiatement (`Account -> SendMoneyService`), ce qui fait qu'on est dans le cadre d'une **screaming architecture**.
  - Par contre, nos couches techniques sont très peu protégées, et le code du domaine n'est plus protégé du reste par des séparations fortes.
- On peut enfin organiser le code dans une architecture **expressive**, reprenant le meilleur des deux autres :
  - Une séparation initiale par features majeures.
  - Puis une séparation par couches à l'intérieur de ces features majeures.
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
  - Le fait que l'architecture soit alignée avec la structure en packages fait que nous avons moins de chances d'en dévier. Elle est incarnée de manière très concrète dans le code.
  - Le domaine étant isolé, on peut très bien en faire ce qu'on veut, y compris y appliquer les patterns tactiques du DDD.
  - Côté visibilité des packages :
    - Les adapters peuvent rester privés, puisqu'ils ne sont appelés qu'à travers les ports.
    - Les ports doivent être publics pour être accessibles par les adapters.
    - Les objets du domaine doivent être publics pour être accessibles depuis les services et les adapters.
    - Les services peuvent rester privés parce qu'ils sont appelés à travers les ports primaires.
- Concernant la manière dont fonctionne l'**inversion de dépendance** ici :
  - Pour les adpaters entrants il n'y a pas besoin d'inversion puisqu'ils sont déjà entrants vers l'hexagone. On peut, au besoin, quand même protéger l'hexagone derrière des ports quand même.
  - Pour les adapters sortants par contre il faut inverser la dépendance, en les faisant respecter le port de l'hexagone, puis en les instanciant et les donnant à l'hexagone.
  - Il faut donc un **composant tiers neutre** qui instancie les adapters sortants pour les donner à l'hexagone, et instancie l'hexagone pour le donner aux adapters entrants.
    - Il s'agit de l'**injection de dépendance**.

## 4 - Implementing a Use Case

- Comme on a une forte séparation hexagone/adapters, on peut implémenter l'hexagone de la manière dont on veut, y compris avec les patterns tactiques du DDD, mais pas forcément.
- Dans ce chapitre on implémente un use-case dans l'hexagone de l'exemple _buckpal_ qui est une application de gestion de paiement.
- La **couche domain** se trouve dans `buckpal -> domain`, et contient une entité `Account`, qui a des méthodes pour ajouter et retirer de l'argent.
  - Chaque ajout ou retrait se fait en empilant des entités `Activity` qui contiennent chaque transaction dans un tableau interne à `Account`.
  - Le tableau interne ne contient qu'une fenêtre d'`Activity` pour des raisons de performance, et une variable permet de connaître la valeur du compte avant ce nombre restreint d'`Activity`.
- Les use-cases se trouvent dans la **couche applicative**, dans `buckpal -> application -> service`.
  - Un use-case va :
    - Récupérer l'input (qu'il ne valide pas par lui-même pour laisser cette responsabilité à un autre composant).
    - Valider les règles business, dont la responsabilité est partagée avec la couche domain.
    - Manipuler l'état du domaine :
      - Ça se fait en instanciant des entités et appelant des méthodes sur elles.
      - Et en général en passant les entités à un adapter pour que leur état soit persisté.
      - Appeler éventuellement d'autres use-cases.
    - Retourner l'output.
  - Les use-cases vont être petits pour éviter le problème de gros services où on ne sait pas quelle fonctionnalité va où.
- La **validation des inputs** se fait dans la couche applicative pour permettre d'appeler l'hexagone depuis plusieurs controllers sans qu'ils aient à valider ces données, et pour garantir l'intégrité des données dans l'hexagone.
  - On va faire la validation dans une classe de type **command**. Cette classe valide les données dans son constructeur, et refuse d'être instanciée si les données sont invalides.
    - L'auteur déconseille d'utiliser le pattern builder et conseille d'appeler directement le constructeur.
    - Exemple de builder :
      ```typescript
      new CommandBuilder().setParameterA(value1).setParameterB(value2).build();
      ```
  - Cette classe va se trouver dans `buckpal -> application -> port -> in`.
  - Elle constitue une sorte d'anti-corruption layer protégeant l'hexagone.
- On pourrait être tenté de **réutiliser des classes de validation d'input** entre plusieurs use-cases ressemblants, par exemple la création d'un compte et la modification d'un compte. L'auteur **le déconseille**.
  - Si on réutilise, on va se retrouver avec quelques différences (par exemple l'ID du compte) qui vont introduire de potentielles mauvaises données.
  - On va se retrouver à gérer les différences entre les deux modèles dans les use-cases alors qu'on voulait le faire dans un objet à part.
  - Globalement, faire des modèles de validation d'input permet, au même titre que le fait de faire des petits use-cases, de garder l'architecture maintenable dans le temps.
- La **validation des business rules** doit quant à elle être faite dans les use-cases.
  - La différence avec la validation des inputs c'est que pour les inputs il n'y a pas besoin d'**accéder à l'état du modèle de données**, alors que pour les business rules oui.
  - Le use-case peut le faire directement en appelant des fonctions, ou alors le déléguer à des entities.
    - Dans le cas où l'essentiel de la logique est fait dans les entities et où le use-case orchestre juste des appels et passe les données, on parle d'un **rich domain model**. Dans le cas où c'est le use-case qui a l'essentiel de la logique et les entities sont maigres, on parlera d'un **anemic domain model**.
  - Le use-case lève une exception en cas de non-respect des règles business comme pour les règles d'input. Ce sera à l'adapter entrant de décider de ce qu'il fait de ces exceptions.
- Concernant **l'output** renvoyé par le use-case, il faut qu'il soit **le plus minimal possible** : n'inclure que ce dont l'appelant a besoin.
  - Si on retourne beaucoup de choses, on risque de voir des use-cases couplés entre eux via l'output (quand on ajoute un champ à l'objet retourné, on a besoin de changer tous ceux qui le retournent).
- Les use-cases qui font **uniquement de la lecture** pour renvoyer de la donnée peuvent être distinguées des use-cases qui écrivent.
  - Pour ça on peut les faire implémenter un autre port entrant que les use-cases d'écriture, par exemple le port `GetAccountBalanceQuery`.
  - On pourra à partir de là faire du CQS ou du CQRS.

## 5 - Implementing a Web Adapter

- Tous les appels extérieurs passent par des **adapters entrants**.
- Comme le flow d'appel est déjà dirigé de l'adapter vers l'hexagone, on pourrait enlever le port, et laisser l'adapter appeler directement les use-cases.
  - La matérialisation des ports permet d'avoir un endroit où tous **les points d'entrée de l'hexagone sont clairement identifiés** et spécifiés. C'est utile pour la maintenance à long terme.
  - Enlever ces ports fait partie des raccourcis discutés dans le chapitre 11.
  - Dans le cas où notre adapter est un WebSocket qui va appeler mais aussi qui sera appelé, alors il faut obligatoirement avoir les ports entrants, et surtout sortants, puisque là on a bien une inversion du sens d'appel.
- Les adapters web vont :
  - Créer des objets internes à partir des objets HTTP.
    - On parle aussi de désérialisation.
  - Vérifier les autorisations.
  - Valider l'input, et le faire correspondre à l'input du use-case qui va être appelé.
    - Vu qu'on valide déjà l'input à l'entrée du use-case, on va ici seulement valider le fait que l'input reçu peut bien être converti dans l'input du use-case.
  - Appeler le use-case.
  - Récupérer l'output, et reconstruire un objet HTTP à partir de ça pour le renvoyer.
    - On parle aussi de sérialisation.
- L'adapter se trouve dans `buckpal -> adapter -> in -> web`.
- L'adapter web a la responsabilité de communiquer avec le protocole HTTP. C'est une responsabilité qu'il doit avoir seul, et donc **ne pas faire fuiter des détails du HTTP dans le use-case**.
- Concernant la taille des controllers, il vaut mieux les avoir **les plus petits et précis possibles**.
  - Il vaut mieux éviter de créer par exemple une classe `AccountController` qui va avoir plusieurs méthodes associées chacune à un endpoint.
    - Ce genre de classe peut grossir et devenir difficile à maintenir. De même pour les tests associés.
    - Le fait d'être dans une classe fait que ces controllers vont partager des fonctions et objets entre eux. Et donc vont être plus facilement couplés.
  - On peut nommer les classes de web adapter avec des noms plus précis que `UpdateX`, `CreateX` etc. Par exemple `RegisterAccount`.
  - Les petits controllers permettent aussi de travailler plus facilement sur le code en parallèle.

## 6 - Implementing a Persistence Adapter

- Avec l'adapter de persistance, on a une vraie inversion des dépendances qui fait que malgré le sens des appels de l'hexagone vers l'adapter, grâce au port c'est l'adapter qui dépend de l'hexagone.
  - On va donc pouvoir faire des modifications dans l'adapter de persistance sans que ça n'affecte la logique business.
- Les adapters de persistance vont :
  - Prendre l'input.
    - Ca peut être une domain entity ou un objet spécifique pour une opération en base.
  - Le mapper au format base de données et l'envoyer à DB.
    - En général on va mapper vers les entities de l'ORM, mais ça peut aussi être vers des requêtes SQL directement.
  - Récupérer la réponse DB et la mapper au format applicatif.
    - En général une domain entity.
  - Renvoyer la valeur à l'application service.
- L'adapter se trouve dans `buckpal -> adapter -> out -> persistance`.
- Il faut que **les modèles d'input et d'output vers et depuis le persistance adapter** soient tous deux **dans l'application core** (hexagone).
- Plutôt qu'avoir un gros port qui permet d'accéder à toutes les méthodes de l'adapter correspondant à une entity, il vaut mieux avoir des ports plus fins.
  - Une des raisons c'est qu'il est plus difficile de mocker le persistance adapter en entier que de mocker certaines de ses méthodes correspondant aux ports utilisés.
  - La plupart du temps on va se retrouver avec **une méthode de l'adapter par port**.
- Pour ce qui est de l'adapter lui-même (celui qu'on accède via les ports), on peut l'avoir gros, mais on peut aussi le découper, par exemple pour avoir un adapter par entity, ou un par aggregate (si on utilise les patterns tactiques du DDD).
  - On pourrait aussi créer deux adapters pour une même entity : un pour les méthodes utilisant notre ORM, et un autre pour les méthodes utilisant du SQL directement.
    - Dans l'adapter on pourra donc utiliser les entities de l'ORM, ou alors des **repositories** faites à la main, qui contiendront des méthodes exécutant du SQL.
  - Séparer les aggregates dans des adapters distincts permet aussi de faciliter l'extraction d'un bounded context par la suite.
- On va donc avoir une **duplication des domain entities** dans le persistance adapter, en général sous forme d'entities d'ORM.
  - Utiliser les entities ORM dans le domaine peut être un choix possible pour éviter des mappings (discuté dans le chapitre 8), mais ça a le désavantage de faire fuiter des contraintes spécifiques à la DB vers le domaine.
- L'adapter en lui-même :
  - Pour une lecture, il appelle des méthodes sur les entities ORM ou sur les repositories maison, puis il map le résultat à une entity domaine et la renvoie.
  - Pour une écriture, il récupère l'entity domaine, la map vers l'entity ORM ou vers la méthode de repository maison, et exécute la méthode sur celle-ci.
- Concernant les **transactions**, elles ne peuvent pas être dans l'adapter de persistance. Elles doivent être dans la fonction qui orchestre les appels à la persistance, c'est-à-dire les use-cases applicatifs.
  - Si on veut garder nos use-cases purs, on peut recourir à l'**aspect-oriented programming**, par exemple avec AspectJ.

## 7 - Testing Architecture Elements

- Il y a 3 types de tests dans la pyramide :
  - Plus on monte dans la pyramide, et plus les tests sont lents et fragiles, donc plus on monte et moins nombreux doivent être les tests.
    - Les **unit tests** testent en général une seule classe.
    - Les **integration tests** mettent en jeu le code de plusieurs couches, et vont souvent mocker certaines d'entre-elles.
    - Les **system tests** testent le tout de bout en bout, sans mocks (autre que les composants qu'on ne peut pas instancier dans notre test).
      - On pourra parler de end-to-end tests si on teste depuis le frontend et non depuis l'API du backend.
  - NDLR : l'auteur adopte une vision proche de l'école de Londres, en considérant qu'un test teste une unité de code (et pas une unité de comportement peu importe la quantité de code), et qu'en testant plusieurs bouts de code ensemble il faut mocker les bouts de codes voisins (c'est comme ça qu'on obtient des tests fragiles aux refactorings).
- Côté implémentation :
  - Les **domain entities** sont testés avec des unit tests (state-based).
    - NDLR : Dans l'exemple on teste Account, mais pour autant on ne mock pas Activity, on en construit une vraie instance. Donc sur cet exemple en tout cas, on n'est pas tout à fait dans l'école de Londre non plus.
  - Les **use-cases** sont testés avec des unit tests (communication based) vérifiant que le use-case appelle la bonne méthode sur le domain entity et sur l'adapter de persistance.
    - NDLR : Là on est bien dans la London school.
    - L'auteur fait remarquer que le test utilisant des mocks, il est couplé à la structure du code et pas seulement au comportement. Et donc il conseille de ne pas forcément tout tester, pour éviter que ces tests cassent trop souvent.
  - Les **web adapters** sont testés avec des tests d'intégration.
    - On parle ici d'intégration parce qu'on est “intégré” avec autre chose que du code pur, en l'occurrence avec la librairie de communication HTTP.
    - Il s'agit de tests communication based, envoyant un faux message HTTP sur le bon path, et vérifiant qu'on a fait un appel sur le bon use-case mocké, avec la bonne commande.
  - Les **persistance adapters** sont testés avec des tests d'intégration.
    - Ici pas de mocks, on construit des domain entities et on les passe à l'adapter pour qu'il le mette en base, et on vérifie depuis la base avec des méthodes de repository qu'on a écrit la bonne chose.
    - Si besoin de données préalables, par exemple pour de la lecture, on exécute d'abord du SQL pour mettre la DB dans un état qui permettra cette lecture.
    - Le fait de ne pas mocker est justifié par le fait qu'on perdrait toute confiance dans nos tests puisque chaque type de DB vient avec ses propres spécificités SQL.
  - Les **chemins principaux complets** sont testés avec des system tests.
    - On utilise de vrais messages HTTP, et on ne mock rien dans nos couches.
- On peut utiliser des fonctions helper pour rendre nos tests plus lisibles en extrayant des bouts de code. Ces fonctions forment un **domain specific language** qu'il est bon de cultiver.
- Concernant la **quantité de tests** :
  - L'auteur suggère d'aller vers du 100% de coverage du code important. Garder quand même le 100% permet de lutter contre la théorie des vitres cassées.
  - Pour mesurer la fiabilité des tests, on peut mesurer **à quel point on est confiant pour mettre en production** notre changement.
    - Pour être toujours plus confiant, il faut mettre en production souvent.
    - Pour chaque bug en production, il faut se demander ce qu'on aurait pu faire pour qu'un test trouve le bug, et l'ajouter.
    - Le fait de documenter les bugs comme ça permet d'avoir une mesure de la fiabilité des tests dans le temps.

## 8. Mapping Between Boundaries

- Les 3 composants principaux (driving adapter, hexagone et driven adapter) doivent avoir un modèle qui leur permet d'appréhender le système et ses entités. On peut choisir différentes **stratégies de mapping** entre ces modèles en fonction de leur unicité ou de leur différence.
- **1- La no-mapping strategy** consiste à avoir le même modèle dans l'adapter web, l'hexagone, et l'adapter de persistance.
  - On n'implémente la représentation des entities qu'une fois pour la réutiliser partout.
  - Chaque couche va avoir besoin de champs ou d'éléments techniques qui lui sont spécifiques, par exemple des annotations liées à HTTP pour l'adapter web, des annotations d'ORM pour l'adapter de persistance. Nos entities auront donc **plusieurs raisons de changer**.
  - Tant que toutes les couches ont besoin des informations formatées de la même manière, cette stratégie marche. C'est le cas pour les **applications CRUD**.
  - A partir du moment où on commence à **gérer des problèmes spécifiques au web ou à la persistance dans l'hexagone**, alors il faut passer à une autre stratégie.
- **2- La two-way mapping strategy** consiste à avoir un modèle spécifique pour chacun des composants principaux (adapter web, hexagone et adapter de persistance), et de faire un mapping quand la donnée rentre, et un autre quand elle sort.
  - L'avantage c'est que cette séparation des modèles permet d'adapter leur structure pour les besoins de chaque couche : besoins web (ex: sérialisation JSON), besoins du modèle, besoins de la persistance (ex: ORM).
  - Le désavantage principal c'est le boilerplate conséquent.
    - Et même avec l'utilisation de librairies de mapping, les bugs sont compliqués à trouver parce que le mapping est caché.
  - Un autre désavantage c'est que malgré la séparation, les objets du modèle de l'hexagone sont quand même utilisés par les autres couches externes, ce qui fait qu'ils pourraient avoir besoin de changer pour des nécessités de ces couches.
- **3- La full mapping strategy** consiste à utiliser un mapping entre les 3 composants principaux comme pour la two-way mapping strategy, mais cette fois on va établir des **modèles d'input et d'output fins spécifiques à chaque use-case**.
  - On a encore plus de mapping que si on mappait juste les modèles des 3 composants, mais ce mapping va aussi être plus maintenable parce qu'il sera à chaque fois **spécifique au use-case** sans avoir besoin d'être adapté pour correspondre à de nouveaux besoins.
  - L'auteur conseille ce pattern plutôt entre l'adapter web et l'hexagone qu'entre l'hexagone et l'adapter de persistance (parce qu'il y aurait vraiment trop de mappings).
  - On pourra aussi faire des variantes, par exemple utiliser cette stratégie pour le modèle d'entrée dans l'hexagone depuis l'adapter web, mais renvoyer les objets du modèle de l'hexagone en sortie vers l'adapter web.
- **4 - La one-way mapping strategy** consiste à avoir une interface commune aux trois modèles de chacun des trois composants.
  - De cette manière les objets peuvent être passés sans devoir obligatoirement les mapper. Si le mapping est nécessaire, il suffira à la couche qui en a besoin de le faire.
  - Quand l'objet est passé de l'hexagone vers l'extérieur ils peuvent l'utiliser tel quel sans risquer de le modifier parce que les setters ne sont pas exposés.
  - Quand l'objet passe vers l'hexagone, il devra en général être mappé pour reconstruire le comportement riche du domaine.
    - On peut le faire avec le pattern Factory du DDD.
  - Cette stratégie a de l'intérêt quand les modèles sont proches.
    - Le modèle web peut facilement ne pas avoir besoin de mapper l'output venant de l'hexagone.
  - Le désavantage c'est que cette stratégie est plus difficile à appréhender étant donné son caractère non systématique.
- Il faut **adapter la stratégie** en fonction des cas d'usage et de leur nature, et pas adopter une seule stratégie pour toute la codebase.
  - On peut avoir des différences de stratégie en fonction :
    - Des lectures et écritures.
    - De la communication entre adapter web et hexagone, et hexagone et adapter de persistance.
- Il ne faut pas avoir peur de **changer de stratégie en cours de route**.
  - La plupart des applications commencent en étant CRUD, puis soit le restent, soit se complexifient suffisamment pour mériter un changement de stratégie de mapping.
  - L'équipe doit se mettre d'accord sur des stratégies à choisir pour chaque partie de la codebase, et surtout **noter pourquoi elle fait ce choix** pour pouvoir réévaluer plus tard si le choix doit être modifié ou non.
    - Il peut être intéressant aussi de noter dans quel cas elle prévoit de changer de stratégie.

## 9 - Assembling the Application

- Nous voulons garder l'inversion de dépendance entre les composants externes et l'hexagone.
  - Donc nous devons instancier les adapters pour les donner au constructeur des objets de l'hexagone par le mécanisme qui s'appelle l'**injection de dépendance**.
- Nous devons avoir un **composant de configuration** qui soit neutre du point de vue notre architecture, et qui ait **accès à tous les composants** pour les instancier.
  - Il va :
    - Créer les adapters web et s'assurer que les requêtes HTTP sont câblées aux bons adapters.
    - Créer les adapters de persistance et s'assurer qu'elles aient accès à la base de données.
    - Créer les use cases, et au moment de leur création, leur donner les adapters web et les adapters de persistance dans leur constructeur, pour qu'elles y aient accès (injection de dépendance).
  - Il va aussi passer certaines valeurs de configuration aux autres composants (serveur de base de données, serveur SMTP etc).
  - Il aura toutes les raisons de changer
- Côté implémentation :

  - On peut créer le composant avec du **code sans librairie** :

    ```typescript
    function main() {
      const accountRepository = new AccountRepository();
      const activityRepository = new ActivityRepository();
      const accountPersistanceAdapter = new AccountPersistanceAdapter(
        acountRepository,
        activityRepository
      );

      const sendMoneyUseCase = new SendMoneyService(accountPersistanceAdapter);

      const sendMoneyController = new SendMoneyController(sendMoneyUseCase);

      startProcessingWebRequests(sendMoneyController);
    }
    ```

    - Cette méthode a le désavantage d'amener à écrire beaucoup de code, et d'obliger à ce que les classes de chaque composant soient accessibles publiquement.

  - Parmi les techniques impliquant une librairie, en Java on a
    - Le classpath scanning où il s'agit d'annoter les classes de chaque composant et demander à Spring de scanner les classes pour trouver celles qu'il faut instancier et injecter.
      - Elle est plus rapide mais peut mener à des bugs difficiles à trouver parce que le système de scanning est obscur.
    - L'autre méthode c'est d'écrire des classes de configuration qui vont indiquer quelles classes doivent être instanciées et injectées.
      - On va écrire plus de code pour obtenir plus de découplage et de transparence sur ce qui est fait.

## 10 - Enforcing Architecture Boundaries

- Ce chapitre traite de la manière d'éviter que l'architecture choisie s'érode au fil du temps, causant un manque de clarté et une lenteur à faire des changements.
- La principale chose à faire respecter est le **sens des dépendances** parmi les couches (`domaine -> application -> adapters -> configuration`).
- On peut utiliser la **visibilité de package,** si le langage le permet (_package-private modifier_ en Java), pour rendre le contenu des couches plus cohésives.
  - Si on part du principe que notre composant de configuration est une librairie qui passe outre la visibilité de package et qu'elle peut instancier même les classes privées à leur package, alors on n'a que les relations entre couches à se préoccuper :
    - Les **adapters et les use cases peuvent être privés** au package de leur couche.
    - Les **entities du domaine doivent être publiques** pour être accédées par les couches du dessus, **de même que les ports** qui doivent être accédés par les adapters qui les implémentent.
- On peut aussi utiliser des **moyens au runtime** pour empêcher que le sens des dépendances s'inverse, par exemple **au moment des tests**.
  - En Java il y a la librairie ArchUnit qui permet de faire des tests d'architecture, y compris des tests sur le sens des dépendances, en vérifiant qu'un package ne dépend pas d'un autre package (importe rien qui vienne de lui).
  - On peut construire par dessus ce genre de librairie pour obtenir un DSL (Domain Specific Language) dans nos tests, qui vérifie les dépendances pour un bounded context donné :
    ```java
    HexagonalArchitecture.boundedContext("account")
      .withDomainLayer("domain")
      .withAdaptersLayer("adapter")
        .incoming("web")
        .outgoing("persistence")
        .and()
      .withApplicationLayer("application")
        .services("service")
        .incomingPorts("port.in")
        .outgoingPorts("port.out")
        .and()
      .withConfiguration("configuration")
      .check(new ClassFileImporter().importPackages("buckpal"));
    }
    ```
  - Attention par contre : ce genre de test est vulnérable aux refactorings. Il suffit que le nom des packages change et aucun problème ne sera trouvé sur des packages qui n'existent pas.
- On peut enfin profiter de la **phase de build** de notre application pour créer autant d'artefacts de build que nécessaire, et profiter de l'outil de build pour garantir les limites des composants de notre architecture.
  - On peut découper avec diverses granularités :
    - Une première solution c'est de faire 3 groupes de build : la configuration, les adapters, et l'application (hexagone).
    - On peut décider de séparer les types d'adapter pour qu'ils restent autonomes.
    - Un cran plus loin encore, on peut isoler les ports dans une unité à part. De cette manière on empêche la no mapping strategy.
    - On peut enfin aussi séparer les types entrants et sortants des ports pour plus de clarté, et séparer le domaine et l'application service dans deux unités pour empêcher le domaine d'accéder aux use cases.
  - Un des avantages c'est que l'outil de build nous empêchera d'avoir des dépendances circulaires entre nos unités de build, améliorant l'aspect single responsibility de nos modules.
  - Être obligé de maintenir un script de build permet aussi de faire des choix en conscience pour ce qui est du placement des diverses classes.
  - D'un autre côté c'est un certain travail de maintenance quand même, donc il vaut mieux que l'**architecture soit un minimum stable d'abord**.
- L'idée c'est de combiner les trois méthodes pour avoir une architecture solide dans le temps.
- A noter que plus on découpe finement, plus on devra faire de mappings.

## 11 - Taking Shortcuts Consciously

- Les raccourcis doivent être connus et compris pour être évités dans le but de garantir l'intégrité de l'architecture, et dans certains cas acceptés en toute conscience.
- La **théorie des vitres cassées** vient d'un psychologue (Philip Zimbardo) qui a conduit une expérience en laissant une voiture dans un quartier chaud, et une autre dans un quartier chic.
  - La première a été désossée rapidement puis les passants ont commencé à la dégrader.
  - La 2ème a été laissée intacte pendant une semaine. Puis le psychologue a cassé une de ses vitres, et à partir de là elle a été dégradée aussi vite que la première, par des gens de tout type.
  - L'idée est de dire que nous avons une tendance naturelle à en rajouter quand les choses sont déjà en mauvais état ou mal rangées. La même chose s'applique au code et à son architecture.
- Il est de la responsabilité des développeurs de garder **l'architecture la plus clean possible dès le début**.
  - On peut cependant prendre des **raccourcis choisis en conscience**, faire des compromis qu'on assume.
  - Pour que l'effet des vitres cassées soit limité, il faut **documenter les raccourcis choisis** par l'équipe dans des ADR (architecture Decision Record).
- Parmi les raccourcis possible dans l'architecture hexagonale on a :
  - Utiliser le **même modèle pour les inputs (ou les outputs) de deux use cases**.
    - La question à se poser est : est-ce que ces deux use cases sont voués à **évoluer ensemble** ou non ?
    - Si oui alors il faut que leurs inputs et leurs outputs aient des modèles séparés. Si non alors on peut (et on doit) les coupler au niveau de leurs inputs et outputs.
    - Il ne faut donc pas oublier de régulièrement reconsidérer si deux use cases imaginés comme voués à évoluer ensemble, ne doivent pas être désormais considérés de manière séparée.
  - Utiliser des **entities du domaine comme modèles d'entrée ou de sortie de la couche applicative**.
    - Il s'agit d'avoir les ports gauches (l'entrée et la sortie depuis l'adapter web vers l'hexagone) basés sur des domain entities.
    - En faisant ça on va être tenté d'ajouter des champs à l'entity du domaine à chaque fois qu'on en aura besoin dans notre input ou output de la couche applicative. Donc le domaine va dans une certaine mesure dépendre de l'application..
    - C'est **OK de le faire si on est sur des use cases simple type create/update** parce que dans ce cas c'est bien le contenu exact des domain entities qu'on veut.
    - Il ne faut pas oublier de reconsidérer régulièrement les use cases où on l'a fait et qui se sont complexifiés.
  - **Ne pas utiliser de ports entrants pour l'adapter web**.
    - Le sens du flow étant le même que le sens des appels pour l'adapter web, on peut très bien lui permettre d'appeler directement les use cases, sans passer par une interface.
    - On perd alors la clarté des points d'entrée qui ne sautent plus aux yeux aussi bien qu'avec des ports explicites.
    - On ne peut plus non plus utiliser des moyens pour forcer l'hexagone à ne pas dépendre de l'adapter web.
    - Cette technique est donc à réserver aux **petites applications, ou celles qui n'ont qu'un adapter web**.
  - **Ne pas créer d'application service**.
    - Parfois l'application service ne fait rien à part appeler une méthode dans l'adapter de persistance et retourner son résultat à l'adapter web. Dans ce cas, on peut laisser l'adapter web appeler directement l'adapter de persistance.
    - C'est le cas quand on a des **use cases CRUD**.
    - On a alors nos domain entities qui sont passés entre adapters gauches et droits.
    - Le **danger c'est que si la fonctionnalité se complexifie**, la logique métier sera ajoutée dans l'adapter de persistance. Il faut dans ce cas absolument créer un application service.
- La plupart des raccourcis sont adaptés aux fonctionnalités simples de type CRUD. On commence en général comme ça, et on réévalue les raccourcis si l'application se complexifie. Si elle reste simple on pourra garder les raccourcis.

## 12 - Deciding on an Architecture Style

- La question dans ce chapitre est : quand est-ce qu'il faut utiliser l'architecture hexagonale ?
  - La première chose c'est que **cette architecture met le domaine au centre** et l'isole du reste, pour pouvoir travailler dessus.
    - Si on n'a pas besoin de ça, on n'a sans doute pas besoin d'architecture hexagonale.
    - Ça va bien avec le DDD.
  - La deuxième chose c'est qu'il faut **expérimenter** cette architecture au moins sur un module de notre application, pour voir ce qu'elle apporte et voir où est-ce qu'on peut l'utiliser.
  - Et enfin la 3ème chose c'est que le choix de l'architecture **dépend de nombreux critères** :
    - Le type du logiciel.
    - Le rôle du domaine dans le code.
    - L'expérience de l'équipe.
    - etc.
    - NDLR : l'auteur ne se mouille pas beaucoup.
      - Pour info Vlad Khononov conseille dans Learning Domain Driven Design l'heuristique d'adopter l'architecture hexagonale dans le cas où on a un code subdomain et qu'on choisit les patterns tactiques du DDD, et d'adopter une architecture en couches sinon.
      - On peut imaginer qu'étant donné que l'auteur donne des raccourcis pour les use cases CRUD, y compris ceux qui resteront CRUD, il serait pour privilégier l'usage de l'architecture hexagonale la plupart du temps, en modulant avec ces raccourcis.
