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
