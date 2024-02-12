# Accelerate

### Preface

- Les auteurs ont collecté des données de plus de **2000 organisations différentes**, de **toutes tailles** (de la startup à la grande entreprise) et de tous les domaines.
- Nicole a un background plus académique, alors que Jez et Gene ont un background plus ancré dans le développement logiciel.
- Entre 2014 et 2017, les 3 auteurs ont mené une recherche sur l’efficacité des organisations qui font du logiciel, en publiant chaque année le _State of DevOps Report_. Ce livre résume leurs découvertes.
- Ils ont principalement **utilisé des sondages** pour collecter leur donnée, et renvoient à la partie II de ce livre pour montrer en quoi leur méthode **permet une recherche scientifique**.
- Ce qu’ils ont fait chaque année :
  - **2014** :
    - Ils ont eu une approche plutôt exploratoire, en essayant de savoir quelles étaient les caractéristiques de la delivery logicielle dans les organisations, et ce qui l’impactait.
    - Ils ont découvert que :
      - Le _throughput_ et la stabilité allaient ensemble.
      - La capacité à faire de la bonne delivery avait un impact sur la profitabilité de l’entreprise.
      - La culture et les pratiques techniques avaient un impact.
    - Ils ont fait évoluer la méthode de collecte de résultats pour avoir des éléments plus précis.
  - **2015** : Ils ont confirmé les résultats de 2014, et les ont poussés plus loin.
  - **2016** : Ils ont plus particulièrement exploré les pratiques techniques et leur impact, et la partie project management (l’impact des pratiques lean notamment).
  - **2017** : Ils ont creusé le rôle de l’architecture, du leadership de transformation, et ont inclus les organisations à but non lucratif.

## Part I: What We Found

### 1 - Accelerate

- Le logiciel représente un des leviers majeurs de croissance pour tous types d’entreprises.
- Les pratiques décrites dans ce livre peuvent être considérées comme issues du mouvement DevOps.
- Il y a un écart important entre les diverses entreprises qui existent en termes de maturité sur les pratiques logicielles, et l'écart entre les meilleures et les moins bonnes organisations se creuse.
- Les leaders ont tendance à surestimer la maturité de leur organisation par rapport aux subordonnés.
- Pour la transformation de l'organisation, les auteurs conseillent d’**utiliser un _capability model_ plutôt qu’un _maturity model_** : il s’agit d’être dans une amélioration continue et de se baser sur des outcomes pour suivre l’évolution.
- Il y a souvent un désaccord sur quels aspects se concentrer dans une transformation. Les auteurs ont trouvé 24 éléments qui peuvent être suivis facilement, et dont ils ont montré qu’ils permettent la performance de la delivery et de l’organisation.
- Vu que l’étude inclut tout type d’organisations (toute tailles, greenfield comme brownfield, tous types de stacks techniques etc.), **le contenu du livre s’appliquera aussi à notre organisation**.

### 2 - Measuring Performance

- La performance de la production logicielle est **compliquée à mesurer**. Les méthodes qui le font se concentrent en général sur les outputs plutôt que les outcomes, et sur le local plutôt que le global.
  - Par exemple, certaines entreprises mesurent le nombre de lignes de code, ce qui donne du logiciel difficile à maintenir..
  - Les entreprises utilisant les méthodes agiles utilisent parfois la notion de vélocité pour mesurer la productivité. Ça conduit les équipes à surestimer les tâches et moins collaborer avec les autres équipes.
  - Certaines entreprises tentent de maximiser l’utilisation des développeurs, mais ça mène à des équipes incapables de réaliser les tâches à cause du travail non planifié qui n’a pas de place.
- Pour mesurer efficacement, il faut :
  - Se concentrer sur le **global plutôt que le local**, pour éviter par exemple un conflit entre objectifs des devs et des ops.
  - Considérer les **outcomes plutôt que les outputs**, pour éviter de favoriser le travail inutile.
- Les auteurs ont considéré **4 critères** de mesure efficace de la performance :
  - 1 - Le **delivery lead time**.
    - Dans le lean il s’agit du temps entre une demande du client, et la livraison.
    - Dans le développement logiciel, il s’agit du temps pour réaliser un changement et l’amener en production. On compte ici seulement la partie delivery parce qu’elle est plus stable que la partie discovery.
    - Les auteurs le mesurent comme étant le **temps entre le code commité et le code qui tourne en production**.
    - Avoir un lead time court permet d’avoir un cycle de feedback plus rapide.
  - 2 - La **fréquence de déploiement**.
    - C’est un proxy pour le _batch size_ dans le lean. L’idée c’est de réduire le _batch size_ pour baisser la variabilité et le risque de défaut.
    - Les auteurs le mesurent comme étant le **nombre de déploiements en production** faits par unité de temps.
  - 3 - Le **temps moyen pour restaurer le système**.
    - Il s’agit d’une métrique de stabilité.
    - Les auteurs le mesurent comme étant **la durée pour rétablir le service dans le cas où il a été interrompu ou dégradé**.
  - 4 - Le **pourcentage d’échec suite à un changement**.
    - Il s’agit d’une métrique de qualité.
    - Les auteurs le mesurent comme étant **le pourcentage de changements qui ont mené à une interruption ou une dégradation du système**.
- Les auteurs ont utilisé la technique statistique du _cluster analysis_ pour regrouper les organisations par paquets.
  - Ils ont constaté que les organisations performaient en général à peu près de la même manière sur les 4 critères. Ca veut dire qu’**il n’y a pas de compromis entre la vitesse et la stabilité ou la qualité**, puisque certains critères mesurent la vitesse, et d’autres la stabilité ou la qualité.
- Pour démontrer que les critères choisis sont pertinents vis-à-vis de l’organisation, les auteurs ont aussi demandé aux sondés comment leur organisation performait d’un point de vue **profitabilité et parts de marché**.
  - Les données montrent que les organisations qui performant bien sur les 4 critères sont deux fois plus performantes en termes de profitabilité que les mauvais performers sur les 4 critères.
  - Le même résultat a été trouvé en utilisant des **critères de performance organisationnelle non commerciaux** : quantité et qualité de services et de biens, satisfaction des clients etc.
- Etant donné que la delivery logicielle a un impact sur l’organisation, les auteurs conseillent de **garder les logiciels stratégiques dans l’entreprise**, et de sous-traiter ou utiliser des logiciels-as-a-service pour les logiciels non stratégiques.
  - Il s’agit du cœur du _Wardley Mapping_.
- Attention par contre à s’assurer d’abord d’avoir une culture d’amélioration continue et d’apprentissage avant d’essayer d’avancer sur ces métriques dans notre organisation. Si l’organisation est pathologique, les employés cacheront des choses et falsifieront les chiffres.

### 3 - Measuring and Changing Culture

- La culture d’une organisation est en général divisée dans le milieu académique en 3 niveaux :
  - 1 - Les _basic asumptions_ qui représentent les comportements ancrés et difficiles à conceptualiser par les acteurs eux-mêmes.
  - 2 - Les _values_ qui peuvent être discutées par les acteurs, et qui sont ce qu’on appelle habituellement “culture” pour une organisation ou une équipe.
  - 3 - Les _artifacts_ qui sont les plus visibles, et sont constitués par des documents écrits, des procédures, des rituels etc.
- Les auteurs de ce livre ont choisi de se concentrer sur le 2ème niveau, et ont en particulier choisi le **modèle de Westrum**.
  - Ils s‘agit de classifier les organisations en 3 catégories :
    - **Pathological** : le management se fait par la peur et la menace. Les employés font souvent de la rétention ou de la distorsion de l’information pour des raisons politiques.
    - **Bureaucratic** : chaque département établit ses règles et procédures, et insiste sur leur strict respect. Suivre les règles est plus important que la mission.
    - **Generative** : ce qui est mis en avant c’est la performance et l’accomplissement de l’objectif de l’organisation. Tout découle de ça.
  - Pour Westrum, le type d’organisation influence grandement la manière dont l’information circule à l’intérieur de celle-ci.
  - Le modèle de Westrum indique que les organisations génératives ont 3 avantages :
    - Les employés collaborent mieux et ont un plus grand niveau de confiance.
    - La mission étant mise en avant, les querelles personnelles ou de département passent au second plan.
    - La hiérarchie joue un rôle mineur comparé aux autres types.
  - Les auteurs ont pu démontrer que **le type génératif d’organisation mène à une meilleure performance de delivery et organisationnelle**.
  - Ils ont aussi pu montrer que les pratiques comme la _continuous delivery_ et les pratiques de _lean management_ permettent d’aller vers le type génératif.
- Pour **mesurer le type de culture d’organisation**, les auteurs utilisent des questions de type _Likert_, c’est-à-dire la possibilité de mettre entre “Strongly disagree” et “Strongly agree” avec 7 niveaux de granularité.
  - Une fois les mesures obtenues, les auteurs font une analyse de cohérence des données avant de les utiliser pour des interprétations : il s’agit d’analyser un _construct_.
    - Est-ce que les choses qui doivent aller ensemble ont été effectivement répondues ensemble, est-ce que les éléments qui ne sont pas liés ne le sont effectivement pas etc.
    - Leur analyse démontre que le _construct_ basé sur le modèle de Westrum est fiable.
- Un autre _construct_ a été fait avec les 4 métriques de la delivery performance, mais seules 3 des métriques ont passé l’analyse pour former un _construct_ cohérent : le delivery lead time, la fréquence de déploiement et le temps pour restaurer le système.
  - Le pourcentage d’échec après changement ne fait pas partie du _construct_, bien qu’il soit aussi corrélé aux autres.

### 4 - Technical Practices

- La **continuous delivery** consiste à pouvoir livrer en continu. Elle a les caractéristiques suivantes :
  - La qualité est intégrée au processus de développement.
  - Les changements sont de petite taille.
  - Les tests sont automatisés.
  - L’équipe est dans une démarche d'amélioration permanente.
  - Chacun est responsable d’atteindre les objectifs organisationnels.
  - Côté technique :
    - La configuration est versionnée, et appliquée automatiquement dans les étapes de build, test et déploiement.
    - Les changements sont intégrés en continu.
    - Les tests sont écrits en même temps que le code.
- Les auteurs ont mesuré, et montré que les caractéristiques suivantes participaient à améliorer la performance de la delivery (en réalisant des _constructs_ pour la plupart):
  - L’utilisation d’un **système de versionning**, non seulement pour le code, mais aussi pour la configuration système et la configuration de l’application.
    - Le fait que la configuration système et la configuration de l’application soit versionnée a une corrélation particulièrement forte avec la performance de la delivery.
  - L’utilisation d’une **suite de tests automatisés** joués régulièrement.
    - Le fait que ces tests soient fiables (pas de faux positifs ou négatifs) joue aussi dans la corrélation avec la performance de la delivery.
    - Les tests écrits par les développeurs, plutôt que par des QA ou des sous-traitants, est aussi corrélé à la performance.
  - Le **déploiement automatisé**.
  - L’intégration continue, aussi appelé **trunk-based development**, où une branche ne dure pas plus d’un jour avant d’être intégrée à la branche principale.
  - Le **_shift left_ sur la sécurité**, c’est-à-dire qu’elle soit intégrée au processus de développement.
  - La **disponibilité de données pour réaliser des tests** : les équipes de développement peuvent disposer de telles données pour jouer les tests au besoin.
- Les auteurs ont trouvé que les pratiques associées à la _continuous delivery_ avaient :
  - Un impact positif sur la **performance de delivery** :
    - Un meilleur résultat sur les 4 métriques de performance de delivery.
  - Un impact positif sur la **performance organisationnelle** :
    - Une tendance vers la culture générative au sens de Westrum.
    - Le fait que les employés s’identifient fortement à l’organisation.
  - Un impact positif sur le **bien-être des employés** :
    - Un taux de burnout plus faible chez les employés.
    - Un plus faible ressenti de “douleur” lié au déploiement de la part des employés.
  - Un impact positif sur la **qualité** :
    - Un plus faible pourcentage d’échec suite à un changement, qui est une métrique de qualité en plus de faire partie des 4 métriques de performance de la delivery.
    - Une meilleure qualité du produit perçue par les employés.
    - Un plus faible pourcentage de temps passé sur du travail non prévu, et à résoudre les bugs remontés par les clients.

### 5 - Architecture

- La continuous delivery permet d'améliorer la performance sous plusieurs aspects, mais elle est parfois difficile à mettre en place quand l’architecture des systèmes existants n’est pas adaptée.
- Les auteurs ont récupéré des données de **différents types de systèmes**, mais ont trouvé que seuls les cas où le logiciel est sous-traité, et le cas où c’est un système mainframe avaient une performance de delivery moindre.
  - Le fait que les systèmes soient greenfield, anciens, auto-hébergés ou non, service oriented ou non, incluant du logiciel embarqué ou non etc. n’a pas de corrélation avec la performance.
- Les auteurs ont trouvé que la caractéristique importante était **que les systèmes soient faiblement couplés**.
  - Ceux qui performent le mieux répondent à ces caractéristiques :
    - Ils n’ont pas besoin d’un environnement intégré type staging / pré-production pour la plupart de leurs tests.
    - Ils déploient leur application/service indépendamment des autres équipes.
    - Ils peuvent faire des changements majeurs dans leur application sans l’accord d’une personne extérieure à l’équipe, et sans coordination avec d’autres équipes.
  - Ca implique que les équipes soient pluridisciplinaires pour pouvoir réaliser leurs tâches sans avoir à communiquer des détails de ces tâches avec d’autres équipes.
- Ils ont trouvé que pour les high-performers, **plus l’organisation est grande et plus le nombre de déploiements par développeur est grand**.
  - A l’inverse, pour les low performers, la fréquence de déploiement par développeur baisse quand l’organisation est plus grande.
- Les auteurs ont trouvé que globalement, bien que la standardisation amène certains bénéfices, **laisser les équipes choisir leurs outils** et frameworks augmentait la performance de delivery et de l’organisation.
  - Ça n'empêche que la standardisation dans des domaines particuliers est plus efficace, comme par exemple l’architecture et la configuration de l’infrastructure, ou encore les librairies liées à la sécurité.
  - Il s’agit en fait de laisser les équipes choisir leurs outils, y compris des outils standards dans le cas où ils le trouvent pertinent et où ça leur facilite la vie.
  - Ils ont aussi trouvé que le plus efficace pour **les architectes** était qu’ils se concentrent sur le fait d’aider les développeurs à atteindre leurs outcomes, en aidant à une architecture découplée par exemple, et non pas qu’ils se concentrent sur le choix des outils.

### 6 - Integrating InfoSec into the Delivery Lifecycle

- Les auteurs ont montré qu’**intégrer la sécurité dans la phase de développement** (_shift left_) est corrélé avec une meilleure performance de la delivery.
  - Les high performers passent aussi 50% de temps passé en moins à régler les dommages liés au manque de sécurité, par rapport aux low performers.
- Intégrer la sécurité au développement passe par :
  - Former les développeurs aux pratiques de sécurité.
  - Que les experts en sécurité fournissent des outils et librairies de sécurité pour les développeurs.
  - Que les experts en sécurité interviennent auprès des développeurs pendant le développement des features, plutôt qu’à une phase séparée et ultérieure.

## 7 - Management Practices for Software

- Historiquement les logiciels étaient principalement gérés par un management de projet. Après les années 2000, la méthodologie agile et le lean se sont peu à peu imposés. Le lean a initialement été adapté pour le logiciel par les livres de Mary et Tom Poppendieck.
- La recherche menée par les auteurs s’intéresse en particulier à l’impact des pratiques issues du lean sur la performance de la delivery. Ils ont spécifiquement étudié 4 pratiques :
  - 1 - Le fait de **limiter le nombre de tâches en parallèle**, et d’utiliser cette limitation pour améliorer le process et l’efficacité.
    - Les auteurs posent spécifiquement la question de savoir si la limitation permet aux sondés l’amélioration du process et du throughput.
  - 2 - Le fait d’**afficher graphiquement les métriques de productivité et l’état actuel du travail**, y compris les défauts, à la fois pour les leaders et les employés.
    - Les auteurs demandent à quel point ces visuels sont disponibles facilement pour tout le monde.
  - 3 - Le fait d’**utiliser les données de monitoring et de performance pour prendre des décisions** business au quotidien.
  - 4 - Le fait d’**avoir un process review du code “light”**.
    - Les auteurs ont mesuré l’impact d’un organisme externe à l’équipe qui doit valider les changements de code, le peer reviewing à l’intérieur de l’équipe (pair programming ou asynchrone), et le fait de n’avoir aucun mécanisme de review.
    - Le résultat est que **les équipes qui utilisent le peer review et celles qui n’ont pas de mécanisme de review du tout** ont une meilleure performance de la delivery que les autres.
    - Les reviews par un organisme externe à l’équipe ralentissent la delivery, mais n’apportent pas plus de stabilité.
- Les auteurs ont trouvé que les pratiques de lean management mesurées menaient à :
  - Une culture de type générative.
  - Une meilleure performance de la delivery.
  - Moins de burnout chez les employés.

## 8 - Product Development

- Ce qu’on appelle agile n’en est souvent pas vraiment : on passe de longs mois à attribuer le budget, faire de l’analyse, créer des requirements, qui donnent lieu à de gros projets de delivery, avec le feedback client laissé pour la fin.
  - Le lean et le mouvement _lean startup_ prônent au contraire la **product discovery auprès des clients, depuis le début et tout au long** du développement des fonctionnalités.
  - Les auteurs citent **_The Lean Startup_** d’Eric Ries, qui s’est inspiré du lean, du _design thinking_, et du travail de Steve Blank.
- Les auteurs ont mesuré les pratiques produit suivantes issues du lean :
  - Le fait de **découper les fonctionnalités** en use-cases réalisables en moins d’une semaine.
  - Le fait que l’équipe ait la visibilité et la compréhension de **l’ensemble de la chaîne du business à la delivery**.
  - Le fait que les organisations fassent de la **discovery régulière**, et utilisent le résultat de cette discovery comme feedback pour concevoir leurs produits.
  - Le fait que les équipes aient **l’autorité pour modifier les spécifications** pendant le développement, sans demander la permission.
- Les auteurs ont trouvé que ces pratiques prédisaient :
  - La performance de la delivery.
  - La performance organisationnelle.
  - Une culture générative.
  - Un taux de burnout plus faible des employés.
