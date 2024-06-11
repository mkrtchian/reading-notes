# Technical Agile Coaching with the Samman Method

## 1 - Introduction

- La méthode **Samman** consiste, pour un coach technique, à améliorer le niveau technique de plusieurs équipes en même temps, en divisant son temps en :
  - 1 - **Learning hours**, où l’équipe apprend des techniques par des exercices pratiques sous forme de katas.
  - 2 - **Ensemble working**, où l’équipe applique ce qui a été appris sur le code de production, accompagnée par le coach.
- Emily cite notamment **le TDD et le refactoring** comme deux piliers de son coaching technique.
- Le fait que les compétences techniques de l’équipe permettent une performance de l’organisation est appuyé par exemple par la recherche expliquée dans **_Accelerate_**.
- Une **journée classique** pour un coach technique comme emily consiste en :
  - 1 heure de _learning hour_ avec deux équipes en même temps.
  - 2 heures d’_ensemble working_ avec chaque équipe (donc 4 heures).
  - Le reste est partagé entre de la préparation et de la communication.
- D’une certaine manière, le coach technique qui pratique la méthode Samman a le privilège de faire du mob programming pour l’essentiel de son temps.

## 2 - The purpose of Samman Coaching

- Parmi les éléments techniques qu’Emily apprend aux équipes, il y a :
  - Les **tests unitaires**, et la manière d’en écrire de bons.
  - L’**intégration continue**, qui est une des techniques dont l’efficacité fait consensus.
    - On parle bien d’intégrer le plus souvent possible, avec pour objectif d’arriver à des incréments de quelques heures.
  - Le **refactoring du code legacy**, avec des techniques à base d’ajout de tests pour traiter le code sans avoir à le réécrire entièrement.
  - Le **design incrémental**, avec la capacité à savoir quand changer le design au cours du développement, quels design patterns appliquer.
- Les techniques de développement ne peuvent marcher que si **l’ensemble de l’équipe les applique**. C’est pour ça que l’apprentissage et la mise en place des pratiques se fait avec l’équipe entière.
- En 10 à 20 jours de coaching, les équipes acquièrent une compréhension des techniques fondamentales de développement, et du fait que le développement itératif permet une plus grande efficacité.
  - Par la suite, il s’agit d’augmenter leurs compétences générales de code et de design, et d’ancrer un changement culturel.
- Parmi les éléments à **mesurer** pour prouver l’efficacité du coaching :
  - Au départ, on peut mesurer l’enthousiasme des développeurs par des sondages, le nombre de tests écrits, la fréquence d’intégrations du code.
  - Par la suite, on peut mesurer les deadlines mieux tenues, les bugs moins fréquents.
  - Attention au fétichisme de la mesure, il faut malgré tout discuter avec les gens, et vérifier que les mesures qu’on obtient ont l’air cohérents.

## Part I - Ensemble Working

- Emily reprend le concept de _mob programming_ de Woody Zuil, et change quelques termes pour plus de clarté :
  - **ensemble programming** au lieu de _mob_ pour insister sur l’aspect collaboratif.
  - **Typist** au lieu de _driver_ pour bien insister sur l’aspect non décisionnaire de la personne qui a le clavier.

## 3 - Ensemble Primer

- L’_ensemble programming_ utilisé dans la méthode Samman a les rôles suivants :
  - Le **typist** est la seule personne qui écrit au clavier.
    - Elle ne décide pas de ce qu’elle fait, elle doit écouter les autres membres de l’équipe, et en particulier le _navigator_.
  - Le **navigator** représente l’ensemble de de l’équipe qui n’écrit pas, et guide le _typist_ dans ce qu’il faut faire.
  - Les **team-members** participent en intervenant quand ils ont une suggestion, une question ou toute autre intervention qu’ils jugent pertinente.
  - (optionnel) Le **facilitator** veille à ce que les rôles soient correctement tenus et qu’il y ait une rotation, et que la collaboration se passe bien. Son rôle peut devenir non nécessaire avec le temps.
  - (optionnel) Le **researcher** se détache de temps en temps pour chercher quelque chose de spécifique, et laisser le groupe avancer. Dès qu’il a trouvé, il revient vers le groupe pour partager sa trouvaille.
  - (optionnel) L’**archivist** écrit les décisions du groupe pour en garder une trace. Il peut aussi écrire l’objectif actuel du groupe, et tenir une liste de choses à faire que le groupe met de côté momentanément.
- Il y a régulièrement des phases de discussion, auquel cas les rôles sont suspendus, et l’ensemble des participants peuvent exprimer leurs idées sur un tableau.
- Les rôles tournent régulièrement, souvent avec l’aide d’un outil automatisé qui indique quand tourner.
  - En général la bonne idée c’est que le _navigator_ courant devienne le _typist_.
