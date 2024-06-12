# Technical Agile Coaching with the Samman Method

### 1 - Introduction

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

### 2 - The purpose of Samman Coaching

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

### 3 - Ensemble Primer

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

### 4 - Let the Ensemble give you Superpowers

- Parmi les avantages de l’_ensemble programming_ :
  - L’équipe entière est responsable du code, et **s’aligne sur les pratiques** de code.
  - **La connaissance se diffuse** à une vitesse incroyable : si un des membre sait faire quelque chose, très peu de temps après tous sauront le faire.
    - Exemple : si une configuration Kubernetes doit être faite et qu’une personne a des connaissances sur ça, elle dit quoi faire au _typist_, les autres posent des questions, et la prochaine fois ils sauront aussi le faire.
  - L’**onboarding** est hyper rapide : l’équipe ne fait que parler de ce qu’elle fait en expliquant en permanence les détails, donc un nouveau développeur peut rentrer dans le bain en très peu de temps.
- Le coach se comporte comme un visiteur quand il rejoint une équipe qui fonctionne en _ensemble programming_ de manière fluide : il s’insère rapidement et commence à contribuer comme les autres, en suggérant des opportunités de refactoring, de patterns de design etc.
  - **La 1ère étape est donc d’aider l’équipe à fonctionner en tant qu’_ensemble_** de manière fluide. C’est là que le coach pourra contribuer le mieux sur l’aspect technique.

### 5 - Coaching Behaviors in an Ensemble

- Pendant les moments d’_ensemble programming_, le coach va alterner entre différents comportements.
  - **Enseigner** : à certains moments, quand l’équipe est confrontée à une technique qu’elle ne connaît pas, le coach peut prendre quelques minutes pour expliquer le concept, avant de retourner au code avec l’équipe.
    - Ca peut être par exemple un cas où _extract method object_ serait adapté, mais l’équipe ne connaît qu’_extract method_. On va alors sur le site de Fowler pour expliquer la technique en question, on en fait une petite démonstration sous forme de kata, puis on l’applique dans le code de production en guidant tant que _navigator_.
  - **Mentorer** : pour les techniques où l’équipe a déjà une première expérience, mais où elle n’est pas encore complètement à l’aise, le coach va proposer un guidage.
    - A mesure que l’équipe devient à l’aise, le coach va intervenir de moins en moins en tant que _navigator_, et ne donner que des petites indications.
    - Tant que l’équipe progresse, le coach les laisse faire.
  - **Faciliter** : dans certains cas le coach adopte un rôle neutre pour aider une solution à aboutir.
    - Par exemple, si deux solutions de design sont proposées par l’équipe, il les aide à essayer la première, puis la deuxième, et enfin à faire un choix.
  - **Coacher** : dans le cas où l’équipe a déjà la connaissance théorique et pratique sur un sujet, mais a besoin d’un petit coup de pouce pour embrayer sur une technique, le coach peut utiliser une **question de coaching** pour aiguiller.
    - Ca peut par exemple être quand un _navigator_ est coincé parce qu’il ne sait pas quel test écrire, en lui demandant quel serait le prochain scénario.
    - Si ces petites questions ne marchent pas, le coach revient sur du mentoring, voire même une petite session d’enseignement.
  - **Observer** : si l’équipe avance bien, le coach peut se mettre en retrait et noter des choses, qu’il pourra communiquer à l’équipe par la suite.
  - **Prendre des pauses** : le coach peut, comme les autres membres, prendre des pauses à tout moment et laisser les autres continuer.
    - Emily conseille aussi au moins une pause collective pour couper la session de 2 heures en deux, et une pause à la fin si elle enchaîne avec une autre équipe.
- La session doit se terminer par 15 à 25 minutes de **rétrospective**, où l’équipe et le coach parlent de la session pour essayer de prendre conscience de ce qu’ils ont fait, ce qu’ils ont appris, les points d’amélioration etc.

### 6 - Kindness, Consideration and Respect

- Le rôle du coach est de veiller à ce que les membres de l’_ensemble_ soient respectueux les uns envers les autres.
  - D’ailleurs la recherche montre que traiter les autres avec gentillesse fait qu’on les aime par la suite davantage, plutôt que dans le sens inverse.
- Plutôt que de **critiquer le code** legacy qu’on améliore, il vaut mieux partir du principe que la personne qui l’a écrit a fait de son mieux, en particulier si elle est présente, pour ne pas la rabaisser.
- Une règle générale est de **construire par dessus** ce que les autres navigateurs ont fait plutôt que de refaire. On dit “Oui, et …”.
- Quand les relations s’enveniment, il faut marquer une pause, laisser chacun aller se calmer avant de reprendre.
  - Au besoin, il pourra être nécessaire de traiter le sujet en dehors, avec des 1&1.
- **Le typist doit écouter les instructions qu’on lui donne**, sinon il n’y aura pas d’ownership collectif de ce qui est fait de la part de l’équipe. Il faut donc s’assurer que ce soit le cas, et au besoin rappeler au _typist_ qu’il doit être à l’écoute et non pas à l’initiative.
- Ne pas hésiter à pointer ce qu’un des contributeurs un peu timide dit de pertinent, pour marquer que ce que dit chacun est important.
- Quand certains membres se distraient et commencent à faire autre chose, le mieux est d’**augmenter la vitesse de rotation** pour qu’ils soient _navigator_ plus souvent.
- Dans le cas où une personne dit ou fait quelque chose d’inacceptable qui ne peut pas attendre la rétrospective, il faut le recadrer : “nous ne faisons pas ça ici”.
  - Dans le cas où il dirait que c’était une blague, on peut rétorquer : “Oui j’en suis sûr, mais nous ne faisons pas ça ici”.
