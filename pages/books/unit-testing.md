# Unit Testing: Principles, Practices, and Patterns

## I - The bigger picture

### 1 - The goal of unit testing

- De nos jours, la plupart des entreprises créent des tests pour leurs logiciels.
  - En moyenne le ratio code de test / code de prod est entre 1/1 et 3/1 (en faveur du code de test), et parfois plus.
- Le but principal des unit tests c'est de **permettre une croissance durable du projet**. Sans eux, le temps de développement explose au bout d'un moment.
  - On appelle cette explosion la _software entropy_ : la désorganisation progressive du code.
- Le fait qu'un code soit **difficilement testable** est un signe de mauvaise conception à cause d'un couplage inapproprié. C'est un **bon indicateur négatif**. Par contre, si le code est testable, ça ne veut pas dire qu'il est bon, on ne peut pas en faire un indicateur positif.
- Les tests sont un code comme un autre, ils ont un **coût de maintenance**, et peuvent avoir une valeur nulle ou même négative. Il vaut mieux ne garder que les bons tests.
- Le **code coverage** est un **bon indicateur négatif** : si le code coverage est faible c'est que le code est peu testé. Par contre, si le coverage est élevé, on ne peut rien conclure : c'est un mauvais indicateur positif.
  - Le problème du coverage c'est :
    - Qu'**on ne peut pas s'assurer qu'on vérifie tout ce qui est fait**. Par exemple, si un code renvoie un résultat et assigne ce résultat dans une variable globale, et que le test vérifie seulement l'une de ces choses, on ne pourra pas savoir que l'autre n'est pas testée malgré le coverage de 100%.
    - Qu'**on ne teste pas les chemins permis par nos dépendances**. On délègue souvent des responsabilités à des dépendances qui permettent beaucoup de flexibilité, mais sans tester chaque possibilité offerte. Et on ne peut pas vérifier qu'on le fait.
      - Le simple fait de faire un `parseInt(variable)` fera que `variable` marchera dans des cas précis supportés par la fonction standard `parseInt()`. Pour autant, on ne peut pas s'assurer de tester chacun de ces chemins et leurs conséquences avec notre code.
  - Se fixer le coverage comme **target** crée un incentive pervers qui va à l'encontre de l'objectif du unit testing. Le coverage doit rester un **indicateur** (négatif).
- Le **branch coverage** est une autre forme de coverage qui compte le nombre d'embranchements (if, switch etc.) testés sur le nombre total d'embranchements. C'est un peu mieux que le code coverage, mais ça reste pour autant seulement un indicateur négatif.
- Un **bon test** c'est un test qui :
  - est intégré au cycle de développement, exécuté le plus souvent possible.
  - teste les parties les plus importantes de la codebase. En général c'est la logique business.
  - offre une grande valeur comparé aux coûts de sa maintenance.

### 2 - What is a unit test?

- Il existe deux écoles de unit testing : la **classical school** (qu'on pratiquait à l'origine), et la **London school**, qui est née à Londres.
  - Un livre canonique pour le style classique est **_Test-Driven Development: By Example_** de Kent Beck, et un livre pour le style London est **_Growing Object -Oriented Software, Guided by Tests_** de Steve Freeman et Nat Pryce.
- Un **unit test** est un test qui vérifie une **unité de code**, de manière **rapide**, et **isolée**.
- Le code testé peut avoir des dépendances.
  - Les **shared dependencies** sont celles qui affectent les tests entre eux parce qu'ils sont changés par le code et ne sont pas réinitialisés entre les tests. Par exemple, une base de données est shared. Elle pourrait ne pas l'être si elle était instanciée à chaque test.
  - Les **private dependencies** sont celles qui ne sont pas partagées.
  - Les **out-of-process dependencies** sont celles qui sont exécutées dans un autre processus. Elles impliquent un temps d'exécution plus important que de rester dans le même processus que le code exécuté. La base de données est out-of-process, même si on l'instancie à chaque fois.
  - Les **volatile dependencies** sont soit non installées sur un environnement par défaut (c'est le cas d'une base de données, mais pas d'un filesystem par exemple), soit on un comportement non déterministe (par exemple `new Date()`).
  - A propos de la gestion de dépendances, l'auteur conseille **_Dependency Injection: Principles, Practices, Patterns_** de Steven Deursen et Mark Seemann.
- On appellera par la suite
  - **collaborators** les dépendances qui sont soit shared, soit mutables (un objet utilisé par l'objet qu'on teste, la base de données etc.)
  - **values** les dépendances qui sont immutables (par exemple un Value Object, le nombre 5 etc.).
- La controverse entre les deux écoles porte sur **l'isolation** :
  - Pour la London school l'isolation porte sur le code testé.
    - Tout collaborator qui n'est pas directement testé doit être remplacé dans les tests par un **test double** (c'est le terme générique, le terme _mock_ est une forme particulière de test double). On tolère seulement les dépendances immutables (les values).
    - **Le “unit” c'est l'unité de code (la classe)**, donc on a un fichier de test par classe.
    - Avantages :
      - Ça permet de tester du code même très couplé, en remplaçant simplement les dépendances dans les tests par des doubles.
      - Ça permet d'être sûr que seul un test ne marchera plus si une fonctionnalité ne marche plus.
    - Inconvénients :
      - Ça ne force pas à faire du code découplé.
      - Les tests cassent facilement au moindre refactoring.
  - Pour la classical school l'isolation porte sur les tests entre eux : il faut pouvoir les jouer en parallèle sans qu'ils s'affectent mutuellement.
    - On n'utilise les doubles que très peu, seulement pour éliminer les shared dependencies.
    - **Le “unit” c'est le comportement (la fonctionnalité)**, et celle-ci peut contenir plusieurs classes qui seront toutes instanciées indirectement dans les tests.
    - Avantages :
      - Ca force à faire du code découplé.
      - Cela permet d'avoir des tests qui collent mieux au cas d'usage business, et qui sont moins fragiles aux refactorings.
    - Inconvénients :
      - Si une fonctionnalité ne marche pas, plusieurs tests peuvent casser.
        - Mais si on rejoue tous les tests à chaque changement de code, on peut savoir que c'est lui qui vient de faire passer les tests au rouge.
        - Et en plus si un changement casse beaucoup de tests, ça permet de savoir que cette partie du code est très importante.
- Les deux écoles ont aussi une différence dans leur rapport au TDD :
  - La London school va avoir tendance à faire du **outside-in TDD**, en construisant d'abord les classes de plus haut niveau utilisant des collaborators sous forme de test doubles. Puis les implémenter petit à petit en allant vers le détail.
  - La classical school va plutôt mener à du **inside-out TDD**, en partant des classes les plus bas niveau dans le modèle, pour construire par-dessus jusqu'aux couches supérieures.
- Un **test d'intégration** est un test qui ne répond pas à une des 3 caractéristiques du test unitaire (tester une unité, de manière rapide et isolée).
  - Pour la London school, les caractéristiques sont :
    - Vérifier le comportement d'une seule classe.
    - Le faire vite.
    - Le faire en isolation vis-à-vis des dépendances de cette classe (grâce aux doubles).
  - Pour la classical school :
    - Vérifier le comportement d'une unité de comportement.
    - Le faire vite.
    - Le faire avec des tests isolés les uns par rapport aux autres.
  - Du coup pour savoir ce qui est test d'intégration :
    - La plupart des tests unitaires selon la classical school sont des tests d'intégration pour la London school puisqu'ils font intervenir plusieurs classes.
    - Un test qui teste plusieurs unités de comportement sera un test d'intégration pour la classical school.
    - Dans le cas où on a une out-of-process dependency (comme une DB) impliquée, les tests sont lents donc on sera sur des tests d'intégration pour les deux écoles.
    - Si on a une shared dependency (comme une DB) impliquée, là encore on aura un test d'intégration pour les deux écoles.
- Un **test end-to-end** est un test d'intégration qui teste toutes les dépendances out-of-process (ou la plupart d'entre elles), là où les autres tests d'intégration n'en testent qu'une ou deux (genre juste la DB, mais pas RabbitMQ ou le provider d'emails).
- Dans la suite du livre l'auteur va plutôt adopter l'approche classique, parce que c'est celle qu'il préfère et celle qui est la plus courante.

### 3 - The anatomy of a unit test

- Les tests unitaires doivent être structurés avec les 3 blocs Arrange, Act, Assert (qu'on appelle aussi Given, When , Then) :
  - **Arrange** : Il peut être aussi gros que les deux autres sections réunies. S'il est plus gros, il est conseillé de l'extraire dans une fonction pour augmenter la lisibilité.
    - Avoir une méthode unique (constructeur de la classe de tests, ou `beforeAll `/ `BeforeEach` global) est une moins bonne idée puisqu'on couple les tests ensemble, et que ce que possède chaque test est moins clair.
    - L'idéal c'est avoir des fonctions de type factory configurables, qu'on peut réutiliser dans les tests en sachant depuis le test à peu près ce qu'on crée.
  - **Act** : Il ne devrait faire qu'**une ligne** vu qu'on est censé vérifier une unité de comportement. S'il fait plus, c'est qu'on a la possibilité de faire une partie de la chose et pas l'autre, ce qui peut vouloir dire qu'on est en état de **casser un invariant**, et donc qu'on a une mauvaise encapsulation de notre code.
    - Exemple : si notre act c'est deux lignes qui font :
      ```typescript
      customer.purchase(item);
      store.removeFromInventory(item);
      ```
      C'est que l'un peut être fait sans l'autre au niveau de l'interface publique (celle-là même qui est testée). C'est un danger qu'on s'impose pour rien. Une seule méthode publique devrait faire les deux.
  - **Assert** : Vu qu'on vérifie une unité de comportement, il peut y avoir plusieurs outcomes, donc plusieurs asserts.
    - Attention quand même, si cette section grossit trop, c'est peut être le signe d'une mauvaise abstraction du code. Par exemple, si on doit comparer toutes les propriétés d'un objet un par un, et qu'on aurait pu implémenter l'opérateur d'égalité sur l'objet en question, et ne faire qu'un assert.
- On écrit en général d'abord la partie arrange si on a déjà écrit le code, et d'abord la partie assert si on fait du TDD.
- Quand on teste plusieurs unités de comportement, on se retrouve par définition avec un test d'intégration. Il vaut mieux revenir sur de l'unitaire si possible.
- Il faut **éviter les `if` dans les tests**. Ça complique la compréhension et la maintenance.
- Pour **repérer facilement l'objet qu'on teste**, et ne pas le confondre avec des dépendances, l'auteur conseille d'appeler l'objet testé **sut** (pour System Under Test) :
  ```typescript
  // Arrange
  const sut = new Calculator();
  // Act
  const result = sut.sum(3, 2);
  // Assert
  expect(result).toBe(5);
  ```
- Pour bien **séparer les 3 sections** AAA l'une de l'autre, l'auteur conseille :
  - Soit de laisser une ligne entre chaque section.
  - Soit, si certaines sections doivent déjà sauter des lignes parce qu'elles sont longues, de laisser en commentaire `//Arrange`, `//Act` et `//Assert`
- A propos de la manière de **nommer les tests** :
  - Vu que les tests testent un comportement, le nom des tests doit être une phrase, qui **a du sens pour les experts métier**.
    - Sauf dans le cas où on teste des fonctions utilitaires, qui n'ont donc pas de sens pour les experts métier.
  - Il faut éviter de mettre le nom du SUT (la fonction testée) dans le nom du test. Ça oblige à changer le nom du test si le nom de la fonction change, et ça n'apporte pas grand chose puisque c'est le comportement qui nous intéresse.
  - Il vaut mieux **être spécifique** dans le nom du test. Par exemple, si on teste qu'une date est invalide si elle est au passé, préciser ça plutôt que de rester vague en parlant simplement de vérifier si la date est valide.
- On peut utiliser les **tests paramétrisés** pour grouper des tests dont seule une valeur d'entrée et la valeur attendue change. Par exemple tester avec la date d'aujourd'hui, avec la date de demain, etc.
  - Attention quand même, faire ce genre de regroupement a un coût en lisibilité. Donc à faire que si les tests sont simples.
  - Il faut éviter de mettre dans le même test les cas positifs et les cas négatifs.
  - En général, le framework de test fournit la possibilité de paramétriser les tests, en acceptant une liste de paramètres à faire varier en entrée du test.

## II - Making your tests work for you

### 4 - The four pillars of a good unit test

- Dans ce chapitre on pose des critères pour **évaluer la qualité d'un test**.
- Un bon test a 4 caractéristiques fondamentales :
  - **1- Protéger des régressions **: éviter les bugs**.**
    - Pour évaluer ce point on peut prendre en compte :
      - La quantité de code exécutée : plus il y en a plus c'est fiable.
      - La complexité du code exécuté.
      - L'importance du code : tester du code du domaine est plus utile que de tester du code utilitaire.
  - **2- Résister aux refactorings** : à quel point on peut refactorer sans casser le test.
    - Pour évaluer ce critère, on peut regarder si le test produit souvent des faux positifs pendant les refactorings.
    - L'intérêt de ce critère c'est que si on a trop de faux positifs :
      - On porte de moins en moins attention au résultat des tests puisqu'ils disent souvent n'importe quoi : et on laisse passer de vrais bugs.
      - On n'ose plus refactorer le code, puisqu'on n'a pas confiance dans les tests. Et le code pourrit.
    - Ce qui fait casser les tests pendant les refactorings c'est souvent le **couplage aux détails d'implémentation**, au lieu de porter sur un comportement attendu du point de vue métier.
      - Pour avoir une idée de ce que veut dire “tester les détails d'implémentation”, l'exemple le plus extrême de ce genre serait un test qui vérifierait simplement que le code source de la fonction testée est bien le code source attendu dans le test. Ce test casserait littéralement à chaque changement.
      - Sans aller jusqu'à cet extrême, on retrouve souvent des tests qui vérifient la structure interne d'un objet, ou qu'une fonction appelle telle ou telle autre fonction etc. sans que ça n'ait aucun intérêt d'un point de vue métier.
  - **3- Donner un feedback rapide** : à quel point on peut exécuter le test vite.
    - Plus le test est lent, moins souvent on l'exécutera.
  - **4- Être maintenable** : il y a deux composantes :
    - A quel point c'est difficile de comprendre le test. Ça dépend de la taille du test, de la lisibilité de son code.
    - A quel point c'est difficile de lancer le test. Par exemple à cause de la database qui doit être en train de tourner etc.
- Les deux premiers piliers caractérisent la précision (accuracy) du test.
  - La protection contre les régressions dépend de la capacité à ne pas avoir de faux négatifs (bugs présents mais ratés par les tests). C'est le fait d'avoir le bon signal.
  - La résistance aux refactorings dépend de la capacité à ne pas avoir de faux positifs (fausses alarmes). C'est l'absence de bruit.
  - Au début du projet, les faux positifs (les bugs pas couverts) ont la plus grande importance. Mais à mesure que le projet avance, les faux négatifs deviennent de plus en plus gênants et empêchent de garder le code sain en le refactorant.
    - Donc si on est sur un projet moyen ou gros, il faut **porter une attention égale aux faux positifs et aux faux négatifs**.
- On peut noter un test sur chacun des 4 critères, et lui **donner une note** finale qui nous aidera à **décider si on le garde ou non** (pour rappel : garder un test n'est pas gratuit, ça implique de la maintenance).
  - On peut évaluer (subjectivement) la valeur du test à chacun des 4 critères, entre 0 et 1, puis multiplier ces quatre valeurs pour avoir le résultat final.
    - Ca implique donc qu'un test qui vaut zéro à l'un des critères aura une valeur finale de zéro. On ne peut pas négliger un des critères.
  - On ne peut malheureusement pas obtenir la note maximale partout, parce que les 3 premiers critères ont un caractère exclusif entre eux : on ne peut en avoir que deux parfaits.
    - Les tests end to end, par exemple, maximisent la protection vis-à-vis des régressions parce qu'ils exécutent beaucoup de code, et sont résistants aux refactorings vu qu'ils testent depuis ce que voit l'utilisateur final. Par contre ils sont très lents.
    - Et si on a des tests très rapides, en général on n'obtiendra pas à la fois un découplage et donc une résistance aux refactorings, et en même temps une capacité à arrêter tous les bugs.
  - La règle à retenir c'est que **la résistance aux refactorings est non-négociable**, pour la raison que ce critère est assez binaire : soit on est bien découplé, soit non. Et si on ne l'est pas, la valeur du test passe à zéro.
    - Le choix qui reste c'est donc la possibilité de faire varier le curseur entre la rapidité du test, et sa capacité à empêcher les régressions.
- Si on examine notre **pyramide de tests** (unit, integration, e2e), on maximisera d'abord le critère non-négociable de résistance aux refactorings pour tous, puis :
  - Les tests unitaires sont les plus rapides et protègent le moins, puis on a les tests d'intégration qui sont au milieu, et les tests e2e sont très lents et protègent le plus.
  - En général on a peu de tests e2e parce que leur extrême lenteur diminue beaucoup leur valeur. Et ils sont aussi difficiles à maintenir.
  - Pour les projets classiques on aura une pyramide, et pour les projets très simples (CRUD etc.), on pourra se retrouver avec un rectangle.
- Le black-box testing consiste à tester sans prendre en compte la structure interne, seulement avec les considérations business. Le white-box testing consiste à faire l'inverse.
  - Le white-box testing menant à du code couplé aux détails d'implémentations, il n'est pas résistant aux refactorings, donc il ne faut pas l'utiliser (sauf pour analyser).

### 5 - Mocks and test fragility

- Il y a principalement deux types de **test doubles** :
  - 1- Les **mocks** qui aident à émuler et examiner les **interactions sortantes**, c'est-à-dire le cas où le SUT interagit pour changer l'état d'une de ses dépendances.
    - On pourrait voir le mock comme la commande du pattern CQS.
    - Il existe une petite distinction avec les **spies** qui sont des mocks écrits à la main, alors que les mocks sont en général générés par une librairie de mock.
  - 2- Les **stubs** qui aident à émuler les **interactions entrantes**, c'est-à-dire le cas où une des dépendances fournit une valeur utilisée par le SUT.
    - On pourrait voir le stub comme la query du pattern CQS.
    - Il existe des sous ensemble de stubs :
      - le **dummy** qui est très simple
      - le **stub** qui est plus sophistiqué, et retourne la bonne valeur en fonction du cas
      - et le **fake** qui est un stub utilisé pour remplacer un composant qui n'existe pas encore (typique de l'école de Londres).
- Le mot mock peut vouloir dire plusieurs choses, ici on l'utilise pour sa définition principale de sous ensemble de test double, mais parfois il est utilisé pour désigner tous les tests doubles, et parfois il désigne l'outil (la librairie qui permet de créer des mocks et des stubs).
- **Vérifier les interactions sur des stubs est un antipattern** : les stubs émulent des données entrantes, et donc vérifier que le stub a bien été appelé relève du couplage à des détails d'implémentation.
  - Les interactions ne doivent être vérifiées que sur des mocks, c'est-à-dire des interactions sortantes, dans le cas où l'appel qu'on vérifie a du sens d'un point de vue business.
- La distinction entre **comportement observable** et **détail d'implémentation** :
  - Il faut d'abord choisir le client qu'on considère, puis vérifier si notre code lui permet :
    - Soit d'exécuter une opération pour faire un calcul ou un side effect pour atteindre ses objectifs.
    - Soit d'utiliser un état pour atteindre ses objectifs.
  - Si oui, alors on a un comportement observable, si non alors notre code est un détail d'implémentation.
  - Le choix du client considéré est important, on reviendra sur cet aspect dans la suite.
- Si l'API publique coïncide avec le comportement observable, alors on dira que notre système est bien conçu.
  - Sinon, on dira qu'il fait **fuiter des détails d'implémentation**. Parce que des détails d'implémentation pourront alors être accédés de manière publique sans protection (sans encapsulation).
    - Exemple : Le cas où le renommage de l'utilisateur se faisait en deux temps : renommer, puis appeler la fonction de normalisation qui coupe le nom à 50 caractères max. Ici la fonction de normalisation ne permet d'atteindre aucun objectif du client qui l'appelle (il voulait juste renommer), pourtant elle est publique. On a donc un problème de fuite.
    - Un bon moyen de savoir si on fait fuiter des détails d'implémentation, c'est de voir les cas où on a besoin de plus d'une opération pour atteindre un objectif du client (le “act” du test).
- L'**architecture hexagonale** consiste en plusieurs hexagones communiquant entre eux.
  - Chaque hexagone est constitué de deux couches :
    - Le **domain layer** qui n'a accès qu'à lui-même et qui contient les règles et invariants business de l'application.
      - Il est une collection de domain knowledge (how-to).
    - L'**application service layer** qui orchestre la communication entre le domain layer et le monde externe. Elle instancie des classes importées du domain layer, leur donne les données qu'elle va chercher en base, les sauve à nouveau en base, répond au client etc.
      - Elle est est une collection de use-cases business (what-to).
  - Le terme hexagone est une image, chaque face représente une connexion à un autre hexagone, mais le nombre n'a pas besoin d'être 6.
  - Au sein de chaque couche, le client est la couche d'au-dessus, et donc ce sont ses objectifs qui sont pris en compte pour savoir si on lui expose des détails d'implémentation ou non.
    - Les objectifs du client final sont transcrits en objectifs secondaires dans la couche du dessous, et donc on a une relation fractale qui permet à **tous les tests d'avoir toujours un rapport avec un requirement business** (Les objectifs de l'application service layer sont des sous-objectifs du client final).
      - NDLR : un peu comme les OKR.
  - Exemple :
    ```typescript
    // domain layer
    class User {
      setName(newName: string) {
        // On normalise et on set la valeur.
      }
    }
    // application service layer
    class UserController {
      renameUser(userId: number, newName: string) {
        const user: User = getUserFromDatabase(userId);
        user.setName(newName);
        saveUserToDatabase(user);
      }
    }
    ```
- Pour savoir **quand utiliser les mocks** sans abimer la résistance au refactoring, il faut se demander si l'interaction sortante qu'on veut vérifier est interne à notre application (notre hexagone par exemple), ou porte vers des systèmes externes.
  - Si l'interaction est **interne**, alors il ne faut pas mocker, même s'il s'agit d'une dépendance out-of-process comme une base de données. Tant qu'elle n'est visible que depuis notre application, elle est un détail d'implémentation pour nos clients.
  - Si l'interaction est **externe**, et donc visible par nos clients externes, alors il faut vérifier qu'elle se fait correctement par un mock. Par exemple, l'envoi d'un email répond à un besoin client, donc il faut vérifier que l'appel vers le système externe se fait correctement.
  - Pour parler un peu des écoles : l'école de Londres préconise de mocker toutes les dépendances mutables, ça fait beaucoup trop de mocks. Mais l'école classique préconise de mocker aussi des choses en trop : typiquement la base de données qui est une shared dependency. On peut au lieu de mocker nos interactions avec elle, la remplacer intelligemment par autre choses dans nos tests (cf. les deux prochains chapitres).

### 6 - Styles of unit testing

- Il y a 3 “styles” de tests :
  - **Output-based** : c'est quand il n'y a pas de side effect, et qu'on teste une fonction qui prend des paramètres, et renvoie quelque chose. Il s'agit de fonction pure, donc de programmation fonctionnelle.
  - **State-based** : on fait une opération, et on vérifie l'état d'un objet.
  - **Communication-based** : on utilise des mocks pour vérifier qu'un appel à une fonction a été fait avec les bons paramètres.
- A propos des écoles de test :
  - L'école classique préfère le state-based plutôt que la communication based.
  - L'école de Londres fait le choix inverse.
  - Et toutes les deux utilisent l'output-based testing quand c'est possible.
- On peut comparer les 3 styles de test vis-à-vis des 4 critères d'un bon test :
  - Pour la protection contre les régressions et la rapidité de feedback les 3 styles se valent à peu près.
  - Concernant la résistance au refactoring :
    - L'output-based testing offre la meilleure résistance parce que la fonction se suffit à elle-même.
    - Le state-based testing est un peu moins résistant parce que l'API publique exposée est plus importante, et donc les chances de faire fuiter des détails d'implémentation dans la partie publique sont plus grandes.
    - Le communication-based testing est le plus fragile, et nécessite une grande rigueur pour ne pas coupler à des détails d'implémentation.
  - Concernant la maintenabilité : c'est à nouveau l'output-based qui est le plus maintenable parce que prenant le moins de place, suivi du state-based, et enfin du communication-based qui prend beaucoup de place avec ses mocks et stubs.
  - **Globalement l'output-based testing est le meilleur**, mais il nécessite d'avoir du code écrit de manière fonctionnelle.
- A propos de la programmation fonctionnelle, l'auteur conseille les livres de Scott Wlaschin.
- Pour pouvoir faire de l'output-based testing, il faut écrire du code avec des **fonctions pures**, c'est-à-dire qui renvoient le même résultat à chaque fois qu'on donne les mêmes paramètres, sans qu'il n'y ait d'inputs ou d'outputs cachés.
  - Parmi ces choses cachées, on a :
    - Les **side-effects** : des outputs cachés, par exemple la modification d'un état d'une classe, l'écriture dans un fichier etc.
    - Les **exceptions** : elles créent un chemin alternatif à celui de la fonction, et peuvent être traitées n'importe où dans la stack d'appel.
    - La **référence à un état** interne ou externe : un input caché qui va permettre de récupérer une valeur qui n'est pas indiquée dans la signature de la fonction.
  - Pour savoir si on a une fonction pure, on peut essayer de remplacer son appel par la valeur qu'elle devrait renvoyer, et vérifier que le programme ne change pas de comportement. Si oui on a une _referential transparency_.
- L'**architecture fonctionnelle** consiste à maximiser la quantité de code écrite de manière fonctionnelle (fonctions pures, avec valeurs immutables), et confiner le code qui fait les side-effects à un endroit bien précis.
  - 1- Il y a le code qui prend les décisions, qui est sous forme de fonctions pures. C'est le **functional core**.
  - 2- Et le code qui agit suite aux décisions, qui prend les inputs et crée les side-effects (UI, DB, message bus etc.). C'est le **mutable shell**.
  - On va couvrir le functional core par de nombreux tests unitaires output-based, et couvrir le mutable shell qui est la couche d'au-dessus par des tests d'intégration moins nombreux.
  - L'architecture fonctionnelle est en fait un **cas particulier de l'architecture hexagonale** :
    - Les deux ont bien deux couches organisées par inversion de dépendance.
    - La différence principale c'est que l'architecture fonctionnelle exclut tout side-effect du functional core vers le mutable shell, alors que l'architecture hexagonale permet les side-effects dans la couche domaine tant que ça n'agit pas au-delà de cette couche (DB par exemple).
- Exemple d'application peu testable, refactorée vers la functional architecture :

  - Description :
    - On a un système d'audit qui enregistre tous les visiteurs d'une organisation.
    - Le nom de chaque visiteur et la date sont ajoutés à un fichier de log.
    - Quand le nombre de lignes max du fichier est atteint, on écrit dans un autre fichier.
  - Initialement la classe `AuditManager` a une méthode `addRecord()` qui va lire les fichiers existants, les classer pour trouver le dernier. Puis vérifier s'il est plein pour soit écrire dedans, soit écrire dans dans un nouveau.

    - **La logique et la lecture/écriture sont dans la même fonction**. Donc les tests vont être à la fois lents, et difficiles à paralléliser à cause de la dépendance out-of-process partagée qu'est le filesystem.

      ```typescript
      public class AuditManager {
      constructor(
          public maxEntriesPerFile: number,
          public directoryName: string
          ) {}

      addRecord(visitorName: string, timeOfVisit: Date) {
          // Get all files in the given directory
          const fs = require('fs');
          const files = fs.readdirSync(directoryName);
          // Build the record content

          // If no file, create one with our record
          fs.writeFile(...

          // Sort by file name to get the last one
          // If file's lines do no exceed max, write inside
          // Otherwise create a new file and write inside
      }
      }
      ```

  - Une 1ère étape est d'**utiliser des mocks** pour découpler le filesystem de la logique :

    - Une des manières de faire ça c'est d'injecter un objet qui respecte une interface `IFileSystem`, qui sera soit le vrai filesystem, soit un mock dans les tests.
    - Le mock va à la fois servir de stub pour renvoyer le contenu des fichiers, et aussi de mock pour vérifier qu'on appelle bien la bonne fonction avec les bons paramètres pour écrire dans le filesystem. L'usage du mock ici est légitime parce que ces fichiers sont user-facing.

      ```typescript
      public class AuditManager {
      constructor(
          public maxEntriesPerFile: number,
          public directoryName: string,
          public fileSystem: IFileSystem,
          ) {}

      addRecord(visitorName: string, timeOfVisit: Date) {
          const files = fileSystem.readdirSync(directoryName);
          // Build the record content

          // If no file, create one with our record
          fileSystem.writeFile(...

          // Sort by file name to get the last one
          // If file's lines do no exceed max, write inside
          // Otherwise create a new file and write inside
      }
      }
      ```

      ```typescript
      it("creates a new file when the current file overflows", () => {
        const fileSystemMock: IFileSystem = {
          readdirSync: () => ["audits/audit_1.txt", "audits/audit_2.txt"],
          writeFile: jest.fn(),
          // ...
        };
        const sut = AuditManager(3, "audits", fileSystemMock);

        sut.addRecord("Alice", new Date("2019-04-06"));

        expect(fileSystemMock.writeFile).toHaveBeenCalledTimes(1);
        expect(fileSystemMock.writeFile).toHaveBeenCalledWith(
          "audits/audit_3.txt",
          "Alice; 2019-04-06"
        );
      });
      ```

    - On n'a rien changé à la protection contre les régressions et à la résistance aux refactorings. Par contre on a rendu les tests plus rapides, et on a un peu amélioré la maintenabilité parce qu'on n'a plus à se préoccuper du filesystem. Mais le setup des mocks est verbeux, on peut faire mieux sur la maintenabilité.

  - La 2ème étape est de **refactorer vers la functional architecture** :

    - `AuditManager` ne connaît plus du tout l'existence du filesystem : il reçoit des valeurs en entrée (une liste de `FileContent` à partir duquel il lira le contenu des fichiers), et renvoie des valeurs en sortie : une liste de `FileUpdate` qui contiendront les contenus à changer).

      ```typescript
      class AuditManager {
        constructor(public maxEntriesPerFile: number) {}

        addRecord(
          files: FileContent[],
          visitorName: string,
          timeOfVisit: Date
        ) {
          // Build the record content
          // If no file, create one with our record
          if (files.length === 0) {
            return new FileUpdate("audit_1.txt", newRecord);
          }

          // Sort by file name to get the last one
          // If file's lines do no exceed max, write inside
          // Otherwise create a new file and write inside
        }
      }
      ```

      ```typescript
      class FileContent {
        constructor(public fileName: string, public lines: string[]) {}
      }
      class FileUpdate {
        constructor(public fileName: string, public newContent: string) {}
      }
      ```

    - On a une classe `Persister` qui va permettre de lire tous les fichiers, et de renvoyer leurs informations sous forme de `FileContent`, et une autre méthode pour prendre une liste de `FileUpdate`, et les appliquer sur le filesystem. Il doit être le plus simple possible pour que le max de logique soit dans `AuditManager`.

      ```typescript
      const fs = require("fs");

      class Persister {
        readDirectory(directoryName: string): FileContent[] {
          return fs.readdirSync(directoryName).map((file) => {
            return new FileContent(file.name, file.lines);
          });
        }

        applyUpdate(filePath: string, update: FileUpdate) {
          fs.writeFile(filePath, update);
        }
      }
      ```

    - Pour faire fonctionner ensemble le functional core (`AuditManager`), et le mutable shell (`Persister`), on a besoin d'une autre classe de type “application service” (pour utiliser la terminologie de l'hexagonal architecture).

      - Il va manipuler manipuler `Persister` pour obtenir les données des fichiers, les donner à une instance d'`AuditManager`, puis appeler la méthode de calcul sur `AuditManager`, récupérer les commandes d'écriture en sortie, et les donner à `Persister` pour mettre à jour le filesystem.

        ```typescript
        class ApplicationService {
          constructor(public directoryName: string, maxEntriesPerFile: number) {
            this.auditManager = new AuditManager(maxEntriesPerFIle);
            this.persister = new Persister();
          }

          addRecord(visitorName: string, timeOfVisit: Date) {
            const files: FileContent[] = this.persister.readDirectory(
              this.directoryName
            );
            const update: FileUpdate = this.auditManager.addRecord(
              files,
              visitorName,
              timeOfVisit
            );
            this.persister.applyUpdate(this.directoryName, update);
          }
        }
        ```

    - On a gardé les précédents avantages, et on a amélioré la maintenabilité en éliminant le setup de mocks verbeux, remplacés par la simple instanciation de valeurs mis dans les objets `FileContent` et `FileUpdate`.

      ```typescript
      it("creates a new file when the current file overflows", () => {
        const sut = new AuditManager(3);
        const files = [
          new FileContent("audits/audit_1.txt", []),
          new FileContent("audits/audit_1.txt", [
            "Peter; 2019-04-06",
            "Jane; 2019-04-06",
            "Jack; 2019-04-06",
          ]),
        ];

        const update = sut.addRecord(files, "Alice", new Date("2019-04-06"));

        expect(update.fileName).toBe("audit_3.txt");
        expect(update.newContent).toBe("Alice; 2019-04-06");
      });
      ```

    - Pour rester sur du fonctionnel, on peut renvoyer les erreurs par valeur de retour, et décider de quoi en faire dans l'application service.

- **La functional architecture n'est pas toujours applicable**.
  - Elle permet d'avoir des avantages en termes de maintenabilité du code et des tests, mais elle a des désavantages :
    - Le code pourra **être un peu plus gros** pour permettre la séparation entre logique et side effects.
    - Le code pourra **souffrir de problèmes de performance**.
      - Dans notre cas, ça a marché parce qu'on lisait tous les fichiers avant d'appeler la logique en donnant tous ces contenus et la laissant décider. Si on avait voulu n'en lire que certains en fonction de paramètres décidés par la logique, on n'aurait pas pu la garder comme fonction pure.
      - Une autre solution aurait pu être de concéder un peu de centralisation de la logique dans le core en faveur de la performance, en laissant la décision de charger les données ou non à l'application service.
  - Il faut donc **appliquer la functional architecture stratégiquement**.
    - Ne pas sacrifier la performance si elle est importante dans le projet.
    - L'appliquer si le projet est censé durer dans le long terme, et que l'investissement initial de séparer en vaut la peine.
- En général (surtout si on fait de l'OOP), on aura une combinaison de tests state-based et output-based, et quelques tests communication-based.
  - Le conseil ici c'est de privilégier les tests output-based quand c'est raisonnablement possible.

### 7 - Refactoring toward valuable unit tests

- Les tests et le code sont profondément liés, il est impossible d'obtenir de **bons tests avec du mauvais code**.
- On va catégoriser le code en 4 catégories, en fonction de 2 axes :
  - L'axe de **complexité ou d'importance vis-à-vis du domaine**.
    - La complexité cyclomatique est définie par le nombre de branches possibles dans le code : 1 + le nombre de branches.
      - Le calcul tient compte du nombre de prédicats dans les conditions : si notre if vérifie 2 prédicats, ça ajoute 2 points.
    - L'importance vis-à-vis du domaine c'est la connexion du code avec le besoin de l'utilisateur final. Du code utilitaire ne rentrera pas là-dedans.
    - C'est la complexité **ou** l'importance domaine. Un code signifiant du point de vue du domaine mais simple rentre dans la description.
  - L'axe du **nombre de collaborators** impliqués.
    - Pour rappel un collaborator est une dépendance, qui est soit mutable (autre chose que des valeurs primitives et des value objects), soit out-of-process.
- Les 4 catégories de code sont :
  - **Domain models and algorithms** : grande valeur sur l'axe de complexité, faible valeur sur l'axe des collaborators.
    - C'est eux qu'il faut le plus tester, à la fois parce qu'ils sont faciles à tester et parce qu'on obtiendra une grande résistance aux régressions. C'est d'eux qu'on obtient le meilleur “retour sur investissement” de nos tests.
  - **Trivial code** : faible valeur sur les deux axes.
    - C'est du code simple, qui ne mérite pas de tests.
  - **Controllers** : faible valeur sur l'axe de complexité, grande valeur sur l'axe des collaborators.
    - Il s'agit de code pas complexe mais qui coordonne le code complexe ou important.
    - On peut les tester avec des tests d'intégration qui seront beaucoup moins nombreux que les unit tests des domain models and algorithms.
  - **Overcomplicated code** : grande valeur sur les deux axes.
    - Là on est embêté : c'est à la fois du code qu'on ne peut pas se permettre de ne pas tester, et du code difficile à tester. Par exemple des fat controllers qui font tout eux-mêmes.
    - On va chercher à se débarrasser de ce code en le découpant, pour obtenir du code qui score beaucoup sur l'un des axes mais jamais les deux.
- Le **Humble Object Pattern** va nous permettre de découpler la logique de la partie difficile à tester (par difficile on entend code asynchrone/multi-thread, UI, dépendances out-of-process etc.).
  - Le test va tester la partie logique complexe/métier directement.
  - Le humble object est une fine couche avec très peu de logique, qui va lier la logique et la dépendance qui pose problème dans les tests.
  - Il s'agit de dire qu'un code doit soit avoir une grande complexité (domain layer and algorithms), soit travailler avec beaucoup de dépendances (controllers), mais jamais les deux.
  - Exemples :
    - La functional et l'hexagonal architecture utilisent le humble object pattern.
    - On peut aussi mettre dans cette catégorie les patterns MVC et MVP qui séparent la logique (le modèle) de la UI (view), avec le humble object (le presenter ou le controller).
    - L'aggregate du DDD est aussi un exemple : on groupe les classes dans des clusters (les aggregates) où elles auront une forte connectivité, et les clusters auront une faible connectivité entre eux. Ca permet de faciliter la testabilité en ayant besoin d'instancier essentiellement les collaborators du cluster concerné.
      - NDLR : que l'aggregate permette d'améliorer la testabilité ou la maintenabilité OK, mais j'arrive pas à voir le rapport avec le humble object pattern ici. On n'a pas de hard-to-test dependency.
- Exemple d'application avec du code overcomplicated, refactorée vers du humble object pattern :

  - Description :
    - On a un CRM qui gère les utilisateurs, et les stocke en DB.
    - La seule fonctionnalité dispo c'est le changement d'email : si le nom de domaine du nouvel email appartient à l'entreprise le user est un employé, sinon il devient un customer.
    - En fonction des emails des users, et donc de leur statut, le nombre d'employés est calculé et mis en base.
    - Quand le changement d'email est fait, on doit envoyer un message dans un message bus.
  - La 1ère implémentation contient une classe `User`, avec une méthode `changeEmail()` qui calcule le nouveau statut du user, et sauve son email en base, mais aussi recalcule et sauve le nouveau nombre d'employés dans la table de l'entreprise. Elle envoie aussi le message dans le message bus.

    ```typescript
    class User {
      constructor(
        private userId: number,
        private email: Email,
        private type: UserType
      ) {}

      changeEmail(userId: number, newEmail: Email) {
        // Get user data from database
        // If new email is same as before, return
        // Get company data from database
        // Check whether the email is corporate
        // Set the user type accordingly
        // If the type is different, update company number
        // of employees.
        // Save user info in database
        // Save company info in database
        // Send message to message bus
      }
    }
    ```

    - Notre méthode `changeEmail()` fait des choses importantes du point de vue domaine, mais en même temps elle a deux collaborators out-of-process (la DB et le message bus), ce qui est un no-go pour du code compliqué ou avec importance domaine.
    - On est en présence du pattern Active Record : la classe domaine se query et se persiste en DB directement. C'est OK pour du code simple, mais pas pour du code qui va croître sur le long terme.

  - Possibilité 1 : rendre explicites les dépendances implicites, en donnant l'objet de DB et message bus en paramètre (ce qui permettra de les mocker dans les tests).
    - Que les dépendances soient directes ou via une interface, ça ne change rien au statut du code : il reste overcomplicated.
    - On va devoir mettre en place une mécanique de mocks complexe pour les tests. On peut trouver plus clean que ça.
  - Possibilité 2, étape 1 : **introduire un application service** (humble object) qu'on appelle `UserController` pour prendre la responsabilité de la communication avec les dépendances out-of-process.

    - La nouvelle classe va chercher les informations du user et de l'entreprise en DB, crée un objet User avec ces infos. Puis elle appelle user.changeEmail(), et enfin sauve les données du user et de l'entreprise en DB, et envoie l'event d'email changé dans le message bus.

      ```typescript
      class UserController {
        constructor(
          private database: Database,
          private messageBus: MessageBus
        ) {}

        changeEmail(userId: number, newEmail: Email) {
          // Get user data from database
          // Get company data from database

          const user = new User(userId, email, type);
          const numberOfEmployees = user.changeEmail(
            newEmail,
            companyDomainName,
            numberOfEmployees
          );

          // Save user info in database
          // Save company info in database
          // Send message to message bus
        }
      }
      ```

      ```typescript
      public class User {
      // ...
      changeEmail(
          newEmail: Email,
          companyDomainName: string,
          numberOfEmployees: number
      ) {
          // If new email is same as before, return

          // Check whether the email is corporate
          // Set the user type accordingly
          const newType = ...

          // If the type is different, update company number
          // of employees.
          numberOfEmployees = ...

          this.email = newEmail;
          this.type = newType;

          return numberOfEmployees;
      }
      }
      ```

    - Problèmes :
      - On a une logique complexe dans le fait de reconstruire les données à partir de la base de données (le mapping), c'est le travail d'un ORM.
      - L'event de changement d'email est envoyé systématiquement, même si l'email n'a pas été changé.
      - On a un petit code smell : la méthode `user.changeEmail()` prend le nombre d'employés en paramètre, et renvoie le nouveau nombre d'employés. Ça n'a rien à voir avec un user donné.
    - Mais au moins la classe `User` a perdu ses collaborators, elle est donc en l'état purement fonctionnelle. On va pouvoir la tester à fond facilement.

  - Étape 2 : **enlever de la complexité de l'application service**.

    - Pour faire le mapping entre les données de la DB et un objet en mémoire, on va soit utiliser un ORM, soit créer nous-mêmes un objet de type factory qui va renvoyer notre `User`.

      - Cette logique a l'air simple avec peu de branches apparentes, mais il faut prendre en compte les branches cachés liés aux dépendances : on fait des conversions de type, on va chercher des objets inconnus dans un tableau un à un etc. beaucoup de choses peuvent mal aller dans ce processus.

      ```typescript
      public class UserFactory {
      create(data: Record&lt;any, any>) {
          Precondition.requires(data.length >= 3);

          const id = data[0];
          const email = data[1];
          const type = data[2];

          return new User(id, email, type);
      }
      }
      ```

      - On a ici du code utilitaire complexe.

    - A la fin de l'étape on a bien `User` qui est dans la case “domain models and algorithms”, et `UserController` qui est dans la case “Controllers”. Il n'y a plus d'overcomplicated code.

  - Étape 3 : on introduit une nouvelle classe domaine `Company`.

    - Notre nouvelle classe domaine `Company` peut récupérer la logique de calcul du nombre d'employés qu'on sort de `User`.
    - On a donc `UserController` qui crée les deux objets de domaine à partir des données de la DB, et qui appelle `user.changeEmail()` en donnant l'instance `company` en paramètre.
      - On a un principe important d'encapsulation OO ici : **tell, don't ask**. Le user va dire (tell) à l'instance de company de mettre à jour elle-même son nombre d'employés, plutôt que lui demander (ask) ses données brutes et faisant l'opération à sa place.
    - `user.changeEmail()` n'est plus une fonction pure puisqu'elle a un collaborator (company), mais vu qu'il n'y en a qu'un et qu'il n'est pas out-of-process, c'est raisonnable.

      - On va donc devoir faire du state-based testing, l'output-based étant possible qu'avec des fonctions pures.

      ```typescript
      class Company {
        constructor(
          private domainName: string,
          private numberOfEmployees: number
        ) {}

        changeNumberOfEmployees(delta: number) {
          Precondition.requires(this.nomberOfEmployees + delta >= 0);
          this.numberOfEmployees += delta;
        }

        isEmailCorporate(email: Email) {
          // Get the domain part from the email
          // and return whether it is equal to this.domainName
        }
      }
      ```

      ```typescript
      class User {
        // ...
        changeEmail(newEmail: Email, company: Company) {
          if (newEmail === this.email) return;

          const newType = company.isEmailCorporate(newEmail)
            ? Usertype.Employee
            : Usertype.Customer;

          // If the type is different, update company number
          // of employees.
          company.changeNumberOfEmployees(delta);

          this.email = newEmail;
          this.type = newType;
        }
      }
      ```

      ```typescript
      class UserController {
        constructor(
          private database: Database,
          private messageBus: MessageBus
        ) {}

        changeEmail(userId: number, newEmail: Email) {
          const userData = this.database.getUserById(userId);
          const user = UserFactory.create(userData);
          const companyData = this.database.getCompany();
          const company = CompanyFactory.create(companyData);

          user.changeEmail(newEmail, company);

          this.database.saveCompany(company);
          this.database.saveUser(user);
          this.messageBus.sendEmailChangedMessage(userId, newEmail);
        }
      }
      ```

    - A la fin, user et company sont sauvés en DB, et l'event est envoyé dans le message bus par `UserController`.

- Comment **tester** notre exemple refactoré ?

  - Le code des classes domaine (User et Company), et le code utilitaire complexe (factory si on n'a pas utilisé d'ORM) peuvent être unit testés à fond.

    - Exemple : `"changement d'email de corporate à non corporate"`, `"changement d'email de non corporate à corporate"`, `"changement d'email au même email"` etc.

      ```typescript
      it("changes email from non corporate to corporate", () => {
        const company = new Company("mycorp.com", 1);
        const sut = new User("user@gmail.com", UserType.Customer);

        sut.changeEmail("new@mycorp.com", company);

        expect(company.numberOfEmployees).toBe(2);
        expect(sut.email).toBe("new@mycorp.com");
        expect(sut.userType).toEqual(UserType.Employee);
      });
      ```

  - Les méthodes ultra simples comme le constructeur de User n'ont pas à être testées.
  - Le controller doit être testé avec des tests d'intégration moins nombreux. Ce sera l'objet des prochains chapitres.
  - Les pré-conditions sont des checks qui permettent de throw une exception tôt si une incohérence est détectée, pour éviter des problèmes plus importants.
    - Ces **pré-conditions doivent être testées seulement si elles ont un lien avec le domaine**, sinon c'est pas la peine.
    - Exemple de pré-condition qu'on teste : la méthode qui permet de mettre à jour le nombre d'employés sur `Company` throw si le nombre souhaité est inférieur à 0.
    - Exemple de pré-condition à ne pas tester : notre user factory vérifie que les données venant de la base ont bien 3 éléments avant de reconstruire le user. Cette vérification n'a pas de sens d'un point de vue domaine.

- Notre découpage domaine/controller marche bien parce qu'on récupère l'ensemble des données upfront, et les sauve à la fin en base inconditionnellement dans le controller. Mais **que faire si on a besoin d'accès à des données seulement dans certains cas dictés par la logique** ?
  - Il y a des trade-offs à faire en fonction de :
    - la testabilité du code du domaine
    - la simplicité du code du controller
    - la performance
  - On a 3 possibilités :
    - **Garder toute la logique dans le domaine, et toute l'interaction avec les deps out-of-process dans le controller**.
      - Dans ce cas on va avoir une moins bonne performance, puisqu'on fera la lecture de la donnée dont on n'aura peut-être pas besoin à l'avance systématiquement. Le controller n'ayant pas la connaissance de si on a besoin ou non, il prend la donnée et la donne tout le temps.
      - Par contre on a un code de domaine testable, et un controller simple.
    - **Injecter les dépendances out-of-process dans le domaine**, et laisser le code business décider quand récupérer ou non les données.
      - Le souci ici c'est la maintenabilité des tests du domaine, avec soit des tests lents à travers la DB, soit des mocks compliqués à maintenir.
      - Par contre on a un controller simple, et de la performance.
    - **Découper le processus de décision en plusieurs parties**.
      - Le controller va appeler la 1ère partie, récupérer les données, puis décider lui-même s'il faut faire la deuxième partie. Si oui il récupère les données additionnelles depuis la DB, et exécute la 2ème partie. Et à la fin comme d'habitude sauve le tout en DB.
      - Une partie de la logique risque de fuiter du domaine vers le controller et rendre le controller plus compliqué.
      - Par contre on a le code du domaine testable, et on garde la performance.
  - La plupart du temps, **céder sur la performance n'est pas possible**.
    - Il nous reste donc les 2 dernières possibilités.
    - L'auteur conseille de **privilégier la séparation du processus de décision plutôt que l'injection des dépendances out-of-process** dans le domaine. On peut gérer la fuite de la logique vers le controller et la complexification du code du domaine avec certaines techniques.
- Une de ces techniques est le pattern **CanExecute / Execute**.
  - Imaginons qu'on veuille mettre à jour l'email du user seulement si son compte n'est pas encore confirmé.
    - 1ère possibilité : on query les infos upfront, on donne tout à user, et le user décide de changer ou non l'email. Mais on a peut être récupéré les infos de la company pour rien, si le user était déjà confirmé => problème de performance.
    - 2ème possibilité : le controller vérifie lui-même si le compte du user est confirmé avant de faire éventuellement la query des infos de la company. Ici le controller a récupéré une partie de la logique chez lui.
    - 3ème possibilité (CanExecute / Execute) : le user expose une méthode `canChangeEmail()` qui encapsule la logique de prise de décision. Le controller n'a plus qu'à l'appeler pour décider si on passe à l'étape suivante ou non. La décision ne se fait plus vraiment au niveau du controller.
      ```typescript
      // controller
      const canChangeEmail = user.canChangeEmail();
      if (!canChangeEmail) {
        return;
      }
      user.changeEmail(newEmail, company);
      ```
      - Pour s'assurer que le controller n'a d'autre choix que d'appeler cette méthode avant d'aller plus loin (et donc lui retirer de la responsabilité), on va mettre une pré-condition dans la méthode `user.changeEmail()`, où on appelle explicitement `canChangeEmail()` en vérifiant que la réponse est oui. Et cette pré-condition métier sera testée (contrairement à l'appel à `canChangeEmail()` dans le controller).
        ```typescript
        // user
        public canChangeEmail() {
        return this.isEmailConfirmed ? false: true;
        }
        public changeEmail(newEmail: Email, company: Company) {
        Precondition.requires(this.canChangeEmail());
        // [...]
        }
        ```
- Voici une autre de ces techniques concerne l'envoi de **domain events** :
  - On parle bien ici des domain events au sens DDD, ces events permettent d'informer les autres composants du système des étapes importantes qui ont lieu dans nos objets domaine.
  - Si on revient à notre exemple de CRM, au moment du changement d'email du user, le controller envoie un message dans un message bus. Mais cet envoi est fait dans tous les cas, même si le changement n'a pas eu lieu. On veut l'envoyer seulement si le changement est fait.
    - Pour enlever la décision d'envoyer ou non l'event du controller, et la mettre dans le domaine, on va créer une liste d‘events qu'on met à l'intérieur de la classe domaine.
    - On a un event :
      ```typescript
      class EmailChanged {
        public userId: number;
        public newEmail: Email;
      }
      ```
    - Le User crée l'event si l'envoi est confirmé :
      ```typescript
      public changeEmail(newEmail: Email, company: Company) {
      // [...]
      this.emailChangedEvents.push(new EmailChanged(userId, newEmail);
      }
      ```
    - Et le Controller va itérer sur les domain events de User pour envoyer les bons messages dans le message bus :
      ```typescript
      public changeEmail(userId: int, newEmail: Email) {
      // [...]
      user.changeEmail(newEmail, company);
      // [...]
      user.emailChangedEvents.forEach((event) =>
          this.messageBus.sendEmailChangedMessage(
          event.userId,
          event.newEmail
          );
      );
      }
      ```
    - On va donc pouvoir unit tester la création de chaque domain event dans chaque cas dans le user, et on fera beaucoup moins d'integration tests pour vérifier que le controller lit bien les events du user et envoie ce qu'il faut.
  - Dans des projets plus gros, on pourrait vouloir fusionner les events avant de les dispatcher, cf. [Merging domain events before dispatching](https://enterprisecraftsmanship.com/posts/merging-domain-events-dispatching/).
- Pour ce qui est de l'envoi de l'email, c'est un comportement observable de l'extérieur donc il doit être fait que si l'email est changé. Par contre, l'écriture en DB peut être faite inconditionnellement parce qu'elle est privée et que le résultat ne changera pas.
  - On a un petit souci de performance à écrire en DB si l'email n'a pas changé, mais c'est un cas plutôt rare.
  - On peut aussi le mitiger par le fait que la plupart des ORM n'iront pas écrire en DB si l'objet n'a pas changé. Donc on peut faire l'appel sans crainte.
- Le conseil général de Vladimir est de ne jamais introduire de dépendances out-of-process (même mockées dans les tests) dans le code du domaine. Il conseille plutôt de fragmenter les appels au domaine, et au pire mettre ce code dans le controller et le tester par des tests d'intégration.
  - Les cas dans lesquels on va devoir mettre la logique dans le controller peuvent être par exemple :
    - Vérifier qu'un email est unique (il faut faire un appel out-of-process pour ça).
    - Gérer les cas d'erreur liés aux appels out-of-process.
- A propos de qui est le client de qui et de la notion de détail d‘implémentation :
  - Au niveau du controller, le client c'est l'utilisateur final, donc il faut tester ou mocker ce qui lui est visible ou sert directement son but. Les appels qui sont faits vers le domaine sont un détail d'implémentation.
  - Au niveau du domaine, le client c'est le contrôler, donc il faut unit tester ce qui sert directement son but. Les appels éventuels vers d'autres classes du domaine sont des détails d'implémentation qu'on n'a pas à mocker.

## III - Integration testing

### 8 - Why integration testing?

- Pour rappel, un test d'intégration est un test qui ne répond pas à au moins un des 3 critères des tests unitaires : vérifier une unité de comportement, le faire vite, le faire en isolation par rapport aux autres tests.
  - En pratique les tests d'intégration vont être ceux qui gèrent la relation avec les dépendances out-of-process.
  - On est donc dans la partie “controllers” en termes de type de code.
- Les règles de la pyramide des tests sont de :
  - Couvrir le maximum de cas par des tests unitaires.
  - Tester **un happy path**, ainsi que **les edge cases qui ne peuvent pas être couverts par les tests unitaires** avec des tests d'intégration.
  - Quand la logique est simple, on a moins de tests unitaires, mais les tests d'intégration gardent leur valeur.
- Quand un edge case amène à un **crash immédiat**, il n'y a **pas besoin de le tester avec un test d'intégration**.
  - Exemple du pattern CanExecute/Execute.
  - On appelle ce principe le **Fail Fast principle**.
  - On reste dans l'esprit coût/bénéfice pour la maintenance d'un test, dans ce cas le bénéfice n'est pas suffisant parce que ce genre de cas ne mène pas à de la corruption de données, et est rapide à remarquer et à fixer.
- Il y a 2 manières de tester les **dépendances out-of-process** : les tester directement ou les remplacer par des mocks.
  - On peut classer ces dépendances en deux catégories :
    - Les **managed dependencies** sont celles que seuls nous utilisons, et que le monde externe ne connaît pas. Exemple typique : la base de données.
      - Ces dépendances sont considérées comme des détails d'implémentation.
      - On n'a donc pas à se préoccuper de nos interactions avec elles, ce qui compte c'est leur état final, et l'impact que ça aura sur le résultat observable. Donc **pas besoin de mock**.
    - Les **unmanaged dependencies** sont celles qui sont observables de l'extérieur. Exemple typique : un serveur SMTP dont les mails seront visibles par les clients finaux, ou encore un message bus dont les messages vont affecter des composants externes à notre système.
      - Ces dépendances sont considérées comme faisant partie du comportement observable.
      - Puisque les unmanaged dependencies sont observables, ils font partie de l'API publique, et donc il faut nous assurer que nos interactions avec elles restent les mêmes : **les mocks sont parfaits pour ça**.
    - Il peut arriver qu'une dépendance soit à la fois managed et unmanaged : par exemple une base de données dont on choisit de partager certaines tables publiquement avec un composant externe.
      - Partager une DB est en général une mauvaise idée parce que ça va nous coupler fortement, il vaut mieux passer par une API synchrone ou un message bus.
      - Ceci dit, si ça arrive, il faudra différencier les tables partagées des tables privées, et traiter chacune comme ce qu'elle est (managed/unmanaged) : des mocks pour assurer l'ensemble de nos interactions avec les tables partagées, et la vérification de l'état final seulement pour les tables privées.
    - Dans le cas où on n'aurait pas la possibilité de tester en intégration une DB privée (base legacy trop grosse, trop coûteuse, raisons de sécurité etc.), l'auteur conseille de ne pas écrire de tests d'intégration du tout pour celles-ci, et de se concentrer sur les unit tests.
      - La raison est que ça compromet la résistance aux refactorings en traitant une dépendance privée comme publique, et ça n'ajoute que très peu de protection contre des régressions en plus des unit tests. Le rapport coût/bénéfice n'est pas suffisant.
- Si on reprend l'exemple du CRM, pour écrire des tests d'intégration pour le `UserController` :

  - On va d'abord écrire un test pour couvrir le **happy path le plus long**. Ici ce serait le cas où on change l'email d'un user, qui passe de non corporate à corporate. On va mettre à jour en DB le user, les infos de company, et aussi envoyer le message dans le message bus pour l'email.
  - Il n'y a qu'un edge case non couvert par des unit tests : le cas où l'email ne peut pas être changé. Mais dans ce cas on est sur du fail fast : une exception sera lancée et le programme s'arrêtera. Donc pas besoin de test d'intégration pour ça.
  - A propos des **tests end to end**, on peut en faire **quelques-uns pour notre projet**, et leur faire traverser les scénarios les plus longs pour s'assurer que tout est bien branché. On vérifiera le résultat pour le client final au lieu de regarder dans la DB, et on vérifiera le message envoyé dans le message bus pour la dépendance externe à laquelle on n'a pas accès. Ici pour cette feature on choisit de ne pas en faire.
  - Concernant notre test d'intégration de happy path donc, il faut d'abord décider de la manière dont on traite nos dépendances out-of-process : la DB est managed donc doit être testée au niveau de son état pour le `user` et la `company`, alors que le message bus est unmanaged donc doit être mocké pour tester les interactions avec lui.

    - Notre test va contenir **3 sections** :

      - D'abord mettre le user et la company en DB et initialiser le mock pour le message bus. (Arrange)
      - Ensuite appeler la méthode de notre controller. (Act)
      - Et enfin tester le résultat en DB et l'interaction avec notre mock (Assert).

      ```typescript
      it("changes email from non corporate to corporate", () => {
        // Arrange
        db.createCompany("mycorp.com", 0);
        db.createUser(1, "user@gmail.com", "customer");
        const busMock = { send: jest.fn() };
        const sut = new UserController(new MessageBus(busMock));

        // Act
        sut.changeEmail(1, "user@mycorp.com");

        // Assert
        const user = db.getUserById(1);
        expect(user.email).toBe("user@mycorp.com");
        expect(user.type).toBe("employee");

        const company = db.getCompany();
        expect(company.numberOfEmployees).toBe(1);

        expect(busMock.send).toHaveBeenCalledTimes(1);
        expect(busMock.send).toHaveBeenCalledWith(expect.toInclude("1"));
        expect(busMock.send).toHaveBeenCalledWith(
          expect.toInclude("user@mycorp.com")
        );
      });
      ```

    - **Il ne faut pas utiliser les mêmes objets entre les sections**, de manière à être sûr à chaque fois de lire et écrire depuis la DB.

- **L'introduction d'interfaces prématurées est une mauvaise idée**. Il faut en introduire une quand elle existe déjà mais est implicite, c'est-à-dire quand il y a **au moins deux implémentations** de celle-ci.
  - Le principe fondamental ici c'est YAGNI (you ain't gonna need it) qui dit que le code supposément utile pour plus tard ne le sera sans doute pas, ou pas sous cette forme.
  - Pour plus d'info sur le trade off YAGNI vs OCP, l'auteur a fait [un article](https://enterprisecraftsmanship.com/posts/ocp-vs-yagni/).
  - Par conséquent, étant donné qu'un mock est une implémentation de plus, il nous faudra la plupart du temps **faire une interface seulement pour les unmanaged dependencies**.
- Quelques bonnes pratiques pour les tests d'intégration :
  - **Créer une séparation explicite entre domain model et controllers** permet de savoir quoi tester unitairement, et quoi tester en intégration.
  - **Limiter le nombre de couches à seulement 3** : infrastructure layer, domain layer et application service layer.
    - David J. Wheeler a dit à ce propos : “All problems in computer science can be solved by another layer of abstraction, except for the problem of too many layers of abstraction.”
    - On se retrouve souvent avec 4, 5, 6 layers, ce qui rend l'ajout d'une feature, et même la compréhension d'une feature complexe parce qu'on doit toucher à de nombreux fichiers.
    - On a souvent tendance à tester le layer du dessous depuis le layer du dessus. Et avec de nombreux layers on aboutit à de nombreux tests avec mocks qui apportent chacun peu de valeur.
  - **Éliminer les dépendances circulaires** : quand deux classes dépendent l'une de l'autre pour fonctionner.
    - Les dépendances circulaires créent aussi une difficulté à appréhender le code parce qu'on ne sait pas par où commencer.
    - Par exemple, quand une classe en instancie une autre et lui passe une instance d'elle-même. On se retrouve à introduire des interfaces et utiliser des mocks pour les tests.
  - **Ne pas mettre plusieurs Act dans le même test** : parfois on est tenté de mettre en place plusieurs Arrange/Act/Assert à la suite dans le même test. C'est une mauvaise idée parce que le test devient difficile à lire et à modifier, et a tendance à grossir encore.
- A propos de la question des **logs** :

  - Selon l'auteur, **les logs doivent être testé** uniquement s'ils sont destinés à être **observés par des personnes autres que les développeurs** eux-mêmes.
    - Par exemple des personnes du business qui en ont besoin pour des insights.
    - Steve Freeman et Nat Pryce distinguent deux types de logs dans **Growing Object-Oriented Software, Guided by Tests** : le **support logging** qui est destiné au personnel de support et sysadmins, et le **diagnostic logging** qui est destiné aux développeurs eux-mêmes pour du débug.
  - Il faut bien distinguer le diagnostic logging et le support logging, en n'y appliquant pas la même technique de code.

    - Le support logging étant plus important, on pourra utiliser une classe à part inspirée du **structured logging** : une manière de logger qui sépare les paramètres et le texte principal, de manière à pouvoir reformater ces logs comme on veut.
    - Exemple de code :

      ```typescript
      domainLogger.userTypeHasChanged(45, "customer", "corporate");

      class DomainLogger {
        public userTypeHasChanged(
          userId: number,
          oldType: UserType,
          newType: UserType
        ) {
          this.logger.info(
            `User ${userId} changed type ``from ${oldType} to ${newType}`
          );
        }
      }
      ```

    - Pour le tester il va falloir le traiter comme une **dépendance out-of-process unmanaged** (puisqu'elle ne nous est pas privée). Et donc on peut faire comme avec le message envoyé dans le message bus :
      - Si c'est le controller qui doit faire le log, il peut le faire directement et ce sera testé dans un test d'intégration sous forme de mock.
      - Si c'est le code de domaine qui le fait, il faut séparer la logique d'envoi du log de l'envoi du log lui-même : créer un domain event pour l'envoi de ce log dans le domaine, et itérer sur les events de log dans le controller pour logger les logs dans la dépendance out-of-process. Le test pourra être fait sous forme unitaire pour vérifier la création du domain event.

  - Concernant la **quantité de logs** :
    - Pour le support logging la question ne se pose pas : il en faut autant qu'il y a de requirement business.
    - Pour le diagnostic logging il faut faire **attention à ne pas en abuser** :
      - Trop de logs noient l'information importante.
      - Même si on log avec des niveaux différents, on pollue quand même le code avec des lignes de log un peu partout, ce qui rend plus difficile la lecture.
      - L'auteur conseille de ne pas utiliser de logs dans le domaine, et dans ne le controller les utiliser que temporairement pour trouver un bug, puis les enlever.
      - Idéalement il faudrait que les logs ne servent que pour les exceptions non gérées.
  - Concernant la manière de passer le logger à nos objets, l'auteur conseille de le passer explicitement dans le constructeur ou dans l'appel à une méthode.

### 9 - Mocking best practices

- Il faut mocker les unmanaged dependencies **à l'edge (au bord) de notre système**.
  - La raison est d'augmenter la protection contre les régressions en mettant en jeu le plus possible de code. On va donc **mocker au plus près de l'appel à la dépendance externe**.
    - On améliore aussi la résistance aux refactorings parce que ce qui est mocké est une API publique, et donc peu susceptible de changer contrairement à notre code interne.
  - Exemple : Si on a une classe `MessageBus` qui encapsule et ajoute des fonctionnalités à une classe `Bus` qui elle-même est un simple wrapper autour de la dépendance externe, il faut mocker `Bus` et non pas `MessageBus`.
    ```typescript
    class MessageBus {
      private _bus: Bus;
      // [...]
    }
    ```
  - Dans les tests on va peut être instancier un peu plus de choses pour que le mock soit en bout de chaîne, mais c'est pas grave :
    ```typescript
    // Arrange
    const busMock = new Mock&lt;IBus>();
    const messageBus = new MessageBus(busMock);
    const sut = new UserController(messageBus)
    // [...]
    // Assert
    expect(busMock).toHaveBeenCalledWith(/* ... */);
    ```
  - Pour le mock de notre `DomainLogger`, on n'est pas obligés d'aller jusqu'à l'edge parce que contrairement à `MessageBus` où la structure exacte des message est cruciale pour maintenir la compatibilité avec la lib, **la structure exacte des messages de log nous importe peu**.
- Quand on veut mocker du code réutilisé dans de nombreux endroits (ce qui est en général le cas du code qui est à l'edge du système), il peut être plus lisible d'**implémenter son propre objet de mock**, qui est par définition un spy.

  - Exemple de spy :

    ```typescript
    class busSpy {
      public send(message: string) {
        this.sentMessages.push(message);
      }

      public shouldSendNumberOfMessages(num: number) {
        expect(this.sentMessages.length).toBe(num);
        return this;
      }

      public withEmailChangedMessage(userId: number, newEmail: Email) {
        const message = `Type: user email changed id: ${userId}``email: ${newEMail}`;
        expect(this.sentMessages).toContain(message);
        return this;
      }
    }
    ```

  - Utilisation dans le code :
    ```typescript
    busSpy
      .shouldSendNumberOfMessages(1)
      .withEmailChangedMessage(user.userId, "new@gmail.com");
    ```

- Bonnes pratiques pour les mocks :
  - Vu que les mocks doivent êtres réservés aux dépendances out-of-process unmanaged, ils doivent être **seulement dans les tests d'intégration**.
  - On peut utiliser autant de mocks que nécessaire pour gérer toutes les dépendances out-of-process unmanaged qui sont utilisées dans notre controller.
  - Pour bien s'assurer de la stabilité de l'utilisation de l'API publique constituée par notre dépendance unmanaged, il faut **aussi vérifier le nombre d'appels** vers la dépendance.
  - Il ne faut **mocker que les classes qu'on possède**. Ca veut dire qu'il faut wrapper toute dépendance unmanaged out-of-process par un adapter qui représente notre utilisation de cette dépendance. C'est ce wrapper qu'on va mocker.
    - Un des avantages c'est que si la dépendance change de manière importante dans son interface, elle ne pourra pas impacter le reste de notre code sans qu'on change notre wrapper. Il s‘agit d'une protection.
    - A l'inverse, selon l'auteur, **créer des wrappers autour de dépendances qui ne sont pas unmanaged ne vaut pas le coup** en terme de maintenance. Un exemple en est l'ORM.

### 10 - Testing the database

- Il est préférable d'avoir tout ce qui concerne la **structure de la base de données dans l'outil de versionning**, tout comme le code.
- En plus de la structure, certaines données sont en fait des **reference data**, et doivent être aussi versionnées avec le code.
  - Il s'agit de données qu'il faut générer pour que l'application puisse fonctionner.
  - On peut différencier les reference data du reste en se demandant si l'application peut modifier ces données : si non alors ce sont des reference data.
  - Exemple : imaginons qu'on reprenne notre exemple CRM, et qu'on veuille mettre le type d'utilisateur en base. Si on veut garantir par la DB elle-même que le type ne sera pas autre chose que les types autorisés, on peut créer une table `UserTypes`, y mettre les types autorisés, et faire une foreign key depuis la table `User` vers cette table.
    - Les données dans cette table sont là juste pour des raisons techniques, pour faire ce qui est fait ou pourrait l'être dans le code mais avec plus de sécurité. Elles ne sont pas accessibles aux utilisateurs de l'application. Ce sont des reference data.
- Il est préférable de permettre à tous les développeurs d'avoir leur base de données (idéalement sur leur machine locale).
  - Une DB partagée peut devenir inutilisable, au moins momentanément, et ne permet pas de garantir l'exécution des tests vu que des modifications peuvent être faites par les autres développeurs.
- Il y a deux types d'approche pour le développement vis-à-vis de la base de données : la delivery state-based et migration-based.
  - La **state-based** consiste à avoir l'état actuel de la structure de la DB versionnée. On va alors créer une DB modèle à partir de cette structure, puis utiliser un outil de comparaison qui va la comparer avec la DB de production, pour ensuite appliquer les modifications sur la production.
  - La **migration-based** consiste à écrire des scripts de migration qui vont être versionnées. On ne connaît pas l'état actuel de la DB depuis ces scripts, mais les jouer tous dans l'ordre permet d'en obtenir un exemplaire.
    - L'outil de comparaison de DB ne sera pas utilisé ici, sauf pour éventuellement permettre de détecter des anomalies dans la DB de prod.
  - La state-based est plus utile pour gérer les conflits de merge en ayant l'état explicite, alors que la migration-based est plus utile pour gérer la _data motion_ (le fait de changer la structure de la DB avec des données dedans).
    - La raison est que gérer la transformation de données existantes est difficile à faire automatiquement, il faut y appliquer des règles métier.
    - Dans la plupart des cas, gérer la data motion est plus important que la gestion de conflits de merge. Donc il vaut mieux **préférer l'approche migration-based**.
- Il ne faut jamais faire de changements directement dans la DB sans passer par l'app, autrement que par des scripts de migration versionnés.
  - Si une migration est incorrecte, il vaut mieux faire une migration pour la corriger (sauf si elle n'a pas encore été jouée et que la jouer amènera à de la perte de données).
- A propos de la gestion des **transactions** dans nos DB :

  - Les transactions sont importantes à la fois dans le code pour garantir la consistance des données, et aussi dans les tests pour s'assurer qu'ils sont fiables.
  - Dans le code, on a deux notions liées à la DB :

    - Les **transactions** qui décident si les modifications faites doivent être gardées ou non. Elles durent le temps de l'opération entière.
    - Les **repositories** qui prennent une transaction, et agissent sur les données (en lecture ou écriture) dans le cadre de cette transaction.
    - Exemple dans notre controller du CRM :

      ```typescript
      public UserController {

      public UserController(
          private transaction: Transaction
      ) {
          this.userRepository =
          new UserRepository(transaction);
      }

      // [...]
      const user = this.userRepository.getById(userId);
      // [...]
      this.userRepository.save(user);
      this.transaction.commit();
      // [...]
      }
      ```

  - Il existe aussi un pattern appelé **unit of work**, qui consiste à retenir les modifications sur les objets qui doivent avoir lieu au cours d'une transaction, et à les soumettre en une seule fois à la DB au moment où la transaction est validée.
    - Ca permet notamment d'économiser le nombre de connexions à la DB. La plupart des ORM l'implémentent.
  - Dans le cas où on travaille avec les document databases comme MongoDB, les transactions sont souvent garanties au sein d'un même document seulement.
    - Dans ce cas, il faut se débrouiller pour que nos opérations n'affectent qu'un document. Si on utilise le domain model pattern du DDD, on pourra affecter un aggregate par document et suivre la guideline de ne mettre à jour qu'un document à la fois.
  - Concernant les tests d'intégration, **il faut que chacun des 3 blocs (Arrange, Act, Assert) ait sa transaction à lui.**
    - La raison est de chercher à reproduire au mieux l'environnement de production. Dans le cas contraire on peut par exemple se retrouver à avoir certaines de nos libs (ORM notamment) qui vont mettre en cache certaines données au lieu d'aller lire/écrire en DB explicitement.
    - Ça compromet donc l'idée de wrapper chaque test dans une transaction qu'on annule à la fin du test (l'idée est évoquée et balayée pour cette raison).

- Selon l'auteur, la **parallélisation des tests d'intégration n'en vaut pas le coup**, parce que ça nécessite trop d'efforts. Il vaut mieux les jouer séquentiellement, et cleaner les données entre les tests.
  - Il suggère de **cleaner au début de chaque test**. Le faire à la fin peut poser problème à cause de potentiel crash avant la fin.
  - Concernant la manière d'effacer les données, il suggère une simple commande SQL de type `DELETE FROM dbo.User;`
- Il vaut mieux **éviter d'utiliser une DB “in memory”** à la place de la vraie DB dans les tests d'intégration. Ça permet de transformer les tests d'intégration en unit tests, mais ça leur enlève aussi de la fiabilité vis-à-vis de l'intégration à cause des différences entre les deux bases de données.
  - Selon l'auteur on va finir de toute façon par faire des tests d'intégration à la main si on va sur une BD différente.
- On peut utiliser certaines **techniques de refactoring** pour rendre le code des tests d'intégration plus lisible :

  - Pour la section Arrange : on peut par exemple utiliser des méthodes de type factory pour que la création des objets en base avec transaction prenne moins de place.
    - Le pattern **Object mother** consiste à avoir une méthode qui crée l'objet, et le renvoie.
    - Il conseille de commencer par mettre ces méthodes dans la classe de test, et de ne les déplacer que si besoin de réutilisation.
    - On peut mettre des valeurs par défaut aux arguments, pour n'avoir à spécifier que ceux qui sont nécessaires.
  - Pour la section Act : on peut aussi utiliser une fonction helper pour réduire ça à un appel qui créera la transaction et la passera à la méthode testée, comme en production.
    - Ex :
      ```typescript
      const result = execute(() => user.changeEmail(userId, "new@gmail.com"));
      ```
  - Pour la section Assert : là aussi on peut utiliser des fonctions helper :

    - On peut mettre des fonctions qui abstraient le fait d'aller chercher des données en base.
      ```typescript
      const user = queryUser(user.id);
      ```
    - On peut créer une classe exposant une **fluent interface** par dessus des instructions assert.

      ```typescript
      class UserExtensions {
        public shouldExist(user: User) {
          expect(user).toBeTruthy();
          return user;
        }

        public withEmail(user: User, email: Email) {
          expect(email).toEqual(user.email);
          return user;
        }
      }

      // In test
      user.shouldExist().withEmail("new@gmail.com");
      ```

    - TODO : ce code ne fonctionne pas en l'état, il faudrait trouver le moyen de faire de l'extension de méthode en Typescript.

  - Avec les helpers qui créent des objets dans la section Arrange, ou qui lisent des objets dans la section Assert, on crée plus que 3 transactions en tout. Pour autant, ça reste un bon trade off selon l'auteur : on sacrifie un peu de performance du test, contre une amélioration substantielle de maintenabilité du test.

- Faut-il **tester les opérations de lecture** ? (comme renvoyer une information au client)
  - Le plus important est de tester les opérations d'écriture qui peuvent corrompre les données. Pour celles de lecture il n'y a pas ce genre d'enjeu, donc la barre pour ajouter des tests est plus haute : il ne faut tester que les opérations les plus complexes.
  - En fait, l'intérêt principal du domain model c'est de protéger la consistance des données à travers l'encapsulation. Dans les opérations de lecture il n'y en a pas besoin.
    - L'auteur conseille donc de ne tester les opérations qu'avec des tests d'intégration, et seulement pour celles qu'on veut tester.
    - Il conseille aussi d'écrire les requêtes pour la lecture directement en SQL, l'ORM n'étant pas utile dans ce cas, et ajoutant des couches d'abstractions inutiles et peu performantes.
- Faut-il **tester les repositories** ?
  - **Non**. Malgré l'intérêt apparent, le rapport bénéfice/coût est défavorable :
    - D'un côté les repositories manipulent la DB qui est une dépendance out-of-process, donc si on les testait, ce serait avec des tests d'intégration (et ceux-ci coûtent cher).
    - De l'autre, ils ne fournissent pas tant de protection contre les régressions que ça, et surtout ils sont pour l'essentiel déjà testés par les tests d'intégration des controllers.
    - Si on arrive à isoler les factories à part, ça pourrait valoir le coup de les tester à part unitairement, mais quand on utilise un ORM, on ne peut en général pas tester le mapping à part de la DB.
  - Il en est de même pour les event dispatchers par exemple, dont le rapport bénéfice/coût des tests sera défavorable.

## IV - Unit testing anti-patterns

### 11 - Unit testing anti-patterns

- **Il ne faut pas rendre publique une méthode privée**, juste pour la tester.

  - La 1ère règle est de tester la fonctionnalité privée par l'effet qu'elle a sur l'API publique.
  - Si la fonctionnalité privée est trop compliquée pour être testée à travers ce qui est public, c'est le signe d'une **abstraction manquante**. Il faut alors la matérialiser.

    - Exemple de code dont on a envie de tester la méthode privée `getPrice()` sans passer par la méthode publique :

      ```typescript
      class Order {
        public generateDescription() {
          return `Name: ${this.name}, ``total price: ${this.getPrice()}`;
        }

        private getPrice() {
          // de la logique compliquée ici
        }
      }
      ```

    - On matérialise l'abstraction manquante et on la teste avec de l'output-based testing :

      ```typescript
      class Order {
        public generateDescription() {
          const calculator = new PriceCalculator();
          return `Name: ${this.name}, ``total price: ``${calculator.calculate(
            this.products
          )}`;
        }
      }

      class PriceCalculator {
        public calculate(products: Products[]) {
          // de la logique compliquée ici
        }
      }
      ```

- Il en est de même avec un attribut privé : le rendre public juste pour le tester est un antipattern.
- **Il ne faut pas faire fuiter du domain knowledge du code vers les tests** : réutiliser le même algorithme dans le test ne permettra pas de remarquer qu'on s'est trompé.
  _ Un exemple simple peut être un code qui fait une addition :
  `return a + b`, et un test qui teste avec l'addition aussi : `expect(result).toBe(3 + 2);`
  **Il vaut mieux vérifier des valeurs pré-calculées** sans réimplémenter l'algo : `expect(result).toBe(5);`
  _ Si on copie l'algo dans le test, alors on aura tendance à mettre à jour en même temps le code et le test en cas de changement, sans pouvoir se rendre compte que l'algo est faux. \* Idéalement il faut pré-calculer le résultat à expect dans le test avec l'aide d'un expert métier (quand on n'est pas expert nous-mêmes comme pour l'addition), et en tout cas il ne faut pas obtenir le calcul à partir du code qui est censé être testé.
- La **code pollution** consiste à introduire des choses dans le code, qui ne sont utiles que pour le test. C'est un antipattern.
  - Par exemple avoir un `if(testEnvironment) ... else ...` introduit de la pollution qui posera des problèmes de maintenance plus tard.
  - On peut en général régler le problème avec des interfaces : par exemple s'il s'agit d'éviter certaines opérations de log dans les tests en ne loggant pas si on est en env de test, on peut injecter le logger dans le code avec une interface. Dans le test on donnera une version fake du logger qui ne log pas.
    - L'interface est une petite pollution aussi, mais elle crée beaucoup moins de danger que des bouts de code dans des `if`.
- On est parfois tenté de vouloir **stubber/mocker une seule méthode d'une classe** qui fait quelque chose de complexe, pour tester ce qui est complexe et éviter qu'elle ne communique avec une dépendance out-of-process. Ceci est un antipattern.
  - La bonne façon de faire est de séparer la logique complexe de la partie qui communique la chose à la dépendance out-of-process (typiquement avec un humble object pattern qui fait le lien entre les deux), et unit tester la logique.
- Concernant la **notion de temps** utilisée dans le code (`new Date()`), l'introduire en tant qu'élément statique est, comme dans le cas du logger, un antipattern qui introduit une dépendance partagée dans les tests, et pollue le code.
  - La bonne manière est d'**introduire la dépendance temporelle explicitement** dans le constructeur ou la méthode appelée.
  - On peut le faire soit sous forme de service appelable pour obtenir la date, soit en passant la valeur pré-générée. Passer la valeur directement est ce qui présente le moins d'inconvénients, à la fois pour la clarté du code, et pour la testabilité.
