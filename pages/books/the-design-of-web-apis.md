# The Design of Web APIs

## 1 - What is API design

- Ici nous parlons des **API web**, c'est-à-dire utilisant le protocole **HTTP**.
- Une API est dite **publique** quand elle est fournie comme service à une autre entreprise, et **privée** quand elle est fournie à des services internes.
- Le design d'une API web doit être fait pour rendre la vie simple aux développeurs qui vont la consommer.
- L'API doit **cacher l'implémentation**, et n'exposer que ce dont l'utilisateur a besoin.
- L'API doit être **intuitive**, ressembler à ce à quoi on s'attendrait.

## 2 - Designing an API for users

- Il faut comprendre les **besoins de l'utilisateur** de l'API pour designer une API qui y réponde, et non pas utiliser le point de vue du backend.
  - Éviter d'adopter le point de vue du créateur de l'API passe par :
    - **Éviter l'influence des structures de données** côté backend. Si on expose exactement ce qui est en BDD c'est un signe qu'on n'adopte probablement pas le point de vue du consommateur.
      - Il faut correctement nommer les choses, mais aussi introduire de l'abstraction pour masquer les détails qui n'intéressent pas le consommateur.
    - **Éviter l'influence du code business** côté backend. Si le consommateur n'a pas besoin de savoir ce qui se passe finement, on peut lui exposer une API grossière et faire ce qu'il faut dans l'implémentation, ce sera plus simple et plus sûr.
    - **Éviter l'influence de l'architecture** du backend. Par exemple, si le backend utilise une architecture séparée en services, le fait de faire apparaître cette même séparation interne sur l'API exposée n'est probablement pas une bonne idée. Il faut se concentrer sur le besoin du consommateur.
    - **Éviter l'influence de l'organisation humaine** du provider de l'API. Le fait que le provider soit structuré avec tels ou tels départements par exemple ne doit pas influencer l'API.
- En fait, il faut traiter les consommateurs de l'API vis-à-vis de celle-ci comme des utilisateurs finaux vis-à-vis du produit : on doit se demander **ce que le consommateur veut, et de quelle manière il le veut**. Ça revient à créer des User Stories du consommateur d'API.
  - Les deux autres choses dont on a besoin sur les utilisateurs c'est **les inputs et outputs** : ce que l'utilisateur doit apporter, et ce dont il a besoin en retour lors de l'action.
  - Enfin, pour trouver des éléments manquants et compléter l'API, on va analyser **d'où vont venir les inputs requis**, et **ce qui sera fait des outputs**.
  - Autre question importante qui nous permettra d'être plus efficace : trouver qui sont nos utilisateurs.
  - L'**API goals canvas** est donc un tableau avec les cases suivantes :
    - Whos : les utilisateurs de l'API
    - Whats : Ce que les utilisateurs font
    - Hows : les étapes de ce qu'ils font
    - Inputs : ce dont ils ont besoin à chaque étape, et d'où ils l'ont
    - Outputs : ce qu'ils récupèrent à chaque étape, et ce qu'ils en feront
    - Goals : Reformulation concise du besoin
  - Ce tableau ne peut pas être rempli à l'avance pour toute l'application. Il s'agit d'un processus itératif où on traite les fonctionnalités par petits bouts.

## 3 - Designing a programming interface

- REST est une méthode de design d'API qui se calque sur HTTP. Il s'agit d'utiliser à chaque fois une **action HTTP** (par exemple GET), et **un chemin identifiant une ressource** (par exemple /product/123), et un **contenu optionnel**.
  - La réponse est un **statut** qui indique si la transaction s'est bien passée, et **un contenu**.
- Pour faire une API REST, il va s'agir de trouver les ressources à partir des API goals qu'on a pu analyser par exemple avec le canvas, et ensuite de leur attribuer des actions.
- Quand on a plusieurs ressources citées dans un API goal, il faut identifier la ressource principale. C'est sur elle que porte l'action. L'autre n'étant en général qu'une information donnée dans le chemin ou le contenu additionnel de la requête.
  - Exemple : Rechercher des produits dans un catalogue avec une requête textuelle : c'est bien le catalogue qui est la ressource principale.
- Les chemins doivent refléter cette organisation, en ayant un nom compréhensible pour la ressource au début (/catalogue), suivi des paramètres.
  - La manière la plus standard de faire des chemins c'est d'avoir un nom pluriel pour les collections, suivi d'un identifiant d'une des ressources de cette collection :
    - `/ressources/{ressourceId}`
    - `/ressources/{ressourceId}/sub-ressources/{subRessourceId}`
- Si on a un paramètre à donner dans une requête qui doit simplement récupérer un résultat (par exemple faire une recherche), alors on utilise GET et on donne la chaîne de recherche dans un paramètre de l'URL.
  - Ex : GET /products?free-query=blabla
- De même que le path et l'action de l'API doit être conçue selon les besoins du client et non pas selon la structure du backend, le contenu des données doit aussi être structuré dans ce but :
  - Si certaines propriétés ne sont pas nécessaires au client pour son usage, on les supprime.
  - Si certaines propriétés seraient plus claires dans ce contexte sous un autre nom : on les renomme.
- Quand on ne sait pas quelle méthode REST choisir pour une action, par défaut on choisit **POST**.
- Il est facile de faire correspondre une action métier avec une API REST, tant qu'on est dans du CRUD d'une ressource. Mais quand on veut faire des actions plus complexes, alors il faut faire des **compromis** entre la **user-friendlyness**, et la **conformité avec le standard REST**.
  - Ex : Valider son panier peut être fait avec :
    - POST /cart/check-out, ce qui est très user friendly, mais pas très conforme à la norme de manipulation de ressources de REST.
    - POST /orders, ce qui est plus conforme à REST mais on perd la notion métier de panier dans l'histoire.
    - En réalité il n'y a pas de “bonne solution”, il s'agit de faire un compromis. Il n'y a pas toujours de bonne API.
- L'architecture REST :
  - a été élaborée par un thésard en 2000, et a depuis envahi l'univers des API réseau.
  - a été conçue spécifiquement pour les **architectures distribuées**, dont d'ailleurs l'architecture navigateur / serveur en est un rudiment. Il s'agit de favoriser l'efficacité, la stabilité, la scalabilité.
  - Pour être RESTful, il faut respecter ces 6 principes :
    - **Séparation Client / Serveur**
    - **Statelessness** : toute l'information d'une requête est contenue dans la requête. Le serveur ne conserve pas de session.
    - **Cacheability** : une réponse doit indiquer si elle peut être stockée par le client, et si oui pour combien de temps avant qu'il faille qu'il refasse la requête.
    - **Layered system** : quand le client interagit avec le serveur, il n'en voit qu'une couche, le reste est caché derrière l'API.
    - **Code on demand** (optionnel) : le serveur peut transférer du code exécutable au client, par exemple du JavaScript.
    - **Uniform Interface** :
      - Toutes les interactions se font au travers d'actions standardisées sur des ressources, et en fonction de l'état de ces ressources (qu'on obtient par GET, et qu'on modifie par PATCH etc.).
      - Les interactions doivent aussi fournir les metadata suffisantes pour comprendre la structure de ces états et ce qu'il est possible de faire aux ressources.
- Si on se rend compte qu'un des paramètres d'une méthode de notre API ne peut pas être fournie par le client, alors c'est qu'on a sans doute oublié quelque chose… Il faut revoir l'API, ajouter une méthode etc.

## 4 - Describing an API with an API description format

- Décrire une API selon un format standardisé permet de la partager avec des êtres humains qui vont savoir la lire, et avec des outils automatisés qui pourront l'exploiter pour générer une documentation HTML, ou dans n'importe quel autre but.
- L'OAS (Open API Specification) est un format ouvert, communautaire, et très utilisé pour REST.
  - Initialement la spécification s'appelait Swagger, mais elle a été renommée OpenAPI en 2016.
  - On peut utiliser JSON ou YAML pour écrire le document, mais Arnaud recommande YAML pour la lisibilité accrue pour les humains.
  - On édite le fichier à la main et on le versionne.
  - VSCode a une extension Swagger viewer qui aide à visualiser ce qu'on a écrit.
- Tips YAML :
  - Pour indiquer qu'il n'y a rien, il faut mettre des {}, par exemple quand il n'y a pas encore de paths : `paths: {}`
  - Pour écrire une string multiligne, on met un | d'abord :
    ```yaml
    description: |
    blabla
    blabla
    ```
  - Les noms de propriété doivent être des strings en YAML, donc il faut entourer les chiffres par des guillemets quand ils sont en propriété.
- Le format OpenAPI :
  - Il ne faut pas hésiter à écrire des descriptions.
  - ex
    ```yaml
    paths:
      /objects:
      description: description du path
      get:
        summary: résumé court de la méthode
        description: résumé long de la méthode
        responses:
        "200":
          description: description de la réponse
          content:
          application/json:
            schema:
            # et on décrit le schéma de la réponse
    ```
  - Dans le cas où une méthode GET prend un paramètre, ça se passe dans parameter :
    ```yaml
    get:
    parameters:
        # il s'agit du nom qui va apparaître dans l'URL
        - name: nom-du-parametre
        description: description du paramètre
        # où se trouve le paramètre
        in: query
        # caractère obligatoire ou non
        required: false
        schema:
            # type de données du paramètre
            type: string
    ```
  - Même chose pour les **path parameters** quand un morceau du path est paramétrisé. Dans ce cas il faut l'indiquer entre accolades :
    ```yaml
    paths:
    /objects/{objectId}
        delete:
        parameters:
            - name: objectId
            in: path
            # obligatoire, sinon ça ne compilera pas
            required: true
            schema:
                type: string
    ```
  - Pour décrire les formats JSON attendus en entrée, ou en réponse, OpenAPI utilise la **spécification JSON-schema** :
    Exemple pour `{prop1: "", prop2: { prop2-1: ""}}`
    ```yaml
    type: object
    description: une description de l'objet JSON
    required:
    - prop1
    - prop2
    properties:
    prop1:
        type: string
        description: description de prop1
        example: Exemple de valeur
    prop2:
        type: object
        properties:
        prop2-1
            type: string
            example: Exemple de valeur
    ```
  - Pour les méthodes comme POST qui ont besoin de données en entrée, ça se fait dans **requestBody**, à côté de **responses**.
- On peut **réutiliser des schémas** JSON déjà définis pour éviter de les répéter dans notre fichier OpenAPI :
  - Il faut renseigner le schéma à la racine du document, dans :
    ```yaml
    components:
    schemas:
      mon_objet:
      type: object
      properties:
        # [...]
    ```
  - Et ensuite on peut le référencer avec :
    ```yaml
    schema:
    $ref: #/components/schemas/mon_objet
    ```
- On peut placer le mot-clé **parameters** non seulement au niveau des actions (get, post etc.), mais aussi un niveau au-dessus, au niveau des ressources (c'est-à-dire au niveau du path). Et alors à ce moment là ces paramètres s'appliquent à toutes les méthodes du path. Ça évite de les répéter, fût-ce avec un $ref.

## 5 - Designing a straightforward API

- Une des clés d'un design “straitforward” est de **reproduire l'habitude des gens**, et ça dans tous les domaines.
- Il faut des noms de propriété clairs et évocateurs.
  - Éviter les abréviations (min ou max c'est OK parce que c'est entré dans la langue commune)
  - Éviter les détails techniques qu'on peut retrouver autrement (ex. type de variable booléenne)
  - Éviter ce qui n'intéresse pas le consommateur de manière générale.
  - Essayer de ne pas dépasser 3 mots dans un nom quel qu'il soit.
- Il faut des **formats de données bien choisis**.
  - Par exemple le format ISO 8601 pour une date.
  - Adopter le point de vue du consommateur :
    `"type": "checking"` plutôt que `"type": 1`
- Il faut aussi que les données qu'on donne soient pertinentes pour le consommateur.
  - Ne pas hésiter à **ajouter des données** pour que le consommateur ait ce qu'il lui faut déjà préparé.
- A propos des erreurs :
  - Il faut bien distinguer 3 types d'erreurs par leur type :
    - erreur de format parmi les paramètres fournis
    - erreur fonctionnelle
    - erreur interne du serveur
  - Pour une erreur interne, en général la seule chose qu'a besoin de savoir l'utilisateur c'est qu'il y a eu une erreur et que ce n'est pas de sa faute.
  - En HTTP, les codes **4XX** concernent les erreurs causés par l'utilisateur, alors que les codes **5XX** concernent les erreurs sur lesquelles l'utilisateur n'a pas d'influence.
  - Le code de statut ne suffit pas. Il faut aussi donner d'autres informations, **à la fois du texte pour les êtres humains, et des informations pour les machines**.
    - Pour les machines ça peut être un string représentant un type d'erreur précis, une valeur d'ID etc.
  - Dans le cas où il y a plusieurs erreurs, il vaut mieux **les signaler toutes** dans la même réponse.
    - Si les erreurs sont de plusieurs types (par ex données mal formées et erreur fonctionnelle), on peut utiliser le code de retour 400 qui est générique.
- Pour les messages de succès c'est comme pour les erreurs :
  - Bien renseigner le bon code **2XX**
  - Donner des informations supplémentaires, comme par exemple retourner l'objet qu'on vient de créer avec son ID générée.
- Il faut regarder le flow dans son ensemble, et repérer ce dont l'utilisateur d'API a besoin pour lui éviter des erreurs qui seraient de son fait.
  - Une fois qu'on a repéré les choses dont il aurait besoin, on les lui fournit avec une API pour lui faciliter le travail.
  - Ne pas hésiter à agréger des données ensemble dans une API, si ça peut aider le consommateur à consulter une autre API en évitant des erreurs
    - Par exemple lui fournir les éléments qui ont _une particularité_ plutôt que bruts, pour qu'il puisse les utiliser dans une autre API qui a besoin en paramètre d'un élément qui a _la particularité_.

## 6 - Designing a predictable API

- Il faut rester **consistant au sein de l'API** :
  - Dans le nommage et le format des différents paramètres dans notre API.
    - Ex : si on a choisi `accountNumber` quelque part, on ne le change pas en juste `number` dans un des autres endpoints.
    - Et si c'était un nombre, ça reste un nombre.
  - Entre les différents paths de nos API endpoints.
  - Dans la structure des données prises en paramètre ou renvoyées.
  - Dans les flows permis par les différents API endpoints.
- En plus de la consistance au sein de l'API, il faut respecter la consistance au sein de **l'organisation**, au sein du **domaine métier**, et enfin avec ce qui est partagé par le **reste du monde**.
  - Ne pas hésiter à utiliser des standards ISO et autres.
    - TIP : chercher “&lt;some data> standard” ou “&lt;some data> format” sur google.
  - Ne pas hésiter à copier ce que fait une autre API connue, les utilisateurs se sentiront chez eux et tout le monde sera gagnant.
- Il faut formaliser les règles choisies pour l'API dans un document (cf. chapitre 13), au risque de les oublier et de faire perdre à l'API peu à peu sa consistance.
- Il peut être intéressant de rendre l'API **adaptable** aux besoins de l'utilisateur :
  - Un même endpoint peut proposer d'envoyer les données sous **plusieurs formats**, par ex CSV et JSON.
    - On peut utiliser un paramètre dans l'URL : `/ressource?format=csv`
    - Et on peut aussi utiliser un header HTTP fait pour ça : `Accept: text/csv`
      - Si le serveur ne peut pas répondre dans ce format, il peut renvoyer le code `406 Not Acceptable`.
    - A contrario, quand c'est le client qui envoie par exemple du contenu XML, il peut le spécifier avec le header `HTTP Content-type: application/xml`
      - Si le serveur ne comprend pas ce format, il peut répondre **`415 Unsupported Media`**.
  - De la même manière que pour les formats, un endpoint peut supporter **plusieurs langues** (traduction des phrases, système de mesure etc.).
    - On peut là aussi tirer avantage du protocole HTTP en utilisant ses headers :
      - `Accept-Language: en-US` pour dire qu'on accepte l'anglais US.
      - `Content-Language: en-US` pour dire que le body sera en anglais US.
  - Enfin on peut aussi permettre à l'utilisateur des fonctionnalités de **pagination, de filtrage ou d'ordre des éléments**.
    - Le plus courant est d'utiliser des paramètres dans l'URL :
      - `/ressources?page=3&sort=-amount&category=car`
    - Pour la pagination on pourrait penser au header HTTP `Range: items=10-19` qui dit qu'on veut les items du 10ème au 19ème.
- Il peut être très pratique le notre API soit **discoverable**.
  - On peut faire ça à l'aide de **metadata** qu'on place dans le body. Par exemple, si on renvoie du contenu paginé, avoir un attribut “pagination” qui va donner la page actuelle et le nombre total de pages, pour aider l'utilisateur.
  - On peut aussi ajouter des URLs pour aider l'utilisateur à faire ses prochaines requêtes d'API : ça fait des **hypermedia API**. Par exemple pour la pagination, ajouter en plus un attribut `next` et un `last` avec en valeur les URLs permettant d'obtenir ces pages.
    - Il s'agit d'une certaine manière de faire la même chose qu'avec les pages web et leurs liens, mais avec les APIs.
    - Usuellement, les URLs vers le reste de l'API sont mis dans des attributs nommés `href`, `links`, ou `_links`.
    - Plusieurs spécifications ont été créées sur la manière d'organiser ces URLs d'API, parmi eux HAL, Collection+JSON, JSON API, JSON-LD, Hydra et Siren.
  - Un des moyens d'obtenir des informations sur un endpoint est d'utiliser la méthode HTTP `OPTIONS`, qui devrait renvoyer les autres méthodes disponibles sur cet endpoint, mais aussi des informations sur le format, ou encore des URLs vers d'autres endpoints utiles liés.
    - Attention cependant à bien documenter ce qu'on implémente dans notre API, les utilisateurs sont rarement des experts du protocole HTTP…

## 7 - Designing a concise and well-organized API

- Il faut bien **organiser** son API :
  - Organiser les **données** :
    - Par exemple en groupant les propriétés liées entre elles ensemble, côte à côte ou même au sein d'un objet.
      - Dans le cas où une propriété est optionnelle, et qu'une autre propriété n'a de sens que si la première est utilisée, les grouper dans un objet serait une bonne idée.
    - En classant les propriétés des plus importantes aux moins importantes à mesure qu'on descend
  - Organiser le **feedback** :
    - Quand des erreurs se produisent, on peut les catégoriser avec un type précis avec un système d'enums (en plus du statut HTTP).
    - Et on peut les classer de la plus importante à la moins importante.
  - Organiser les **API endpoints** :
    - On peut les grouper par catégorie fonctionnelle dans notre document OpenAPI, pour plus de clarté.
      - Et dans chaque catégorie, classer du plus important au moins important.
- Il faut bien **dimensionner** ses endpoints :
  - Bien réfléchir au **nombre de propriétés** d'une structure de données, et à la **profondeur d'imbrication** en fonction de son cas d'usage.
    - Pour la profondeur, il est recommandé de ne pas dépasser 3 niveaux.
  - Bien réfléchir aux endpoints eux-mêmes et à la **complexité** qu'ils peuvent embarquer pour l'utilisateur :
    - Par exemple, un endpoint qui permet d'avoir des infos sur un compte en banque, et qui donne en même temps la liste de toutes les transactions du compte sera probablement surchargé inutilement si l'utilisateur veut juste les infos sur le compte.
    - Il vaut mieux s'assurer que **notre endpoint ne fait pas 2 choses très différentes** (ou plus) en même temps.
  - Le dimensionnement dépend en fait du contexte et doit être optimisé pour l'expérience utilisateur des consommateurs. En général, les petites unités fonctionnent mieux qu'un énorme couteau suisse.

## 8 - Designing a secure API

- Une des techniques utilisées couramment pour sécuriser des API web est le framework **OAuth** 2.0.
  - 1. il faut enregistrer des **consumers**.
    - Ca peut se faire par exemple sur un portail de développement où on va se connecter, payer ce qu'il faut etc.
    - Quand on enregistre le consumer, on va lui attribuer des **scopes** d'autorisation, qui vont correspondre à la possibilité d'accéder à un certain nombre d'API endpoints et de méthodes.
  - 2. le **client** consumer va pouvoir demander un token au **serveur d'authentification**.
    - L'utilisateur final propriétaire entre ses identifiants sur la page du serveur d'authentification, et après vérification le serveur d'authentification envoie le token au client.
    - Il existe d'autres flows possibles dans OAuth.
  - 3. Le client va pouvoir consommer l'API en fournissant à chaque fois le token.
    - A chaque requête, le serveur qui a les ressources va valider auprès du serveur d'authentification que le token est valide et possède les bons scopes d'autorisation.
    - Le serveur de ressources a connaissance du user ID et du scope d'autorisation attaché au token, et donc va pouvoir éventuellement **filtrer le contenu** avant de le renvoyer ce que spécifie l'API.
- L'ID de l'utilisateur et les scopes attachés à son compte ne sont en général pas dans le body de la requête ou les paramètres d'URL, mais sont pourtant là de par l'authentification initiale. Il est donc intéressant de remarquer qu'un même API endpoint peut **renvoyer différentes données en fonction de l'utilisateur qui y fait appel**.
- Selon l'organisation internationale OWASP, il faut **réduire la surface d'attaque** pour réduire le risque. Et donc il faut éviter de donner la possibilité de faire certaines actions à des utilisateurs qui n'en ont pas besoin.
- Comment bien définir les **scopes d'autorisation** ?
  - Il faut choisir la bonne **granularité** : un scope par endpoint et méthode c'est très flexible mais très complexe à configurer pour les utilisateurs, et si on a trop peu de scopes on risque d'être obligé de donner trop de pouvoir à certains utilisateurs.
  - On peut par exemple partir de l'API goals canvas qui nous a permis de construire notre API en fonction des besoins de l'utilisateur qu'on a définis, et regrouper sous un même scope les actions qui concernent un même flow.
  - On peut aussi avoir des scopes arbitraires, comme un scope “admin” qui a accès à tout.
  - Il existe plusieurs manières de définir des scopes et pas de solution magique, et la bonne manière dépend en fait du contexte.
  - On peut aussi définir plusieurs granularités en même temps : des scopes grossiers mais faciles à configurer, et des scopes plus fins. L'utilisateur pourra alors utiliser un mélange et configurer plus finement les parties qu'il veut.
- OpenAPI permet de spécifier des scopes pour chaque endpoint/méthode défini :
  - Ca se fait dans components -> securitySchemes
    ```yaml
    components:
    securitySchemes:
      BankingAPIScopes:
      type: oauth2
      flows:
        implicit:
        authorizationURL: "https://..."
        scopes:
          "beneficiary:read": List beneficiaries
          "beneficiary:manage": Create, list beneficiaries
    ```
  - Et ensuite on les indique dans nos paths existants :
    ```yaml
    paths:
    /beneficiaries:
        get:
        description: Get beneficiaries list
        security:
        - BankingAPIScopes:
            - "beneficiary:read"
            - "beneficiary:manage"
        responses:
        …
    ```
- Toujours dans l'optique de réduire la surface d'attaque, il faut **identifier les données sensibles** et ne pas les fournir quand ce n'est pas nécessaire.
  - Par exemple, quand on obtient les informations d'un compte, on peut donner par défaut les autres infos mais pas le numéro du compte, ou seulement les 4 derniers chiffres.
  - Quand il faut les fournir quand même, ou quand il faut fournir une action avec des conséquences jugées sensibles, alors on peut y faire attention et utiliser des techniques pour s'assurer qu'elles sont protégées :
    - Isoler l'action sensible dans un **endpoint dédié** qu'on va pouvoir mieux protéger, dans le cas où il y a une vraie différence de nature entre la version sensible et la version non sensible d'un point de vue utilisateur.
    - Utiliser un **scope dédié**, pour que par défaut la donnée sensible ne soit pas retournée ou actionnée, et le soit si le scope d'autorisation est activé.
    - Se baser sur les **permissions de l'utilisateur** qui fait l'appel pour ne dévoiler la donnée sensible qu'à certaines personnes.
    - Et enfin on peut **combiner** l'access control de l'utilisateur et du consommateur (scope) pour être sûr qu'il s'agit de la bonne personne (et non pas d'une personne qui a une délégation par exemple) et qu'elle le fait dans un cadre où elle a la permission de le faire.
- Concernant le feedback lié à la sécurité, quand on demande quelque chose auquel on n'a pas accès, on peut recevoir une réponse **`401 Unauthorized`** si on n'est pas correctement authentifié, ou **`403 Forbidden`** si les scopes qui nous sont associés ne sont pas suffisants pour qu'on fasse l'action.
  - Attention à ne pas dévoiler inutilement des informations : il vaut parfois mieux renvoyer systématiquement **`404 Not Found`** plutôt qu'un 403 même si la donnée existe, pour éviter qu'un attaquant essaye de nombreuses données et puisse savoir lesquelles existent même s'il n'a pas les autorisations d'y accéder.

## 9 - Evolving an API design

- Quand on change notre API, il faut surtout éviter les **breaking changes**, c'est-à-dire ce qui obligerait les consommateurs à changer leur code pour ne pas que leur application casse.
  - Sur les **données en sortie** de l'API :
    - Il ne faut pas :
      - Enlever, modifier ou déplacer des propriétés.
      - Modifier le format / type d'une donnée.
      - Augmenter la taille d'une chaîne qui était limitée.
      - Rendre optionnelle une propriété qui était obligatoire.
      - Ajouter des valeurs à un enum.
    - En revanche on peut :
      - Ajouter des propriétés, optionnelles ou obligatoires.
      - Rendre obligatoire une propriété qui ne l'était pas.
      - Diminuer la taille maximale de chaînes limitées.
    - Une des possibilités c'est d'ajouter des données déjà existantes dans de nouvelles propriétés, mais sous une autre forme. Ça peut par contre avoir des limites dans la mesure où ça complique aussi l'API.
  - Sur les **données en entrée** et les paramètres :
    - C'est pareil que pour les données en entrée, sauf :
      - On peut rendre optionnelle une propriété qui était obligatoire, mais pas l'inverse.
      - On peut augmenter la taille maximale d'une chaîne et pas la diminuer.
      - On peut ajouter des valeurs à un enum.
      - Si on ajoute une propriété, il faut qu'elle soit optionnelle.
  - Sur le **feedback** :
    - Le feedback peut être traité comme des données de sortie.
      - On ne peut donc pas ajouter un élément à un enum d'erreurs existant.
    - Pour les codes de statut HTTP, la spécification dit que les clients sont censés au moins comprendre les classes d'erreur (2XX, 4XX, 5XX etc.), et donc que s'ils rencontrent une erreur qu'ils ne savent pas gérer (par ex 429), ils doivent se rabattre sur l'erreur par défaut de la classe (par ex 400).
      - Dans la réalité, les clients ne vont pas forcément suivre la spec, et n'importe quel changement de feedback pourrait les impacter (sauf peut être d'enlever un code d'erreur qui ne peut plus arriver). Donc si on peut éviter d'introduire de nouvelles erreurs avec des clients qu'on connait pas, c'est mieux.
  - Sur les **endpoints et les flows d'appels** eux-mêmes :
    - Renommer le path d'un endpoint est en théorie possible en renvoyant `301 Moved Permanently` sur l'ancien path, mais dans les faits les clients ne vont pas forcément le prendre en compte et se retrouver en état d'erreur.
    - On ne peut pas non plus enlever des endpoints sans casser les clients.
    - On peut en ajouter, mais à condition que ça ne change pas les flows existants.
      - Par exemple, si on ajoute un endpoint de validation qui devra être appelé juste après un ancien endpoint pour améliorer la sécurité, les clients non mis à jour ne l'appelleront pas, et auront des échecs "silencieux", parce que le flow aura changé.
- Même sans changer le contrat d'API, on peut quand même casser les clients par des changements d'apparence anodins du **contrat invisible**.
  - La loi de Hyrum dit : _“With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody”_.
- Les breaking changes sont bien plus graves sur les API publiques. Sur les API privées on peut en général se débrouiller pour mettre à jour les clients. Mais c'est quand même un poids non négligeable, qui doit nous amener à nous poser la question pour chaque breaking change, de savoir si on le veut vraiment.
- Quand les breaking changes deviennent inévitables, on peut **versionner son API**.
  - Le semantic versioning classique des implémentations (Major.Minor.patch) pourrait se transcrire dans l'univers des API par une version à 2 chiffres : **Breaking.Non-breaking**.
  - Pour créer les nouvelles versions, on peut :
    - Utiliser l'URL (blabla.com/apiv2/) ou les sous-domaines (v2.blabla.com/api/). C'est ce qui est le plus courant.
    - Ajouter des paramètres aux requêtes, que ce soit dans l'URL, dans le header HTTP ou autre. Mais globalement cette option-là est moins claire, et moins appréciée des consommateurs.
    - Utiliser le fait que l'utilisateur de l'API est identifié, et donc stocker côté provider une association UserID / Version. C'est plus simple pour le consommateur qui n'a rien à faire de son côté à part demander à passer à la V2, mais moins flexible aussi.
  - Il est possible de versionner avec une plus grande granularité que l'API entière, par exemple ajouter une V2 seulement pour certains endpoints, seulement certaines méthodes, ou encore donner la possibilité de visionner le contenu du body avec des headers HTTP.
    - Mais c'est peu connu des consommateurs, surtout dans le monde de REST, et ça peut porter à confusion. Donc bien réfléchir avant d'aller par là.
- Pour éviter d'avoir à faire des breaking changes, on peut essayer dès le début d'avoir des structures **extensibles**.
  - Par exemple, prendre l'habitude d'**encapsuler dans un objet** toute propriété qui nous paraît importante va nous permettre d'y ajouter des propriétés par la suite.
  - Si on a des propriétés similaires, il peut être judicieux de les **mettre dans une liste** ou un objet, pour pouvoir facilement les étendre plus tard.
    - Par ex si on a une date de début, de fin, on peut les mettre dans une liste d'événements, pour peut être plus tard ajouter une date d'exécution comme élément de liste supplémentaire.
  - Utiliser des formats de données standard permet aussi de baisser le risque de vouloir les changer plus tard.
  - Concernant les erreurs, les mettre dans une liste, avec chacune dans son objet permet de les rendre extensibles, et de pouvoir en ajouter aussi.
    - La propriété `type` correspondant à un enum indiquant le type d'erreur doit être le plus générique possible parce qu'on ne peut pas changer les enums sans breaking change.
      - Ex : `MISSING_MANDATORY_ATTRIBUTE`, plutôt que `MISSING_AMOUNT` si la propriété manquante était un amount.
    - Autre exemple : l'auteur conseille de ne pas retourner d'erreur si l'utilisateur demande 150 résultats par page et que le maximum est de 100, mais d'en retourner simplement 100. Et plus tard, si on veut abaisser ce maximum à 50, on ne provoquera pas non plus d'erreurs chez les clients.
      - Bien sûr, si l'utilisateur veut transférer 1500€ et qu'il a 1000€, il ne faut pas faire le transfert de 1000€ silencieusement, quand ça concerne le domaine métier ce genre de choix doit être réfléchi avec soin :)
  - Plus l'API va grossir, et plus l'étendre va devenir difficile sans casser soit les données, soit les flows. Une bonne pratique est de garder les API petites, et d'en faire plusieurs autonomes.

## 10 - Designing a network-efficient API

- Le “design idéal” d'API est contrebalancé par des facteurs supplémentaires à prendre en compte. L'un d'entre eux est la performance réseau. Il faut trouver un **compromis** entre les deux.
- Les problèmes de performance réseau dépendent :
  - de la vitesse du réseau
  - du volume de données échangée
  - du nombre d'appels API
- Il y a d'abord des **optimisations au niveau du protocole** :
  - La **compression** et les **connexions persistantes** sont disponibles par défaut dans HTTP, et peuvent être activées dès le début.
    - La compression permet de **réduire les données échangées**
    - Les connexions persistantes permettent de réutiliser les mêmes connexions pour plusieurs requêtes, pour **gagner de la latence**.
  - Chaque endpoint/méthode peut renvoyer des métadonnées indiquant combien de temps la réponse doit être **mise en cache** (donc conservée sans refaire d'appel API) par le client.
    - Pour le protocole HTTP ça se fait avec le header `Cache-Control`.
    - Pour choisir la valeur on se base sur le contexte au cas par cas : est-ce qu'il est probable statistiquement que telle donnée soit changée dans l'heure ? Dans les 10 mn ? Est-ce que c'est important d'avoir des données très à jour sur telle ou telle donnée ?
  - En plus du cache on peut aussi utiliser les **requêtes conditionnelles** : cette fois il s'agira pour le backend de soit retourner la donnée si elle a été modifiée depuis la dernière fois, soit une simple réponse **`304 Not Modified`** sans rien dans le body.
    - On gagne en bande passante.
    - Le mécanisme consiste à ce que le backend envoie un `Etag` dans le header HTTP la première fois, et que ce tag soit renvoyé par le client pour les prochaines fois. Le backend peut alors savoir si depuis cet Etag la donnée a changé ou non. Si elle a changé, il renverra un nouvel Etag pour la prochaine fois.
- Mais on peut aussi optimiser l'utilisation réseau grâce à des **techniques de design d'API** :
  - Permettre la **pagination** et le **filtrage** est une des panières d'envoyer moins de données à la fois.
    - Dans le cas d'une pagination, si des éléments sont ajoutés au fur et à mesure et qu'on veut garder une fiabilité et une exhaustivité de ce qui est affiché, on peut demander les X prochains éléments à partir de l'élément qui a tel ID, plutôt que juste la page 2.
  - Bien **choisir les propriétés** pour les **éléments d'une liste**.
    - Il faut trouver une balance entre trop de propriétés (voir toutes) quand on fait GET sur une ressource sans préciser laquelle, et pas assez de propriétés. Dans un cas on a beaucoup de données quelle que soit l'utilisation, dans l'autre on peut se retrouver à devoir refaire un GET mais cette fois avec l'ID de chaque objet, pour obtenir le détail avec les propriétés qui nous intéressent.
    - La solution est de trouver les propriétés qui sont souvent utiles quand on traite une liste d'objets, et les ajouter à la réponse de l'API de liste.
    - Une autre solution serait d'accepter un paramètre ou un header HTTP (par ex `Accept:application/notre.content.type.custom+json`), et de renvoyer la version courte, complète, ou même enrichie en propriétés en fonction de ce qui est demandé par le client.
  - **Agréger des données** venant de ressources différentes dans une même réponse d'API. Il s'agit de dénormalisation de données dans l'API.
    - Ça peut permettre d'économiser des appels d'API.
      - Par exemple en obtenant dans un même appel le profil d'une personne, et la liste de ses adresses qui sont d'habitude dans une ressource séparée.
    - Mais c'est à manipuler avec précaution :
      - D'abord c'est pas sûr que ça nous fasse économiser du temps dans tous les cas : parfois une énorme requête peut prendre plus de temps que plusieurs en parallèle, ou même être plus fragile sur des réseaux lents (type 3G), et donc plus souvent sujette à être retentée de zéro.
      - Ensuite ça peut être plus difficile à mettre en cache, sachant que le temps de cache sera alors celui de la ressource contenue dans l'agrégation qui a le temps de vie le plus court.
        Donc mauvaise idée de grouper une ressource qui change peu souvent et une ressource qui change très souvent dans un même endpoint.
    - On peut aussi le faire de l'**expansion** à la demande avec un paramètre : dénormaliser les données des propriétés indiquées par le client, si c'est possible.
      - Même exemple que le profil avec ses adresses, sauf que le client ajoute un paramètre `/profile?expand=addresses`
  - Permettre le **querying côté client** avec des API du type **GraphQL**. Les clients indiquent alors chaque propriété qu'ils veulent parmi celles disponibles pour une même ressource.
    - C'est utile quand le réseau est vraiment important pour nous, et que chaque milliseconde compte.
    - Par contre GraphQL utilise uniquement la méthode POST sur un unique endpoint HTTP, donc les mécanismes de cache usuels qu'on peut mettre en place avec les API REST et les headers HTTP (`Cache-Control` etc.) ne marchent pas.
      - L'éventuelle mise en cache doit être gérée par le client plutôt qu'un niveau du protocole, mais c'est de toute façon assez compliqué étant donné qu'on fait en fait de l'agrégation dans tous les sens.
  - De manière générale, revenir aux bases et **envoyer aux utilisateurs ce dont ils ont besoin** peut probablement permettre de réduire les appels réseau. Que ce soit avec de l'agrégation, l'ajout d'une propriété ici ou là, l'ajout de nouveaux endpoints spécifiques pour pour des besoins précis etc.
    - Mais comme toujours il faut trouver le bon compromis. En créant trop d'endpoints personnalisés on risque aussi d'obtenir une API compliquée et pas très réutilisable. Une solution peut être alors de créer des **couches d'API intermédiaires** consommant l'API initiale, et fournissant des endpoints spécifiques à un contexte donné.
      - Par exemple, les **BFF (Backend For Frontend)** sont des API qui vont consommer des API de données plus génériques, et fournir des endpoints personnalisés pour répondre exactement aux besoins du frontend qu'ils ont en charge.

## 11 - Designing an API in context

- La nature des informations et de la relation provider / consumer peut lourdement influencer le design d'API. On peut avoir parfois besoin d'une **communication initiée par le provider**.
  - Exemple : une transaction initiée par le client est acceptée tout de suite (donc réponse `202 Accepted`), mais doit ensuite être validée puis exécutée, et ça peut prendre des minutes, heures voire jours.
    - Le client peut faire des appels réguliers pour voir où ça en est, et le header `Cache-Control` peut donner au client une idée de la fréquence à laquelle faire ces appels.
    - Pour autant, il est hors de question que le client patiente pendant des heures ou des jours en faisant des appels réguliers, c'est trop inefficace.
  - La solution peut être la mise en place d'un **webhook** côté client.
    - Il s'agit d'une API HTTP, standardisée par le provider (pour que ce ne soit pas l'anarchie) et mise en place par le client, et dont le client a donné l'URL au provider au moment de souscrire pour avoir un token et pouvoir consommer l'API du provider.
    - Une fois que la transaction a été exécutée, le provider va alors faire un appel POST sur ce webhook, en donnant les infos de l'événement qui s'est produit. Ce backend maintenu par le client peut alors utiliser les moyens nécessaires pour envoyer l'info au téléphone, ou au navigateur (par des mécanismes push, des websockets, du simple polling HTTP de la part du navigateur etc.).
    - Attention à penser à la sécurité du webhook. Une des possibilités c'est d'en faire un event assez générique qui va pousser le client à faire une autre requête pour obtenir les infos détaillées de l'event.
    - Ce système de webhooks est standardisé par le W3C sous le nom **WebSub**.
  - Dans le cas où c'est le client qui veut obtenir des **updates très fréquents** pendant un certain temps, et pour éviter qu'il fasse des calls permanents, il peut faire un appel qui initie une communication **SSE (Server-Sent Events)**.
    - Les SSE se basent sur HTTP, et ont été standardisés par le W3C pour HTML5, donc fonctionnent très bien avec les navigateurs.
    - La connexion HTTP reste ouverte, et le serveur peut simplement envoyer des données dès qu'il les a, jusqu'à ce que l'un des deux demande à fermer la connexion.
    - Par contre c'est unidirectionnel : c'est le serveur qui envoie les données.
  - Si on veut une **connexion bidirectionnelle** (par exemple pour les chats), on peut recourir aux **WebSockets**.
    - Les WebSockets ne se basent pas sur HTTP mais directement sur TCP, donc la mise en place peut être plus compliquée vis-à-vis des proxies et autres.
- Parfois, pour économiser des requêtes on peut vouloir faire des **PATCH, PUT, POST ou DELETE sur une liste d'éléments**.
  - Il suffit d'envoyer en body une liste d'objets avec la même information qu'on aurait donné pour faire l'opération sur un seul élément.
  - Côté réponse, dans un cas comme ça on peut valider les éléments qui réussissent même si certains ont échoué.
    - On peut retourner une liste avec là aussi la réponse qu'on aurait renvoyé pour chaque élément seul : le statut, la ou les erreurs éventuelles ou le contenu pour chaque élément.
    - Le statut de la réponse HTTP peut être alors **`207 Multi-Status`**.
    - Attention à bien vérifier que dans notre cas valider certains éléments et avoir des éléments sur d'autres ne crée pas d'incohérence.
- Le type d'API qu'on utilise doit être choisi en fonction du contexte, à la fois celui du consumer parce que l'API est pour lui, et celui du provider parce qu'il a aussi des contraintes. Il faut éviter de céder au **biais de choisir l'outil ou le format qu'on connaît le mieux** à chaque fois.
- Actuellement il y a 3 types d'API connues : **REST**, **GraphQL** et **gRPC**.
  - REST étant de loin le plus connu, et répondant à la plupart des besoins, il est considéré comme celui à prendre par défaut si on n'a pas de contraintes particulières. Les autres peuvent aussi être très bien en fonction du contexte.
    - REST est basé sur les **ressources** et suit le protocole HTTP de très près. Il est le plus standardisé, et permet de profiter nativement des fonctionnalités de HTTP (content-negotiation, caching, requêtes conditionnelles etc.).
    - La gestion d'erreur est standardisée : 4XX, 5XX.
  - gRPC (g pour Google, et RPC pour Remote Procedure Call) consiste à **appeler des fonctions** dans son code en leur donnant des paramètres. Ces fonctions sont complètement custom de la part du provider, et ne se basent pas sur un modèle comme les ressources pour REST.
    - Il est en général utilisé avec des données formatées en **protobuf** (à la place de JSON), qui est un format binaire et ne répétant pas le nom de chaque propriété contrairement à JSON (donc peut diviser par presque 2 la taille des données transférées). Par contre c'est moins connu que JSON, et moins facile à afficher / débugger parce que binaire.
    - Il est construit par dessus HTTP mais n'utilise pas la plupart de ses fonctionnalités comme REST. Par contre, il permet les communications bidirectionnelles grâce à HTTP2.
    - Il a un format standard d'erreurs inspiré de REST, et pas de mécanisme standard de caching.
    - Il faut l'utiliser plutôt que REST quand on a une API **privée vers client privé** (communication entre services d'un même backend), quand les millisecondes gagnées importent vraiment.
  - GraphQL adopte le même **modèle basé sur les fonctions** que gRPC pour la création/modification, par contre pour le querying il a un **modèle basé sur les données** : c'est l'utilisateur qui spécifie non seulement les propriétés qu'il veut, mais aussi avec quel autre donnée il veut faire un lien etc.
    - Pour le query l'utilisateur a une grande flexibilité, mais il est aussi en capacité de demander **des requêtes extrêmement complexes et coûteuses**. Le rate-limiting peut ne pas suffire pour se protéger parce qu'on ne peut pas prévoir ce que le client va faire.
    - Il est agnostique niveau protocole, et est utilisé la plupart du temps par dessus HTTP avec des POST sur un endpoint unique.
    - Il a un format standard d'erreurs qui consiste à donner un texte d'erreur, et la ligne qui a causé l'erreur dans la requête GraphQL et la propriété problématique dans la donnée en réponse (si une réponse partielle a pu être faite).
    - Il n'a pas de mécanisme standard pour le caching, et celui-ci est difficile étant donné la flexibilité des données.
    - Il faut aller vers GraphQL plutôt que REST quand on est dans un contexte d'**API privée** et alimentant des **périphériques mobiles** qui ont besoin d'économiser la quantité de données échangée.
  - A noter qu'on peut tout à fait avoir par ex une API BFF spécialisée qui expose du GraphQL pour les mobiles, et qui consomme une API REST ou gRPC plus générique dans notre backend.

## 12 - Documenting an API

- Créer une documentation est une manière de tester le design : si on est incapable de l'expliquer c'est qu'il y a peut être des incohérences.
- Dans la documentation d'une API, il faut bien évidemment **une référence des endpoints possibles**. Typiquement le genre de documentation qu'on peut générer à partir d'une spécification OpenAPI.
  - Pour fournir plusieurs exemples dans OpenAPI :
    ```yaml
    requestBody:
    content:
      "application/json":
      #...
      examples:
        premierExemple:
        # ...
        deuxiemeExemple:
        summary: Résumé du 2ème exemple
        description: Description du 2ème exemple
        value:
          prop1: "blablabla"
          prop2: 3
          prop3: "bliblibli"
    ```
  - Les outils comme ReDoc sont même capables de générer des exemples de données JSON complets à partir des types et formats déclarés dans la spécification OpenAPI.
  - Il faut décrire ce que fait chaque endpoint, les données qu'il prend et renvoie, mais aussi chaque cas possible de réponse de réussite ou d'erreur. Et ne pas oublier la sécurité (scopes, autorisations). Tout ça se fait dans OpenAPI.
  - A propos de l'idée de générer la documentation à partir du code (avec éventuellement un format OpenAPI automatique intermédiaire) versus maintenir le fichier OpenAPI à la main :
    - L'avantage c'est la synchronisation plus facile entre le code et la doc.
    - Les inconvénients sont surtout le manque de flexibilité : la documentation finale contiendra moins de choses si tout vient du code. Et le risque que l'API ait plus tendance à exposer le point de vue du provider, ce qu'on souhaite éviter.
- Il faut aussi un **guide utilisateur** qui va expliquer l'API d'un point de vue global, les principes généraux, comment éventuellement s'inscrire pour avoir un token etc.
  - Pour le coup cette partie doit être écrite à la main, par exemple en markdown.
  - On y ajoute des cas d'usage détaillés, qui seront le reflet de l'API goal canvas qu'on a utilisé pour designer notre API : telle personne a besoin de telle et telle info pour pour faire telle chose + le détail des infos qu'elle donne, les API calls, les réponses qu'elle reçoit.
  - On peut aussi y ajouter les choses communes à l'API comme le type de pagination utilisée, les formats de données et plus généralement les headers HTTP supportés etc.
- Il peut être utile d'avoir une **documentation spécifique pour les développeurs de l'implémentation**.
  - Elle peut contenir des choses que les consommateurs n'ont pas besoin de savoir, et qui sont liées à la manière dont l'API s'intègre avec l'implémentation. Par exemple des infos sur d'où vient telle ou telle propriété dans le système, des liens vers des formats pour aider à implémenter etc.
- Et enfin il faut un **changelog** listant pour chaque version ce qui est ajouté/modifié, et surtout les breaking changes.
  - OpenAPI ne permet pas de faire de changelog, mais il permet d'ajouter une propriété `deprecated: true` sur les paramètres, les endpoints, les propriétés.

## 13 - Growing APIs

- A partir du moment où plusieurs personnes travaillent sur l'API, ou qu'il y a plusieurs APIs dans l'organisation, il y a de fortes chances pour que de l'incohérence s'installe entre APIs et au sein d'une API. Il faut pour ça rédiger des **API guidelines** à destination des designers d'API.
  - Il y a 3 parties :
    - Il y a d'abord les **reference guidelines** qui sont le minimum : le document décrit quelles méthodes, codes de statut, headers sont utilisés couramment dans l'API, le format des ressources (la structure de leur path), la structure habituelle des données, la manière dont la pagination est gérée etc.
      - On y définit aussi les termes utilisés dans l'API (ressource, version etc.) à l'image du langage ubiquitaire du DDD.
    - Ensuite il faut les **use case guidelines** qui sont une version plus digeste et prête à l'emploi pour étendre l'API. Par exemple comment créer un nouvel élément dans l'API, et on montre pas à pas, comme un tuto.
      - On fait bien attention à utiliser le même vocabulaire partagé que celui défini dans les reference guidelines.
    - Enfin, on peut ajouter des **design process guidelines** où on va donner des référence vers des ressources utiles pour creuser tel ou tel aspect utile pour le design de l'API. Par exemple des liens vers des spécifications, tutoriels, livres etc.
  - Le site [webconcepts.info](https://webconcepts.info/) rassemble des informations fiables sur HTTP, OAuth et d'autres concepts liés avec des liens vers les spécifications, intéressant quand on cherche la bonne spécification à suivre.
  - Le site [apistylebook.com](http://apistylebook.com/) rassemble des API guidelines célèbres dont on peut s'inspirer.
  - Il faut écrire les guidelines **petit à petit** de manière **itérative**, en n'y mettant que ce dont on est sûr à chaque fois, et en étant prêt à revoir le contenu.
    - Il faut aussi que ce soit un travail collectif et permanent de tous ceux qui sont en charge du design de l'API, sinon les guidelines ne seront pas respectées.
- Une API étant potentiellement difficile à changer, et pouvant poser des problèmes importants de sécurité, il est important qu'il y ait une procédure de **review** sérieuse à chaque changement.
  - Il faut avant tout identifier les **besoins** derrière un changement d'API.
    - La méthode des 5 “Pourquoi ?” (Pourquoi vouloir faire ceci ? Parce que cela. Et pourquoi cela ? etc.) permet en général de remonter au besoin racine.
    - Il faut aussi bien comprendre le contexte des utilisateurs, du provider de l'API, les aspects sécurité concernés (données sensibles ?) etc.
  - Ensuite il faut **linter** l'API :
    - Examiner si le design proposé suit bien les guidelines.
    - S'il est cohérent avec le reste de l'API (même si c'est pas encore écrit dans les guidelines).
    - Si des erreurs de forme ne sont pas glissées dedans. Par exemple des propriétés abrégées ou manifestement pas user friendly.
    - Une partie peut être faite avec des outils automatiques pour gagner du temps.
  - Il faut reviewer le design du **point de vue du provider**.
    - Il faut vérifier que l'API est extensible, sécurisée et ne devrait à priori pas poser de problèmes de performance ou d'implémentation.
  - Le reviewer du **point de vue du consommateur**.
    - Se demander si on n'expose pas la structure interne du provider au lieu de répondre au besoin de l'utilisateur. Vérifier que l'API est facile à utiliser, que le flow est suffisamment simple etc.
    - Obtenir du feedback des clients peut aussi avoir de la valeur pour obtenir une bonne API.
  - Et enfin une fois que l'implémentation est faite (ou en cours), vérifier qu'elle correspond bien avec la spécification de l'API.
    - Ça se fait avec des tests unitaires, et des tests au niveau de l'API.
    - Il faut toujours réaliser les tests de sécurité (vérifier le contrôle d'accès, vérifier que les données sensibles ne fuitent pas).
    - Il faut tester que l'API fonctionne comme prévu au runtime, pas seulement avec des techniques statiques sans faire tourner l'API.
    - Il ne faut pas oublier de tester le caractère obligatoire des propriétés ou encore le fait qu'une valeur doive être entre un min et un max.
    - Il faut tester l'API aussi dans toute la chaîne réseau pour vérifier que des proxis, pare-feux, routeurs ne nous causent pas de problèmes.
