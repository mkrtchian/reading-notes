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

### 7 - Coaching Situations Illustrated with Stories

- Quelques exemples de **situations où un coach Samman peut intervenir** :
  - Un _navigator_ est hésitant et n’arrive pas à avancer, le coach lui pose la question “**Que devrions-nous faire maintenant ?**”
    - Si le _navigator_ ne sait toujours pas, le coach essaye de poser des questions pour l'aiguiller, par exemple “A quelle étape du TDD sommes-nous ?”, “Quel scénario nous reste-t-il ?”.
  - Un _navigator_ est hésitant et n’arrive pas à avancer, le coach **fait appel à l’équipe**.
    - Si le _navigator_ n’y arrive pas du tout, le coach peut donner le rôle de _navigator_ à une autre personne, puis le redonner à la personne qui n’y arrivait pas au tour d’après.
  - L’équipe est bloquée suite à un désaccord, le coach propose à l’équipe de **réaliser des expérimentations** pour trancher collectivement.
    - Il s’agit d’être orienté vers l’action, avec du code écrit tout s’éclaircit.
    - Laisser l’équipe mener des expérimentations est une meilleure option que de trancher la question du haut de sa stature de coach.
  - L’équipe commence l’écriture de code, mais a besoin de créer des scénarios pour commencer, le coach **facilite la découverte des scénarios** en posant des questions et laissant les membres de l’équipe donner leurs idées.
    - Une telle session peut typiquement prendre 5 à 15 minutes, avant l’écriture du code en TDD, et permet de garder un cap pour savoir quel test écrire ensuite.
    - Ça peut être pas mal qu’un membre de l’équipe note les scénarios, ou les prenne en photo pour que l’équipe ne les perde pas.
  - Le _typist_ ne **comprend pas les instructions** du _navigator_, le coach aide le _navigator_ à être plus explicite.
    - Dans l’ordre, le navigator doit exprimer :
      - Son intention.
      - Puis si le typist ne comprend pas, indiquer la position sur l’écran où intervenir.
      - Et enfin si il ne voit toujours pas, indiquer des détails jusqu’à quoi taper caractère par caractère.
  - Le _navigator_ saute sur l’écriture du code sans test qui échoue, le coach lui **rappelle qu’il faut un test** en posant des questions.
  - Le _typist_ oublie d’**utiliser un raccourci clavier** pour aller plus vite, le coach l’aide en le lui rappelant, ou en le lui apprenant.
  - Le _navigator_ demande à déclarer une nouvelle fonction mais au changement, le _navigator_ suivant **ne sait plus à quoi elle servait**, le coach lui demande de revenir à l’endroit où elle doit être utilisée plutôt que là où elle est déclarée.
    - Cette technique s’appelle le **consume-first design**, et permet de mieux communiquer l’intention derrière le nouveau code, en partant du contexte d’utilisation.
  - Le _navigator_ demande à écrire du code et des tests en chaîne, le coach lui demande de compiler et jouer les tests pour **avoir du feedback plus souvent**.
  - Le _navigator_ enchaîne sur un autre test, du code ou un refactoring, le coach lui rappelle de **demander un commit** vu qu’un étape a été complétée.
  - Le _typist_ est **la seule personne de l’équipe qui connaît un sujet** et les autres n’arrivent pas à le guider, le coach demande à **quelqu’un d’autre de prendre le rôle de _typist_**, pour que l’information circule à travers plusieurs personnes.
  - L’équipe entière **ne connaît pas une partie du code**, le coach demande qui connait cette partie, et demande à cette personne si elle peut venir temporairement les aider.
    - Si ça arrive trop souvent, le coach en parle avec le manager pour trouver une solution plus pérenne.

### 8 - Retrospectives

- Chaque session de 2 heures doit contenir une **rétrospective de 15 minutes à la fin**, c’est l’occasion de réfléchir à comment améliorer les sessions suivantes.
- En tant que coach, il vaut mieux avoir des stylos, ou un template de rétro (pour le remote) déjà prêt.
- Il vaut mieux **varier les types de rétrospectives**, voilà des exemples :
  - On donne 5/10 minutes pour que chacun écrive des observations sur des post-its, puis on lit les observations à haute voix.
    - On peut marquer notre accord avec certains post-its.
    - Si un post-it donne lieu à une discussion trop longue, on la décale à plus tard.
  - On donne du temps pour que chacun écrive des post-its à propos de 3 catégories : “Ce que j’ai aimé”, “Ce que j’ai appris”, “Ce qui a manqué”.
    - Chacun lit ses post-its, ce qui peut donner lieu à de courtes discussions.
  - On demande à chacun de dire une chose qu’il a trouvé bonne pendant cette session, l’idée étant de favoriser les bons comportements.
- Le coach doit aussi faire une sorte de **rétrospective pour lui-même**, en écrivant de petites notes privées après chaque séance :
  - Noter où en étant l’équipe à la fin de la séance pour s'en rappeler la prochaine fois.
  - Noter des choses pour pouvoir faire un rapport au management à la fin.
  - Noter des décisions de design qui ont été prises, telle ou telle personne qu’on devrait encourager à parler, des éléments spécifiques qu’il faudrait travailler la prochaine fois.
- La rétrospective est une **compétence qui s’apprend**, à force de pratiquer, l’équipe va être de plus en plus attentive à ce qui se passe pour pointer ce qui va ou ne va pas.

### 9 - Remote Ensembles

- Il est important de **voir les visages** des membres de l’équipe, ça permet de véhiculer les émotions.
  - Si on en a la possibilité, ça peut être pas mal d’avoir le code sur un écran, et les visages sur un autre écran pour pouvoir alterner entre les deux souvent.
- La **prise de parole doit être régulée** consciencieusement.
  - Il faut faire attention à ce que les gens ne se parlent pas l’un par dessus l’autre, et modérer leurs interventions en particulier s’ils ne sont ni _navigator_ ni _typist_.
  - On peut demander à lever la main si le besoin s’en fait ressentir.
  - Si un sous-groupe veut avoir une discussion à côté, ils peuvent soit le faire dans le chat, soit le partager avec tout le groupe.
- Il faut absolument **faire les pauses**, elles sont d’autant plus nécessaires en remote.
- Dans le cas où on ne dispose pas d’outil collaboratif en direct comme VSCode LiveShare, on peut utiliser une branche commune où chaque _typist_ commit et push, puis le suivant pull et commit par dessus avant de push etc.
  - Dans le cas où le processus de changement de typist deviendrait trop lent, il vaut mieux **garder un rythme de changement de _navigator_ élevé**, et diminuer seulement le rythme de changement de _typist_.
- Dans le cas où on aurait des problèmes de réseau, le bon compromis est de faire en sorte que **le _typist_ n’ait pas de lag vis-à-vis de l’éditeur**, et que le lag soit plutôt entre l’éditeur et les non-_typists_.
- Pendant les phases de discussions de design, l’équipe a besoin d’un outil graphique pour représenter des schémas. Ça peut être une personne qui dessine en local, ou encore un outil collaboratif si ça marche par rapport au réseau.
  - Même chose pour les rétrospectives : il y a les outils collaboratifs qui peuvent poser des problèmes de réseau, et sinon il y a soit le chat, soit les outils locaux.
