# Accelerate

### Preface

- Les auteurs ont collecté des données de plus de **2000 organisations différentes**, de **toutes tailles** (de la startup à la grande entreprise) et de tous les domaines.
- Nicole a un background plus académique, alors que Jez et Gene ont un background plus ancré dans le développement logiciel.
- Entre 2014 et 2017, les 3 auteurs ont mené une recherche sur l’efficacité des organisations qui font du logiciel, en publiant chaque année le _State of DevOps Report_. Ce livre résume leurs découvertes.
- Ils ont principalement **utilisé des sondages** pour collecter leur donnée, et renvoient à la partie II de ce livre pour montrer en quoi leur méthode **permet une recherche scientifique**.
- Ce qu’ils ont fait chaque année :
  - 2014 :
    - Ils ont eu une approche plutôt exploratoire, en essayant de savoir quelles étaient les caractéristiques de la delivery logicielle dans les organisations, et ce qui l’impactait.
    - Ils ont découvert que :
      - Le _throughput_ et la stabilité allaient ensemble.
      - La capacité à faire de la bonne delivery avait un impact sur la profitabilité de l’entreprise.
      - La culture et les pratiques techniques avaient un impact.
    - Ils ont fait évoluer la méthode de collecte de résultats pour avoir des éléments plus précis.
  - 2015 :
    - Ils ont confirmé les résultats de 2014, et les ont poussés plus loin.
  - 2016 :
    - Ils ont plus particulièrement exploré les pratiques techniques et leur impact, et la partie project management (l’impact des pratiques lean notamment).
  - 2017 :
    - Ils ont creusé le rôle de l’architecture, du leadership de transformation, et ont inclus les organisations à but non lucratif.

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
  - 1 - Le** delivery lead time**.
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
