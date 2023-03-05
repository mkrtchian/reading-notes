# Monolith to Microservices: : Evolutionary Patterns to Transform Your Monolith

## 1 - Just Enough Microservices

- Les microservices sont un type particulier de service-oriented architecture (SOA).
  - Ils exposent une API via le réseau, donc forment une architecture distribuée.
  - Il sont **déployables indépendamment** :
    - Il s’agit d’être en mesure de modifier et déployer un seul service sans toucher aux autres.
    - Le conseil de l’auteur est d’_effectivement_ déployer les services indépendamment, plutôt que le tout ensemble en espérant une indépendance théorique.
  - Ils sont organisés autour d’un **business domain**.
    - Le but est de rendre les changements affectant plusieurs microservices le plus rare possible, et favoriser les changement à l’intérieur du microservice.
  - Ils gardent la **base de données privée**, et ne l'exposent que via une API.
    - Partager la DB est une des pires choses à faire pour avoir une déployabilité indépendante.
    - Ne pas la partager telle quelle permet de décider ce qu’on partage et ce qu’on ne partage pas, et aussi de garder une API publique stable tout en étant libre de faire des changements en interne.
- L’exemple utilisé dans ce livre est une entreprise de vente de CD de musique.
  - Elle a une application organisée en 3 couches techniques : UI, backend, DB.
  - Chaque couche est sous la responsabilité d’une équipe : équipe front, équipe back, équipe DB.
    - Et d’ailleurs cette l’architecture découle probablement de l’organisation des équipes cf. loi de Conway.
  - On a donc une forte cohésion au niveau technique : s’il faut faire un travail sur un aspect technique (par exemple moderniser la UI), une seule équipe sera impactée.
    - Mais on a une faible cohésion par domaine business, puisque l’ajout d’une fonctionnalité nécessite l’intervention et la coordination de 3 équipes.
  - A l’inverse on peut imaginer une architecture organisée autour des domaines, avec un bout de UI, un bout de backend et un bout de DB chacun, et sous la responsabilité d’équipes pluridisciplinaires.
- Les **microservices** ont de nombreux **avantages**, et il s’agit de comprendre lesquels on cherche à obtenir en priorité pour orienter notre décomposition de monolithe.
  - La possibilité de scaler différemment des parties du système, et d’obtenir de la robustesse (le système peut continuer à opérer même si une partie est down).
  - La possibilité d’utiliser différentes stacks technologiques et de les faire communiquer ensemble.
  - La possibilité pour plusieurs équipes de travailler sur le système sans se marcher dessus.
- Parmi les **désavantages** :
  - Les problématiques des systèmes distribués : la communication réseau étant significativement plus lente que la communication in-process, et les paquets pouvant se perdre, on doit faire attention à beaucoup plus de choses.
    - Les transactions deviennent problématiques.
  - Les microservices arrivent avec leurs technologies spécifiques à maîtriser, qui peuvent causer bien plus de problèmes que les systèmes classiques si elles sont mal utilisées.
- La **UI** ne doit pas être mise de côté dans la décomposition : si on veut pouvoir déployer rapidement des features complètes, il faut la décomposer elle-aussi pour qu’elle corresponde avec les services côté backend.
- L’auteur conseille de ne pas adopter une nouvelle stack technologique pour faire la migration vers les microservices. La migration en elle-même est déjà assez difficile, il vaut mieux garder les outils qu’on connaît dans un premier temps.
- A propos de la **taille** des microservices :
  - C’est un des critères les **moins importants**, surtout quand on débute avec.
  - Il vaut mieux s’intéresser d’abord à la question de savoir combien de microservices on sera capable de gérer dans l’organisation, et comment faire en sorte de ne pas trop les coupler.
  - Il cite Chris Richardson qui parle d’avoir des microservices avec de petites interfaces.
    - NDLR : c’est par cette idée que Vlad Khononov caractérise principalement les microservices dans _Learning Domain Driven Design_.
  - L’idée initiale des microservices était de les avoir si petits qu’on pourrait facilement les recoder pour les remplacer (par exemple dans une techno qui permette plus de performance/scalabilité), mais l’auteur sous-entend que ce n’est plus vraiment un critère essentiel, en tout cas qui fait consensus.
- Côté ownership, l’architecture en microservices favorise le modèle où les équipes tech/produit sont au contact du client, et sont supportées par d’éventuelles équipes transverses.
  - Ca s’oppose au modèle plus traditionnel où le “business” gère la relation avec les clients, et où les développeurs sont dans un silo à part, sans ownership réel sur un business domain de bout en bout.
- Le terme **monolith** désigne ici l’unité de **déploiement**.
  - Le **single process monolith** : il s’agit d’une app single-process, qu’on peut éventuellement dupliquer pour des raisons d’availability.
    - En général le monolithe va au moins communiquer avec une DB, formant un système distribué très simple.
    - Ça représente l’essentiel des projets qui cherchent à migrer vers du microservice, donc l’auteur va se concentrer sur ça.
    - Il est possible de réaliser un **modular monolith** en gardant le single-process, mais en créant des modules de code bien séparés.
      - [Shopify](https://www.youtube.com/watch?v=ISYKx8sa53g) est un bon exemple de modular monolith.
      - On a ceci dit souvent la DB dont le split en modules est négligé.
  - Le **distributed monolith** : on a plusieurs services communiquant à travers le réseau, mais le système a besoin d’être déployé en un bloc.
    - C’est un système qui a tous les désavantages : absence de modularisation, et système distribué.
  - Les **third-party black-box systems** : les services externes SASS qu’on utilise, ou open source qu’on installe.
- Les **monoliths** ont un certain nombre de **désavantages** :
  - Les diverses parties du code ont tendance à être plus facilement couplées.
  - Le travail à plusieurs équipes est plus compliqué en terme de conflit de modification, en terme de confusion d’ownership, et aussi pour savoir quand déployer.
- Concernant les **avantages** :
  - On n’a pas tous les problèmes associés aux systèmes distribués.
  - Le workflow de développement, le monitoring et le débug est plus simple.
  - On peut réutiliser du code très facilement.
- A propos du **couplage** et de la **cohésion** :
  - Le couplage c’est l’idée que changer une chose implique d’en changer aussi une autre. La cohésion c’est le fait de garder ensemble des choses qui ont un rapport entre-elles (et qui d’habitude changent ensemble).
    - Pour avoir un système facile à transformer, on a envie que le couplage soit faible, et la cohésion élevée.
    - Par exemple, si la logique d’une fonctionnalité est présente à travers plusieurs modules, on va devoir les changer tous pour la modifier (couplage élevé), et les éléments de cette fonctionnalité ne sont pas rassemblés (cohésion faible).
  - Dans le cas spécifique des microservices, les modules en question qu’il faut considérer en priorité sont les microservices eux-mêmes, puisque modifier leurs limites coûte très cher.
    - On veut donc faire en sorte que chaque changement impacte, et donc oblige le redéploiement, du moins possible de microservices.
    - Si dans les microservices on peut se tromper dans les limites de chaque service, dans le monolithe ces limites n’existent pas naturellement, et donc on a tendance à avoir un couplage généralisé où tout dépend de tout.
  - Il y a différents types de couplage :
    - **Implementation coupling** : il s’agit d’un service qui doit changer quand on modifie l’implémentation d’un autre service.
      - L’exemple typique c’est le couplage à la DB d’un autre service.
        - La solution c’est soit d’avoir une API pour accéder à la donnée, soit d’avoir une DB publique spécifique pour les consommateurs externes, distincte de la DB interne du microservice.
      - Avoir une interface publique distincte permet aussi de concevoir cette interface pour répondre aux besoins des consommateurs, en mode **outside-in**, plutôt qu’imaginer ce qu’on veut exposer parmi ce qu’on a déjà.
        - L’auteur conseille de toujours faire ça : **impliquer les consommateurs dans le design de l’API publique**, pour que le service les serve au mieux.
    - **Temporal coupling** : il s’agit de communication synchrone dépendante d’autres communications.
      - Par exemple, si un service envoie un message à un autre service, qui doit d’abord interroger un 3ème avant de répondre. Si le 3ème est down le 2ème ne pourra pas répondre.
        - La solution peut être pour le 2ème service d’avoir les données du 3ème en cache.
        - Une autre solution pourrait être d'utiliser des communications asynchrones : le 3ème service reçoit le message asynchrone et recontacte le 2ème quand il est dispo.
      - Pour plus d’infos sur le type de communications, voir le chapitre 4 de **_Building Microservices_**.
    - **Deployment coupling** : à chaque fois qu’on doit redéployer des services quand on en déploie un.
      - Idéalement on veut pouvoir déployer le plus petit set de choses pour avoir peu de risques et un feedback rapide (et aller vers une continuous delivery).
      - Les _release trains_ sont une mauvaise idée.
    - **Domain coupling** : il s’agit des interactions indispensables liées aux fonctionnalités elles-mêmes.
      - On ne peut pas les éliminer, mais on peut les agencer de telle sorte qu’elles aient un impact limité en termes de couplage.
      - Par exemple, dans le cas de l’entreprise de vente de CD, le microservice de la commande doit communiquer au microservice de l'entrepôt quels CD ont été achetés et où ils doivent être acheminés.
        - On peut réduire au maximum les informations communiquées entre services, par exemple l’entrepôt recevrait seulement les données de packaging et pas l’ensemble des détails de la commande.
        - On peut faire en sorte que la commande inclut les infos nécessaires sur l’utilisateur (dont elle aura de toute façon besoin pour d’autres raisons) dans le message envoyé à l’entrepôt, plutôt qu’avoir l’entrepôt faisant un autre appel pour obtenir les infos de l’utilisateur.
        - Une autre possibilité pourrait être que la commande émette un event, et que l'entrepôt le consomme.
- Le **Domain Driven Design** permet d’organiser les microservices efficacement autour de business domains.
  - Les **aggregates** :
    - On peut les voir comme des représentations de choses réelles, avec un cycle de vie qu’on peut traiter avec une machine à état.
      - Par exemple une commande, une facture, un objet en stock.
    - Un microservice peut contenir un ou plusieurs aggregates.
      - Si un autre microservice veut changer le contenu d’un aggregate, il doit soit envoyer un message au microservice qui en a la responsabilité, soit faire en sorte que ce microservice écoute des events que lui émet.
    - Il y a de nombreux moyens d’organiser le système en aggregates, mais il vaut mieux commencer par celui qui colle le mieux au modèle mental des utilisateurs.
      - L’event storming est un bon moyen pour ça.
  - Les **bounded contexts** :
    - Ils permettent de cacher l’implémentation aux bounded contexts extérieurs.
    - Ils contiennent un ou plusieurs aggregates, dont certains peuvent être privés pour l’extérieur.
  - Concernant la relation avec les microservices :
    - Au début on cherche de gros microservices, donc les bounded contexts sont de bons candidats.
    - A mesure qu’on avance, on va affiner nos microservices, et opter pour un aggregate par service.
    - A noter que le groupe de microservices autour d’un bounded context peut cacher qu’il y a en fait plusieurs microservices (ce détail relevant de l’ordre de l’implémentation).
    - NDLR : selon Vlad Khononov le microservice est de fait un bounded context, et va bien avec la taille d’un subdomain. Il ne peut pas être plus grand que le plus grand bounded context possible, ni plus petit qu’un aggregate. Mais la taille de l’aggregate marche rarement.

## 2 - Planning a Migration

- On peut vouloir adopter les microservices pour diverses raisons, et ces raisons peuvent fortement influencer ce sur quoi on va concentrer nos efforts.
- L’auteur pose en général 3 questions pour aider les entreprises à **savoir si elles ont besoin des microservices** :
  - Qu'est-ce que vous espérez accomplir ?
    - On devrait pouvoir trouver des choses qui sont alignées avec les besoins business et des utilisateurs finaux.
  - Est-ce que vous avez considéré des alternatives ?
  - Comment saurez-vous si la transition fonctionne ?
- Parmi les **raisons de choisir les microservices** :
  - **Améliorer l’autonomie des équipes / Scaler le nombre de développeurs**.
    - Il est notoire que les unités business autonomes sont plus efficaces. Et cette règle s’applique aussi à l’échelle de l’équipe, comme le modèle d’Amazon avec les équipes à deux pizzas.
    - Avoir le contrôle exclusif sur des microservices permet aux équipes d’acquérir de l’autonomie, et de travailler en parallèle.
    - Autres moyens d’obtenir ça :
      - Le **monolith modulaire** peut répondre à ce point, avec une certaine coordination nécessaire quand même pour le déploiement commun.
      - On peut aussi penser à des approches self-service où on provisionne des machines automatiquement au lieu d’avoir à passer par un ticket manuel auprès d’une autre équipe.
  - **Réduire le time to market**.
    - Le fait que les microservices permettent de déployer sans besoin de coordination fait qu’on peut amener des changements en production plus vite.
    - Autres moyens d’obtenir ça :
      - L’auteur recommande de faire l’**analyse** concrète du chemin et du **temps réel de chaque étape** entre l’idée obtenue en discovery, et la feature en production.
      - On trouve souvent des bottlenecks qui permettent de gagner un temps conséquent.
  - **Scaler efficacement la charge**.
    - Comme les microservices tournent dans des processus différents, on peut les scaler indépendamment, et donc maîtriser les coûts de notre infrastructure.
    - Autres moyens d’obtenir ça :
      - On peut essayer de passer sur une plus grosse machine (scaling vertical).
      - Faire tourner **plusieurs copies du monolithe**, derrière un load balancer (scaling horizontal). Le bottleneck risque d’être la DB, mais ça ne coûte pas très cher d’essayer.
  - **Améliorer la robustesse**.
    - Comme on a plusieurs unités indépendantes et tournant sur des machines séparées, on peut concevoir le système de sorte qu’il continue à fonctionner même si certaines parties sont en échec.
    - Attention quand même : il y a tout un effort à faire pour obtenir cette robustesse, le fait de distribuer le système ne suffit pas à le rendre robuste.
    - Autres moyens d’obtenir ça :
      - Faire tourner **plusieurs copies du monolithe** permet de répondre à cette problématique. Y compris par exemple dans des racks ou datacenters différents.
  - **Adopter de nouvelles technologies.**
    - Les microservices étant isolés et communiquant par réseau, on peut très bien tester un nouveau langage, une nouvelle DB ou autre sur un seul microservice.
    - Autres moyens d’obtenir ça :
      - On peut parfois switcher de langage, par exemple si on utilise la JVM, on peut basculer entre les langages supportés.
        - Pour les nouvelles DB c’est plus compliqué.
      - On peut toujours remplacer le monolithe par un nouveau avec une approche incrémentale type _strangler fig_.
  - **Réutiliser des composants**.
    - C’est une **mauvaise raison**.
    - En général on cherche à optimiser autre chose derrière la réutilisation, il vaut mieux se concentrer sur cette vraie raison.
      - Par exemple, la réduction du time to market. Or le coût de coordination entre équipes peut impliquer que réécrire le composant serait plus rapide.
- **Quand ne pas adopter les microservices** :
  - **Un domaine pas très clair**.
    - Dans le cas où on a un domaine encore jeune et pas très bien compris, la décomposition en microservices peut impliquer de se tromper de limites, et les changer coûte cher.
    - Et donc typiquement il faut éviter les microservices dès le début.
  - **Quand on est une startup**.
    - Les microservices sont utiles pour les scale-ups ou les entreprises établies qui ont trouvé leur product market fit. Les startups le cherchent et donc seront amenées à beaucoup changer leur produit.
    - On peut éventuellement séparer ce qui est clairement à part dans un service, et laisser le reste dans le monolithe pour nous donner plus de temps pour le faire maturer.
    - Il y a aussi la question de la capacité à gérer les microservices avec les effectifs de la boite : si on a du mal à en gérer 2, en gérer 10 va être vraiment difficile.
  - **Quand le logiciel est déployé chez le client**.
    - Le déploiement de microservices implique une grande complexité au niveau de l’infrastructure. On ne peut pas attendre des clients qu’ils puissent la gérer.
  - **Quand on n’a pas de bonne raison**.
    - Mine de rien c’est un des cas les plus courants où les gens adoptent les microservices alors qu’ils ne devraient pas.
- On a souvent plusieurs raisons d’adopter les microservices dans notre organisation. Il faut les **prioriser**.
  - Par exemple, on décide qu’il nous faut des microservices pour gérer une augmentation de trafic. Puis on se dit que ce serait pas mal d’augmenter aussi l’autonomie des équipes, et d’adopter un nouveau langage.
    - Il faut bien garder en tête que c’était l’augmentation du trafic qui était la plus importante. Et donc si on trouve un autre moyen plus simple de régler le problème, peut-être que les autres raisons devront attendre.
  - Un bon moyen pour aider aux décisions est de représenter l’ensemble des raisons d’adopter les microservices avec des curseurs de 1 à 5 : si on augmente le curseur pour une raison, on doit le baisser pour une autre.
- Pour réussir à créer un **changement organisationnel** (pour mettre en place des microservices ou autre chose), l’auteur propose la méthode en 8 étapes de John Kotter, décrite plus en détail dans son livre **_Leading Change_**.
  - **Étape 1 : Establishing a sense of urgency**. Le meilleur moment pour initier le changement c’est juste après une crise dont l’idée qu’on veut mettre en place règlerait le problème sous-jacent, avec l’idée “Il faut le mettre en place _maintenant_”.
  - **Étape 2 : Creating the guiding coalition**. On a besoin de convaincre des personnes autour de nous. En fonction de l’impact de notre idée, il faudra avoir des personnes plus ou moins haut placées, et typiquement des personnes du business dans le cas où on introduit des systèmes distribuées qui vont impacter les utilisateurs.
  - **Étape 3 : Developing a vision and strategy**. La vision définit le “quoi”, elle doit donner envie mais être réaliste. La stratégie définit le “comment”.
  - **Étape 4 : Communicating the change vision**. Il vaut mieux privilégier la communication en face à face (plutôt que slack ou ce genre de chose) pour pouvoir ajuster le discours en fonction des réactions.
  - **Étape 5 : Empowering employees for broad-based action**. Souvent les organisations amènent de nouvelles personnes dans l’équipe pour aider au changement en donnant de la bande passante.
  - **Étape 6 : Generating short-term wins**. Pour éviter que l’engouement retombe, il faut obtenir des quick wins. Ça peut être par l’extraction de microservices “faciles” (à condition qu’ils aient un intérêt quand même).
  - **Étape 7 : Consolidating gains and producing more change**. On continue avec des changements plus profonds en fonction des succès ou échecs. Ça peut être la décomposition de la DB qu’on ne peut pas mettre de côté éternellement.
  - **Étape 8 : Anchoring new approaches in the culture**. A force de pratiquer la nouvelle manière de faire, la question de savoir si c’est la bonne approche ou non disparaît. Elle devient habituelle.
- La décomposition d’un monolithe étant une chose difficile, il faut qu’elle soit faite de manière **incrémentale**. On sort un service à la fois, et on obtient du feedback pour s’améliorer sur la suite.
  - Le feedback en question est aussi précieux parce que la plupart des problèmes complexes liés aux microservices sont remarqués une fois que c’est **déployé en production**.
- Une des raisons de la méthode incrémentale est de **rendre les erreurs réversibles**.
  - Mais il y a des décisions qui sont plus impactantes que d’autres, et donc il faut **adapter le temps passé à analyser à la facilité à annuler la décision**.
    - Exemple : changer de fournisseur cloud ou changer l’API qu’on fournit publiquement est très impactant, alors d'expérimenter une librairie open source ou un nouveau langage beaucoup moins.
  - Certaines décisions liées aux microservices peuvent être difficiles à défaire, par exemple annuler une migration de DB ou défaire la réécriture d’une API utilisée par de nombreux consumers.
    - Dans ces cas, l’auteur recommande d’utiliser un tableau blanc pour simuler les divers use-cases et leurs conséquences en terme de communication entre services, pour voir s’il y a des problèmes apparents.
- Pour ce qui est de savoir où on commence, il nous faut une décomposition en composants business. Et pour ça on utilise le **Domain Driven Design**.
  - La notion de **bounded context** et les relations entre les BCs nous permet de représenter un découpage possible en microservices.
  - On n’a pas besoin d’un modèle super détaillé des BCs, mais d’avoir **juste assez d’information** pour pouvoir commencer à faire des choix. Et comme on procède de manière incrémentale, une erreur est vite rattrapée.
  - L’**event storming** est un outil recommandé par l’auteur pour obtenir une connaissance partagée du modèle, et pouvoir faire des choix pertinents à partir de là.
    - Pour approfondir il y a **_Introducing EventStorming_**, le livre pas encore terminé d’Alberto Brandolini.
  - Pour prioriser, on peut se servir du **context mapping** (le nom n’est pas mentionné par l’auteur).
    - Un BC qui a beaucoup de liens avec d’autres BCs ne sera peut être pas le bon premier candidat pour être extrait en microservice parce qu’il impliquera beaucoup de communications réseau.
    - A noter que le context map qu’on a à ce stade ne représente pas forcément le vrai découpage. Il va falloir regarder dans le code et vérifier ce que le BC fait dans base de données.
    - Il faudra aussi mettre la facilité d’extraction en balance avec l’utilité d’extraire ce BC là.
      - Par exemple, si notre objectif c’est d’améliorer le time to market, mais qu’on commence par extraire un BC en microservice alors qu’il n’est presque jamais modifié, on n’aura pas beaucoup d’impact sur ce qu’on voulait faire.
      - On peut placer les BCs sur un graphique à deux axes : en abscisses l’intérêt de la décomposition, et en ordonnée la facilité de la décomposition.
        - On va choisir en priorité les BCs qui se retrouvent en haut à droite.
- A propos de l’**organisation des équipes**.
  - Historiquement les équipes étaient organisées par compétences techniques : devs Java ensemble, DBA ensemble, testeurs ensemble etc.
    - Pour intervenir sur une fonctionnalité il fallait passer par plusieurs équipes.
  - De nos jours, avec des mouvements comme DevOps, les spécialités sont poussées vers les équipes de delivery, qui sont organisées autour de domaines fonctionnels, en _vertical slices_.
    - Le rôle des équipes centrales qui restent s’est transformé : au lieu de faire eux-mêmes, ils aident les équipes delivery, en y envoyant des spécialistes, organisant des formations, et en créant des **outils self-service**.
  - Pour aller plus loin, l’auteur recommande **_Team Topologies_** et **_The Devops Handbook_**.
  - Il faut faire attention à ne pas chercher à copier tel quel les autres organisations, sans prendre en compte le contexte, la culture d’entreprise etc. On peut en revanche s’en inspirer.
    - Le changement **prend du temps**. Par exemple, on peut intégrer des ops dans des équipes de dev pour former petit à petit chacun aux problématiques de l’autre.
    - Pour commencer le changement, on peut réunir des personnes de chaque équipe, et faire un mapping des responsabilités liées à la delivery, en fonction de chaque équipe.
    - Et ensuite on peut planifier un changement de responsabilités liées aux équipes, et de la structure des équipes, sur 6 mois à un an par exemple.
  - Concernant la montée en compétence nécessaire pour la nouvelle organisation, l’auteur préconise de laisser les développeurs s’auto-évaluer avec une note sur chaque compétence nécessaire, et de les aider ensuite sur celles où ils se sont mis un faible score.
    - Ces auto-évaluations devraient être privées pour ne pas être faussées.
- Pour savoir si on va **dans la bonne direction** :
  - Il faut avoir quelques **métriques** quantitatives et qualitatives liées aux outcomes qu’on recherche avec la transition qu’on a entamé.
    - Les métriques quantitatives dépendent des objectifs.
      - Par exemple, si c'est le time to market, on peut mesurer le cycle time, le nombre de déploiements et le failure rate.
      - Si on cherche la scalabilité, on peut se reporter au dernier test de performance réalisé.
      - Attention aux métriques : elles peuvent pousser à des comportements non souhaités pour satisfaire la métrique.
    - Pour ce qui est des métriques qualitatives, il s’agit de vérifier si l’équipe est contente ou pas, s’ils sont débordés etc.
  - Il faut organiser des **checkpoints réguliers** pour voir où on en est.
    - On vérifie que les raisons pour lesquelles on a commencé la transition sont toujours là.
    - On jette un œil aux métriques quantitatives pour voir l’avancée.
    - On demande du feedback qualitatif.
    - On décide d’éventuelles actions.

## 3 - Splitting the Monolith

- Ce chapitre décrit des patterns pour migrer le code dans des micros de manière incrémentale.
- Un des critères à prendre en compte pour le choix des patterns c’est le fait qu’on ait ou non **la possibilité de changer le code du monolithe**.
  - On peut avoir de nombreuses raisons pour ne pas le pouvoir :
    - Si on n’a plus le code source du monolithe.
    - Si le monolithe est écrit dans une technologie pour laquelle on n’a pas les compétences.
    - Si on a peur de trop impacter les autres développeurs du monolithe.
  - Dans le cas où on peut modifier le code du monolithe, si le code est en trop mauvais état, ça peut aussi parfois être plus rapide de le réécrire dans le microservice plutôt que de l’extraire.
- Une des grandes difficultés c’est d’**isoler le code qu’on veut extraire dans notre microservice**, c'est-à-dire modulariser le monolithe.
  - En général le code dans les monolithes est organisé autour de considérations techniques et pas de domaines métier, c’est pourtant ça qu’on veut extraire.
  - Pour aider à faire ça, l’auteur recommande le concept de _seam_, qu’on trouve dans **_Working Effectively with Legacy Code_** de Michael Feathers.
    - Un _seam_ est une délimitation autour d’une zone qu’on veut changer. On travaille ensuite à une nouvelle implémentation de la fonctionnalité, et à la fin on remplace l’ancienne par la nouvelle.
    - Ça peut être plus ou moins grand, ici ce qui nous intéresse c’est un bounded context.
  - Réorganiser le code pour obtenir un **modular monolith** peut être suffisant pour ce qu’on recherche, en fonction de nos objectifs (cf. chapitre précédent).
    - Et ça peut aussi être une première étape pour aller vers l’extraction d’éventuels microservices ensuite. C’est en tout cas le conseil de l’auteur.
    - Pour autant, de nombreuses équipes préfèrent identifier une fonctionnalité, et la recoder dans un microservice sans refactorer le monolithe.
    - Dans tous les cas, l'auteur recommande une **approche incrémentale** : si la réécriture du service se compte en jours ou semaines ça peut être OK, si ça se compte en mois, il vaut mieux adopter une approche plus incrémentale.
- Dans la suite du chapitre, on voit des patterns de migration, qui permettent d’extraire du code sous forme d’un microservice cohabitant avec le monolithe.
  - Chaque pattern a des avantages et des inconvénients, il faut les comprendre pour pouvoir prendre à chaque fois le plus adapté.
  - **On extrait toujours les microservices un par un**, en apprenant des erreurs pour le prochain.

### Pattern: Strangler Fig Application

- C’est un des patterns les plus utilisés, et ça se base sur l’image d’un figuier qui s’implante sur un arbre existant, plante ses racines, et petit à petit “étrangle” l’arbre qui finira par mourir sans ressources, laissant le figuier à sa place.
- Cette technique permet d’avoir la nouvelle version en parallèle de l’ancienne. On fait grossir petit à petit les fonctionnalités de la nouvelle, puis on fait le switch quand le microservice est prêt à remplacer la fonctionnalité dans le monolithe.
  - Il faut faire la différence entre **deployment** et **release** : on intègre et déploie régulièrement ce qu’on fait en production, pour éviter les problèmes de merge et dérisquer le plus possible de choses en production, mais on n’active la fonctionnalité que quand elle est prête.
  - Concrètement, vu qu’on est en train de sortir un microservice qui va tourner sur un processus à part, le switch se passe **au niveau réseau** : tant que le microservice n’est pas prêt, les requêtes concernant sa fonctionnalité vont vers le monolithe, et quand on veut le release, on les redirige vers lui.
  - Si attendre que le microservice soit fini n’est pas assez incrémental pour nous, on peut aussi commencer à rediriger une partie des requêtes du monolithe vers le microservice, en fonction de ce qui a déjà été implémenté.
    - Ça va par contre nous obliger à partager temporairement la même DB entre la fonctionnalité dans le monolithe, et celle dans le microservice.
- Cette technique a l’avantage de **ne pas avoir à toucher au monolithe** dans le cas où la portion de fonctionnalité qu’on sort est **autonome**.
  - Pour ça il faut qu'elle n'ait pas besoin de faire d’appel vers le monolithe, et que le monolithe n’ait pas besoin de faire d’appel vers elle non plus.
  - Dans le cas où la fonctionnalité doit faire des appels vers le monolithe, il faudra que le monolithe expose des endpoints, et donc on devra le modifier.
  - Si c’est le monolithe qui doit faire des appels vers le microservice, alors on ne peut pas vraiment utiliser cette technique : on ne pourra pas faire le switch de la fonctionnalité au niveau réseau.
    - On pourra à la place utiliser le pattern _Branch by Abstraction_ par exemple.
- **Exemple : HTTP Reverse Proxy** : HTTP permet très facilement de faire de la redirection.
  - Si notre monolithe reçoit des requêtes HTTP, on va pouvoir mettre en place un proxy pour router les requêtes entre le monolithe et le microservice.
    - Étape 1 : On met en place le proxy, et on le configure pour laisser passer les requêtes comme avant vers le monolithe.
      - Ça nous permet de nous assurer que la latence additionnelle d’une étape réseau de plus ne pose pas problème.
      - On peut aussi dès cette étape tester le mécanisme de redirection pour vérifier qu’il n’y aura pas de problème à le faire.
    - Étape 2 : on implémente progressivement la fonctionnalité dans le microservice, vers lequel il n’y a aucun trafic.
    - Étape 3 : Quand le microservice est prêt, on redirige le trafic vers lui.
      - On peut remettre le trafic vers le monolithe s' il y a un problème.
      - Pour plus de facilité, la redirection peut être activée avec un feature toggle.
  - Pour ce qui est du proxy lui-même, ça va dépendre du protocole. Si on a du HTTP, on peut partir sur un serveur connu comme NGINX.
    - Ca peut être par exemple sur le path : rediriger `/invoice/` vers le monolithe, et `/payroll/` vers le microservice.
    - Si on route sur un contenu se trouvant dans le body d’une requête POST (NDLR : comme GraphQL), ça risque d’être un peu plus compliqué.
    - En tout cas, l'auteur **déconseille de coder soi-même son proxy** si on a besoin de quelque chose de custom.
      - Les quelques fois où il a essayé, il a obtenu de très mauvaises performances.
      - Il conseille de plutôt partir d’un proxy existant comme NGINX, et de le personnaliser avec du code (du lua pour NGINX).
- Dans le cas où on voudrait que notre microservice supporte un autre protocole que celui du monolithe (par exemple gRPC au lieu de SOAP), on pourrait envisager faire la traduction dans le proxy.
  - Pour l’auteur c’est une mauvaise idée : si on le fait pour plusieurs microservices, on va finir par complexifier ce proxy partagé, alors qu’on voulait que les microservices soient indépendants.
  - L’auteur conseille plutôt de faire ce mapping de protocole dans chacun des microservices qui en ont besoin, et éventuellement de faire en sorte qu’ils supportent les deux protocoles.
  - On peut aussi aller vers le **service mesh** où chaque microservice a son proxy local, qui peut faire les redirections et mapping qu’il veut.
    - Les outils les plus connus pour ça sont Linkerd et Istio.
    - Square a mis en place le service mesh et en a fait [un article](https://squ.re/2nts1Gc).
- **Exemple : FTP**.
  - L’entreprise suisse Homegate a utilisé le strangler fig pattern pour extraire des microservices, et en profiter pour changer le protocole utilisé pour uploader des fichiers : de FTP vers HTTP.
  - Mais ils voulaient qu’il n’y ait pas de changement pour les utilisateurs.
  - Donc ils ont mis en place une interception des appels FTP, et le remapping vers du HTTP pour taper dans le microservice responsable de ça.
- **Exemple : Message Interception** : dans le cas de messages **asynchrones** à router vers le nouveau microservice.
  - Une première possibilité est le **content-based routing**, où un router va consommer tous les messages du message broker, et les queuer sur deux autres queues : une pour le monolithe, et une pour le microservice extrait.
    - Ce pattern vient d’**_Enterprise Integration Patterns_**. Et de manière générale l’auteur recommande ce livre pour des patterns de communication asynchrone.
    - L’avantage c’est qu’on n’a pas à toucher au monolithe.
    - L’inconvénient c’est qu’on complexifie là encore le système de communication plutôt que les programmes. Donc l’auteur est plutôt réticent.
  - L’autre possibilité c’est la **selective consumption**, où le monolithe et le microservice consomment sur la même queue, mais sélectionnent les messages qui leur sont destinés.
    - L’avantage c’est qu’il n’y a pas de complexité dans le mécanisme de communication.
    - Parmi les désavantages :
      - Le message broker pourrait ne pas supporter la consommation sélective.
      - Il faut déployer les changements dans le monolithe et dans le microservice en même temps pour que la consommation se passe bien.
- Dedans le cas où on veut **ajouter des fonctionnalités** ou fixer des bugs en même temps qu’on implémente le microservice, il faut bien garder en tête que **le rollback sera alors plus difficile**.
  - Il n’y a pas de solution facile : soit on accepte que le rollback sera plus compliqué à faire, soit on freeze les features sur la partie extraite en microservice tant que l’extraction est en cours.

### Pattern: UI Composition

- L’interface utilisateur doit aussi être découpée par considérations business, pour obtenir des slices verticaux avec les microservices.
- **Exemple : Page Composition**.
  - L’auteur a travaillé chez The Guardian, où la migration a été réalisée à plusieurs reprises page par page.
    - La 2ème fois en utilisant un CDN pour le routing redirigé progressivement vers les nouvelles pages.
  - REA Group, une entreprise immobilière australienne, avait plusieurs équipes responsables de parties différentes du site, et donc la séparation par pages avait dans ce cas encore plus de sens.
- **Exemple : Widget Composition.**
  - De nombreuses entreprises utilisent la séparation en widgets pour suivre les microservices.
  - C’est le cas par exemple d’Orbits qui avait une UI décomposée en widgets majeurs sous la responsabilité d’équipes différentes.
    - Quand ils ont voulu migrer vers des microservices, ils ont pu le faire incrémentalement, en suivant le découpage des widgets côté front.
  - Un des avantages de cette séparation c’est que même quand un des widgets ne fonctionne pas, le reste peut être affiché.
- Côté **applications mobiles** (Android / iOS), on est face à des monolithes de fait, puisqu’il faut tout redéployer et faire retélécharger à l’utilisateur à chaque changement.
  - De nombreuses entreprises (comme Spotify cf. [video](https://www.youtube.com/watch?v=vuCfKjOwZdU)) utilisent des composants affichés qui viennent du backend, pour ne pas avoir à redéployer l’app mobile quand ils y font un changement.
- **Exemple : Micro Frontends**.
  - Il s’agit de faire des composants indépendants dans un frontend de type SPA, avec des bouts de React, Vue, etc. cohabitant et partageant de l’information, mais sans se gêner.

### Pattern: Branch by Abstraction

- Dans le cas où le Strangler fig pattern n’est pas possible parce que le composant qu’on veut extraire est profondément ancré dans le monolithe (il reçoit des appels des autres composants du monolithe par exemple), on peut utiliser cette technique.
- On va travailler sur une version alternative du composant **à l’intérieur même du monolithe**, et de l’activer à la fin.
- Il s’agit du même principe qu’une branche du gestionnaire de versions, à la différence que là on travaille en intégration continue, et déploiement continu (bien qu’on ne _release_ qu’au moment où le microservice est prêt).
  - L’auteur n’insiste pas trop sur les nombreux problèmes d’une branche de gestionnaire de version qui dure longtemps, mais nous conseille de jeter un œil au _State of DevOps Report_ pour nous en convaincre.
- Concrètement :
  - 1 - On crée une abstraction devant la fonctionnalité qu’on va remplacer.
    - Cette étape peut être plus ou moins complexe, en fonction de la taille de l’API qu’on expose aux autres modules.
    - Il peut être nécessaire de définir un _seam_ à extraire.
  - 2 - On fait en sorte que les clients de notre fonctionnalité utilisent cette abstraction pour y accéder.
    - La migration doit être incrémentale.
  - 3 - On crée une nouvelle implémentation de la fonctionnalité.
    - La nouvelle implémentation dans le monolithe va juste faire des appels vers le microservice qu’on développe à l’extérieur du monolithe.
    - On migre les fonctionnalités de manière incrémentale.
  - 4 - On pointe l’abstraction sur la nouvelle fonctionnalité développée.
    - Comme avec le strangler fig pattern, on aimerait bien avoir un feature toggle pour pouvoir activer et désactiver la nouvelle fonctionnalité sans changer le code.
  - 5 - On enlève l’abstraction et l’ancienne implémentation.
    - Il se peut que l’abstraction ait un intérêt en elle-même, dans cas on peut éventuellement la laisser.
    - Il faut bien penser à enlever les éventuels feature toggles.
- Il existe une variante qui s’appelle **Verify branch by abstraction** : on appelle la nouvelle implémentation d’abord, et si elle échoue, on fallback sur l’ancienne.
- Quand l’utiliser :
  - Cette technique est à utiliser **à chaque fois qu’un changement va prendre du temps**, et qu’on veut ne pas empêcher les autres d’avancer sur ce qu’ils font, tout en restant sur de l’intégration continue.
  - Pour les microservices, l’auteur conseille d’utiliser en priorité le strangler fig pattern, parce qu’il est plus simple.
  - Si on ne peut pas toucher au code du monolithe, alors il faut choisir une autre technique que celle-là.

### Pattern: Parallel Run

- Quand on a besoin d’un **grand degré de fiabilité**, on peut jouer les deux implémentations en parallèle, pour vérifier que le résultat est bien le même.
  - Il n’y a qu’une des implémentations qui sera la source de vérité : en général l’ancienne jusqu’à ce qu’on décide que la nouvelle a fait ses preuves et qu’on n’a plus besoin de l’ancienne.
  - On peut **vérifier le résultat, mais aussi des éléments non-fonctionnels** comme le temps de réponse et le nombre de timeouts.
- **Exemple : calcul de produits financiers dérivés**.
  - L’auteur a travaillé sur le système d’une banque, où il s’agissait de refaire le calcul de produits dérivés.
  - L’enjeu financier étant important, ils ont décidé de jouer les deux systèmes en parallèle, et de recueillir la différence entre les deux par des batchs journaliers.
  - Ils ont fini par changer la source de vérité vers le nouveau système après un mois, et ont enlevé l’ancien après quelques mois de plus.
- Pour vérifier des side-effects qu’on n’a envie de faire qu’une fois (comme le fait d’envoyer un email), on peut utiliser des **spies**, comme dans les unit tests mais en production.
  - Il vaut mieux faire les vérifications à partir du microservice plutôt qu’à partir de la partie de la nouvelle fonctionnalité qui est dans le monolithe, pour tester le plus possible de choses.
  - Les vérifications peuvent être faites en asynchrone, en enregistrant les appels quelque part, et en vérifiant plus tard qu’on a bien eu la même chose que pour l’autre implémentation.
- L’auteur conseille [Github Scientist](https://github.com/github/scientist) (existant en plusieurs langages) pour aider à implémenter ce pattern.
- Le **canary release** consiste à releaser d’abord auprès d’un nombre réduit de clients.
  - Le **dark launching** consiste à déployer pour tester, mais à ne pas releaser auprès des clients.
  - Le parallel run est une forme de dark launching.
  - L’ensemble de ces techniques font partie de la **progressive delivery**.
- Ce pattern est très utile dans certains cas, mais a un coût de mise en place.
  - L’auteur ne l’a utilisé qu’une ou deux fois dans sa carrière.

### Pattern: Decorating Collaborator

- Cette technique permet de **ne pas avoir à modifier le monolithe**, tout en permettant de **déclencher quelque chose à partir de ce que fait le monolithe**.
- On laisse l’appel aller dans le monolithe et en sortir, et on l’intercepte à la sortie, pour éventuellement faire un appel vers notre microservice.
  - De la logique va donc se retrouver dans le proxy qui décide de faire l’appel au microservice. Attention à ce que cette logique ne devienne pas trop complexe.
- **Exemple : Loyalty Program**.
  - On a un monolithe qui traite un ordre d’achat. On veut y ajouter une fonctionnalité de points de fidélité, mais le monolithe est compliqué et on ne veut pas le modifier maintenant.
  - Le proxy va récupérer la réponse du monolithe avant qu’elle n’aille au client, et faire un appel au microservice qui s’occupe d’allouer les points de fidélité.
- Si on n’a pas suffisamment d’infos suite à l’appel intercepté, on **risque d’avoir besoin de refaire un appel au monolithe**.
  - L’auteur conseille d’y réfléchir à deux fois avant d’utiliser ce pattern dans le cas où l’information ne se trouve pas dans l’appel intercepté.
- Une alternative à ce pattern peut être le pattern **change data capture**.

### Pattern: Change Data Capture

- Cette technique est plus invasive que decorating collaborator : on va **écouter les changements issus de la DB**, et y faire réagir notre microservice.
- **Exemple : Issuing Loyalty Cards**.
  - On a un monolithe qui permet de créer des comptes de fidélité, et renvoie simplement que la création a fonctionné. Et on aimerait imprimer des cartes de fidélité à chaque fois.
  - Si on voulait utiliser le decorating collaborator pattern, il faudrait faire un appel supplémentaire au monolithe pour obtenir les informations manquantes, et que le monolithe expose une API pour ça.
  - On va donc plutôt écouter ce que dit la DB quand le monolithe insert le compte de fidélité, et alimenter notre microservice d’impression avec ça.
- Pour ce qui est de la **manière de l’implémenter** :
  - **Database triggers **: c’est un mécanisme de stored procedures, fournis par la plupart des bases de données.
    - Attention à ne pas trop en utiliser, leur maintenabilité est difficile.
  - **Transaction log pollers** : la plupart des DB écrivent leurs données dans un fichier de log qui précède l’écriture dans la base. On peut simplement lire ce fichier.
    - C’est une des solutions les plus intéressantes selon l’auteur, avec la contrainte qu’on a besoin de s’adapter à la structure spécifique du log de cette DB.
    - On a de nombreux outils qui lisent les logs, y compris certains qui les mettent dans un message broker.
  - **Batch delta copier** : il s’agirait d’écrire un programme qui compare régulièrement le contenu de la DB, et qui réagit s’il y a un changement.
    - Le problème c’est de réussir à savoir s’il y a un changement. Certaines DB le permettent, mais pas forcément au niveau du row, auquel cas il faudrait ajouter nous-mêmes des timestamps pour savoir qu’est-ce qui a changé quand.
- Ce pattern est utile quand on a besoin de réagir au monolithe, mais quand on ne peut pas vraiment mettre en place le strangler fig ou le decorating collaborator, et qu’on ne peut pas non plus changer le monolithe.

## 4 - Decomposing the Database

#### Pattern: The Shared Database

- Partager la DB veut dire ne pas avoir la possibilité de **choisir ce qu’on cache**, et même ne pas savoir ce qui est utilisé par d’autres.
- Dans le cas où plusieurs services peuvent modifier la DB partagée, on ne sait plus qui la contrôle. Et la logique de modification est dupliquée et peut diverger.
- La DB doit être privée à chaque microservice. Le partage publique d’une DB n’est approprié que dans deux cas :
  - 1 - Une DB avec des **données de référence** read-only très stables (par exemple la liste des pays existants ou des codes postaux).
  - 2 - Dans le cas du pattern **Database-as-a-Service Interface**, où on partage une DB read-only, distincte de notre DB interne.
- Même si la bonne solution dans la plupart des cas c’est de splitter la DB du monolithe dans les nouveaux microservices, on a des techniques qui permettent d’aller dans la bonne direction à peu de frais et d’arrêter l’hémorragie, en ajoutant des abstractions par dessus la DB du monolithe.

#### Pattern: Database View

- On crée une view par dessus la DB, et on demande aux clients d’utiliser la view. De cette manière on peut modifier la DB source comme si elle était privée, en adaptant la view pour qu’elle soit stable pour les clients.
- **Exemple : Database as a public contract**.
  - L’auteur travaillait dans une banque, et ils ont remarqué qu’un problème de performance majeur pouvait être corrigé en restructurant le schéma de leur DB.
  - Malheureusement la DB était utilisée par plus de 20 applications (sans même savoir lesquelles) partageant les mêmes credentials.
    - Pour la question des credentials, l’auteur conseille _HashiCorp Vault_ qui permet de gérer un grand nombre de credentials facilement.
  - Ils ont mis en place des views comme solution temporaire pour pouvoir restructurer la DB sans impacter les clients.
- Une view peut aussi simplement cacher des champs ou des tables, et permettre de décider ce qu’on veut montrer ou non publiquement.
- Les views ont quelques limitations :
  - Elles peuvent poser des problèmes de performance, et la version materialized de la view est plus efficace, mais contiendra des données anciennes, datant de la dernière fois qu’on a fait un update.
  - Elles sont **read-only**.
  - Toutes les DB n’ont pas la fonctionnalité. Les DB relationnelles l’ont, et certaines DB NoSQL aussi (c’est le cas de _Cassandra_ et _Mongo_ par exemple).
  - Il est probable que le schéma de la view doive se trouver sur la même database engine que le schéma initial.
- En termes d’ownership, l’auteur conseille de le donner à l'équipe qui a la charge de la DB source.
- Cette étape va dans la bonne direction, mais l’auteur déconseille de faire ça à la place d’une décomposition de la DB sans avoir de bonnes raisons.

#### Pattern: Database Wrapping Service

- Une autre manière de cacher la DB pour arrêter l’hémorragie c’est de la mettre derrière un service, et demander aux clients d’y accéder via ce service.
- Exemple : banque australienne.
  - L’auteur a travaillé pour une banque qui avait un problème de scalabilité de sa DB.
  - Malheureusement les autorisations étaient implémentées sous forme de stored procedures, et les toucher était trop dangereux.
  - Alors ils ont décidé de créer un service pour cacher la DB, et faire en sorte que la nouvelle logique autour des d’autorisations ne soit plus dans la DB elle-même, mais implémentée chez les clients.
- L’avantage de ce pattern par rapport à la database view c’est qu’on peut mettre de la **logique dans le service**, et qu’on peut aussi proposer à nos clients d’**écrire**.
  - Par contre, il faudra que nos clients **utilisent l’API** pour y accéder, et pas du SQL.
- Comme avec la database view, il s’agit plutôt d’une solution temporaire avant de faire des changements plus profonds pour séparer la DB dans les bons services.

#### Pattern: Database-as-a-Service Interface

- Un des cas où on peut exposer une DB de manière publique c’est si les clients ont besoin de jouer des requêtes SQL directement sur les données qu’on propose.
  - Par exemple pour obtenir des insights business avec des outils comme Tableau. Martin Fowler parle du [reporting database pattern](https://martinfowler.com/bliki/ReportingDatabase.html), mais l’auteur préfère généraliser le nom du pattern.
  - Par contre, il faut bien qu’on **sépare cette DB publique de notre DB privée**.
  - La DB exposée ne peut être que **read-only**.
- Pour implémenter, il propose que la DB publique soit synchronisée avec la DB privée au travers d’un **mapping engine**.
  - Le mapping engine permet de garantir que les deux DB publique et privée peuvent diverger et fonctionner ensemble quand même.
  - Les écritures doivent se faire via API.
  - Il y aura donc une latence entre ce qu’on écrit, et ce qu’on lit de la DB publique qui pourrait être en retard dans la synchronisation.
- Pour ce qui est de la manière d’implémenter le mapping engine :
  - Une première solution robuste peut être d’utiliser le **change data capture** de la DB. Pour l’exploiter, il y a des outils comme **_Debezium_**.
  - Une autre solution serait d’avoir un batch process qui met à jour régulièrement la DB publique.
  - Et une 3ème option peut être d’émettre des **events**, et de reconstruire la DB à l’extérieur à partir de ceux-ci.
- Cette solution est plus avancée que le database view pattern, et aussi plus difficile à mettre en place d’un point de vue technique.

### Transferring Ownership

- Les précédents patterns permettaient juste de mettre en pansement sur une grosse DB, mais il faut que les bonnes données aillent au bon endroit.

#### Pattern: Aggregate Exposing Monolith

- Quand on extrait un microservice, il a parfois besoin d’accéder aux données qui sont encore dans le monolithe, ou de les modifier.
  - S’il est légitime d’un point de vue domaine que ces données soient possédées par le monolithe, alors il peut **exposer des endpoints**.
  - Les données sont regroupées en aggregates, et sont associées à des machines à état sous forme de code. Quand le monolithe ou un microservice fournit des endpoints, il donne en fait la possibilité d’accéder à la machine à état pour savoir ce qu’on va pouvoir ou non faire avec les données.
- Le fait pour le monolithe de fournir des endpoints pour travailler avec certaines données, peut être une étape vers l’extraction d’un microservice organisé autour de ces données.
- **Faire des appels représente plus de travail** que de faire des queries directement en DB, **mais c’est bien mieux sur le long terme**. Il ne faut recourir aux autres techniques (database view pattern etc.) que si on ne peut pas changer le monolithe.

#### Pattern: Change Data Ownership

- Dans le cas où la donnée dont le microservice a besoin se trouve encore dans la DB du monolithe, mais que c’est le microservice qui devrait la posséder, il faut la **déplacer dans le monolithe**.
  - Le monolithe devra alors appeler le microservice pour obtenir la donnée, ou demander des changements.
  - La question de savoir si les données doivent appartenir au micorservice se résout en se demandant si la logique qui contrôle la donnée (automate à état de l’aggragate, contrôle des règles de consistance etc. se trouvent dans le microservice.
- **Déplacer de la donnée est difficile**. Ça peut impliquer de devoir casser des foreign keys, des transactions etc. ce sujet est traité plus tard dans le chapitre.
