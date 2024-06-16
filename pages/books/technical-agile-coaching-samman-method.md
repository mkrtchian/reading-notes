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

## Part II - Learning Hours

- Emily conseille de créer ses propres supports d’apprentissage. Et même si on s’inspire de supports existants, il faut se les personnaliser pour se les approprier.

### 10 - Explaining Why you should hold a Learning Hour

- L’idée que **l’apprentissage doit se faire au travail** plutôt que sur son temps libre n’est pas forcément partagée par tous. Emily donne quelques arguments pour défendre le fait qu’il faille passer 1 heure par jour de son temps de travail en apprentissage.
  - Les développeurs doivent apprendre tout au long de leur carrière, sinon ils vont rester peu efficaces malgré l’expérience, et même finir par avoir des connaissances datées.
  - **Faire une heure d’apprentissage par jour permet de normaliser la pratique** sous forme d’habitude, et d’être sûr de globalement ne pas la louper en cas d’absence.
  - Le fait que le temps d’apprentissage soit très régulier permet de mettre en pratique sur le code de production entre chaque petite session d’apprentissage.
- Quand on sait programmer mais qu’on ne connaît pas le TDD, **apprendre le TDD va faire perdre du temps au début** le temps de le maîtriser, **puis permettra d’aller bien plus vite**.
  - C’est comme apprendre une nouvelle technique de ski : on connaît le chasse neige qui nous permet d’avancer mais qui n’est pas très performant, mais quand on apprend la nouvelle technique plus performante, au début on est plus lent qu’avec le chasse neige, et c’est seulement après plusieurs essais qu’on accélère.
  - Il ne faut surtout pas abandonner dès le début, sinon on restera avec la technique initiale qui est peu performante même si on la maîtrise déjà.
  - Le fait d’avoir un groupe et un coach, et de s'entraîner d’abord sur des katas avant de passer au code de production, permet d’avancer pas à pas et d’avoir moins de risques d’abandonner.
- Emily fait en général les _learning hours_ avec les équipes qu’elle coach, et les donne parfois à plusieurs équipes en même temps quand elles partagent les mêmes problématiques techniques.
  - Elle conseille de laisser l’invitation ouverte pour des personnes extérieures à l’équipe, ou ayant des rôles non codeurs, et aussi aux futurs coachs qui veulent voir comment ça se passe.

### 11 - The Theory and Practice of Teaching and Learning

- L’objectif le plus important des sessions d’apprentissage est **dans quelle mesure les apprenants pourront mettre en pratique leur apprentissage**.
- Le coach doit d’abord parler aux membres de l’équipe, et jeter un œil à leur code, pour avoir une idée de leurs connaissances, et adapter les _learning hours_ en conséquence.
- Emily met en avant le **bloom model** pour l’apprentissage, créé par Benjamin Bloom dans les années 50.
  - Il met en avant 6 catégories d’apprentissages :
    - 1 - Se rappeler
    - 2 - Comprendre
    - 3 - Appliquer
    - 4 - Analyser
    - 5 - Evaluer
    - 6 - Créer
  - Chaque catégorie est **associée à un verbe**, par exemple si on veut avancer sur l’apprentissage de l’_approval testing_, on peut demander de :
    - Se rappeler : **Décrire** les caractéristiques de l’approval testing.
    - Comprendre : **Comparer** l’_approval testing_ et l’_assertion-based testing_.
    - Appliquer : **Utiliser** le framework d’approval testing pour écrire des tests.
  - On peut utiliser les catégories du _bloom model_ pour classer les objectifs d’apprentissage, en commençant par les 3 premiers, puis en passant aux 3 derniers une fois que les 3 premiers sont au point.
- Un autre modèle dont Emily s’inspire est le **4C model** de Sharon Bowman, qui met en avant que chaque personne vient avec son background et ses motivations, et que l’apprentissage doit l’utiliser pour s’y greffer.
  - Elle conseille le livre de l’auteur **_Training from the back of the Room_**.
  - Le modèle implique de diviser le cours en 4 parties :
    - **Connect** : rassembler les apprenants et les faire collaborer.
    - **Concept** : donner de nouvelles informations au groupe.
    - **Concrete** : pratiquer dans des exercices concrets.
    - **Conclusions** : laisser les apprenants consolider leurs connaissances.
- Shanon Bowman a aussi écrit le livre **_Using Brain Science to Make Training Stick_**, qui explique comment créer des cours efficaces pour l’apprentissage selon la science.
  - **Bouger est plus efficace que de rester assis**. Il faut idéalement faire en sorte que les élèves bougent toutes les 10/15 minutes, par exemple en faisant en sorte que le _typist_ doive s’asseoir sur une chaise particulière à chaque rotation.
    - En cas de session remote c’est plus compliqué de les faire bouger, il faut essayer de prendre au moins des pauses régulières.
  - **Parler est plus efficace qu’écouter**. Parler renforce la mémoire, et permet d’avoir du feedback. C’est typiquement ce qu’on fait en pair ou ensemble programming.
  - **Les images sont plus efficaces que les mots**. Il vaut mieux démontrer visuellement quelque chose que de l’expliquer.
    - Si on ajoute en plus des **émotions** aux images, la mémorisation sera d’autant plus efficace.
  - **Écrire est plus efficace que lire**. On se concentre beaucoup plus et on s’investit alors physiquement. On peut demander aux apprenants d’écrire des notes, des conclusions etc.
  - **Court est plus efficace que long**. Il vaut mieux diviser la _learning hour_ en morceaux de 10 à 20 minutes, ponctués de pauses de 1 à 2 minutes où le groupe fait autre chose, par exemple discuter ce qu’on vient de voir, poser des questions, noter des observations etc.
  - **Varié est plus efficace que constant**. Il faut varier les situations et les activités pour générer des émotions et créer de la surprise. Par exemple, en plein TDD en pair, on demande à tout le monde de passer au vert dans la minute, puis de s’échanger le code entre pairs.
- On peut **diviser les techniques en micro-compétences**, comme le fait de diviser le TDD en l’identification du prochain test, l'écriture d’un test, le refactoring etc. Et on peut alors **les travailler isolément**. On appelle ça la **deliberate practice**.
  - On va par exemple travailler la capacité à identifier de la duplication comme sous-compétence du refactoring, pour être ensuite plus efficace sur le TDD.
  - L’idée c’est d’identifier les micro-compétences sur lesquelles les élèves ont du mal, et les cibler spécifiquement.

### 12 - Sample Learning Hours

- Dans ce chapitre Emily propose des plans pour 10 _learning hours_ successifs autour de la thématique du TDD. Elle propose de les imprimer pour s’en inspirer.
- **1 - Travail incrémental en petites étapes**
  - Vu qu’il s’agit de la 1ère session, la partie _connect_ et le travail en pair sont importants.
  - On va expliquer le cycle du TDD, expliquer pourquoi on écrit les tests avant, et travailler sur une fondation pure toute simple.
  - Etapes :
    - Connect (10 mn) : on divise l’équipe en pairs, et on leur demande de discuter entre eux des avantages du TDD. Après 3 minutes chaque paire donne un avantage.
    - Concept (15 mn) : le coach prend la main, et montre comment coder un exemple simple en TDD (ici le kata Leap Years).
    - Concrete (20 mn) : on organise le groupe en paires ou en ensemble, et on leur demande de coder le même kata à leur tour en TDD.
    - Conclusions (10 mn) : on demande à l’équipe de synthétiser ce qu’ils ont compris du TDD en une phrase ou deux sur un post-it (ou dans un document partagé en ligne).
- **2 - Sélectionner et ordonner les tests**
  - On part du kata FizzBuzz, sans avoir la liste complète des tests à écrire.
  - On va expliquer pourquoi faire un cas d’usage “todo list”, le coder en TDD, et décrire la technique de triangulation.
  - Etapes :
    - Connect (5 mn) : on donne une liste d’étapes du TDD aux élèves, et on leur demande de mettre dans l’ordre. Après une minute, on leur demande d’échanger avec le voisin, et de comparer. Puis une minute de plus et on leur demande s’ils ont des questions.
    - Concrete (10 mn) : on explique le kata FizzBuzz, et on demande au groupe de donner une liste de tests à écrire.
      - Dans le cas où ils proposent une fonction impure qui affiche du texte, on leur dit qu’il vaut mieux une fonction pure qui retourne le texte et qui sera testable, puis dont le résultat sera affiché.
      - On leur demande dans quel ordre il faudrait implémenter ces tests.
    - Concept (10 mn) : on prend la main, et on montre comment implémenter quelques tests en TDD, en montrant la technique de la triangulation.
    - Conclusions (2 mn) : on demande au groupe de décrire ce qu’est la triangulation dans un document.
    - Concrete (30 mn) : on demande au groupe de se mettre en pairs, et de recoder le kata FizzBuzz, en alternant de navigator toutes les 4 minutes.
      - Si certains ont fini avant, on leur donne des règles plus complexes à implémenter.
    - Conclusions (5 mn) : les élèves se mettent en pairs, et discutent de ce qui a été facile ou difficile dans l’exercice, et ce qu’ils ont trouvé utile ou ont appris.
- **3 - La règle d’or du TDD**
  - Il s’agit dans cette séance d’essayer d’ancrer qu’il ne faut écrire du code de production que s’il vient faire fonctionner un test déjà existant, et donc ne designer que le code nécessaire et pas plus.
  - Etapes :
    - Connect (5 mn) : on demande au groupe de donner 5 choses à se souvenir à propos du TDD. L’une des personnes devrait parler de driver le code à partir des tests. On va s’appuyer sur ça pour la suite.
    - Concept (10 mn) : on introduit la règle d’or du TDD, on l’écrit quelque part et on l’encadre : **do not write any production code until you agave a failing test that requires it**.
    - Concrete (30 mn) : on met les gens en pairs, et on leur demande de faire le _Shopping Basket kata_. Ils doivent au moins constituer une todo list de tests, écrire un premier test, et du code. On leur demandera de le finir à la maison.
    - Conclusions (5 mn) : on demande au groupe de discuter de ce qu’il pense de cette règle en groupe ou en pairs.
- **4 - Le nommage des refactorings**
  - On va introduire le sujet du refactoring, avec pour but d’introduire la notion, parler de la liste des refactorings, et utiliser _extract function_.
  - Etapes :
    - Connect (5 mn) : on demande à chacun d’écrire le nom des refactorings qu’il connaît pour ensuite mettre en commun. Il est possible qu’ils n’en connaissent aucun, dans ce cas on va en donner certains qu’ils utilisent sans en connaître le nom, comme _rename variable_, _extract interface_.
    - Concept (5 mn) : on donne la définition du refactoring de Martin Fowler, en expliquant certains points.
    - Concrete (10 mn) : on demande au groupe de regarder le code du kata Tennis1, et de donner des idées de refactoring, en leur disant le nom de ces refactorings dans la dénomination de Fowler.
    - Concept (10 mn) : le coach démontre l’application d’_extract function_ sur le code de Tennis1.
    - Concrete (25 mn) : on demande au groupe de refaire ces extractions, et de continuer à améliorer le code s’ils ont du temps.
    - Conclusions (5 mn) : on demande au groupe de définir le refactoring, et d’écrire ce qu’ils en retiennent.
- **5 - Malentendus sur le refactoring**
  - Le but est de mieux comprendre le but du refactoring, et de voir le refactoring _rename variable_.
  - Etapes :
    - Connect (15 mn) : on prépare des propos controversés ou faux sur le refactoring, et on les présente au groupe. On leur demande de les discuter et de dire s’ils sont vrais ou faux.
    - Concept (5 mn) : on explique le but du refactoring qui est de faire en sorte que le code soit plus facile à comprendre et modifier. C’est aussi une technique centrale pour permettre le design incrémental.
    - Concrete (30 mn) : on demande au groupe de refactorer le code du kata Tennis3. On leur parlera de rename variable qu’ils vont sans doute utiliser.
    - Conclusions (5 mn) : on demande au groupe de répondre par écrit à la question “Quand devez-vous refactorer ?”.
- **6 - Faire une liste de tests**
  - Il s’agit d’apprendre à constituer une liste de tests initiale pour débuter une démarche en TDD.
  - Etapes :
    - Connect (5 mn) : Emily propose un jeu du type “Le livre dont vous êtes le héros”, où il s’agit de faire un choix et voir ensuite les conséquences. On prépare un tel jeu à un seul choix à propos du comportement initial en TDD, et avec les conséquences de chaque choix de l’autre côté, et on propose au groupe d’y jouer.
    - Concept (10 mn) : on va chercher les katas étudiés dans les séances précédentes, et regarde la liste des tests qu’on avait constituée. On demande ensuite au groupe quelles caractéristiques ont ces listes en commun. On les écrit ensuite pour tout le monde.
    - Concrete et Conclusions (40 mn) : on demande au groupe de se mettre en pairs, et on leur donne les spécifications du kata MarsRover pour qu’ils constituent une liste de tests initiale.
      - On répond à leurs questions en tant qu’expert métier.
      - Ils écrivent d’abord 4 à 6 idées de tests en 10 minutes.
      - Ensuite, ils montrent leurs idées à un autre groupe et en discutent, en essayant d’avoir des améliorations.
      - S’il reste du temps, ils peuvent faire la même chose sur d’autres katas.
- **7 - Arrange, Act, Assert**
  - On va cette fois travailler sur la manière d’écrire un test, dans sa structure et sa lisibilité.
  - Etapes :
    - Connect (15 mn) : on prend les tests du kata Mars Rover, et on demande au groupe lesquels sont le plus susceptibles de contenir des bugs.
    - Concept (5 mn) : on explique que le code de test doit être le plus simple possible pour permettre de valider le code de production, sinon on devrait écrire des tests pour le code de test.
      - Pour faire un parallèle, on peut citer Brian Kernighan qui dit “Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.”
      - On parle aussi de la structure _Arrange, Act, Assert_ qui aide à avoir des tests simples et clairs.
    - Concrete (30 mn) : on demande au groupe de reprendre les tests du kata MarsRover qu’ils ont travaillé à la séance précédente, et de les améliorer sous forme _Arrange, Act, Assert_.
    - Conclusions (5 mn) : on demande au groupe de former des pairs, et de discuter la question : pourquoi le code de test devrait-il être plus simple que le code de production ?
- **8 - Commencer par l’assertion**
  - Le but est de voir pourquoi en TDD il est préférable d’écrire un test en commençant par le bas, par la partie assert. Par exemple, la partie arrange n’aura alors que ce qu’il faut.
  - Etapes :
    - Connect (10 mn) : on prépare des post-its avec des concepts que le groupe a déjà vus, puis on demande à une personne différente à chaque fois de choisir un concept et de l’expliquer, en le guidant avec des questions si besoin.
    - Concept (5 mn) : on choisit un kata où il y a besoin de pas mal d’_arrange_, par exemple MarsRover, et on écrit un test en commençant par l’_assert_, puis _act_, et enfin _arrange_.
    - Concrete (30 mn) : on demande au groupe de s’exercer à écrire des tests en commençant par la fin, par exemple sur le kata MarsRover.
    - Conclusions (10 mn) : on remet les post-its de la partie Connect, et on demande au groupe en pairs d’écrire quel effet a le fait de commencer par l’assert, par rapport à ces thématiques.
- **9 - Une fonction à la fois**
  - On va driver le code vers des fonctions chacune testables.
  - Etapes :
    - Connect (5 mn) : on présente une liste de phrases au groupe, et on leur demande de trouver lesquelles ont un rapport avec la thématique “overdesign“.
    - Concept (10 mn) : on prend le kata Yatzy qu’on explique, puis on demande au groupe s’ils voient une manière de faire une liste de tests. En général ils vont proposer de regrouper les exemples par catégories.
    - Concept (10 mn) : on prend le rôle de _navigator_ en ensemble, en faisant tourner seulement le _typist_, et on drive le code en TDD jusqu’à arriver à ce que le code principal appelle des fonctions annexes pour chaque catégorie, qu’on va tester à part.
    - Concrete (30 mn) : on fait tourner le _navigator_, pour que le groupe s’approprie la suite du code et termine l’exercice.
    - Conclusions (5 mn) : on se met en pairs, et on discute de la manière dont on a divisé le problème en plusieurs morceaux, si ces morceaux sont testables, et s’il y a overdesign.
- **10 - Démo inspirante**
  - Le but ici va être de démontrer ce que donne le TDD appliqué par une personne expérimentée.
  - Etapes :
    - Concept (45 mn) : c’est le coach qui va faire la démonstration. On choisit un kata qui ressemble à leur code et contient des problématiques qu’ils ont (ou encore mieux : du code extrait de leur codebase), et on code en TDD à partir de ça.
      - Il faut s'entraîner à l’avance pour que ce soit fluide, ou encore s’enregistrer pour commenter sa propre vidéo.
    - Conclusions (10 mn) : on demande au groupe d’écrire des observations sur des post-its, puis de les lire.

### 13 - Learning Topics

- Emily regroupe ses learning hours autour de thématiques majeures, et elle fait en général 2 ou 3 séances avant de changer de thématique.
- Elle donne la liste de ses thématiques, avec des exemples de séances :
  - **Small steps** : on travaille l’aspect itératif du TDD.
    - Les étapes du TDD : red, green, refactor.
    - Faire souvent des commits.
    - Revert sur un test rouge imprévu.
    - Designer incrémentalement une fonction.
    - Designer incrémentalement une classe.
  - **Refactoring safely** : on travaille les techniques citées dans le livre **_Refactoring_** de Martin Fowler.
    - Détecter les code smells.
    - Enlever la duplication.
    - Améliorer le nommage.
    - Combiner des refactorings pour un changement plus grand.
  - **Legacy code** : on travaille le code legacy pour le rendre testable et pouvoir travailler avec.
    - Le code coverage pour aider à créer les tests.
    - L’approval testing.
    - Le mutation testing.
  - **Testable design** : on travaille le design qui permet d’obtenir du code testable et refactorable.
    - Les fonctions sont faciles à tester.
    - L’inversion de dépendance.
    - Les heuristiques de design.
    - Avoir des niveaux d’abstraction cohérents.
  - **Designing tests** : on travaille les bonnes pratiques d’écriture de tests.
    - Arrange, act, assert
    - Styles d’assertion.
    - Stubs.
    - Fakes.
    - Mocks et spies.
    - Données de test.
    - Avoir des niveaux d’abstraction cohérents.
  - **Double-loop TDD** : il s’agit d’avoir un niveau de tests en relation avec les experts métier, qu’on peut appeler BDD, qui donnent ensuite lieu à une boucle de feedback plus rapide qui consiste à coder le détail en TDD, avec des tests à destination des développeurs.
    - Au moment de la pratique, une partie de l’équipe joue le rôle des experts métier, et l’autre des développeurs. Emily conseille de prendre des exemples du code de production de l’équipe.
  - **Agile** : on travaille la notion d’agilité et de DevOps, au travers de jeux.
    - Emily a réalisé le jeu [pipeline game](https://www.eficode.com/blog/pipeline-card-game), qui permet de choisir la liste d’étapes de sa pipeline de continuous delivery.
    - Elle cite [Kanban dot game](https://livebook.manning.com/book/kanban-in-action/chapter-13/), tiré du livre **_Kanban in Action_** de Marcus Hammarberg et Joakim Sunden. Ca permet de comprendre l’intérêt de limiter les tâches en parallèle.
    - Elle propose d’autres exemples sur le site [Tasty Cupcakes](https://tastycupcakes.org/).
- On peut bien sûr s’inspirer des thématiques d’Emily, mais on doit aussi faire les nôtres, qui pourront être basés sur nos préférences et compétences spécifiques.

### 14 - Remote Learning Hours

- Emily présente quelques outils pour les séances de _learning hours_ en remote.
  - **Cyber-dojo** permet d’éditer du code collaborativement, et au coach de voir ce que font les élèves. On peut héberger son propre serveur.
  - **VNC** pour se connecter à une machine Amazon EC2 ayant un gestionnaire de fenêtre graphique. Tous les participants peuvent alors contrôler la machine à distance.
  - Les participants peuvent utiliser leur **machine locale**, auquel cas il faut penser au temps de setup à faire de préférence avant la session, et le switch qui peut être fait par des commit/push successifs.
- Pour ce qui est des **rétrospectives**, Emily a du mal à faire écrire des notes virtuelles aux participants. On peut au moins **leur faire dire les choses à haute voix, et l’écrire nous-mêmes**.
