# Learning to Scale

## 1 - Introduction

- On prend souvent de mauvaises décisions basées sur des **idées fausses**, alors qu’on pourrait utiliser l’apprentissage pour les corriger.
  - Exemples :
    - Une équipe choisit un raccourci qui impacte une autre équipe et l’oblige à travailler plus et à recruter pour s’en sortir. Personne ne se rend compte de l’origine du problème et du gaspillage global.
    - Une commerciale passe son temps à affiner son argumentaire, et n’écoute pas les vrais besoins de ses clients. Elle finit par avoir de mauvais résultats sans jamais savoir pourquoi.
    - L’équipe de direction élabore une réorganisation majeure, mais ne se rend pas compte que ça va empirer les choses, et qu’il vaudrait mieux s’appuyer sur les équipes et faire des changements graduels.
- Toyota a inventé un modèle permettant de **tirer parti de l’intelligence de chacun** : le **TPS** (Toyota Production System).
  - Elle a commencé dès les années 50, et s’est fait connaître dans les années 80 de par son succès.
  - En dehors de Toyota, ce modèle s’appelle _le lean_.
  - Ce modèle a influencé le mouvement agile et le mouvement lean startup.
- Le livre **_The Lean Strategy_**, sorti en 2017, constitue une avancée majeure et permet de comprendre le lean comme stratégie d’entreprise globale, plutôt que partielle comme auparavant.
  - Le livre **_Learning to Scale_** est une forme d’introduction à cette version plus complète du lean.

## 2 - Comment nous limitons la croissance

- Au moment où l’entreprise commence à grossir fortement, les fondateurs n’ont plus le temps de tout gérer par eux-mêmes.
  - En général, les fondateurs vont essayer d’embaucher des managers pour structurer des rôles de contrôle, mais les employés commettent toujours des erreurs et se démotivent, et l’entreprise se rigidifie.
- La **loi d'airain de Ballé** dit qu’_en période de forte croissance, les coûts engendrés par la complexité et le travail en silos, augmentent plus vite que le chiffre d’affaires_.
  - Il s’agit du “syndrôme des grandes entreprises”.
  - On peut le décliner en 4 points :
    - **Privilégier les processus plutôt que le client**.
      - Les personnes du bas de l’échelle appliquent les processus faits par les dirigeants sans réfléchir, même si le résultat est inefficace.
    - **Préférer les silos au travail d’équipe**.
      - On peut penser notamment aux différents chefs de service qui se rejettent la faute plutôt que de collaborer autour d’un but commun.
        - NDLR : c’est très bien illustré dans **_The Phoenix Project_**.
    - **Récompenser l’obéissance plutôt que l’initiative**.
      - On peut par exemple penser à un PM qui trouve des solutions issues de sa discovery, mais qui voit toutes ses propositions rejetées par son chef qui a déjà ses idées à lui.
    - **Confondre le leg et l’héritage technologique**.
      - Chaque entreprise qui a à un moment une bonne idée technologique qui perce finit par elle-même être dépassée par des concurrents qui innovent.
        - Il faut savoir abandonner les technologies qui procuraient un avantage concurrentiel hier et qui n’en procurent plus aujourd’hui.
        - Exemple : les clients lourds se font dépasser par le web.
- Les modèles classiques de management sont basés sur les théories de personnes comme Taylor ou Ford. Mais elles posent des problèmes.
  - Faire correspondre un produit uniforme à une clientèle la plus vaste possible permet d’économiser des coûts, mais les clients s’en vont quand la concurrence augmente.
  - Découper l’activité en petites tâches reproductibles permet d’être plus efficace, mais dès que le contexte change, le découpage en question ne correspond plus à ce qu’il faut faire.
  - Spécialiser les personnes dans des rôles leur permet d’être plus performants dans ce qu’ils font, mais ils perdent de vue l’ensemble et peuvent agir contre l’intérêt de l’entreprise sans s’en rendre compte.
  - Le contrôle centralisé permet d’agir vite, mais quand l’entreprise grossit, les dirigeants perdent le contact avec la réalité du terrain.
- Dans le management classique de type **Command & Control**, on applique un processus en **4D**.
  - **Définir**.
    - L’équipe dirigeante définit les **enjeux stratégiques** de l’entreprise en s’appuyant éventuellement sur des conseils externes.
  - **Décider**.
    - L’équipe dirigeante définit la **stratégie d’entreprise**, c’est-à-dire le plan d’action.
  - **Diriger**.
    - L’équipe dirigeante communique le plan aux investisseurs et aux employés, et s’occupe de la **mise en place** en nommant des personnes pour l’exécution et en définissant des objectifs.
  - **Démêler**.
    - Au bout d’un moment, le plan d’action décidé en dehors des réalités du terrain finit par avoir des conséquences néfastes. L’équipe dirigeante pense alors à définir une **nouvelle stratégie**.
- Le management de type 4D a pour conséquence :
  - Une baisse de la motivation.
  - Une innovation limitée parce qu’on ne s’appuie que sur quelques personnes (qui sont en plus déconnectées de la réalité du terrain) pour savoir quoi faire.
  - Les meilleurs éléments qui partent en burnout.
  - De mauvais résultats financiers.
- Le **lean** est une **alternative radicalement différente** des autres approches.
  - Le management de type _Command & Control_ est le plus répandu parce qu’il découle d’un penchant humain naturel vers le contrôle.
  - D’autres formes de management très différentes ont été expérimentées : en utilisant des mécanismes de récompense, en allant vers une autonomie totale des employés, en mettant en place les entreprises libérées, l’holacratie etc.
    - Mais toutes ces approches ont en commun d’être toujours sur la notion de **contrôle** : la question de savoir qui l’exerce et comment.
    - Le lean est radicalement différent de toutes ces approches parce qu’il se base sur la manière dont les gens **apprennent sur le terrain** (et non pas sur une histoire de contrôle donc).
    - _Le lean n’est pas un système de production, c’est un système d’apprentissage._

## 3 - Faire de l’apprentissage une stratégie

- Pour être une **entreprise apprenante**, il y a deux composantes :
  - **1 - Rechercher activement ce que nous ignorons et qui limite nos performances.**
  - **2 - Développer activement les connaissances et compétences de chacun.**
  - Exemple : un CTO arrive dans une entreprise, et la direction met la pression pour délivrer un projet. Il va se concentrer sur les deux aspects d'apprentissage.
    - 1 - Il cherche ce que les équipes ignorent et qui limite les performances.
      - Il commence par les problèmes de qualité : un tiers du temps de dev est passé sur des bugs.
      - Il passe du temps avec des devs et des PMs pour identifier l’origine de plusieurs bugs individuellement (plutôt que par statistique).
      - Il finissent par identifier que les PM ne prennent pas en compte des edge cases problématiques, et que les devs ont des pratiques de qualité de code qui ne sont pas suffisamment solides.
    - 2 - Il crée un environnement où le travail quotidien va permettre une acquisition rapide de compétences et de connaissances.
      - Il lance le département produit sur la réduction des bugs.
      - Il montre aux PMs et à leur responsable, pendant des séances individuelles, comment prendre en compte les cas particuliers dans les spécifications.
      - Il met en place une manière pour les devs de faire remonter les soucis dans les specs de manière régulière aux PMs pour établir une discussion entre eux.
      - Il travaille avec les Tech Leads sur l’amélioration des pratiques de qualité de code, à partir de leur expérience mais aussi en passant en revue les articles et livres de référence sur ces sujets.
      - Les Tech Leads utilisent ces connaissances pour former les devs et trouver des améliorations importantes pour pas trop d’efforts.
- Pour que l’apprentissage soit au cœur de l'entreprise, il faut que les employés soient dans un **environnement qui les incite à apprendre**.
  - La question de quelles compétences sont les plus utiles sur le moment se pose : par exemple pour développeur, explorer de nouvelles technos ou apprendre à faire du code avec peu de bugs.
  - Il faut que le moment de l’apprentissage soit très proche du moment de la mise en pratique.
  - Il faut de l’autonomie pour tester les choses par soi-même.
  - Il faut de la sécurité psychologique.
- Au management classique Command & Control, le lean vient opposer le management de type Orient & Support.
  - Le **Command and Control** consiste à donner des directives précises, puis à vérifier qu’elles sont exécutées.
    - Les employés sont là pour exécuter correctement les ordres et non pas réfléchir. De toute façon, ils en seraient bien incapables.
    - Exemple : “_Les chiffres de vente sont décevants. Chacun travaille de manière différente, donc j’ai repensé l’argumentaire commercial, élaboré un nouveau processus de vente et créé un nouveau modèle de proposition qu’il vous suffit juste de compléter pour gagner du temps. J’ai également augmenté la part variable de votre rémunération afin que vous soyez pleinement motivés. Je vais mettre en place des rendez-vous hebdomadaires avec chacun d’entre vous, d’ici quelques jours, pour répondre à vos questions et vous aider à appliquer ce nouveau processus avec succès._”
  - L’**Orient & Support** consiste à déterminer des objectifs impératifs à atteindre, puis à aider les employés à exprimer la manière de les atteindre.
    - La détermination des objectifs elle-même vient de l’analyse de ce qui se passe sur le terrain, en compagnie des gens qui sont sur le terrain.
    - On part du principe qu’on a recruté des gens compétents et impliqués, qui, dans de bonnes conditions et avec un peu d’aide, pourront aller chercher les compétences et les connaissances dont ils auront besoin pour trouver les solutions.
    - Exemple : “_Nous avons pris du retard sur nos objectifs de vente, nous avons donc besoin de comprendre ce qui se passe. Comme vous le savez, tous les problèmes rencontrés par le client qui achète nos produits se traduisent par un cycle de vente plus long. J’ai repensé notre tableau de ventes afin que chaque commercial puisse se rendre compte du lead time de chaque vente en cours. A partir de demain, je viendrai creuser chaque jour quelques cas de vente afin que nous puissions décortiquer des dossiers spécifiques. Cela devrait nous aider à découvrir pourquoi il est difficile pour certains clients d’acheter chez nous, et ce que nous pouvons faire pour développer une meilleure relation avec eux._”
- Centrer la stratégie autour de l’apprentissage **commence par la hiérarchie**.
  - Si le CEO et l’équipe de direction n’adoptent pas la démarche lean, elle n’aura au mieux qu’un effet marginal dans l’entreprise.
  - Si la hiérarchie ne pratique pas l’apprentissage au quotidien à partir du terrain :
    - Elle fera des erreurs avec de lourdes conséquences.
    - Les employés finiront par se démotiver, voyant leurs propositions se faire rejeter par une direction qui a des idées préconçues.
- Dans le lean, la stratégie se décline en **4C**.
  - **Chercher**.
    - L’équipe dirigeante va fréquemment sur le terrain pour aider les équipes à résoudre des problèmes du quotidien.
  - **Confronter**.
    - Elle adopte une “vue d’hélicoptère” pour découvrir les enjeux majeurs.
      - L’exercice de l’**hélicoptère** consiste à faire des va et vient entre les détails des problèmes du terrain, et le niveau stratégique où il s’agit d’avoir une vision d’ensemble.
  - **Cadrer**.
    - Elle décline ces enjeux au sein des équipes pour que chacune contribue à son niveau à l’effort d’apprentissage de l’entreprise.
  - **Co-construire**.
    - Les managers aident les équipes à développer des capacités à trouver des solutions, pour répondre aux enjeux qui les concernent.
- La stratégie 4C implique **d’arrêter de bouleverser l’entreprise** sur des coups de tête.
  - Les managers ont en général du mal à accepter ce point, parce que jouer aux apprentis sorciers est addictif.
  - Parmi ce qui rentre là-dedans :
    - Réorganiser les services.
    - Pousser des idées de nouveaux produits.
    - Déployer de nouveaux processus de fonctionnement.
    - Externaliser des parties de l’activité.
- Côté cadre de fonctionnement pour favoriser l’apprentissage, le lean dispose du modèle **TPS** (Toyota Production System).
  - Une partie des anciens de Toyota l’ont renommé _Thinking People System_ pour mieux communiquer l’intention qu’il y a derrière.
  - Il a été éprouvé dans de nombreuses industries, et pour toutes les tailles d’entreprise.
  - Il est constitué de 4 parties principales :
    - **La satisfaction client**.
      - Répondre au besoin spécifique de chaque client.
      - Créer de nouveaux produits pour apporter de la valeur aux clients.
    - **Le Jidoka**.
      - Réussir à faire un travail de qualité, et éliminer la cause des défauts **dès qu’ils se présentent**.
    - **Le Juste-à-temps**.
      - Réduire le _lead time_, et avoir un **flux continu** de valeur.
    - **Le socle de stabilité**.
      - Être dans un environnement qui favorise la contribution et l’apprentissage de chacun sur le terrain.
  - Le lean nécessite des mois, voire des années à être maîtrisé du fait de nombreux concepts contre-intuitifs
    - Mais selon l’auteur ça en vaut la peine, parce qu’il répond efficacement à la plupart des questions de management, et permet d’être efficace tout en créant un environnement agréable pour les employés.

## 4 - Votre périple lean

- Ce qu’il **ne faut pas** faire (en tant que dirigeant) :
  - Déléguer la mise en place du lean.
  - Lire quelques ressources sur le sujet et se dire qu’on est bon.
    - Le lean c’est **avant tout de la pratique**.
  - Appliquer le lean aux autres plutôt qu’à soi.
  - Mettre en place plein d’outils lean, et s’assurer que les gens les utilisent.
- Le lean est une **pratique personnelle, comme le tennis ou le piano**.
  - Il y a des pratiquants de différents niveaux.
  - Quand on est débutant, on n’arrive pas à grand-chose et c’est normal : il faut commencer par des exercices et progresser petit à petit.
  - Il faut se lancer dans la pratique, et la compréhension viendra au fur et à mesure.
  - Au bout d’un moment on arrive à un plateau, on peut alors lire une ressource plus avancée, ou se faire accompagner par un pratiquant qui a de l’expérience (_senseï_).
    - Vu la nature du lean (apprendre au quotidien à partir du terrain), un senseï extérieur ne pourra que tenir le rôle de coach, en donnant des pistes à partir de ce qu’il voit, des idées d’exercice etc. Il ne pourra pas mettre le lean en place dans l’entreprise à notre place.
- On ne peut pas mettre en place le lean dans l’entreprise en l’imposant comme un process à respecter. Ça ne marcherait pas.
  - Une des raisons c’est que le lean nécessite une grande implication pour entrer dans un processus d’apprentissage, et on ne peut pas espérer que tous les employés d’une entreprise aient cette implication en même temps.
  - Une des conséquences c’est que **le lean ne se met pas en place en quelques semaines**.
  - La bonne manière de s’y prendre c’est de commencer soi-même à appliquer le processus en commençant par des exercices (le chapitre suivant en donne).
    - On peut ensuite embarquer les personnes motivées autour de soi, en les aidant à faire la même chose de leur côté.
    - Au bout d’un moment, de plus en plus de personnes de l’entreprise pratiquent le lean.
    - Il se peut qu’il reste finalement quelques personnes complètement réticentes à cette approche : elles trouveront une meilleure opportunité professionnelle ailleurs.

## 5 - Passez à la pratique

### 1 - Chercher pour confronter

#### Commencer par le Gemba

- _Gemba_ veut dire “l’endroit où les choses se passent réellement”, c’est “le terrain”.
  - Ça peut être d’aller voir les clients qui utilisent le produit, les employés qui fabriquent le produit, ou encore même les fournisseurs s’il y en a.
- La posture à adopter pendant les Gemba walk c’est “**_Aller voir, demander pourquoi, faire preuve de respect_**” : il s’agit en grande partie d’essayer d’**y apprendre des choses sur la réalité du terrain**.
- **Exercice :**
  - En tant que cadre / dirigeant, on réserve des créneaux dans son agenda, par exemple un jour par semaine, où on va faire un Gemba walk.
  - On peut commencer par poser des questions axées orient and support.
    - Si on va voir un client :
      - Orient : qu'est-ce que vous essayez d’obtenir avec notre produit ?
      - Support : qu'est-ce que vous appréciez dans notre produit ? Qu’est-ce qui vous aiderait davantage ?
    - Si on va voir une équipe de delivery :
      - Orient : qu’est-ce que vous essayez d’améliorer dans le produit ?
      - Support : qu’est-ce qui est difficile ? Comment je pourrais vous aider ? Quelle est la prochaine étape pour résoudre le problème ?
  - On va ensuite demander à **voir la réalité des faits**.
    - Par exemple, si on a demandé à une équipe de dev de raconter un incident de prod, on peut maintenant demander à voir le code, les specs, et les tests correspondant à l’endroit problématique.
    - A une équipe de sales, après les avoir questionnés sur un client manqué, on pourra demander à voir les échanges par mail, les propositions commerciales etc. pour en apprendre plus à partir des faits.
  - Si on tombe face à quelque chose qui nous surprend, il faut résister à la tentation “Command & Control” de dire ce qu’il faut faire pour faire “mieux”.
    - Au lieu de ça, il faut **chercher à comprendre pourquoi**, pour essayer de remonter à la cause du problème, et laisser à l’équipe la possibilité de découvrir elle-même comment le régler.
      - L’idée c’est qu’elle soit dans un processus d’apprentissage, pour qu’elle sache à l’avenir régler le problème elle-même.
  - En tant que dirigeant, on doit aussi être **attentif aux dérives Command & Control** et mauvaises pratiques du genre.
    - Est-ce que certains employés sont mis sous pression ? Est-ce qu’ils en sont réduits à suivre des processus au détriment de l’intérêt du client ? Est-ce qu’ils se battent pour l’intérêt de leur département au détriment de l’intérêt de l’entreprise ? etc.
- Pour que les employés osent révéler les vrais problèmes, il faut les mettre dans un** climat de confiance** et de sécurité psychologique. Et donc il faut tolérer l’erreur.
  - En revanche, il faut être moins tolérant envers le fait de commettre deux fois la même erreur, pour qu’ils ne s’imaginent pas que c’est la fête non plus.
    - NDLR : “La confiance mais pas trop”...
- Les problèmes pertinents à résoudre sont regroupés autour de 4 axes, et sont décrits par le TPS.

#### Gagner le sourire des clients

- La satisfaction client est un des piliers du lean, elle permet de **rester concentré sur ce qui est important**, pour éviter de perdre du temps avec des process inutiles, des jeux de pouvoir etc.
- L’idée du lean c’est de traiter chaque client **individuellement**, avec leurs besoins propres, plutôt que de créer des abstractions représentant des catégories de clients.
  - Il s’agit bien sûr pour l’entreprise de répondre aux besoins de l’ensemble des clients, mais en restant concentré sur les besoins individuels on a de meilleures chances d’avoir un produit qui soit plus adapté à l’ensemble des clients.
- **Exercice :**
  - On peut faire un tableau de type “**mur client**”, qui liste les problèmes remontés par les clients.
    - Le tableau contient les colonnes “Date”, “Client”, “Problème”, “Causes probables”, “Contre-mesure”, “Résultat”.
    - L’objectif est de remettre les clients au centre de l’attention, et de mieux connaître leurs besoins.
- Il ne faut pas se jeter trop vite sur les solutions. Et en particulier il faut faire attention à :
  - Ne pas proposer de solutions avant que tout le monde soit d’accord sur le problème.
  - Ne pas essayer de deviner des problèmes qui ne sont peut-être pas là.
  - Bien examiner les conséquences négatives des solutions avant de les adopter.
- Une méthode pour résoudre efficacement les problèmes est le cycle **PDCA** (Plan, Do, Check, Act).
  - 1 - On clarifie d’abord le problème, et on se base sur les faits en analysant le Gemba.
  - 2 - On cherche une cause racine probable.
    - On cherche à répondre à la question : **Quelle est l’erreur de raisonnement que nous commettons sans cesse, et qui est à l’origine de ce problème ?**
    - Il ne faut pas s’arrêter aux causes évidentes, mais chercher plusieurs possibilités, et creuser chaque cause pour arriver à son origine, en posant à chaque fois la question “Pourquoi ?” .
  - 3 - **Plan** : on trouve **le plus petit changement possible** qui permettrait de remédier au problème.
  - 4 - **Do** : on le met en place, avec l’accord de tout le monde.
  - 5 - **Check** : on vérifie si la situation s’améliore et dans quelle mesure.
  - 6 - **Act** : on fait le point sur ce qu’on a appris, et on voit s’il faut une nouvelle petite itération PDCA ou si le problème semble résolu durablement.
- Pour que la résolution de problème donne lieu à un apprentissage, il faut :
  - Que la personne qui a fait le travail le retranscrive **par écrit**, dans un tableau du type “mur client”.
  - En rediscuter plus tard avec la personne.
- Les problèmes à chercher en priorité sont d’ordre **opérationnel**, et non pas de relations entre individus et équipes, ou de motivation.
  - La raison est que la cause du problème est souvent de ce côté, et que le versant relationnel / émotionnel n’en est qu’une conséquence qu’il faut traiter une fois qu’on a résolu le problème de fond.
  - Exemples :
    - Un commercial démotivé, mais qui ne sait pas rédiger de bonnes propositions commerciales.
    - Deux équipes qui n’arrivent pas à travailler ensemble, mais qui ne savent pas très bien ce que le client veut.
