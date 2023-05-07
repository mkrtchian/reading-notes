# Effective Kafka

## 1 - Event Streaming Fundamentals

- Les **systèmes distribués** sont plus complexes que les systèmes non distribués, ils déplacent une partie de la **complexité du local vers le global**.
  - La raison pour laquelle on les utilise c’est qu’ils permettent de décomposer le système en plus petits problèmes qu’on va pouvoir diviser entre plusieurs équipes.
  - La complexité globale peut être réduite par certaines techniques, par exemple les messages asynchrones.
  - On y trouve des échecs partiels, intermittents, ou même byzantins (les nœuds envoient des informations fausses).
  - Le problème le plus important est sans doute celui de la consistance.
- L’**event-driven architecture** (EDA) consiste à avoir des _emitters_ envoyant des notifications d’event à des _consumers_.
  - Les emitters n’ont aucune connaissance des consumers. Et de même les consumers n’ont pas connaissance des emitters.
  - Les notifications d’event sont immutables, que ce soit côté emitter ou consumer.
  - L’EDA est la manière **la plus découplée** de faire communiquer des composants entre eux.
    - Le seul couplage sera dans le contenu des messages qui transitent.
    - Imaginons un système d’e-commerce, avec une plateforme BI et un CRM. Il leur suffira de consommer les events d’achat et d’y réagir en toute indépendance.
      - Parmi les autres possibilités qu’on aurait pour l’exemple e-commerce :
        - On peut les mettre dans un monolith (non-modulaire), mais la complexité risque d’augmenter à mesure que le modèle global est enrichi.
        - On peut utiliser des patterns d’intégration : des messages synchrones envoyés par le composant e-commerce ou par les deux autres. Dans ce cas on se rapproche du distributed monolith parce que les composants ne seront pas indépendants.
          - NDLR : toute communication synchrone relèverait du distributed monolith, un peu violent…
        - On peut utiliser la _data decapsulation_, où les composants BI et CRM viennent lire la DB du composant e-commerce. Dans ce cas on se retrouve dans un mode “get rich quick scheme” qui mène toujours à des pleurs. Le couplage est maximal.
      - Cet exemple montre que **l’EDA scale de manière linéaire**, alors qu’avec les approches plus couplées, la complexité explose quand on scale le nombre de composants.
  - L’EDA est beaucoup **plus résilient** que les approches couplées : si un composant est en situation d’échec, il a peu de chances d’impacter d’autres composants.
    - Si on reprend l’exemple d’e-commerce :
      - Dans le cas où le composant d’e-commerce est en situation d’échec, les autres composants vont continuer à pouvoir fonctionner, mais simplement ils ne recevront plus de nouveaux events.
      - Dans le cas où par exemple le CRM est en situation d’échec, les events continueront d’arriver, et il pourra toujours rattraper son retard dès qu’il est rétabli.
      - On peut aussi prévoir une mesure pour que si le message broker est en situation d’échec, l’émetteur puisse publier les events localement, pour les mettre dans le message broker plus tard.
    - Dans un système couplé, un composant qui est en échec peut entraîner des _correlated failures_ chez les autres qui en dépendent.
      - On peut aussi avoir des _congestive collapses_ dans le cas où certains composants sont temporairement surchargés, et que les requêtes synchrones mènent à avoir des timeouts, puis à envoyer plus de requêtes.
  - L’EDA a aussi des avantages en termes de **consistance**.
    - Il favorise l’ownership d’un élément stateful par un composant unique, les autres composants recevant les notifications d’event ne pouvant pas modifier cet état.
    - En dehors du composant owner, les events sont rejouables **dans le bon ordre**, garantissant une _sequential consistency_.
  - L’EDA n’est cependant pas adaptée dans certains cas.
    - Elle n’est **pas adaptée aux interactions synchrones**.
    - Par contre, dans les cas où on peut l’utiliser, elle permet des améliorations significatives des aspects non fonctionnels.
- L’**event streaming** est un moyen d’obtenir un stream **durable** et **ordonné**, d’events **immutables**, délivrés aux consumers qui ont souscrit.
  - L’event streaming n’est pas nécessaire pour implémenter l’EDA, qui peut d’ailleurs être implémenté dans un monolith (cf. outils comme React qui sont basés sur des events).
  - En revanche l’**event streaming est pertinent** comme choix face aux solutions concurrentes (comme les message queues) **dans le cadre d’EDA distribuées**, parce qu’il a été conçu pour ça.
    - L’event streaming supporte nativement l’immutabilité des events.
    - Il supporte la garantie d’ordre des events.
    - Il supporte le fait d’avoir de multiples consumers.

## 2 - Introducing Apache Kafka

- Kafka est une plateforme d’event streaming, mais elle comprend aussi un écosystème entier qui permet l’implémentation d’EDAs.
- L’event streaming est récent comparé aux formes traditionnelles de messaging (MQ-style).
  - Il n’y a pas de standard, mais Kafka est le leader du domaine, et son fonctionnement sert de modèle pour les solutions concurrentes comme **Azure Event Hubs** et **Apache Pulsar**.
- Historiquement, Kafka a été open-sourcé en 2011 par LinkedIn, et confié à la fondation Apache.
  - Il avait été conçu notamment pour gérer les events d’activité des utilisateurs.
  - En 2019, LinkedIn opérait 100 clusters Kafka, pour un total de 100 000 topics et 7 millions de partitions.
  - Aujourd’hui Kafka est utilisé par des géants de la tech, pour des usages comme le real-time analytics, la data ingestion, le log aggregation et le messaging pour l’EDA.
    - Uber par exemple l’utilise pour gérer au total plus de 1000 milliards d’events par jour.
- Parmi les usages qui permettent l’EDA, Kafka supporte :
  - **Publish-subscribe** : un emitter publie des events, et plusieurs consumers les consomment sans que ces noeuds se connaissent.
    - C’est notamment utilisé pour des microservices avec un faible couplage.
  - **Log aggregation** : un ensemble de sources publient des events sous forme de log (soit applicatifs, soit d’infrastructure), qu’on va ensuite agréger au sein du même topic, pour le consommer dans une DB optimisée pour la lecture, comme **Elasticsearch** ou **HBase**.
  - **Log shipping** : il s’agit de streamer des logs depuis une DB master vers un topic où plusieurs DB followers vont consommer et se mettre à jour.
    - Ce pattern permet notamment d’implémenter l’event sourcing.
  - **SEDA pipelines** : le Stage Event-Driven Architecture est l’implémentation d’une pipeline d’events, où on fait une opération à chaque étape, avant d'émettre un event modifié pour l’étape suivante.
    - C’est typiquement utilisé avec les data warehouses, data lakes, le reporting et autres outils de BI.
    - On peut voir le log aggregation comme une forme de SEDA.
  - **CEP** : le Complex Event Processing consiste à un composant qui consomme des events de multiples sources, et en extrait l’information pertinente.
    - Il a souvent besoin d’un stockage pour se rappeler les patterns déjà vus et y réagir.
    - Ça peut être par exemple pour le trading algorithmique, l’analyse des menaces de sécurité, l’analyse de fraude en temps réel etc.
  - **Event-sourced CQRS** : Kafka se place entre la DB master et les DBs de projection, en permettant de les alimenter chacune au travers du concept de _consumer groups_.
    - La différence avec le log shipping c’est que le log shipping opère plutôt à l’intérieur d’un subdomain, alors que le CQRS peut aussi opérer à travers les subdomains.

## 3 - Architecture and Core Concepts

- Kafka est composé de plusieurs types de noeuds :
  - **Broker nodes** : ce sont les composants principaux de Kafka, ils s’occupent des opérations I/O et de la persistance.
    - Ces nœuds sont des processus Java.
    - Chaque partition est sous la responsabilité d’un nœud master qui peut écrire dedans, les followers en ont une copie et peuvent être lus.
      - Un même nœud peut être master pour certaines partitions, et follower pour d’autres.
      - L’ownership peut passer à un autre nœud en cas de besoin (opération spéciale qui le nécessite ou échec du nœud qui était master de la partition).
      - Concernant l’attribution de l’ownership, ça se fait d’abord en élisant un des nœuds comme _cluster controller_, puis celui-ci assigne l’ownership des partitions au gré des besoins.
    - Augmenter le nombre de nœuds constitue un moyen de scaler Kafka.
      - On peut améliorer la durability en ayant plusieurs copies de chaque partition (autant que le nombre de nœuds).
      - On peut améliorer l’availability pour les données en lecture.
  - **Zookeeper nodes** : Zookeeper est un projet open source distinct de Kafka.
    - Ses nœuds sont chargés d’élire le broker qui sera le _cluster controller_, de garantir qu’il n’y en ait qu’un, et d’en réélire un s’il n’est plus opérationnel.
    - Ils fournissent aussi diverses métadonnées à propos du cluster, par exemple l’état des différents nœuds, des informations de quotas, les access control list etc.
  - **Producers** : les applications clientes qui écrivent dans les topics.
    - Un producer communique avec Kafka via TCP, avec une connexion par broker node.
  - **Consumers** : les applications clientes qui lisent des topics.
- Le fonctionnement de Kafka se base sur des notions d’ordering venant de la théorie des ensembles (set theory).
  - Le **total ordering** consiste à avoir un ensemble d’éléments dont une **seule configuration est possible**.
    - On peut l’illustrer avec un set de nombres entiers `{ 2, 4, 6 }`. Si on enlève l’élément 4, puis qu’on le remet, il ne pourra qu’être à la 2ème place, avant le 6 et après le 2.
  - Le **partial ordering** consiste à avoir un ensemble d’éléments ordonnés selon un critère spécifique, mais dont **plusieurs configurations sont possibles** pour satisfaire le critère.
    - Par exemple, si on a des entiers qu’on veut ordonner de manière à ce que le diviseur d’un nombre soit toujours après ce nombre, et qu’on a `[ 2, 3, 4, 6, 9, 8 ]`, on peut tout autant les organiser en `[ 3, 2, 6, 9, 4, 8 ]`.
  - La notion de **causal order** indique qu’on respecte le fait que certains éléments ont une relation _happened-before_ entre eux qui est respectée, quel que soit leur ordre d’arrivée à destination.
    - Cette notion vient de l’étude des systèmes distribués (et non de la théorie des ensembles).
    - Elle est une forme de partial ordering.
    - Elle est la conséquence du fait qu’il n’y ait pas d’horloge commune à l’ensemble des nœuds d’un système distribué, et que les events peuvent arriver dans le mauvais ordre.
- Les **records** sont l’unité principale de Kafka. Ils correspondent aux events.
  - Ils sont composés :
    - D’attributs assez classiques : la _value_ qui peut être sous forme binaire, des _headers_ pour donner des métadonnées, la _partition_ associée au record, l’_offset_ par rapport aux autres records de la partition, un _timestamp_.
      - La combinaison _partition_ + _offset_ permet d’identifier un record de manière unique.
      - L’_offset_ est une valeur entière qui ne peut qu’augmenter, même s'il peut y avoir des gaps entre deux offsets qui se suivent.
    - D’un champ binaire un peu plus inhabituel qui est la _key_, et qui est utilisée par Kafka pour associer les records avec une même partition.
  - Kafka est largement utilisé pour traiter des events à l’intérieur d’un bounded context, tout comme les events entre bounded contexts.
  - Il est aussi de plus en plus utilisé en remplacement des brokers traditionnels (**RabbitMQ**, **ActiveMQ**, **AWS SQS/SNS**, **Google Cloud Pub/Sub** etc.). Dans ce cas, les records ne correspondent pas forcément à des events, et on n’est pas forcément dans de l’EDA.
- Les **partitions** sont l’unité de stream principale qui contiennent les records.
  - Les records d’une même partition sont _totally ordered_.
  - Les records publiés dans une partition par un même producer seront donc aussi _causally ordered_ (la précédence respectée).
    - En revanche, si plusieurs producers publient dans la même partition sans eux-mêmes se synchroniser entre eux, les records de chaque producer seront causally ordered pour un même producer, mais ne le seront pas entre les producers (ça dépendra de qui l’a emporté pour publier plus vite).
    - Publier dans plusieurs partitions ne règle pas ce problème : les records de chaque producer ne seront pas causally ordered. Si on veut un tel ordre, il faut un seul producer.
- Les **topics** sont des unités logiques qui regroupent des partitions.
  - Vu qu’il s’agit d’une union de partitions qui sont chacune _totally ordered_, les topics peuvent être considérés comme _partially ordered_.
    - On peut donc écrire dans les records de plusieurs partitions en parallèle, et n’assurer que l’ordre des records dans chaque partition.
  - On peut indiquer à la main la partition vers laquelle on veut publier un record, mais généralement on indique la key, qui sera hashée pour correspondre avec une partition donnée.
    - Dans le cas où on **réduit le nombre de partitions**, les messages peuvent être **détruits**.
    - Dans le cas où on **augmente le nombre de partitions**, on peut **perdre l’ordre** qu’on voulait conserver avec nos keys, puisque la fonction de hash redirigera vers une autre partition.
    - Même si on a un nombre de partitions supérieur au nombre de keys, il est possible que deux keys mènent vers la même partition.
      - La seule chose qui est garantie, c’est qu’avec la même key, et si le nombre de partitions ne change pas, l’ordre sera respecté.
- Un consumer peut souscrire à un topic en tant que membre d’un **consumer group**, et bénéficier d’un mécanisme de **load balancing** avec d’autres consumers.
  - Le 1er consumer qui souscrit se voit assigner toutes les partitions. Quand un 2ème consumer souscrit au topic, il se voit assigner environ la moitié des partitions qui étaient assignées au 1er. et ainsi de suite.
  - Les consumers ne peuvent que lire les events sans impact sur eux.
    - Une des conséquences c’est qu’on peut en ajouter beaucoup sans stresser le cluster. Et c’est une des différences par rapport aux brokers classiques.
    - Ils maintiennent les offsets de là où ils en sont pour chacune des partitions qu’ils sont en train de lire.
    - Les consumers de différents consumer groups n’ont pas d’impact les uns sur les autres.
  - Kafka s’assure qu’il n’y a **qu’un consumer d’un même consumer group** qui peut lire dans une **même partition**.
    - Si un consumer ne lit plus de messages jusqu’à dépasser un timeout, Kafka assignera ses partitions à un autre consumer, considéré comme sain, du même groupe.
- Pour que Kafka puisse réassigner une partition à un autre consumer en gardant le bon offset, ou redonner le bon offset à un consumer qui se reconnecte après s’être déconnecté, il faut que **les consumers communiquent leurs offsets à Kafka**.
  - On appelle ce processus _committing offsets_.
  - On peut avoir un contrôle sur le **moment où on va faire ce commit**, et donc agir sur la **garantie de delivery** des messages, c’est-à-dire le fait qu’ils soient intégralement traités.
    - On peut passer d’une stratégie _at-most-once_ à une stratégie _at-least-once_ en faisant le commit après l’exécution de la callback au lieu du moment où le message est pris par le consumer.
    - Par défaut, Kafka va faire un commit toutes les 5 secondes, sauf si un record est toujours en train d‘être exécuté, auquel cas il attendra la prochaine occasion 5 secondes plus tard.
      - On peut régler cette durée de 5 secondes à une autre valeur avec la configuration `auto.commit.interval.ms`.
      - Ça implique que si le record est exécuté, et que dans les quelques secondes après, le cluster bascule la partition sur un autre consumer, on risque de ne pas avoir commité et de réexécuter la callback du record dans le nouveau consumer.
      - Si on veut avoir le contrôle sur le moment exact où on veut faire le commit, on peut désactiver le commit automatique (configuration `enable.auto.commit` à `false`), et le faire à la main dans le consumer.
  - Le commit peut se faire via un canal in-memory asynchrone pour ne pas bloquer le consumer, avec la possibilité de fournir une callback qui sera exécutée par Kafka quand le commit aura été pris en compte
    - Ou alors le consumer peut aussi utiliser un appel synchrone pour le commit.
  - Un cas classique est de traiter les records avec une stratégie _at-least-once_ par batch, qu’on appelle _poll-process loop_ :
    - Le consumer garde un buffer de records qu’il prefetch en arrière-plan.
    - Il traite les records un par un (ou parfois en parallèle avec un pool de threads si c’est OK d’un point de vue business).
    - Quand on arrive au dernier record, il fait le commit de l’offset.
    - Puis il prend le batch suivant et recommence.
- Même si c’est moins courant, il est possible de souscrire un consumer **sans qu’il soit membre d’un consumer group**.
  - Dans ce cas, il ne bénéficiera pas des divers mécanismes associés aux consumer groups : load balancing, rebalancing en cas d’échec, détection de l’échec par inactivité, persistance de l’offset.
    - Il devra indiquer les couples topic/partition auxquels il souscrit, et devra persister ses propres offsets lui-même dans un store.
  - Il peut y avoir deux cas d’usages :
    - Le besoin d’avoir vraiment le contrôle sur la manière de consommer les messages, en stockant soi-même son offset etc.
      - Mais ce cas d’usage est très rare, et difficile à implémenter correctement.
    - Un consumer éphémère qui est là juste pour monitorer ou débugger un topic, sans avoir besoin de persister d’offsets.
      - C’est ce que fait par exemple l’outil Kafdrop qui permet de visualiser les messages présents dans les partitions via une interface web : à chaque fois il attache un consumer sans groupe.

## 4 - Installation

- Il y a 4 méthodes pour installer Kafka (et Zookeeper) :
  - En utilisant les images Docker.
    - Si on choisit une autre méthode que Docker, on aura juste besoin d’avoir d’avoir un JDK d’installé.
    - La méthode Kafka dans Docker est la plus immédiate pour avoir Kafka qui tourne, mais elle est aussi connue pour être difficile à configurer si on veut personnaliser.
  - En utilisant un package manager (yum, apt, homebrew etc.)
  - En clonant le dépôt git et en installant depuis les sources.
  - En téléchargeant des binaires sur le site de Kafka.
    - Il suffit de télécharger un tar.gz et de le désarchiver, pour obtenir les exécutables de Kafka qu’on peut lancer avec notre JDK.
    - Le livre part là-dessus.
- La configuration de Kafka peut se faire en changeant les fichiers de conf dans le dossier `config/`.
  - On peut voir les configs prises en compte dans les logs, à chaque fois qu’on démarre Kafka.

## 5 - Getting Started

- On a du tooling livré avec Kafka sous forme de scripts shell pour le gérer en CLI.
  - On peut par exemple créer un topic puis y ajouter des records.
  - On peut changer des offsets pour un consumer group.
  - etc.
- L’auteur **déconseille de laisser Kafka créer automatiquement les topics** (`auto.create.topics.enable` à `true`) pour plusieurs raisons :
  - Les valeurs par défaut de Kafka remontent à sa création, et n’ont pas forcément été pensés pour l’usage qu’il a en général aujourd’hui.
  - Quand on crée un topic, on devrait décider du nombre de partitions en fonction des critères de parallélisation. Donc un nombre par défaut ne va en général pas être satisfaisant.
  - La création de topic à la lecture est encore plus problématique, puisqu’on va avoir des lecteurs qui croient lire quelque chose et qui ne lisent rien.
- Le _lag_ est la différence entre l’offset qui a été commité par un consumer sur une partition donnée et le _high water mark_ de la partition (c’est-à-dire le dernier record dispo à la consommation).
- La **suppression d’un topic est asynchrone**, c’est-à-dire qu’elle sera effectivement réalisée quelque part dans le futur par Kafka, après qu’on l’ait demandée.
  - Pour nos **tests d’intégration**, il va donc falloir trouver des solutions :
    - 1 - Supprimer le consumer group, les offsets enregistrés, ou mettre les offsets au high water mark (tous les trois ont le même effet).
    - 2 - Tronquer les partitions en avançant le _low water mark_ (le record le plus ancien disponible à la consommation).
    - 3 - Utiliser des noms de topics uniques, et les supprimer au fil de l’eau (si on ne les réutilise pas, le fait qu’ils soient supprimés de manière asynchrone ne pose problème).
      - Cette dernière option est celle recommandée par l’auteur.
- Supprimer les offsets pour un consumer group et sur un topic donné, fait que la prochaine fois que ces consumers voudront consommer le topic, ils seront par défaut assignés au dernier record.
  - Ou au premier en fonction de l’option `auto.offset.reset`.
  - Si on supprimer un consumer group, c’est comme si on supprimait ses offsets pour l’ensemble des topics où il avait consommé des records.
- L’essentiel des classes du client Java se résument à :
  - 1 - L’interface `Producer`, l’implémentation `KafkaProducer`, et la représentation du record `ProducerRecord`.
  - 2 - La même chose côté consumer : `Consumer`, `KafkaConsumer`, `ConsumerRecord`.
  - Et c’est à peu près la même chose pour les autres clients qui s’en inspirent.
- L’option `enable.idempotence` à la création du producer permet de garder des séquences pour les couples producer/partition, pour s’assurer qu’un record n’est pas publié deux fois ou dans le mauvais ordre, dans le cas où il y aurait un timeout pendant une publication.
  - L’auteur conseille de l’activer.
- Il faut bien penser à fermer la connexion, sinon on risque de monopoliser des ressources côté client et serveur.

## 6 - Design Considerations

- A propos de la séparation des **responsabilités** entre producers et consumers.
  - Dans le cas d’un **event-oriented broadcast**, c’est le producer qui a la responsabilité de la configuration du topic et du format des données publiées.
    - C’est utile pour que les producers ne connaissent pas du tout les consumers, et qu’on reste sur du couplage faible.
    - Le fait qu’on puisse avoir plusieurs consumers aux intérêts différents montre qu’il est plus pertinent que le producer ait la responsabilité des messages.
      - Pour autant, on peut se demander comment faire en sorte que les consumers soient tous satisfaits par le modèle proposé par le producer.
      - On peut mettre en place du **topic conditioning**, c’est-à-dire compartimenter les problèmes liés à chaque consumer avec une architecture SEDA, contenant pour chaque consumer (ou groupe de consumers aux intérêts communs), un module de conditionnement publiant à son tour dans un topic pour le consumer visé.
        - Cette solution permet de séparer les responsabilités, et laisser le producer avec son modèle, et chaque consumer avec le sien.
  - Pour du **peer-to-peer messaging**, c’est au contraire le consumer qui a la responsabilité de la configuration du topic et du format de données.
    - Le consumer envoie des commandes au producer, pour que celui-ci lui prépare des données qu’il mettra dans Kafka.
  - Dans tous les cas, les flows doivent être designés avec soin, en prenant en compte les besoins des producers et des consumers.
- Concernant la question du **parallélisme** dans le cas où on veut laisser plusieurs consumers consommer depuis plusieurs partitions, il y a des facteurs à prendre en compte pour obtenir quelque chose de performant.
  - L’organisation des partitions d’un topic est **consumer-driven**, du fait du design de Kafka. Le consumer se pose la question de la **bonne clé de partitionnement**.
    - En pratique, le consumer doit trouver une entité suffisamment stable pour que son identifiant puisse servir de clé de partitionnement.
    - Par exemple, si on a des tournois de football, avec des events représentant ce qui se passe dans le jeu, on peut prendre le match comme entité stable, et avoir tous les events d’un même match ordonnés dans une même partition.
    - Si on garde l’exemple mais qu’un consumer est intéressé par le déroulement du tournoi, alors il nous faudra garder l’ordre des matchs, et donc choisir comme entité stable le tournoi.
      - Mais on aura alors moins de possibilités de parallélisation puisqu’on ne pourra plus paralléliser les matchs.
      - L’autre possibilité c’est de laisser le consumer qui a besoin de l’ordre des tournois le reconstituer lui-même, avec des infos qu’il a dans les events.
  - Se pose ensuite la question du **nombre de partitions du topic**.
    - Pour rappel on ne peut pas enlever de partitions sans détruire de messages, et en rajouter fait que la fonction de hash n’envoie plus dans les mêmes partitions qu’avant le rajout (donc il vaut mieux éviter si on veut garder l’ordre des messages).
    - Une solution peut être d’avoir dès le début un **nombre suffisamment élevé de partitions par topic**, pour ne jamais avoir à les augmenter.
      - Attention cependant, trop de partitions peut causer des problèmes de performance.
      - Confluent recommande `100 x b x r` partitions (avec `b` le nombre de brokers du cluster, et `r` le facteur de réplication).
      - Si on atteint le nombre maximal de partitions qu’on avait prévu, une technique peut être de créer un nouveau topic avec plus de partitions, et de copier l’ensemble des messages de l’ancien topic vers le nouveau. Ça nécessite un peu d’effort.
  - Le **nombre de consumers** dans un consumer group doit être au moins aussi grand que le nombre de partitions si on veut profiter du maximum de parallélisme.
    - Par contre, allouer un tel nombre peut aussi mener à du gâchis de ressources, vu que le broker ne fonctionne pas forcément en flux tendu.
    - On peut alors plutôt allouer un nombre variable de consumers au groupe, basé sur l’activité du cluster.
  - Enfin on peut envisager d’avoir du **parallélisme à l’intérieur des consumers**, en gérant plusieurs threads, pour traiter plusieurs records en même temps.
- A propos de la question de la **delivery des messages**.
  - On parle ici de “delivery” au sens où les messages sont traités jusqu’au bout par les consumers, pas juste du fait qu’ils soient disponibles à la lecture (ça, ils le restent de toute façon pour tous les consumers dès lors que la publication a marché).
  - On peut avoir une delivery **at-most-once**, en faisant le commit dès le début de la lecture.
    - C’est utile dans les cas où la perte occasionnelle de donnée n’est pas grave, et ne laisse pas le système consommateur dans un état inconsistant de manière permanente.
    - Ca peut être aussi parce que faire l’action deux fois pose problème, alors le que le fait de la rater de temps en temps non.
  - On peut avoir une delivery **at-least-once**, en ne faisant le commit qu’après exécution complète de la callback du consumer.
    - C’est utile dans le cas où la perte de donnée n’est pas acceptable, et où on est prêt à recommencer certains messages pour l’éviter.
    - Par contre on doit être prêt à avoir la callback potentiellement exécutée plusieurs fois.
  - Et enfin, si on veut une delivery **exactly-once**, on ne peut malheureusement pas compter sur le message broker à lui seul, on doit s’assurer d’avoir un flow **idempotent**.
    - On pourrait le vouloir pour avoir à la fois la consistance parce que la perte de donnée ou le fait de ne pas faire une action n’est pas acceptable, mais où le fait de le faire deux fois n’est pas acceptable non plus.
    - Pour réussir ça, on a besoin d’avoir une **idempotence de bout en bout**, c’est à dire que :
      - La callback du consumer ne doit faire que des changements idempotents. Par exemple un update en DB qui ne change pas l’état de la DB quand il est joué plusieurs fois.
      - Le consumer doit vérifier si les side-effects qu’il fait ont déjà été faits pour ne pas les refaire une 2ème fois. Par exemple, Kafka offre un mécanisme de transaction qui permet de ne publier qu’une fois dans un topic sortant pour un message d’un topic entrant.
      - Dans le cas où on ne peut pas savoir si le side-effect a déjà été fait ou pas, il faut que le side-effect lui-même soit rendu idempotent de bout en bout.

## Chapter 7 - Serialization

- Le client Java a des serializers de base et une interface à implémenter pour créer des serializers Kafka custom.
  - Pour l’auteur, même si cette approche est idiomatique, il vaut mieux avoir Kafka et tout ce qui y est lié isolé dans une couche de messaging pour que la logique business n’y soit pas liée et soit testable.
    - L’auteur préfère **laisser la sérialisation côté logique business**, et donc conseille de ne pas utiliser les serializers custom de Kafka dans ce cas.
  - Et de la même manière, les choses spécifiques à Kafka comme le fait de mettre l’ID des customers comme clé, doivent être dans la couche de messaging pour être les mêmes pour tous les use cases.
- Quand on est en mode **commit manuel**, on peut appeler la fonction qui fait le commit de manière asynchrone **sans l’attendre**.
  - Ça aura pour effet d’avoir plus d’offsets pas encore commités mais un throughput plus élevé.
  - On respecte quand même le at-least-one delivery.
- Dans le cas où on utilise le mécanisme de poll-process loop (où on consomme les messages par batch), le client Java va avoir deux threads : un pour aller chercher plus de records et un autre pour faire le processing des records qui sont déjà là.
  - Il s’agit là d’un mécanisme de **pipelining**, où la 1ère étape va chercher de la donnée pour la mettre dans le buffer suivant jusqu’à ce que le buffer soit plein, auquel cas elle attend avant de continuer.
  - L’auteur propose une version encore plus parallélisée, en ajoutant une 3ème étape dans la pipeline pour séparer la désérialisation du reste du traitement du message.
    - L’avantage c’est que ça peut augmenter le throughput, mais l’inconvénient c’est une utilisation plus intensive du CPU.
    - Il faut créer un thread à la main, et gérer la communication inter-thread à travers un buffer, avec tous les edge cases liés au parallélisme.
    - Selon l’auteur, cette technique a du sens parce que :
      - L’utilisation de Kafka est souvent associée à des cas d’usages qui ont besoin de performance.
      - Elle ajoute de la complexité, mais qu’on n’a à faire qu’une fois et qu’on peut isoler dans un adapter qu’on réutilise.
    - Côté publisher ça aurait moins de sens vu que la sérialisation est moins coûteuse que la désérialisation.
- Il peut être pertinent de **filtrer des messages au niveau de la couche adapter** du consumer Kafka.
  - Par exemple, si le topic contient plus de messages que ce que le use-case qui le consomme peut ou veut désérialiser.
    - Ça peut être parce que le producer publie les messages plusieurs fois, en indiquant la version du schéma dans le header, et qu’on ne veut en lire qu’une version sans avoir à parser les autres.
    - Ça peut aussi être un topic qui contient plusieurs types de messages, dont on ne veut traiter qu’un type.

## 8 - Bootstrapping and Advertised Listeners

- Chaque partition a un leader broker, et `n` follower brokers qui contiennent sa donnée (avec `n + 1` étant le **replication factor**).
- Pour pouvoir écrire un record, un client publisher doit l’envoyer au broker leader de la partition qui l’intéresse.
  - Le leader transférera aux followers, mais on ne peut pas compter sur un des followers pour transférer d’abord au leader.
  - Ça veut donc dire que **le client devra avoir une connexion directe** avec quasi tous (ou même tous) les brokers, vu que tous les brokers peuvent être des leaders de partitions et qu’il risque de vouloir en lire plusieurs.
  - Les brokers sont au courant de la topologie du cluster parce qu’ils ont l’info partagée via ZooKeeper.
    - Le client peut donc **demander la liste des adresses IP des brokers à n’importe lequel d’entre eux**. Et donc, pour peu qu’il ait au moins une adresse de broker valide, il peut réobtenir toutes les autres.
    - Le client est initialement fourni avec une _bootstrap list_ des brokers, et ensuite se débrouille pour la mettre à jour en leur demandant.
  - Cette technique de base de demander la liste des adresses à au moins un broker dont on a l’adresse valide n’est pas super fiable : si le client n’a plus aucune adresse valide parce qu’elles ont toutes changé, il est coincé.
    - Ce que fait la communauté pour répondre à cette problématique c’est d’utiliser des **alias DNS, pointant vers les bonnes adresses IP des brokers**.
    - La spécification DNS permet même d’indiquer un seul nom qui sera associé à une liste d’adresses IP pointant vers chacun des brokers.
- Il y a un problème classique de configuration auquel beaucoup de monde se heurte, et qui empêche la connexion du client aux brokers : le client demande la liste des adresses, et le broker lui répond des adresses en `localhost`.
  - La solution est de configurer les **advertised listeners** dans le fichier `config/server.properties`.
  - Les propriétés sont initialement commentées dans le fichier, et donc c’est les valeurs par défaut qui s’appliquent (on peut les retrouver dans la [documentation de Kafka](https://kafka.apache.org/documentation/#brokerconfigs)).
  - `advertised.listeners` permet d’indiquer les URI qui seront envoyées aux clients qui demandent la liste des adresses des brokers. C’est ça qu’il faut configurer avec le bon hostname pour résoudre le problème de config.
  - Dans le cas où on a des clients situés dans des environnements réseau différents, on a besoin de leur advertiser des adresses différentes pour les mêmes brokers.
    - C’est le cas par exemple si on a un VPC (virtual private cloud) avec le cluster Kafka et des clients, et d’autres clients situés à l’extérieur et ne pouvant pas accéder aux adresses IP internes au VPC.
    - Dans ce cas, on va pouvoir configurer plusieurs URI sur lesquels écoute chaque broker (dans `listeners`), et plusieurs URI qui sont advertised (dans `advertised.listeners`).
      - Il faut faire attention à indiquer des ports différents pour chacune des URI si on ne veut pas de problèmes.
- Les problématiques de bootstrapping se posent largement dans les environnements conteneurisés. La simple utilisation de **docker-compose** nous amène à avoir l’équivalent d’un VPC interne aux containers lancés par docker-compose, et un mapping de port vers la machine hôte.
  - Exemple de config Kafka dans un docker-compose :
    ```yml
    kafka:
      image: bitnami/kafka:2
      ports:
        - 9092:9092
      environment:
        KAFKA_CFG_ZOOKEEPER_CONNECT: zookeeper:2181
        ALLOW_PLAINTEXT_LISTENER: "yes"
        KAFKA_LISTENERS: >-
          INTERNAL://:29092,EXTERNAL://:9092
        KAFKA_ADVERTISED_LISTENERS: >-
          INTERNAL://kafka:29092,EXTERNAL://localhost:9092
        KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: >-
          INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
        KAFKA_INTER_BROKER_LISTENER_NAME: "INTERNAL"
      depends_on:
        - zookeeper
    ```
  - On définit ici deux protocoles propres à Kafka (et associés au type `PLAINTEXT`, donc non sécurisés) : un qu’on appelle `INTERNAL` pour l’URI depuis le réseau interne des containers docker-compose, et un autre qu’on appelle `EXTERNAL` pour le réseau de l’hôte.
  - `KAFKA_LISTENERS` est l’équivalent de `listeners` dans `config/server.properties`, c’est-à-dire les sockets sur lesquels le broker écoute.
    - On choisit deux ports différents qui permettent de différencier les connexions internes et externes, et on indique qu’on écoute sur toutes les interfaces possibles (en n’indiquant aucun hostname ni adresse IP).
  - `KAFKA_ADVERTISED_LISTENERS` est l’équivalent de `advertised.listeners`, c’est-à-dire les adresses URI communiquées aux clients pour joindre le broker.
    - On indique bien le hostname `localhost` aux clients du réseau externe, et le hostname `kafka` aux clients du réseau interne (le nom des containers sert aussi de hostname dans docker-compose).
  - `KAFKA_INTER_BROKER_LISTENER_NAME` permet d’indiquer quel protocole doit être utilisé pour la communication avec les autres brokers du cluster.
  - `depends_on` permet d’indiquer l’ordre dans lequel on start les containers dans docker-compose.
