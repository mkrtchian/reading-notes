# Outcomes Over Output

## 1 - What are outcomes ?

- L’auteur a travaillé dans une entreprise de trading qui avait besoin de diversifier son offre. Le CEO a proposé de travailler sur une nouvelle app, mais au bout de 2 ans le projet a été abandonné sans avoir apporté de valeur : c’était le mauvais output.
  - Ils auraient pourtant pu changer de cap pour faire des choses qui apportaient de la valeur beaucoup plus vite, mais sont restés sur un more waterfall.
- La raison pour laquelle on est obsédé par la réalisation de tâches est liée à l’ère industrielle où il fallait réaliser des objets qui étaient vendus une fois prêts.
  - Cette approche ne marche pas avec le logiciel parce qu’**une feature peut très bien n’apporter aucune valeur**.
  - Exemple : les popups qui invitent à s’inscrire à une newsletter fonctionnent techniquement, mais n’apportent pas de valeur parce que les gens s’en vont.
  - Il faut donc se concentrer sur le fait d’apporter de la valeur, avec le moins de features possibles : c’est le principe des _outcomes_.
- Définitions utilisées dans ce livre :
  - **Un outcome est un changement dans le comportement d’un être humain qui amène des résultats business**.
  - L’_impact_ caractérise les résultats business en question.
  - L’_output_ représente les éléments concrets qui ont été mis en place pour provoquer l’_outcome_.
- Du point de vue des managers :
  - Si on demande à une équipe de réaliser un _impact_, ce sera trop abstrait, et le résultat de trop de facteurs pour qu’ils puissent suivre leur avancement.
  - Si on leur demande de se concentrer sur un _output_, ils seront limités dans leur créativité et l’output risque de ne pas apporter de valeur.
  - C’est pour ça qu’il faut leur proposer de travailler sur un _outcome_ : ils pourront trouver des solutions et mesurer la valeur qu’ils apportent.
- L’auteur propose d’étendre le premier principe agile qui dit qu’il faut délivrer un logiciel de valeur en continu en parlant de _délivrer de la valeur en continu_.
  - Il propose l’_outcome_ comme définition de la valeur : il faut donc **faire avancer nos outcomes en continu**.
- L’autre outil complémentaire de l’_outcome_ c’est **l’expérimentation**. En réalisant de petites expérimentations pour essayer de faire avancer l’_outcome_, on réalise un projet agile.
  - Pour l’auteur, le MVP n’est rien d’autre qu’une expérimentation.

## 2 - Using outcomes

- Les êtres humains dont le comportement vise à être modifié par un _outcome_ peuvent être **les clients externes, tout comme des employés internes à l’entreprise**. Tant qu’on a une modification de comportement qui amène un impact business on est bon.
- Les _impacts_ sont constitués de la somme d’un grand nombre d’_outcomes_.
- Exemple de recherche d’outcome : on a un _impact_ qui est de passer d’une visite des clients sur le site web d’une fois par mois à deux fois par mois. On va chercher quel **comportement plus spécifique** peut les **faire venir** plus souvent.
  - Si on sait qu’ils visitent le site après avoir ouvert la newsletter, on peut choisir comme _outcome_ de les faire ouvrir la newsletter plus souvent.
  - Si on sait qu’ils visitent le site après un partage d’un élément de notre entreprise de la part d’un de leurs amis sur un réseau social, on peut choisir comme _outcome_ de faire en sorte que nos contenus soient plus partagés sur les réseaux sociaux.
- Vu que les _outcomes_ sont des comportements humains, ils sont **mesurables** facilement.
- L’outcome doit idéalement être un **leading indicator**, c’est-à-dire que l’action mesurée va déclencher un _impact_ plus important. Elle vient avant, et donc permet de **prédire** l’_impact_.
- En général on n’est pas sûr qu’un _outcome_ donné permet de driver un _impact_. Il faut alors poser les **hypothèses** pour que ce soit vrai.
  - Le mouvement **_Lean Startup_** propose un cadre pour formuler ces hypothèses. Il s’agit de **(1) poser ce qu’on croit**, et **(2) les preuves qu’on cherche** pour être sûr que c’est vrai.
  - Exemple :
    - 1 - On pense que partager des contenus de l’entreprise sur des réseaux sociaux provoque un afflux plus important de nos clients sur notre site.
    - 2 - Nous saurons que c’est vrai quand nous constaterons une corrélation entre les partages sur les réseaux et l’afflux sur le site.
  - Pour vérifier notre hypothèse, on va mener des expérimentations. L’une des manières de le faire est de réaliser un MVP, c’est-à-dire **la plus petite feature pouvant prouver que notre hypothèse est vraie**.
- Il y a **3 magic questions** à se poser pour traiter les _outcomes_ :
  - 1 - Quels sont les comportements utilisateurs qui drivent des résultats business ?
    - Il s’agit de chercher l’_outcome_.
    - On va naturellement se concentrer sur l’utilisateur, et chercher à comprendre ce qui le motive, ses besoins, ses problèmes.
    - On va donc dès le départ partir de l’utilisateur plutôt que de partir des features qu’on avait en tête : il s’agit d’un shift sur l’approche.
  - 2 - Comment faire en sorte que ces utilisateurs aient plus de ces comportements ?
    - Il s’agit de faire avancer l’_outcome_ choisi.
    - Vu qu’on se concentre sur l’utilisateur tout au long, on peut imaginer diverses features, et même des actions qui ne sont pas des features : notre pricing, notre positionnement, notre manière d’interagir avec eux etc.
  - 3 - Comment savoir si on a raison ?
    - Il s’agit de faire le lien entre _outcome_ et _impact_.
    - Il faut lister ce qu’on sait et ce qui nous manque, et trouver des moyens de tester ce qui nous manque.
- Les leaders et les subordonnés n’arrivent en général pas à se comprendre parce qu’ils pensent à différents niveaux d’abstraction : les _impacts_ pour les leaders et les _outputs_ pour les subordonnés.
  - Le solution est d’introduire la notion intermédiaire d’_outcome_, qui permet à la fois aux leaders de comprendre le lien avec l’_impact_, et aux subordonnés d’en dériver des _outputs_.
  - Les _outcomes_ permettent de faciliter le suivi de l’avancement des deux côtés.
- Pour commencer à utiliser les _outcomes_ dans un système où on mesure les outputs, on peut chercher les comportements utilisateur modifiés par ces features, et se concentrer sur leur mesure.
  - Ça va pousser les développeurs à délivrer de la valeur de manière plus incrémentale, pour faire avancer l’_outcome_.
  - C’est en particulier vrai pour les initiatives de refonte internes qui ont tendance à être suivies par l’empilement des _outputs_ plutôt que par la recherche de valeur incrémentale.
- Les OKR sont souvent mal utilisés, parce qu’on part des _outputs_ qu’on a déjà en tête, et qu’on essaye de les exprimer dans le langage OKR, alors que **leur but est de laisser les outputs ouverts** pour pouvoir expérimenter et itérer.
  - La bonne manière d’être sûr d’obtenir de bons OKR est d’**exprimer les KR sous forme d’_outcome_**.
