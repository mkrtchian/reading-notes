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

## 7 - Serialization

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

## 9 - Broker Configuration

- La configuration peut se faire sur 4 entités de Kafka : les **brokers**, les **topics**, les **clients** et les **users**.
- Il existe une **configuration statique** et une **configuration dynamique**.
  - Historiquement la configuration dynamique a été introduite pour faciliter l’administration de gros clusters, et pour ne plus avoir besoin de restart.
    - La communauté a décidé qu’enlever la configuration statique était trop radical, donc elle a été gardée en fallback.
  - La configuration statique se fait en changeant le fichier `config/server.properties` et en redémarrant le broker.
  - La configuration dynamique se fait via l’admin API de Kafka, au niveau du broker ou du cluster entier.
    - Elle est stockée dans Zookeeper, mais ne nécessite pas la communication directe avec Zookeeper pour faire des modifications de config.
- Côté **précédence**, c’est d’abord la config dynamique par entité qui prend le pas, puis la config dynamique au niveau du cluster, et enfin la config statique.
  - Si rien n’est défini, les valeurs par défaut s’appliquent.
  - Dans le cas de propriétés dépréciées et remplacées par d’autres, les propriétés dépréciées sont prises en compte si elles sont utilisées, et sinon c’est la valeur par défaut des nouvelles propriétés qui est prise en compte.
- Quelques infos sur les **changements de config des brokers**.
  - Sur la configuration **statique**.
    - Toutes les propriétés de `config/server.properties` sont optionnelles, sauf `zookeeper.connect` qui contient la liste des adresses des nœuds ZooKeeper.
    - Il est considéré comme une bonne pratique de spécifier la propriété `broker.id` qui représente l’identifiant du broker. Si on ne le fait pas, ZooKeeper assignera un ID automatiquement à chaque broker (par défaut en commençant par `1001`).
      - Pour changer cette propriété, il faut :
        - D’abord arrêter le broker.
        - Faire le changement dans `server.properties`.
        - Faire le changement dans le fichier `meta.properties` (qui se trouve dans le dossier de log du broker), ou même supprimer le fichier `meta.properties` qui sera régénéré.
          - Le dossier de log contient des fichiers essentiels avec l’info des partitions et des records (rien à voir avec du logging).
          - Son path est configurée avec l’option `log.dirs`, par défaut c’est `/tmp/kafka-logs`.
        - Redémarrer le broker.
  - Sur la configuration **dynamique**.
    - On peut changer la config via l’outil CLI fourni par Kafka sous forme de script bash : `kafka-configs.sh`, ou via une librairie cliente qu’on tierce qui va se connecter à Kafka.
      - Par exemple pour afficher la liste des configurations dynamiques pour le broker 1001 sur un Kafka qui tourne localement :
        ```bash
        ./kafka-configs.sh
            --bootstrap-server localhost:9092
            --entity-type brokers
            --entity-name 1001
            --describe
        ```
    - Il faut faire attention avec les configurations dynamiques, on peut facilement mettre un cluster par terre si on fait une mauvaise manip.
      - Quand on modifie **une config pour tout le cluster**, c'est une bonne pratique de la modifier **d’abord pour un broker**, au cas où elle aurait un impact non souhaité qui serait du coup plus limité.
- A propos de la **configuration des topics**.
  - Ils peuvent être configurés statiquement via `config/server.properties`, ou dynamiquement au niveau du cluster (une configuration de topic par broker n’aurait pas de sens).
    - On peut aussi modifier dynamiquement certaines propriétés par topic.

## 10 - Client Configuration

- La configuration du client est beaucoup plus sensible, en partie parce qu’elle tombe **sous la responsabilité des développeurs applicatifs**.
  - En général la configuration des brokers se fait par des personnes spécialistes de l’infra, gérant d’autres éléments d’infrastructure, et connaissant la manière de gérer les risques.
    - On voit aussi de plus un shift vers les versions de serveurs Kafka pré-configurées. Ça ne peut pas être le cas des clients.
- **La plupart des problèmes** avec Kafka viennent d’une **mauvaise utilisation côté client**, parce que les développeurs ne le connaissent pas assez bien.
  - Exemple : il est notoire que Kafka offre des garanties importantes pour ce qui est de la durabilité des records. Mais en réalité ça dépend des paramètres.
    - Il y a déjà la question du stockage, lui-même influencé par le nombre de brokers.
    - Et ensuite il y a des configurations côté client :
      - Le replication factor et quelques autres pour ce qui est de s’assurer que la donnée reste en cas de problème avec certaines machines.
      - Le nombre d’acknowledgements que le broker leader de la partition doit demander avant de considérer le record comme validé, et le fait d’attendre soi-même l’acknowledgement du leader avant de considérer le message comme publié.
  - Les développeurs imaginent aussi que le comportement par défaut de Kafka optimise la garantie d’ordre et de delivery des records. Mais ces valeurs sont issues de l’utilisation initiale de Linkedin qui avait surtout besoin de performance dans son cas d’usage.
- **La 1ère règle de l’optimisation avec Kafka est : ne le faites pas**.
  - La plupart du temps, les configurations qui offrent des garanties vis-à-vis des records n’ont pas un si grand impact que ça. On peut attendre d’en avoir vraiment besoin.
- Pour ce qui est des **configurations communes** à tous les types de clients (producer, consumer, admin).
  - **bootstrap.servers** permet de contacter les brokers, mais ensuite le plus important c’est que les brokers envoient les bonnes adresses (cf. le chapitre précédent).
  - **client.dns.lookup** donne la possibilité d’utiliser des alias DNS liés à plusieurs adresses.
  - **client.id** permet de définir l’identifiant du client, comme on l’a fait pour le serveur dans le chapitre d’avant. Ça permet la traçabilité, et la gestion de quotas.
  - **retries** indique le nombre de fois qu’on va recommencer une opération qui se termine par une erreur transiente, c’est-à-dire qui peut potentiellement ne pas se reproduire en réessayant.
    - **retry.backoff.ms** indique la durée d’attente avant de réessayer.
    - Par défaut on bourrine, en recommençant un nombre infini de fois toutes les 100 ms.
    - L’autre possibilité c’est en gros de limiter les retries, en ayant conscience que du coup on se retrouvera à un moment où un autre à avoir des opérations qui sont en erreur pour des raisons temporaires. Mais on ne bloquera pas pendant longtemps.
  - Quand on veut utiliser Kafka dans des **tests d’intégration**, il faut prendre en compte que le fait de le lancer dans un environnement virtualisé type Docker va ralentir considérablement son démarrage.
    - Le fait que Kafka écoute sur le port ne suffit pas pour qu’il soit prêt à accepter des requêtes. Il peut donc falloir attendre un certain temps au début des tests pour qu’il démarre.
    - Et c’est encore pire avec Docker sur MacOS.
- Pour ce qui est de la **configuration du producer**.
  - **acks** permet d’indiquer le nombre d’acknowledgements qu’on veut attendre de la part du broker leader avant de considérer que le message est publié.
    - `0` indique qu’on ne veut pas attendre du tout.
    - `1` indique qu’on veut attendre que le leader lui-même ait écrit le record dans son log à lui.
      - C’est la valeur par défaut si `enable.idempotence` est `false`.
    - `-1` permet d’indiquer qu’on veut attendre que le leader mais aussi tous les followers aient écrit le record dans leurs log.
      - C’est la valeur par défaut si `enable.idempotence` est `true`.
  - **max.in.flight.per.connection** indique le nombre de records qu’on veut pouvoir publier (par défaut 5), avant d’avoir à attendre le nombre d’acknowledgements qu’on a indiqué dans `acks`.
    - Augmenter ce nombre permet de se prémunir contre la lenteur du réseau, vu qu’attendre la confirmation à chaque fois qu’on veut publier nous empêche de publier vite.
    - Par contre, on risque de ne pas publier dans le bon ordre pour les records entre deux acknowledgements.
      - Il suffit qu’un record A ait une erreur transiente qui est retentée puis réussie, mais que le record suivant B ait réussi immédiatement et avant le record A. Ce qui inverse l’ordre de publication de A et B.
      - Pour ne pas avoir le problème il faudrait soit avoir `max.in.flight.per.connection` à 1 (attendre la confirmation à chaque publication), soit `retries` à 0 (ne jamais réessayer les erreurs transientes).
      - En réalité il y a une 3ème option qui est d’activer `enable.idempotence`, où Kafka va utiliser un mécanisme qui remet le bon ordre pour les records qui arrivent avec le mauvais ordre.
  - **enable.idempotence**.
    - Permet de garantir que :
      - Les records soient publiés **au plus une fois** (donc dédupliqués).
      - Les records sont publiés **dans l’ordre indiqué par le client** producer.
      - Les records sont d’abord persistés sur l’ensemble des réplicas avant d’envoyer l’acknowledgement.
    - Il nécessite que (si ces propriétés ne sont pas renseignées, elles seront mises aux bonnes valeurs par défaut, mais il ne faut juste pas de conflit) :
      - `max.in.flight.per.connection` soit **entre 0 et 5**.
      - `retries` soit plus grand que 0.
      - `acks` soit à -1.
    - Le problème de duplication peut se produire dans le cas où l’acknowledgement est en time out, où le broker a reçu les records, mais le client pensant que ça n’a pas marché, les renvoie.
    - Le mécanisme c’est que chaque broker maintient un système d’ID pour les records qui arrivent, qui s’incrémente à la manière d’un compteur pour les partitions dont il est leader.
      - Si le record qui arrive est identifié comme étant déjà arrivé, il est ignoré comme duplicata.
      - Si le record qui arrive se voit attribuer un ID plus grand qu’un incrément de 1, alors le message est considéré comme étant dans le mauvais ordre, et le broker répond une erreur indiquant qu’il faut le requeuer.
  - **compression.type** permet d’indiquer l’algo de **compression** qui sera utilisé par le producer (détaillé dans le chapitre 12).
    - Parmi les possibilités :
      - _none_
      - _gzip_
      - _snappy_ (optimisé pour le throughput, au dépend de la compression)
      - _lz4_ (optimisé aussi pour le throughput, surtout la décompression)
      - _zstd_ (nouvel algo, qui est censé faire un bon ratio throughput / performance).
  - **key.serializer** et **value.serializer** servent à indiquer la sérialisation des clés et valeurs des records (cf. le chapitre 7).
  - **partitioner.class** permet d’indiquer une classe Java qui va définir une manière différente de la manière par défaut d’associer les records et les partitions.
    - La manière par défaut va, dans l’ordre :
      - 1 - Si la partition est indiquée explicitement dans la publication du record, elle sera utilisée.
      - 2 - Sinon, si on a indiqué une clé, la clé sera hashée pour déterminer la partition.
      - 3 - Sinon, si le batch courant a une partition qui lui est assignée, on utilise cette partition.
      - 4 - Sinon, on assigne une partition au batch et on l’utilise.
        - Le 3 et 4 ont été introduits dans Kafka plus récemment, et permettent, dans le cas où on n’a pas de préférence d’ordre liée à une clé, de **n’impliquer qu’un broker pour les records d’un batch.** Ça **améliore les perfs par 2 ou 3**, tout en assurant une distribution entre brokers quand on a un grand nombre de batchs.
    - Le client Java a aussi deux autres classes disponibles :
      - `RoundRobinPartitioner` permet d’alterner entre les brokers, sans prendre en compte la clé.
      - `UniformStickyPartitioner` permet de garder les records d’un même batch pour une même partition, sans prendre en compte la clé.
    - On peut aussi donner une classe perso, mais l’auteur conseille d’envisager aussi d’encoder notre ordre custom dans une clé.
  - **interceptor.classes** permet de définir des classes Java qui vont faire quelque chose de particulier à l’envoi et à l’acknowledgement.
    - Ça peut être utile pour le côté “plugin” réutilisable, parce qu’on est sur de l’AOP (Aspect Oriented Programming).
    - On peut par exemple l’utiliser pour ajouter une couche qui fait du logging, du tracing, de l’analyse de message pour empêcher la fuite de données etc.
    - Attention par contre : les exceptions dans les interceptors ne sont pas propagées.
    - Globalement si on y met quelque chose, il vaut mieux que ce soit du code simple et non bloquant.
  - **max.block.ms** permet d’indiquer un timeout au processus de publication (par défaut 60 secondes).
  - **batch.size** permet d’attendre d’avoir une certaine taille de messages (par défaut 16 KB) avant d’envoyer un batch de publication.
    - **linger.ms** fait la même chose au niveau du temps (par défaut 0 ms) en ajoutant un temps minimal à attendre avant d’envoyer un autre batch.
    - L’intérêt est de faire moins de requêtes au serveur et donc d’augmenter le throughput.
  - **request.timeout** permet d’indiquer un timeout vis-à-vis de la réponse du broker pour faire l’acknowledgement (par défaut 30 secondes), avant de réessayer ou d’indiquer la publication comme échouée.
  - **delivery.timeout** permet d’indiquer un temps global pour une requête de publication, qui englobe l’envoi, les retries, et la réponse du serveur.
    - Par défaut, c'est 120 secondes.
    - Il doit être supérieur aux autres timeouts réunis.
  - **transaction.id** et **transaction.timeout.ms** permettent de gérer le comportement des transactions (cf. le chapitre 18).
- Pour ce qui est de la **configuration du consumer**.
  - **key.serializer** et **value.serializer** servent à indiquer la désérialisation des clés et valeurs des records (cf. le chapitre 7).
  - **interceptor.classes** permet de faire la même chose que côté consumer, en traitant les records par batch.
  - Une des choses les plus importantes à régler, c'est **la taille de ce qu’on va aller chercher en une requête**. Ça se configure en plusieurs propriétés.
    - Plus on prendra de données, et plus le throughput sera grand, mais moins on aura un bon délai de propagation de bout en bout d’un record.
    - La propriété **timeout** donnée à `Consumer.poll()` permet de limiter son temps d’exécution.
    - **fetch.min.bytes** (par défaut 1) permet de demander au broker d’attendre d’avoir au moins un minimum de données à envoyer avant de les envoyer.
      - En réalité, le broker doit quand même envoyer une requête même s’il n’a pas assez de données, dans le cas où il dépasse un timeout fixé par **fetch.max.wait.ms** (par défaut 500 ms).
    - **fetch.max.bytes** (par défaut 50 MB) indique au broker à partir de quelle taille il doit arrêter d’ajouter des données. Vu qu’un record (et donc à fortiori un batch) peut de toute façon dépasser cette taille, la limite n’est qu’indicative.
      - La même propriété limite existe pour la taille des partitions : **max.partition.fetch.bytes** (par défaut 1 MB).
        - Cette propriété permet de limiter l’impact des partitions “gourmandes”, en laissant de la place aux partitions qui ont moins de données.
      - Intéressant à savoir : les brokers ne font pas de traitement sur les batchs. **Les batchs sont envoyés par les producers, stockés tels quels, et envoyés tels quels aux consumers**. C’est un choix de design de Kafka pour garantir une grande performance.
    - **max.poll.records** (par défaut 500) permet de limiter le nombre de records retournés par `Consumer.poll()`.
      - Contrairement aux autres propriétés, celle-ci n’impacte pas le broker. C’est le client qui reçoit le même nombre de records par batch, va lui-même limiter ceux qu’il rend disponible. Il bufferise les autres pour les rendre disponibles à l’appel suivant.
      - Elle est là pour éviter que le client n’ait à traiter trop de records, et ne puisse pas appeler à nouveau `poll()` avant `max.poll.interval.ms`.
  - **group.id** permet d’indiquer le groupe d’un consumer. Si on ne le fournit pas, il deviendra sans groupe, et ne pourra pas bénéficier des mécanismes de d’assignation automatique de partition, détection des échecs, ni faire de commits au serveur pour sauvegarder son offset.
  - **group.instance.id** consiste à indiquer un identifiant à un consumer, unique dans son groupe, rendant le consumer _static_. L’effet est que si le consumer n’est plus là, sa partition n’est pas réassignée, mais reste en attente de son retour.
    - C’est pour éviter les rebalancing trop fréquents dans un contextes de manque d’availability transient.
    - Pour en savoir plus : chapitre 15.
  - La **détection d’échecs** est contrôlée par la combinaison de `heartbeat.interval.ms`, `session.timeout.ms` et `max.poll.interval.ms`.
    - Ce sujet fait partie des sujets délicats, source de nombreux problèmes.
    - **heartbeat.interval.ms** (par défaut 3 secondes) contrôle la fréquence à laquelle le consumer envoie des heartbeats.
    - Le broker coordinator du groupe de son côté vérifie que le consumer n’envoie pas son prochain heartbeat après le délai de **session.timeout.ms** (par défaut 10 secondes). Sinon il l’expulse et réassigne ses partitions dans le groupe.
    - **max.poll.interval.ms** (par défaut 5 minutes) est le délai maximal pour qu’un consumer rappelle `poll()`. S'il ne l’a pas fait, il va lui-même arrêter d’envoyer des heartbeats et demander à quitter le groupe.
      - Si le consumer est statique, il arrête les heartbeats mais ne demande pas à quitter le groupe. Il sera évincé par le broker s’il dépasse la `session.timeout.interval` sans avoir réémis de heartbeats.
      - Le but de ce comportement est d’éviter les situations où plusieurs consumers traitent les mêmes messages.
  - **auto.reset.offset** permet d’indiquer ce qui se passe quand un consumer n’a pas d’offsets pour la partition qu’il consomme.
    - Les options sont : `earliest` pour partir du low water mark, `latest` pour partir du high water mark, et `none` pour renvoyer une exception.
    - Les offsets sont stockés par le group coordinator dans un topic nommé `__consumer_offsets`. Ce topic a un temps de rétention comme n’importe quel topic (par défaut 7 jours).
    - L’offset peut ne pas exister si :
      - 1 - C’est le début de la formation du groupe et que la partition n’a pas encore été lue par lui.
      - 2 - Quand rien n’a été consommé sur cette partition par le groupe (et donc aucun offset n’a été commité dans `__consumer_offsets`) depuis plus longtemps que le délai de rétention de `__consumer_offsets`.
      - 3 - Quand on a un offset qui pointe vers un record qui est dans un topic où le délai de rétention est plus faible, et a été dépassé. Donc l’offset pointe vers le vide.
  - **enable.auto.commit** permet d’indiquer si le commit automatique est activé pour un consumer. Il s’agit d’envoyer un commit jusqu’au dernier record traité par le dernier l’appel à `poll()`, pour mettre à jour son offset.
    - Par défaut le client commit toutes les 5 secondes (temps réglable avec **auto.commit.interval.ms**).
    - Si ça marchait vraiment comme ça (tel que le dit la doc), le client mettrait à jour son offset au dernier record reçu dans le batch envoyé par le dernier appel à `poll()`, alors même qu’il n’a pas forcément terminé de traiter le batch.
      - En réalité, l’implémentation règle le problème en envoyant le commit dans le même thread que celui qui traite les records, et seulement après que le batch ait été traité.
      - Mais ce comportement n’est pas garanti vu que la doc ne dit pas ça, Kafka pourrait à tout moment mettre à jour le comportement pour faire le commit dans un autre thread toutes les 5 secondes.
      - Pour éviter les problèmes, l’auteur conseille de **faire le commit à la main**.
  - **isolation.level** permet d’indiquer le type de comportement d’une transaction vis-à-vis du consumer.
    - La valeur `read_uncommitted` va renvoyer tous les records sans prendre en compte les transactions.
    - La valeur `read_committed` va renvoyer les records qui ne font pas partie des transactions, et ceux qui font partie de transactions validées, mais pas ceux qui font partie de transactions qui ne sont pas encore validées.
      - Pour garantir l’ordre, tous les records qui doivent se trouver après les records qui sont dans des transactions non validées seront aussi bloqués le temps de la transaction.

## 11 - Robust Configuration

- Kafka fait le choix d’émettre un warning dans le cas où on donne un mauvais nom de propriété de configuration.
  - Pour éviter les typos, on peut utiliser les constantes pour donner les valeurs.
  - En TypeScript les clients sont typés.
- Si la propriété vient d’un fichier de config qui n’est pas du code, il n’y aura pas de check à la compilation.
  - Dans ce cas, il nous faut vérifier le contenu au runtime.
  - L’auteur propose de faire une classe de validation, qui propose des méthodes de type fluent chaining.
    ```java
    final var config = new TypesafeProducerConfig()
      .withBootstrapServers("localhost:9092")
      .withKeySerializerClass(StringSerializer.class)
      .withValueSerializerClass(StringSerializer.class)
      .withCustomEntry(
        ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, 1
      );
    ```

## 12 - Batching and Compression

- Les batchs sont traités par Kafka comme un **processus de bout en bout** : le producer envoie les records par batchs, ils sont stockés comme tels, puis envoyés au consumer sous le même format.
  - Ca permet de recourir à la _zero-copy optimization_, où les données sont copiées depuis le réseau vers le disque, puis à nouveau vers le réseau, sans que le CPU n’ai eu à intervenir pour transformer la donnée.
- Ce processus de création de batchs arrive quand il y a beaucoup de records à traiter successivement : Kafka va batcher les records qui sont **en attente d’être envoyés** (en limitant la taille des batchs à `batch.size`). Quand le client veut publier au compte goutte, il ne fait pas de batchs.
  - `linger.ms` peut permettre d’avoir plus de batchs : pendant ce temps qu’on attend, des records peuvent s’accumuler pour être batchés.
  - Kafka compte beaucoup sur **du fine tuning fait par des admins** pour la situation précise dans lequel il est utilisé.
- Le batching a encore plus d’intérêt quand on utilise la **compression**.
  - On peut obtenir des ratios de compression entre x5 et x7 sur du JSON.
  - La meilleure performance de compression est obtenue avec de **petits batchs**.
  - La compression est réalisée par le producer, et la décompression dans le consumer, donc ça a l’avantage de ne pas mettre de charge sur le serveur.
    - Le serveur offre aussi la possibilité de modifier la compression de son côté si on le veut vraiment : avec la propriété `compression.type` côté broker, qui a par défaut la valeur `producer`, et peut prendre une valeur de type de compression (`gzip`, `snappy` etc.).
  - L’auteur recommande de **toujours activer la compression pour les records textuels et binaires** (sauf si on sait qu’ils ont une très grande entropie, c’est-à-dire que leur contenu est très variable et difficilement prévisible, donc difficilement compressible).
  - Côté algo, il conseille les heuristiques suivantes :
    - Si on a des clients legacy (avec une version inférieure à 2.1.0) :
      - De base LZ4.
      - Si le réseau est identifié comme un bottleneck : Gzip.
    - Si on a des clients récents :
      - De base LZ4.
      - Si le réseau est identifié comme un bottleneck : ZStandard.
    - Bien sûr, si on a un vrai besoin de fine tuner la performance, il faut faire des benchmarks avec chacun des algos dans notre contexte spécifique.

## 13 - Replication and Acknowledgements

- Le système de réplication fonctionne par _sequential consistency_ : un leader par partition envoie la donnée aux followers.
- Plus le replication factor est élevé, et plus l’acknowledgement des records peut être ralenti à cause du fait qu’il faut attendre le follower le plus lent.
  - Pour répondre à ce problème, chaque leader maintient dans ZooKeeper une liste des **In-Sync Replicas** (ISR), c’est-à-dire les followers qui ne dépassent pas un retard temporel spécifique vis-à-vis des records du leader.
    - On peut régler un nombre minimal de followers dans l’ISR avec `min.insync.replicas` (par défaut 1, mais l’auteur conseille au moins 2, pour toujours avoir au moins une autre copie à jour).
      - En dessous de ce nombre se trouvant dans l’ISR, le leader arrête d’accepter la publication de records et attend qu’un nombre suffisant de followers redeviennent éligibles à l’ISR.
    - Le temps maximal de lag à partir duquel un follower est exclu de l’ISR est configuré avec `replica.lag.time.max.ms` (par défaut 10 secondes).
    - C’est les followers de l’ISR dont on attendra la confirmation pour une durabilité maximale, et non pas celle de l’ensemble des followers.
    - Le producer ne peut que dire s’il veut attendre l’acknowledgement de tous les followers (de l’ISR), du leader seulement, ou de personne. Il ne peut pas influer sur qui se trouve ou non dans l’ISR.
- **Seuls les réplicas de l’ISR** sont éligibles pour devenir **leaders de partition**.
  - Sauf si on a mis la propriété `unclean.leader.election` à `true`.
- Quelle que soit l’approche choisie, elle aura des désavantages plus ou moins grands :
  - Avec un faible `min.insync.replicas` on risque de ne plus avoir de réplicas à jour pour prendre la main au moment où le leader est en échec.
  - Avec un `min.insync.replicas` élevé proche ou égal au replication factor, on risque d’avoir des réplicas lents qu’on est obligés d'attendre.
  - Avec un plus grand replication factor (la propriété `default.replication.factor`), et potentiellement plus de brokers, on risque quand même d’être lent parce qu’on a plus de réplicas à mettre à jour.
- On peut **augmenter le replication factor de topics existants**, mais ça nécessite de créer un fichier de config de réassignement sous forme JSON, avec l’ordre des réplicas qu’on préfèrerait pour chaque partition (pour le choix des nouveaux leaders d’une manière qui les répartit entre brokers).
  - Pour nous aider avec cette config, il y a l’outil **kafka-reassign-tool** sur GitHub.
  - La création d’un réplica supplémentaire demande à copier les partitions pour lesquelles on augmente le replication factor, donc ça peut prendre du temps et occuper le cluster.
- Pour **décommissionner un broker**, il faut d’abord le vider de son rôle de leader pour toutes les partitions où il l’est.
  - On peut pour ça utiliser la même technique avec le fichier de config de réassignement, en indiquant pour toutes les partitions où il est leader, les IDs d’autres brokers.
- Concernant l’**acknowledgement**.
  - Quand un producer choisit de ne pas en recevoir (`acks = 0`), il n’a plus de garantie de durabilité sur ce qu’il envoie (bien que la réplication se fasse comme d’habitude côté serveur), et il n’est plus non plus informé de l’offset des records qu’il publie (par retour de la méthode `send()` par exemple).
    - Ca peut par exemple être utile dans un cas de traitement de données de température qu’on affiche en direct : la perte de quelques données n’est pas très grave.
  - Quand un producer choisit d’en recevoir un quand seulement le leader a validé le record (`acks = 1`), en réalité il n’y a pas beaucoup plus de garantie qu’avec `acks = 0`.
    - Le leader peut échouer à effectivement écrire le record (il répond avant que l’écriture soit complète), ou il peut lui-même être en situation d’échec juste après l’acknowledgement, et avant d’avoir envoyé le record aux autres réplicas.
    - En fait ça revient à se demander si la machine du leader est considérée plus fiable que celle du producer pour ce qui est de décider si un record est publié ou pas.
    - De manière générale ce mode est surtout utile dans les cas où la perte de quelques données est tolérable, mais où le client a besoin de connaître l’offset du record qu’il vient d’écrire.
  - Quand un producer choisit de recevoir tous les acknowledgements (`acks = -1` ou `all`), il a la garantie de durabilité maximale.
- L’auteur conseille comme heuristique par défaut d’adopter `-1` ou `all` pour la valeur de `acks` (au lieu de `1` par défaut), et au moins `2` `pour min.insync.replicas` (au lieu de `1` par défaut) avec un replication factor d’au moins `3`.
  - Si on est dans des cas où la perte de données est tolérable, alors on pourra diminuer ces contraintes.

## 14 - Data Retention

- Les données de chaque partition sont par défaut dans des dossiers de la forme `/tmp/kafka-logs/getting-started-0/`.
  - Le dossier contient un fichier nommé `leader-epoch-checkpoint`, qui contient toutes les réassignation de leader pour la partition. De cette manière, chaque réplicat peut ignorer les messages d’un collègue broker qui se prendrait pour le leader de la partition sans l’être.
  - Le contenu des records se trouve dans fichiers nommés selon le 1er offset du record qu’ils ont, avec l’extension `.log`.
  - Chaque fichier de log a un index nommé de la même manière mais avec une extension `.index`. Il contient un map entre les offsets des records (ou des batchs) du fichier de log, et l’offset physique dans le fichier de log pour aller les lire.
  - On a enfin un autre fichier nommé pareil mais avec l’extension `.timeindex`, et qui contient un map entre des timestamps des records et l’offset physique dans le fichier de log.
- Kafka a des propriétés configurables, liées à la taille des fichiers de log et à leur ancienneté, pour contrôler le moment où on **switch au fichier suivant** pour écrire.
  - Par exemple `log.segment.bytes` (par défaut 1 GB), `log.roll.hours` (par défaut 1 semaine).
  - On peut aussi configurer un temps aléatoire de décalage du switch, pour que l’ensemble des partitions ne changent pas de fichier de log en même temps.
- Les fichiers d’index ont une place pré-allouée, dont la taille est contrôlable par une propriété.
  - On peut de la même manière activer la pré-allocation des fichiers de log, pour gagner en performance sur certains filesystems.
- Le script `kafka-dump-log.sh` dans les outils d’admin de Kafka permet de lire le contenu des fichiers qui composent les logs.
- Il existe des **cleanup policies** qui sont de deux types : supprimer les anciens records, ou faire de la compaction pour gagner en place.
  - **log.cleanup.policy** permet de contrôler le type de policy, cross-topic ou pour un topic spécifique.
    - Par défaut la valeur est `delete`, l’autre valeur étant `compact`. On peut spécifier les deux en même temps, en les séparant par une virgule.
  - Le cleanup ne s’applique qu’aux fichiers de log **inactifs**, c'est-à-dire les fichiers de log dont on a déjà switché vers un autre fichier.
  - Quand la policy est **delete**.
    - Un background process va régulièrement (toutes les `log.retention.check.interval.ms`, par défaut 5 minutes) vérifier pour chaque fichier de log inactif s’il est sujet à être supprimé ou non, en fonction des règles de rétention configurées (par exemple `log.retention.bytes` (non configuré par défaut), `log.retention.hours` (par défaut 1 semaine)).
    - Avec les valeurs par défaut, un fichier de log sera supprimé au bout d’1 semaine. Par contre, il sera supprimé d’un coup. Donc si on n’avait qu’un seul fichier qui n’avait pas atteint la taille d’1 GB pour switch de fichier avant les 1 semaine, on va perdre tous les records d’un coup, et écrire les nouveaux dans un nouveau fichier.
      - Si on veut une plus grande granularité, on peut configurer de plus petites valeurs pour pour le switch de fichier de log actif (`log.segment.bytes` ou `log.roll.hours`).
  - Quand la policy est **compact**.
    - La compaction est utile par exemple dans le cas où on a des **events de type ECST** (l’auteur ne mentionne pas le terme).
      - Normalement il faut une logique en deux temps : hydrater notre app downstream avec les données de l’app upstream, puis laisser l’app upstream publier ses changements sur Kafka.
      - Pour éviter d’avoir ce fonctionnement en deux temps, la compaction permet de publier dès le début les ECST dans Kafka, et de ne pas avoir besoin de l’autre mode puisque **Kafka gardera toujours au moins le record le plus récent pour chaque entité**.
      - Par contre ça ne marche qu’avec les events qui ont la totalité de la donnée de l’entité et qui donc “déprécient” les events précédents pour cette entité. Ça ne marche pas avec les events qui indiquent seulement les champs qui ont changé dans l’entité.
    - La compaction consiste à transformer Kafka en snapshot, où on ne garde que les données les plus récentes pour chaque entité, qu’on **différencie par la key** associée au record.
      - La lecture de l’ensemble du topic prendra donc un temps proportionnel au nombre de keys différents dont il existe des records.
    - D’un point de vue technique, la compaction est faite par des threads en arrière plan.
      - Côté config :
        - Leur nombre est contrôlé par `log.cleaner.threads`, par défaut `1`.
        - `log.cleaner.min.cleanable.ratio` (par défaut `0.5`) indique le ratio de log “sale“ à partir duquel il sera éligible à être compacté.
        - `log.cleaner.min.compaction.lag.ms` (par défaut `0`) permet d’indiquer un temps minimal avant qu’un record ne puisse faire l’objet de compaction. Sachant que ça ne peut pas concerner le fichier de log _actif_, mais seulement ceux où il y a déjà eu un switch de fichier.
        - `log.cleaner.min.compaction.lag.ms` (par défaut infini) permet d’indiquer un temps maximal à partir duquel le log sera quand même compacté, même s’il ne satisfaisait pas le ratio de “saleté”.
        - `log.cleaner.delete.retention.ms` (par défaut 24 heures) indique la durée de vie des _tombstones_.
        - On peut aussi définir ces configs par topic (sauf pour le nombre de threads de compaction).
      - Pour calculer le **ratio de “saleté”**, Kafka maintient un _cleaner point_ correspondant au point jusqu’où la compaction a déjà été faite, pour chaque fichier de log.
        - Le ratio consiste à diviser le nombre de records pas encore traités par le nombre de records existants dans la partie déjà traitée.
      - La compaction laisse les records **dans le même ordre**, et **ne change pas leur offset**. Elle va juste éliminer des records.
      - Les **tombstones** sont créés par les producers pour indiquer à Kafka que les entités d’une key particulière ne sont plus utiles.
        - Ce sont simplement des records, avec une valeur nulle, et la key pour laquelle on veut faire la suppression.
        - La raison pour laquelle ils restent un temps minimal (par défaut 24h) est de s’assurer que les consumers ont eu le temps d’avoir l’info de suppression du record, pour éviter qu’ils gardent l’entité en base alors qu’elle n’est plus censée exister.
  - On peut aussi **combiner compaction et deletion**.
    - Cette possibilité est utile dans des cas particuliers où les events perdent rapidement leur intérêt.
      - On peut alors potentiellement avoir une compaction plus agressive vu qu’on limite la taille des records en supprimant les plus anciens.
    - Un exemple peut être le topic `__consumer_offsets` qui compacte pour que le group coordinator puisse rapidement reconstruire l’état des consumers, et supprime les anciens offsets pour les groupes qui n’ont pas été actifs depuis longtemps pour éviter de trop grossir.
