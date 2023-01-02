# Refactoring: Improving the Design of Existing Code

## 1 - Refactoring : exemple introductif

- Ce chapitre montre un exemple de refactoring selon les techniques qui seront décrites dans le livre.
- Description :
  - Le logiciel sert une entreprise de vente de billets de pièces de théâtre, et permet de créer des factures.
  - Les clients pourront avoir des rabais en fonction de divers paramètres (par exemple le type de la pièce).
- Le programme :

  - On a deux objets/json auxquels notre fonction a accès :
    - Les _plays_ qui sont les pièces de théâtre.
      Exemple :
      ```json
      {
        "hamlet": { "name": "Hamlet", "type": "tragedy" },
        "othello": { "name": "Othello", "type": "tragedy" }
      }
      ```
    - Les _invoices_ qui sont
      ```json
      {
        "customer": "BigCo",
        "performances": [
          {
            "playID": "hamlet",
            "audience": 55
          },
          {
            "playID": "othello",
            "audience": 40
          }
        ]
      }
      ```
  - Le code initial est le suivant :

    ```typescript
    function statement(invoice, plays) {
      let totalAmount = 0;
      let volumeCredits = 0;
      let result = `Statement for ${invoice.customer}\n`;
      const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format;

      for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;
        switch (play.type) {
          case "tragedy":
            thisAmount = 40000;
            if (perf.audience > 30) {
              thisAmount += 1000 * (perf.audience - 30);
            }
            break;
          case "comedy":
            thisAmount = 30000;
            if (perf.audience > 20) {
              thisAmount += 10000 + 500 * (perf.audience - 20);
            }
            thisAmount += 300 * perf.audience;
            break;
          default:
            throw new Error(`unknown type: ${play.type}`);
        }
        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === play.type)
          volumeCredits += Math.floor(perf.audience / 5);
        // print line for this order
        result += ` ${play.name}: ${format(thisAmount / 100)}`;
        result += ` (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
      }
      result += `Amount owed is ${format(totalAmount / 100)}\n`;
      result += `You earned ${volumeCredits} credits\n`;
      return result;
    }
    ```

    - Le programme est court pour les besoins du livre. Pour un si petit programme la question ne se poserait peut-être pas, mais pour un programme de plusieurs centaines de lignes, il faut refactorer.

  - Les utilisateurs veulent deux modifications :
    - 1- Afficher un relevé de compte en HTML et pas seulement sous format texte comme actuellement.
    - 2- Ajouter de nouveaux types de pièces de théâtre, avec chacune ses règles particulières pour le système de rabais. On ne sait pas encore quels types on voudra.
  - Une première (mauvaise) solution simple serait de dupliquer la fonction pour faire la version HTML sur l’autre fonction.
    - Mais il faudrait ensuite mettre à jour les règles des nouveaux types de pièces sur les deux fonctions.

- On va **refactorer** le programme :

  - **1 - Les tests**
    - Avant tout refactoring, la 1ère chose à faire c’est de s’assurer que cette partie du code a des tests solides. Si c’est pas le cas on les écrit.
  - **2 - On décompose la fonction en sortant le switch**
    - On identifie d’abord à l'œil les **parties qui vont ensemble**.
    - Ici c’est d’abord le switch qu’on choisit de traiter comme un bloc.
    - On va utiliser la technique **Extract Function** pour sortir le bloc dans une autre fonction (qui se trouvera dans la portée de _statement_).
    - On regarde d’abord les **variables qui sont utilisées** par la nouvelle fonction extraite :
      - Deux variables ne sont que lues (_invoices_ et _plays_), on va pouvoir les passer en paramètre.
      - Une autre variable est assignée (_thisAmount_), on va pouvoir retourner la valeur pour l’assigner par retour de fonction.
    - Une fois qu’on a déplacé la fonction, on compile (si nécessaire), on joue les tests, et on commit.
      - Pour éviter de passer du temps à débugger son propre refactoring, il faut faire de **petites étapes avec un commit à chaque fois**.
    - On va ensuite renommer la fonction, et ses paramètres :
      ```typescript
      function amountFor(aPerformance, play) {
        // …
      ```
      - Le fait de mettre _For_ dans le nom de la fonction et _a_ dans le nom du paramètre fait partie du style de Fowler, qu’il a pris à Kent Beck.
  - **3 - On supprime la variable play**
    - Pour chaque variable prise en paramètre de notre nouvelle fonction _amountFor_, on vérifie sa provenance pour voir si on ne peut pas s’en débarrasser :
      - _aPerformance_ est différente à chaque tour de boucle, on doit la garder.
      - _play_ est par contre toujours le même : on pourrait le supprimer comme paramètre, et recalculer sa valeur dans notre nouvelle fonction.
    - On va utiliser la technique **Replace Temp with Query** pour remplacer dans la boucle :
      - `const play = plays[perf.playID];`
      - par
      - `const play = playFor(perf);`
      - Avec la nouvelle fonction :
        ```typescript
        function playFor(aPerformance) {
          return plays[aPerformance.playID];
        }
        ```
    - On compile, teste, commit, puis on utilise **Inline Variable** :
      - On supprime la variable `const play = playFor(perf);`
      - Et on appelle la fonction au moment d’appeler _amountFor_ :
        ```typescript
        let thisAmount = amountFor(perf, palyFor(perf));
        ```
      - Et on fait le remplacement par l’appel partout où _play_ était utilisé.
    - On compile, teste, commit, puis on peut utiliser **Change Function Declaration** pour éliminer le paramètre _play_ dans _amountFor_ :
      - On utilise la nouvelle fonction _playFor_ à l’intérieur d’_amountFor_, en remplacement du paramètre _play_.
      - On compile, teste, commit.
      - On supprime le paramètre _play_ qui n’était plus utilisé.
    - Remarques :
      - Faire 3 fois l’accès à play est moins performant que de mettre la valeur dans une variable et y accéder les deux autres fois.
        - Mais **cette différence est négligeable**.
        - Et **même si elle était significative**, rendre le code plus clair permettra de mieux l’optimiser ensuite.
      - **Supprimer les variables locales** permet en général de faciliter les extractions, c’est pour ça qu’on le fait.
    - On utilise encore **Inline Variable** pour appeler plusieurs fois _amountFor_ dans _statement_, comme ça on supprime cette variable locale aussi.
  - **4 - on extrait les crédits de volume**
    - On va extraire le bloc de calcul de crédits de volume. Pour ça on vérifie les variables qui devront être passées :
      - _perf_ doit être passé.
      - _play_ a été supprimé par le refactoring d’avant.
      - _volumeCredits_ est un accumulateur. On peut créer une variable locale dans la nouvelle fonction et la retourner.
    - Ca donne :
      ```typescript
      function volumeCreditsFor(perf) {
        let volumeCredits = 0;
        volumeCredits += Math.max(perf.audience - 30, 0);
        if ("comedy" === playFor(perf).type)
          volumeCredits += Math.floor(perf.audience / 5);
        return volumeCredits;
      }
      ```
    - Et côté appel dans _statement_ :
      `volumeCredits += volumeCreditsFor(perf);`
    - On compile, teste, commit.
    - On va renommer les variables dans _volumeCreditsFor_ :
      ```typescript
      function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type)
          result += Math.floor(aPerformance.audience / 5);
        return result;
      }
      ```
      - On a ici fait deux changements de variable (_aPerformance_, et _result_), il faut compiler, tester et commiter entre chaque changement.
      - La convention _result_ fait partie du style de convention de Martin Fowler, au même titre que _aVariable_ pour les variables en paramètre.
  - **5 - On va supprimer la variable format**
    - On continue à supprimer des variables temporaires dans _statement_ pour faciliter l’extraction de blocs.
    - Ici on s’attaque à _format_, c’est une variable contenant une fonction. On va la supprimer pour déclarer la fonction en question :
      ```typescript
      function format(aNumber) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        }).format(aNumber);
      }
      ```
    - Cette technique de transformer une fonction dans une variable en fonction déclarée n’est pas assez importante pour figurer dans les techniques du livre.
    - On va ensuite utiliser **Change Function Declaration** pour renommer la fonction en quelque chose qui indique mieux ce qu’elle fait.
      - Vu qu’elle est utilisée dans une petite portée et est peu importante, Fowler privilégie un nom plus court que _formatAsUSD_. Il choisit juste _usd_ pour mettre en avant l’aspect monétaire.
  - **6 - On va déplacer le calcul du volume de crédits**
    - On avait précédemment extrait le calcul du volume de crédits pour une pièce. On va maintenant extraire le calcul du volume de crédits pour l’ensemble des pièces hors de _statement_.
    - On va utiliser **Split Loop** pour couper la boucle en deux, et avoir le calcul du volume de crédits dans une boucle à part.
      ```typescript
      for (let perf of invoice.performances) {
        // print line for this order
        result += ` ${play.name}: ${format(thisAmount / 100)}`;
        result += ` (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
      }
      for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);
      }
      ```
      - On compile, teste, commit.
    - On peut alors utiliser **Slide Statements** pour déplacer la déclaration de la variable _volumeCredits_ juste au-dessus de la 2ème boucle.
      - On compile, teste, commit.
    - On va pouvoir utiliser **Replace Temp with Query**, la première étape pour pouvoir le faire c’est d’utiliser **Extract Function** :
      ```typescript
      function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of invoice.performances) {
          volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;
      }
      ```
    - On peut donc appeler la nouvelle fonction dans statement :
      ```typescript
      volumeCredits = totalVolumeCredits();
      ```
      - On compile, teste, commit.
    - On peut alors utiliser **Inline Variable** pour supprimer la variable locale _volumeCredits_, et appeler _totalVolumeCredits_ là où elle était utilisée.
      - On compile, teste, commit.
    - Remarques :
      - Pour le côté **performance**, la plupart du temps créer des boucles supplémentaires ne créera pas de ralentissement significatif.
        - Même dans les rares cas où c’est le cas, on pourra toujours mieux optimiser après avoir rendu le code plus clair par du refactoring.
      - Les étapes présentées avant chaque compilation/test/commit sont très courtes. Il arrive à Martin Fowler de ne pas faire à chaque fois des étapes aussi courtes, mais il fait quand même des étapes relativement courtes.
        - Et surtout, dès que les tests échouent, il **annule ce qu’il a fait depuis le dernier commit** et reprend avec des étapes plus courtes (comme celles-là).
        - Le but c’est de ne pas **perdre de temps à débugger** pendant un refactoring.
    - On va répéter la même séquence pour extraire complètement _totalAmount_ :
      - **Split Loop** pour extraire l’instruction qui nous intéresse dans une boucle à part.
      - **Slide Statements** pour déplacer la variable locale près de la nouvelle boucle.
      - **Extract Function** pour extraire la boucle dans une nouvelle fonction.
        - Le meilleur nom pour cette fonction est déjà pris par la variable _totalAmount_, donc on lui met un nom au hasard pour garder un code qui marche et commiter.
      - **Inline Variable** nous permet d’éliminer la variable locale, et de renommer la nouvelle fonction _totalAmount_.
      - On en profite aussi pour renommer la variable locale dans la nouvelle fonction en _result_ pour respecter notre convention de nommage.
    - Ca donne :
      ```typescript
      function totalAmount() {
        let result = 0;
        for (let perf of invoice.performances) {
          result += amountFor(perf);
        }
        return result;
      }
      ```
  - **7 - On va fractionner les phases de calcul et de formatage**

    - Jusqu’ici on avait refactoré pour rendre le code plus clair et mieux le comprendre. On va maintenant le mener vers l’objectif qui est de pouvoir créer des factures HTML en plus des factures texte.
    - On va mettre en œuvre **Split Phase** pour faire la division logique / formatage.
    - Pour ça on commence par appliquer **Extract Function** au code qui constituera la 2ème phase : on va déplacer l’ensemble du code de _statement_ et les fonctions imbriquées dans une fonction _renderPlainText_.

      ```typescript
      function statement(invoice, plays) {
        return renderplainText(invoice, plays);
      }

      function renderPlainText(invoice, plays) {
        let result = `Statement for ${invoice.customer}\n`;
        // ...
        return result;

        function totalAmount() {
          // ...
        }
        // ...
      }
      ```

      - On compile, teste et commit.

    - On va créer un objet qui servira de **structure de données intermédiaire entre les deux phases** :

      ```typescript
      function statement(invoice, plays) {
        const statementData = {};
        return renderplainText(statementData, invoice, plays);
      }

      function renderPlainText(data, invoice, plays) {
      //...
      ```

    - Le but c’est de déplacer tout le calcul de logique hors de _renderPlainText_, et de tout lui passer au travers de l’objet _data_.

      - (On va compiler / tester / commiter entre chaque étape)
      - On va mettre `invoice.customer` dans _data_, pour obtenir `data.customer` de l’autre côté.
        ```typescript
        const statementData = {};
        statementData.customer = invoice.customer;
        ```
      - On fait pareil avec `invoice.performances`.
      - On veut maintenant que les valeurs des performances soient précalculées dans le paramètre _data_ qu’on donne à _renderPlainText_. On commence par créer une fonction pour enrichir les performances :

        ```typescript
        statementData.performances =
          invoice.performances.map(enrichPerformance);

        function enrichPerformance(aPerformance) {
          const result = { ...aPerformance };
          return result;
        }
        ```

      - On va déplacer les informations des pièces (plays) dans les _performances_ qu’on a mis dans _data_.
        - Pour ça on ajoute la valeur dans notre nouvelle fonction.
          ```typescript
          function enrichPerformance(aPerformance) {
            const result = { ...aPerformance };
            result.play = playFor(result);
            return result;
          }
          ```
        - Ensuite on utilise **Move Function** pour déplacer _playFor_ en dessous d’_enrichPerformance_.
        - Et enfin on remplace toutes les utilisations de _playFor_ dans les fonctions de _renderPlainText_ par les valeurs précalculées issues de _data_. On va y accéder typiquement par `perf.play`.
      - On va ensuite appliquer la même chose que pour _playFor_, mais cette fois pour _amountFor_ dont on élimine les appels de _renderPlainText_.
      - Puis on fait la même chose pour _volumeCreditsFor_.
      - Et encore la même chose pour _totalAmount_, et _totalVolumeCredits_.

    - On en profite pour utiliser **Replace Loop with Pipeline** sur les boucles de _totalAmount_ et _totalVolumeCredits_.
      ```typescript
      function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0);
      }
      ```
    - On va maintenant extraire le code de première phase qu’on vient de créer (la création des data pré-calculées dans statement) dans une fonction à part :

      ```typescript
      function statement(invoice, plays) {
        return renderplainText(
          createStatementData(invoice, plays)
        );
      }

      function renderPlainText(data) {
        //...
      }

      function createStatementData(invoice, plays) {
        const result = {};
        result.customer = invoice.customer;
        result.performances =
            invoice.performances.map(enrichPerformance);
        result.totalAmount = totalAmount(result);
        result.totalVolumeCredits =
            totalVolumeCredits(result);
        return result;

        function enrichPerformance(aPerformance) {
          // ...
        }
      // ...
      ```

    - On peut alors extraire _createStatementData_ et ses fonctions imbriquées (le code de la phase 1 donc) dans un fichier à part qu’on appelle _createStatementData.js_.
    - On peut maintenant facilement écrire la version HTML de statement dans le fichier statement.js :

      ```typescript
      function statement(invoice, plays) {
        return renderplainText(createStatementData(invoice, plays));
      }

      function renderPlainText(data) {
        let result = `Statement for ${data.customer}\n`;
        // ...
        return result;
      }

      function htmlStatement(invoice, plays) {
        return renderHtml(createStatementData(invoice, plays));
      }

      function renderHtml(data) {
        let result = `<h1>Statement for ${data.customer}</h1>\n`;
        // ...
        return result;
      }
      ```

    - Remarque : Fowler propose de suivre la **règle du camping** : il faut toujours laisser le code un peu plus propre que l’état dans lequel on l’a trouvé. Le code ne sera jamais parfait, mais il sera meilleur qu’avant.

  - **8 - On va créer un calculateur pour types de performances**

    - On s’intéresse ici au fait de faciliter l’ajout de nouveaux types de pièces de théâtre, avec chacun ses conditions et valeurs de calcul pour la facturation et les crédits de volume.
    - La solution qu’on retient c’est de créer un calculateur sous forme de classes, avec des classes filles pour contenir la logique de chaque type de pièce. On va donc mettre en œuvre la technique **Replace Conditional with Polymorphism**.
      - NDLR : dans Clean Code, Uncle Bob disait qu’un code procédural (qui utilise les structures de données pour représenter les objets) est adapté pour ajouter des fonctionnalités supplémentaires (par exemple dans notre cas une fonctionnalité en plus du calcul de facturation et du calcul de volume de crédits). Un code orienté objet par contre est plutôt adapté pour l’ajout de nouveaux types d’objets sans ajout de nouvelles fonctionnalités (par exemple dans notre cas ajouter un nouveau type de pièce de théâtre avec ses propres règles de facturation et volume de crédits).
        - L’idée est de minimiser le nombre d’éléments qui seront changés quand on fera notre changement.
    - On commence par créer le calculateur sans qu’il ne fasse rien :

      ```typescript
      function enrichPerformance(aPerformance) {
        const calculator = new PerformanceCalculator(aPerformance);
        // ...
      }

      class PerformanceCalculator {
        constructor(aPerformance) {
          this.performance = aPerformance;
        }
      }
      ```

    - Ensuite, pour plus de clarté, on déplace les informations des pièces :

      ```typescript
      function enrichPerformance(aPerformance) {
        const calculator = new PerformanceCalculator(
          aPerformance,
          playFor(aPerformance)
        );
        // ...
      }

      class PerformanceCalculator {
        constructor(aPerformance, aPlay) {
          this.performance = aPerformance;
          this.play = aPlay;
        }
      }
      ```

  - **9 - On va déplacer les fonctions de calcul dans le calculateur**
    - On va d’abord déplacer _amountFor_ dans le calculateur.
      - Pour ça on commence par utiliser **Move Function** et copier le code dans un getter, et utiliser les variables d’instance `this.play` et `this.performance` :
        ```typescript
        get amount() {
          switch (this.play.type) {
          case "tragedy":
            thisAmount = 40000;
            if (this.performance.audience > 30) {
        //...
        }
        ```
      - On va ensuite instancier le calculateur et utiliser le getter _amount_ dans _amountFor_, pour tester que jusque là les tests passent.
        ```typescript
        function amountFor(aPerformance) {
          return new PerformanceCalculator(aPerformance, playFor(aPerformance))
            .amount;
        }
        ```
      - Enfin on va utiliser **Inline Function** pour éliminer _amountFor_ et utiliser `calculator.amount` à la place.
    - On fait la même chose pour _volumeCreditsFor_, pour se retrouver à utiliser `calculator.volumeCredits`.
  - **10 - On va rendre le calculateur polymorphe**

    - On va commencer par utiliser **Replace Type Code with Subclasses** pour ça.

      - Pour obtenir la bonne classe, on va utiliser **Replace Constructor with Factory Function** :

        ```typescript
        function enrichPerformance(aPerformance) {
          const calculator = createPerformanceCalculator(
            aPerformance,
            playFor(aPerformance)
          );
          //...
        }

        function createPerformanceCalculator(aPerformance, aPlay) {
          switch (aPlay.type) {
            case "tragedy":
              return TragedyCalculator(aPerformance, aPlay);
            case "comedy":
              return ComedyCalculator(aPerformance, aPlay);
            default:
              throw new Error(`Unknown type: ${aPlay.type}`);
          }
        }

        class TragedyCalculator extends PerformanceCalculator {}

        class ComedyCalculator extends PerformanceCalculator {}
        ```

      - On peut maintenant utiliser **Replace Conditional with Polymorphism** pour déplacer les fonctions de calcul dans les classes filles.
        - On peut créer un getter du même nom (_amount_) dans _TragedyCalculator_ par exemple, pour y déplacer le code lié à la facturation des tragédies.
        - Puis on le fait pour la facturation des comédies.
        - On peut alors supprimer `get amount()` de _PerformanceCalculator_. Ou alors le laisser et y throw une erreur indiquant que la fonctionnalité est déléguée aux classes filles.
        - On peut faire pareil avec les volumes de crédits. Pour celui-là on pourra laisser le cas le plus courant (attribuer des crédits si l’auditoire est supérieur à 30 personnes) dans _PerformanceCalculator_, et ne surcharger que pour _ComedyCalculator_.

- Comme souvent, **les premières phases** du refactoring permettent de **comprendre** ce que fait le code en le clarifiant. On peut ensuite réinjecter cette compréhension dans la suite des refactorings pour le faire aller dans le sens qu’on veut.
- Les **petites étapes** sont étonnantes au premier abord, mais cette méthode est vraiment efficace, et permet d’avancer sereinement et rapidement pour faire au final des refactorings importants.

## 2 - Principes du refactoring

- L’auteur propose une définition plus restreinte du refactoring que ce qu’on entend habituellement : il s’agit pour lui d’une **succession de petits changements qui permettent de rendre le code plus facile à comprendre et à changer, sans changer son comportement**.
  - Comme ce sont de petits changements indépendants, on peut arrêter à tout moment en gardant le code fonctionnel.
  - Il propose _restructuration_ (restructuring) comme mot plus général pour désigner le fait de réorganiser le code, le refactoring étant une forme particulière de restructuration.
- Les développeurs ont **deux casquettes** distinctes qu’ils peuvent porter, une à la fois : celle d’**ajout de changements, et celle de refactoring**.
  - Il est important d’essayer de garder ces deux casquettes distinctes pour être efficace dans ce qu’on fait et avancer sereinement.
  - La casquette de changement mène normalement à l’ajout ou à la modification de tests, alors que la casquette de refactoring ne devrait pas mener à toucher aux tests.
  - NDLR : à petite échelle il s’agit aussi des casquettes qu’on adopte en TDD : red-green avec celle du changement, et refactor avec celle du refactoring.
- Pourquoi faire du refactoring ?
  - Pour conserver et améliorer l’architecture du logiciel qui se délite peu à peu.
  - Pour rendre le code plus lisible et compréhensible.
    - On met la connaissance qu’on a au moment où on a passé du temps sur le code dans le code lui-même, comme ça on peut nous-mêmes l’oublier sans souci.
  - Pour révéler les bugs qui se cachaient dans du code fouilli.
  - Pour programmer **plus rapidement**.
    - Si on met en place du code bien structuré et compréhensible, on pourra s’appuyer sur le code existant pour coder plus vite de nouvelles features.
    - Cette hypothèse est basée sur l’expérience de Fowler et celle de centaines de programmeurs qu’il connaît.
- Quand faire du refactoring ?
  - La **règle de trois** : on fait quelque chose une fois, la 2ème fois qu’on le fait on laisse passer, la troisième fois on fait un refactoring.
  - Le meilleur moment est le **refactoring préparatoire** : juste avant de faire une modification, on remanie le code pour rendre cette modification plus facile.
    - Ça peut être un refactoring de compréhension, ou un refactoring de ramassage d’ordures quand on se rend compte que le code est mal structuré pour ce qu’on veut en faire.
  - La plupart des refactorings doivent être **opportunistes**, c’est-à-dire s’intégrer au flux habituel d’ajout de fonctionnalités ou de correction de bugs.
    - On peut parfois aussi faire des refactorings **planifiés** si on a vraiment négligé le code ou qu’on tombe sur quelque chose de spécifique qui le nécessite.
  - Le refactoring est aussi **nécessaire pour le code qui est déjà de bonne qualité**, parce qu’il ne s’agit d’adapter en permanence le code à notre compréhension actuelle du système, et celle-ci varie tout le temps.
  - L’idée de séparer les features et les refactorings dans des features séparées n’a pas que des avantages, Fowler est plutôt réticent..
    - Elle permet de faire des reviews plus ciblées, mais d’un autre côté le refactoring est souvent lié au contexte du changement qu’il accompagne, et on risque d’avoir plus de mal à le comprendre et à le justifier isolément.
    - NDLR : [Kent Beck a récemment](https://www.youtube.com/watch?v=BFFY9Zor6zw) conseillé de faire des PRs séparées avec de petites granularités pour pouvoir choisir le moment où on fait des refactorings et fournir des fonctionnalités régulières aux personnes qui attendent.
  - On a parfois besoin de **gros refactorings**, par exemple pour remplacer une librairie. Dans ce cas, l'auteur conseille de **procéder petit à petit** quand même.
    - Pour la librairie, on peut mettre en place une abstraction devant la librairie actuelle, et remplacer les fonctionnalités derrière l’abstraction petit à petit. On appelle ça _Branch By Abstraction_.
  - Le refactoring est aussi utile pendant les **code reviews** : on retravaille le code pour comprendre plus en profondeur ce que la personne a fait, et pour avoir des idées d’amélioration qu’on pourra mettre en place immédiatement.
    - Ca implique de faire la code review **en présence de la personne qui a fait la PR**. Faire des Code reviews sans la personne ne fonctionne de toute façon pas très bien selon Fowler.
    - La conclusion logique de la pratique est le pair programming.
  - Quand ne pas faire de refactoring :
    - Quand on tombe sur du code qui part dans tous les sens mais qu’on n’a pas besoin de le modifier.
    - Quand il est préférable de réécrire le code plutôt que de le remanier. Ce genre de décision se fait avec l’expérience.
- Que dire aux managers pour le refactoring ?
  - Les managers qui ont une bonne compréhension de la technique vont de toute façon encourager le refactoring parce qu’ils sauront que ça permet de rester productif.
  - Pour ceux qui n’ont pas de bonne compétences techniques, le conseil controversé de Fowler est de **ne pas leur dire qu’on en fait**.
    - Nous sommes les professionnels du développement, nous sommes payés pour notre expertise à coder vite, et le refactoring nous permet justement de coder vite.
- De manière générale, et y compris auprès des développeurs, il ne faut pas justifier le refactoring par “la beauté du code” ou “les bonnes pratiques”, mais par le critère économique qui met tout le monde d’accord : **ça permet d’aller plus vite**.
- Il vaut mieux éviter des granularités trop fines pour ce qui est de la propriété du code, notamment au sein d’une équipe : chaque membre de l’équipe devrait pouvoir modifier toute la codebase pour pouvoir faire des refactorings qui toucheraient éventuellement jusque ces endroits-là.
  - On peut étendre ça entre les équipes où n’importe qui de l’entreprise pourrait faire un PR chez la codebase d’une autre équipe.
- L’utilisation de _feature branches_ est problématique par rapport aux conflits de mege, et en particulier par rapport aux refactorings qui vont provoquer beaucoup de conflits.
  - La pratique du refactoring va de pair avec la Continuous Integration (CI), aussi appelée trunk-based development, qui consiste à **intégrer au moins une fois par** jour son travail sur le branche principale.
    - Les deux pratiques font partie de l’_Extreme Programming_.
    - A noter que la CI est prouvée comme plus efficace que les autres pratiques d’intégration (cf. le livre **_Accelerate_**).
- Pour faire des refactorings, il faut soit des **tests** qui assurent que le comportement n’est pas changé, soit utiliser des outils qui font des **refactorings automatiquement** (par exemple renommer une variable ou extraire une fonction).
  - Dans **_Working Effectively with Legacy Code_**, Michael Feathers décrit comment ajouter des tests à du code legacy : il faut trouver des points d’entrée où insérer des tests, et pour ça il faut prendre des risques en faisant du refactoring.
- Pour ce qui est du **refactoring de bases de données**, il faut aussi y aller par petits pas, en créant de petites migrations successives.
  - Il y a un livre à ce sujet : **_Refactoring Databases_**.
  - Une bonne pratique est le **changement parallèle** (aussi appelé expand-contract) où on va d’abord créer la nouvelle structure, puis l’alimenter avec l’ancienne, puis migrer tout petit à petit pour utiliser la nouvelle. Et finalement supprimer l’ancienne.
- Le refactoring implique d’adopter une **approche incrémentale de l’architecture**.
  - On appelle ça aussi **YAGNI** (you aren’t going to need it) : il s’agit de ne pas rendre le code inutilement flexible pour plus tard “au cas où”.
    - Par exemple, ne pas ajouter des paramètres non utilisés à une fonction, au cas où on en aurait besoin plus tard. On les ajoutera avec du refactoring quand on en aura effectivement besoin.
    - Souvent le besoin imaginé ne se réalise pas, ou pas comme on l’avait imaginé.
    - Ça a bien sûr des limites : parfois un refactoring sera beaucoup plus coûteux plus tard. Dans ce cas, on peut l’envisager tout de suite. Mais ce n'est pas si courant.
  - Cette approche de l’architecture est aussi étudiée sous le nom d’**evolutionary architecture**.
- Le refactoring fait partie d’un ensemble de techniques interdépendantes et cohérentes qui permet l’agilité. Elles sont regroupées au sein de l’**Extreme Programming**.
  - Parmi ces techniques il y a notamment : le refactoring, l’intégration continue (CI), la livraison continue (CD), YAGNI, et les tests automatisés.
- Il y a 3 manières d’aborder la question de la **performance** :
  - La 1ère est la **budgétisation du temps** : au moment de la conception on attribue un budget temps qui ne doit pas être dépassé à chaque composant.
    - C’est utile pour les **systèmes temps réel** comme les simulateurs cardiaques, mais inadapté à des systèmes web classiques.
  - La 2ème est l’**attention constante** : on essaye de faire attention à la performance sur tout le code qu’on écrit.
    - Le problème c’est qu’en général l’essentiel du temps d’exécution des programmes se concentre sur très peu de code. Et on passe 90% du temps à optimiser des choses qui n’ont aucun impact.
    - Un autre problème c’est qu’on a en général une mauvaise idée de la manière dont se comporte le compilateur, le runtime, le matériel etc. et on optimise des choses à tort.
    - Cette solution mène à perdre beaucoup de temps à faire des **optimisations inutiles**, et à obtenir du **code peu maintenable**.
  - La 3ème méthode consiste à **séparer l’optimisation de performance dans une phase à part** : on code sans prendre en compte la performance, puis on passe du temps dédié à l’améliorer.
    - On utilise un profiler pour repérer les endroits du code qui consomment le plus (de temps, de mémoire etc.), et on se concentre sur ça seulement.
    - On procède là aussi itérativement par petites touches, en annulant ce qu’on a fait si ça n’améliore pas.
    - Le fait d’avoir du code bien refactoré permet de plus facilement comprendre ce qui se passe, et aide donc à optimiser.
    - Cette approche est **la plus efficace**.
- Quelques livres intéressants sur le refactoring :
  - **_Refactoring Workbook_** de Bill Wake : un livre avec des exercices pour mettre en application le refactoring.
  - **_Refactoring to Patterns_** de Josh Kerievsky : comment appliquer le refactoring en utilisant les design patterns du gang of four.
  - **_Refactoring Databases_** de Scott Ambler et Pramod Sadalage et **_Refactoring HTML_** de Elliotte Rusty : des livres appliquant le refactoring à des domaines spécifiques.
  - **_Working Effectively with Legacy Code_** de Michael Feathers : comment faire du refactoring sur du code avec peu ou pas de tests.

## 3 - Quand le code sent mauvais

- On ne peut pas savoir quand un refactoring est nécessaire mieux que l’intuition d’un programmeur expérimenté, mais ce chapitre contient une liste de 24 **code smells** qui devraient au moins nous alerter quand on les croise.
- **1 - Mysterious Name** : quand on ne comprend pas un nom de variable ou fonction au premier coup d'œil, il faut la renommer.
  - Si on n’arrive pas à trouver un bon nom, c’est sans doute qu’on a d’autres problèmes plus profonds avec le code qu’on essaye de nommer.
  - Parmi les techniques, il y a **Change Function Declaration**, **Rename Function** et **Rename Field**.
- **2 - Duplicated Code** : quand on a du code dupliqué, il faut essayer de le factoriser pour avoir moins d’endroits à maintenir à jour à chaque modification.
  - En général on va utiliser **Extract Function**.
  - Si le code dupliqué n’est pas tout à fait identique, on peut d’abord utiliser **Slide Statements** pour obtenir un morceau de code identique à factoriser.
  - Si le code dupliqué se trouve dans des classes filles d’une même hiérarchie, on peut la remonter dans la mère avec **Pull Up Method**.
- **3 - Long Function** : les fonctions courtes sont plus efficaces pour la compréhension du code.
  - L’idée c’est de nommer les fonctions avec **l’intention de leur code** plutôt que par ce qu’il fait. A chaque fois qu’on veut commenter, on peut remplacer ça par une fonction qui encapsule le bout de code.
  - C’est tout à fait OK de faire des fonctions qui ne contiennent **qu’une ligne**, pour peu que le nommage apporte une meilleure information sur l’intention.
  - En général, on va utiliser **Extract Function**.
  - Les **conditions** peuvent être divisées avec **Decompose Conditional**.
    - Un grand switch devrait avoir ses clauses transformées en un seul appel de fonction avec **Extract Function**.
    - S’il y a plus d’un switch sur la même condition, alors il faut appliquer **Replace Conditional with Polymorphism**.
  - Les **boucles** peuvent être extraites dans leur propre fonction.
    - Si on a du mal à nommer la fonction, alors on peut appliquer d’abord **Split Loop**.
- **4 - Long Parameter List** : trop de paramètres porte à confusion, il faut essayer de les éliminer.
  - Si on peut obtenir un paramètre à partir d’un autre, alors on peut appliquer **Replace Temp with Query** pour l’éliminer.
  - Si plusieurs paramètres sont toujours ensemble, on peut les combiner avec **Introduce Parameter Object**.
  - Si un argument est utilisé pour choisir une logique dans la fonction, on peut diviser la logique en plusieurs fonctions avec **Remove Flag Argument**.
  - On peut aussi regrouper les fonctions qui ont des paramètres communs en classes avec **Combien Functions into Class**, pour remplacer les paramètres par des champs.
- **5 - Global Data** : le problème des données globales c’est qu’on peut les modifier de n’importe où, et donc c’est très difficile de suivre ce qui se passe.
  - Pour traiter le problème, il faut les encapsuler avec **Encapsulate Variable**.
- **6 - Mutable Data** : le fait que les structures soient mutables fait qu’on peut changer une structure quelque part, et provoquer un bug ailleurs sans s’en rendre compte.
  - La recherche de l'immutabilité vient de la programmation fonctionnelle.
  - On peut utiliser **Encapsulate Variable** pour s’assurer qu’on modifie la structure à partir de petites fonctions.
  - Si une variable est mise à jour pour stocker plusieurs choses, on peut utiliser **Split Variable** pour rendre ces updates moins risquées.
  - Il faut essayer de garder la logique qui n’a pas de side effects et le code qui modifie la structure séparés, avec **Slide Statements** et **Extract Function**. Et dans les APIs, on peut utiliser **Separate Query from Modifier** pour que l’appelant fasse des queries sans danger.
  - Dès que c’est possible, il faut utiliser **Remove Setting Method** pour enlever les setters.
  - Les données mutables qui sont calculées ailleurs sont sources de bugs, il faut les remplacer par **Replace Derived Variable with Query**.
  - Il faut essayer de limiter le scope du code qui a accès aux variables mutables. Par exemple avec **Combine Functions into Class**, ou **Combine Functions into Transform**.
  - Si une variable contient déjà une structure avec d’autres données, il vaut mieux remplacer la structure entière d’un coup, plutôt que de modifier la variable, avec **Change Reference to Value**.
- **7 - Divergent Change** : quand on a un module qui doit être modifié pour plusieurs raisons, on est face à des changements divergents.
  - Par exemple si on se dit “Je devrai modifier ces trois fonctions si j’ajoute une nouvelle base de données, et ces quatre fonctions si j’ajoute un nouvel instrument financier” : les bases de données et les instruments financiers sont deux contextes différents qu’il vaut mieux traiter séparément.
  - Si les deux contextes forment deux phases (par exemple il faut obtenir les infos de la base de données, puis appliquer un instrument financier), alors on peut utiliser **Split Phase** pour séparer les deux avec une structure de données.
  - Sinon on peut utiliser **Extract Function** pour les séparer dans plusieurs fonctions.
  - Et si c’est des classes : **Extract Class**.
- **8 - Shotgun Surgery** : c’est l’inverse du Divergent Change, on a une fonctionnalité qui est dispersée à plusieurs endroits qu’il faut à chaque fois aller modifier.
  - On peut utiliser **Move Function** et **Move Field** pour replacer le code au même endroit.
  - Si on a des fonctions qui opèrent sur les mêmes données, on peut les associer avec **Combien Functions into Class**.
  - On peut aussi combiner le code éparpillé dans une grande fonction ou classe (avec **Inline Function** et **Inline Class**) avant de séparer ça en plus petites fonctions.
- **9 - Feature Envy** : on essaye en général d’avoir des modules à l’intérieur desquels il y a beaucoup de communication, et entre lesquels il y en a peu. On parle de feature envy quand un module communique plus avec du code ‘un module voisin qu’avec le module où il est.
  - En général on va utiliser **Move Function**, parfois précédé d’**Extract Function** si seule une partie de la fonction a besoin de changer d’endroit.
- **10 - Data Clumps** : quand on a un groupe de données qui se retrouvent toujours ensemble, c’est qu’elles doivent peut-être rejoindre une même structure.
  - On va d’abord chercher où ces données apparaissent sous forme de champs pour les extraire dans une nouvelle classe avec **Extract Class**.
    - On parle bien d’extraire dans une classe et pas dans une simple structure, parce que ça va permettre ensuite d’y ajouter du comportement propre à ces données, typiquement quand on a des Feature Envies.
  - Au niveau des paramètres des fonctions on va alors pouvoir utiliser **Introduce Parameter Object** et **Preserve Whole Object**.
- **11 - Primitive Obsession** : il s’agit d’utiliser des Value Objects à la place des types primitifs comme number ou string.
  - Exemple : un numéro de téléphone doit être validé, et correctement affiché.
  - La règle typique c’est **Replace Primitive with Object**.
  - Si le type primitif est impliqué dans une structure conditionnelle, on peut encapsuler les conditions dans une hiérarchie de classes avec **Replace Type Code with Subclasses** puis **Replace Conditionals with Polymorphism**.
- **12 - Repeated Switches** : on repère les switchs portant sur la même condition, et on les remplace par des classes.
  - Il s’agit d’utiliser **Replace Conditional with Polymorphism**.
- **13 - Loops** : les fonctions issues de la programmation fonctionnelle (map, filter, reduce) permettent de voir plus rapidement les éléments qui sont inclus et ce qui est fait avec eux, par rapport à des boucles.
  - On peut remplacer les boucles par des pipelines avec **Replace Loop with Pipeline**.
- **14 - Lazy Element** : parfois certaines classes ou fonctions sont inutiles.
  - Par exemple une fonction dont le corps se lit de la même manière que son nom, ou une classe qui n’a qu’une méthode et qui pourrait être une fonction.
  - On peut les éliminer avec **Inline Function** ou **Inline Class**.
  - Dans le cas où on veut réduire une hiérarchie de classe, on peut utiliser **Collapse Hierarchy**.
- **15 - Speculative Generality** : quand on ajoute des mécanismes de flexibilité pour plus tard, au cas où il y en aurait besoin. Il faut s’en débarrasser parce que YAGNI.
  - On peut se débarrasser de classes qui ne font pas grand chose avec **Collapse Hierarchy**.
  - Les délégations inutiles peuvent être éliminées avec **Inline Function** et **Inline Class**.
  - Les paramètres inutilisés par les fonctions peuvent être enlevés avec **Change Function Declaration**.
  - Si les seuls utilisateurs d’une fonction sont des tests, il faut les supprimer, puis appliquer **Remove Dead Code**.
- **16 - Temporary Field** : quand une classe contient un champ utilisé seulement dans certains cas, ça rend le code plus difficile à comprendre.
  - On peut utiliser **Extract Class** puis **Move Function** pour déplacer le code qui utilise le champ qui est à part.
  - Il se peut aussi qu’on puisse réduire le problème au fait de traiter le cas où les variables ne sont pas valides en utilisant **Introduce Special Case**.
- **17 - Message Chains** : il s’agit de longues chaînes d’appels d’objet en objet pour obtenir quelque chose au bout du compte. Si une des méthodes d’un des objets de la chaîne change, notre appelant doit changer aussi.
  - On peut utiliser **Hide Delegate** sur les objets intermédiaires.
  - Une autre solution est de voir si on peut utiliser **Extract Function** suivi de **Move Function** pour déplacer l’utilisation de la chaîne d’appels plus bas dans la chaîne.
- **18 - Middle Man** : il est normal d’encapsuler et de déléguer des choses, mais si une classe délègue la moitié de ses méthodes à une autre classe, c’est qu’il est peut être temps de s’interfacer directement avec la classe qui sait ce qui se passe.
  - La technique à utiliser est **Remove Middle Man**.
  - On peut aussi utiliser **Replace Superclass with Delegate** ou **Replace Subclass with Delegate** pour fondre le middle man dans la classe cible.
- **19 - Insider Trading** : il s’agit de code de modules différents qui communique trop entre eux, et donc un couplage trop important entre modules.
  - On peut utiliser **Move Function** et **Move Field** pour séparer le code qui ne devrait pas être trop couplé.
  - Dans le cas où les modules ont des choses en commun, on peut aussi en extraire une classe commune, ou utiliser **Hide Delegate** pour utiliser un module comme intermédiaire.
- **20 - Large Class** : une classe avec trop de champs doit être divisée en plusieurs classes.
  - On peut typiquement repérer les noms de variable qui partagent un préfixe ou suffixe commun, et utiliser **Extract Class**, ou encore **Extract Superclass** ou **Replace Type Code with Subclasses**.
  - Si la classe a trop de code, on va probablement avoir des duplications. Le mieux est alors de la refactorer en petites fonctions.
    - Par exemple pour une classe de 500 lignes, on peut refactorer en méthodes de 5 à 10 lignes, avec une dizaine de méthodes de 2 lignes extraites dans une classe à part.
  - Un bon indicateur pour découper une classe c’est en regardant le code qui l’utilise, souvent on peut repérer des parties dans la classe.
- **21 - Alternative Classes with Different Interfaces** : ça peut être intéressant de pouvoir substituer une classe par une autre. Pour ça il faut faire correspondre leur prototype en les faisant adhérer à une même interface.
  - Pour faire correspondre les deux classes, on peut utiliser **Change Function Declaration** et **Move Function**.
- **22 - Data Class** : les classes qui ont des getters/setters mais peu ou pas de logique sont un signe que la logique n’est pas au bon endroit.
  - Leurs champs publics doivent être encapsulés avec **Encapsulate Record**.
  - Les setters pour les méthodes qui ne doivent pas être changés doivent être enlevés avec **Remove Setting Method**.
  - Ensuite on peut chercher où ces getters et setters sont utilisés, et appliquer **Move Function** (et au besoin **Extract Function**) pour déplacer la logique dans la classe qu’on cherche à enrichir.
  - Il y a des exceptions : certaines classes peuvent être légitimes en tant que structure de données, et dans ce cas il n’y a pas besoin de getters et setters. Leurs champs seront immutables et donc n’auront pas besoin d’être encapsulés.
    - Exemple : la structure de données qui permet de communiquer entre les deux phases quand on utilise **Split Phase**.
- **23 - Refused Bequest** : parfois certaines classes filles refusent certaines implémentations venant du parent.
  - Il ne s’agit pas d’une forte odeur, donc on peut parfois le tolérer.
  - Si on veut régler le problème, on peut utiliser une classe soeur et pousser le code qui ne devrait pas être partagé vers elle avec **Push Down Method** et **Push Down Field**.
  - Parfois, ce n'est pas l’implémentation d’une méthode, mais l’interface que la classe fille ne veut pas. Dans ce cas l’odeur est beaucoup plus forte et il faut éliminer l’héritage pour le remplacer par de la délégation avec **Replace Subclass with Delegate** ou **Replace Superclass with Delegate**.
- **24 - Comments** : la plupart des commentaires cachent des code smells, et sont inutiles si on les refactore.
  - Quand on en rencontre, il faut essayer de voir si on ne peut mieux expliquer ce que fait un bloc de code avec **Extract Function** et **Change Function Declaration**. Ou encore déclarer des règles sur l’état du système avec **Introduce Assertion**.
  - Si malgré ça on a toujours besoin du commentaire, alors c’est qu’il est légitime. Il peut servir à décrire ce qui se passe, indiquer les endroits où on n’est pas sûr, ou encore expliquer pourquoi on a fait quelque chose.
