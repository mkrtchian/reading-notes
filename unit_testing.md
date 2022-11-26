# Unit Testing: Principles, Practices, and Patterns

## 5 - Mocks and test fragility

- Il y a principalement deux types de **test doubles** :
  - 1- Les **mocks** qui aident à émuler et examiner les **interactions sortantes**, c’est-à-dire le cas où le SUT interagit pour changer l’état d’une de ses dépendances.
    - On pourrait voir le mock comme la commande du pattern CQS.
    - Il existe une petite distinction avec les **spies** qui sont des mocks écrits à la main, alors que les mocks sont en général générés par une librairie de mock.
  - 2- Les **stubs** qui aident à émuler les **interactions entrantes**, c’est-à-dire le cas où une des dépendances fournit une valeur utilisée par le SUT.
    - On pourrait voir le stub comme la query du pattern CQS.
    - Il existe des sous ensemble de stubs :
      - le **dummy** qui est très simple
      - le **stub** qui est plus sophistiqué, et retourne la bonne valeur en fonction du cas
      - et le **fake** qui est un stub utilisé pour remplacer un composant qui n’existe pas encore (typique de l’école de Londres).
- Le mot mock peut vouloir dire plusieurs choses, ici on l’utilise pour sa définition principale de sous ensemble de test double, mais parfois il est utilisé pour désigner tous les tests doubles, et parfois il désigne l’outil (la librairie qui permet de créer des mocks et des stubs).
- **Vérifier les interactions sur des stubs est un antipattern** : les stubs émulent des données entrantes, et donc vérifier que le stub a bien été appelé relève du couplage à des détails d’implémentation.
  - Les interactions ne doivent être vérifiées que sur des mocks, c’est-à-dire des interactions sortantes, dans le cas où l’appel qu’on vérifie a du sens d’un point de vue business.
- La distinction entre **comportement observable** et **détail d’implémentation** :
  - Il faut d’abord choisir le client qu’on considère, puis vérifier si notre code lui permet :
    - Soit d’exécuter une opération pour faire un calcul ou un side effect pour atteindre ses objectifs.
    - Soit d’utiliser un état pour atteindre ses objectifs.
  - Si oui, alors on a un comportement observable, si non alors notre code est un détail d’implémentation.
  - Le choix du client considéré est important, on reviendra sur cet aspect dans la suite.
- Si l’API publique coïncide avec le comportement observable, alors on dira que notre système est bien conçu.
  - Sinon, on dira qu’il fait **fuiter des détails d’implémentation**. Parce que des détails d’implémentation pourront alors être accédés de manière publique sans protection (sans encapsulation).
    - Exemple : Le cas où le renommage de l’utilisateur se faisait en deux temps : renommer, puis appeler la fonction de normalisation qui coupe le nom à 50 caractères max. Ici la fonction de normalisation ne permet d’atteindre aucun objectif du client qui l’appelle (il voulait juste renommer), pourtant elle est publique. On a donc un problème de fuite.
    - Un bon moyen de savoir si on fait fuiter des détails d’implémentation, c’est de voir les cas où on a besoin de plus d’une opération pour atteindre un objectif du client (le “act” du test).
- L’**architecture hexagonale** consiste en plusieurs hexagones communiquant entre eux.
  - Chaque hexagone est constitué de deux couches :
    - Le **domain layer** qui n’a accès qu’à lui-même et qui contient les règles et invariants business de l’application.
      - Il est une collection de domain knowledge (how-to).
    - L’**application service layer** qui orchestre la communication entre le domain layer et le monde externe. Elle instancie des classes importées du domain layer, leur donne les données qu’elle va chercher en base, les sauve à nouveau en base, répond au client etc.
      - Elle est est une collection de use-cases business (what-to).
  - Le terme hexagone est une image, chaque face représente une connexion à un autre hexagone, mais le nombre n’a pas besoin d’être 6.
  - Au sein de chaque couche, le client est la couche d'au-dessus, et donc ce sont ses objectifs qui sont pris en compte pour savoir si on lui expose des détails d’implémentation ou non.
    - Les objectifs du client final sont transcrits en objectifs secondaires dans la couche du dessous, et donc on a une relation fractale qui permet à **tous les tests d’avoir toujours un rapport avec un requirement business** (Les objectifs de l’application service layer sont des sous-objectifs du client final).
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
  - Pour savoir <strong>quand utiliser les mocks</strong> sans abimer la résistance au refactoring, il faut se demander si l’interaction sortante qu’on veut vérifier est interne à notre application (notre hexagone par exemple), ou porte vers des systèmes externes.
    - Si l’interaction est <strong>interne</strong>, alors il ne faut pas mocker, même s'il s’agit d’une dépendance out-of-process comme une base de données. Tant qu’elle n’est visible que depuis notre application, elle est un détail d’implémentation pour nos clients.
    - Si l’interaction est <strong>externe</strong>, et donc visible par nos clients externes, alors il faut vérifier qu’elle se fait correctement par un mock. Par exemple, l'envoi d’un email répond à un besoin client, donc il faut vérifier que l’appel vers le système externe se fait correctement.
    - Pour parler un peu des écoles : l’école de Londres préconise de mocker toutes les dépendances mutables, ça fait beaucoup trop de mocks. Mais l’école classique préconise de mocker aussi des choses en trop : typiquement la base de données qui est une shared dependency. On peut au lieu de mocker nos interactions avec elle, la remplacer intelligemment par autre choses dans nos tests (cf. les deux prochains chapitres).
