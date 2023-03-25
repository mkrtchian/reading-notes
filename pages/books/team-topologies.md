# Team Topologies

## 1 - The Problem with Org Charts

- La plupart des organisations utilisent l’**organigramme** de l’entreprise pour représenter les intéractions et la division du travail.
  - Mais dans la réalité une telle représentation ne peut pas tenir, et les gens contactent ceux qu’ils ont besoin de contacter pour mener à bien leur tâches.
  - On pourrait comparer ça à un document d’architecture, qui devient obsolète dès qu’il est écrit.
- La manière de voir les organisations évolue :
  - Le livre **_Improving Performance_** de Geary Rummler et Alan Brache pose une première étape d’amélioration continue du business.
  - Le livre **_Project to Product_** de Mik Kersten va un cran plus loin en mettant l’accent sur le produit, et la centralité des équipes.
  - **_Team Topologies_** se veut être une étape de plus dans cette direction.
- Niels Pflaeging, dans **_Organize for Complexity_**, :
  - Identifie 3 structures dans l’organisation :
    - **Formal structure** : l’organigramme.
    - **Informal structure **: le domaine d’influence entre individus.
    - **Value creation structure **: la manière concrète dont le travail se fait, basé sur les relations au sein de l’équipe et entre équipes.
  - Lui et d’autres auteurs comme Frédéric Laloux, ou Brian Robertson (Holacracy), pensent que le point de plus important dans les organisations est le lien entre _informal structure_ et _value creation structure_.
  - Ce livre propose d’aller dans le même sens : **renforcer la cohésion au sein de l’équipe** en la rendant autonome, et **améliorer la confiance inter-équipe** en clarifiant les interactions attendues.
- Ce livre s’appuie sur la **loi de Conway** :
  - Mel Conway avait fait un article de 1968, finissant par dire que le design des systèmes produits par les organisations étaient des **copies de leur structure de communication**.
  - Conway parle bien de la communication réelle, c’est-à-dire de la _value creation structure_ (au sens de Pfaeging).
  - Quand l’architecture voulue est en contradiction avec la structure de l’organisation, l’un des deux est amené à changer.
  - A l’inverse, James Lewis a eu l’idée de mettre en œuvre une “_reverse Conway maneuver_”, où il s’agit de mettre en place une organisation spécifique qui permet l’émergence de l’architecture voulue.
- La **charge cognitive** d’une équipe a tendance à grossir avec le temps.
  - Si on veut que l’équipe puisse être efficace et motivée, il faut la limiter explicitement.
- Traiter le développement logiciel comme une sorte d’usine mène à des équipes inefficaces et démotivées.
  - Les mouvements Agile, Lean et DevOps offrent une solution au travers des équipes autonomes, travaillant itérativement avec les feedbacks de l’utilisateur.

## 2 - Conway’s Law and Why it Matters

- La loi de Conway a été depuis confirmée par de nombreuses études, y compris dans des industries différentes (automobile, aviation etc.).
- La version moderne de cette loi se résume à une citation de Ruth Malan : **“If the architecture of the system and the architecture of the organization are at odds, the architecture of the organization wins”**.
  - Une organisation qui est organisée en silos techniques (équipes QA, DBA, sécurité etc.) ne pourra pas produire de système architecturé pour l’optimisation du flow.
  - Autre exemple : une organisation qui s’organise principalement autour de la vente dans des régions géographiques a peu de chances de mettre en place une architecture logicielle globale qui fournit des services à toutes les régions.
- Le **Reverse Conway Maneuver** est une pratique qui fonctionne.
  - Les recherches menées par les auteurs d’**_Accelerate_** montrent que c’est efficace.
  - Le but c’est de transformer l’organisation pour créer un contexte où le travail peut être fait de bout en bout, sans avoir besoin d’une communication inter-équipe importante.
  - Par exemple, si on a 4 équipes de devs back et front, qui transfèrent le travail à une unique équipe DBA, on va obtenir 4 applications back/front, et une seule DB centralisée.
    - Dans le cas où on voudrait une DB par app, on peut dissoudre l’équipe DBA, et intégrer ses membres aux 4 équipes.
    - La tendance naturelle va être l’émergence de l’architecture qu’on voulait.
- Il faut concevoir l’architecture des systèmes de manière à obtenir des **modules de la taille d’une équipe**.
- La structuration de l’organisation nécessite des compétences techniques.
  - Il faut au minimum impliquer des personnes techniques (qui comprennent les notions d’abstraction, encapsulation etc.) dans le choix du type d’équipes, de leur scope etc.
  - Selon Ruth Malan : “_If we have managers deciding which service will be built, by which teams, we implicitly have managers deciding on the system architecture_”.
  - Selon Allan Kelly, une personne se disant **architecte** doit avoir des compétences techniques, mais aussi de management.
- Il faut **limiter la communication non nécessaire entre équipes**.
  - Il faut définir les patterns de communication entre équipes, en fonction de l’architecture du système qu’on veut mettre en place.
    - Si les équipes communiquent en dehors de ces canaux, alors c’est qu’il y a sans doute quelque chose qui ne va pas : mauvaise API ? Composants mal agencés ou manquants ? etc.
    - On peut monitorer le volume de communication en ligne pour vérifier que les patterns de communication sont les bons.
  - Si deux équipes communiquent juste parce que leur code se trouve dans un dépôt commun ou une application commune, alors on peut les séparer en utilisant les _fracture plane patterns_ (chapitre 6).
- La gestion des **outils** peut aider à respecter les patterns de communication :
  - Il faut des outils partagés entre équipes qui collaborent, et des outils séparés entre équipes indépendantes.
- Certaines entreprises font l’erreur d’avoir de nombreuses équipes chargées de petites parties du système (des complicated subsystem teams). Ça doit rester une exception, et la norme doit être les équipes alignées sur le flow.
- Les réorganisations régulières pour réduire les effectifs ou pour donner des postes à la hiérarchie de management sont incompatibles avec une organisation basée sur la loi de Conway, la notion de cognitive load etc.
