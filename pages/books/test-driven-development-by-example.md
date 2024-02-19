# Test Driven Development: By Example

### Preface

- TDD permet de **gérer la peur** pendant le développement : comme on avance pas à pas, avec chaque pas solidement ancré, on n’a plus peur de tomber, et donc on peut se concentrer sur les feedbacks, réfléchir et tenter des choses tranquillement.
- Plus on a un code complexe à développer, et plus on doit faire de petites étapes, pour pouvoir se reposer entre chaque étape, et que la difficulté soit en petits morceaux.
- Erich Gamma utilise l’expression **test infected** pour désigner le fait que la manière d’écrire le code est influencée par le TDD : on réfléchit plus souvent à ce qu’on fait, et on développe un code plus modulaire pour qu’il soit testable.
- Bien que le TDD soit très utile, il y a certains domaines pour lesquels il ne permet pas de faire de petites étapes, par exemple la sécurité et la concurrence, qui ne peuvent pas vraiment être reproduits par des tests automatisés.

### Introduction

- Kent raconte le moment où un client a demandé à leur boss et au tech lead, Ward Cunningham, s’ils pouvaient faire en sorte que **leur produit puisse gérer le multi-currency**.
  - WyCash est un produit permettant de gérer des produits financiers, développé par une petite équipe en quelques années en utilisant la POO.
    - Au départ, l’objet _Dollar_ avait été sous-traité, avec pour résultat qu’il contenait du calcul et du formatage.
    - L’équipe de Ward a finalement récupéré la responsabilité de l’objet, et l’a petit à petit vidé de sa logique de calcul et de formatage.
    - L’une des fonctionnalités les plus complexes était le _weighted average_. Son code avait petit à petit été rassemblé en un seul endroit appelé _AveragedColumn_.
  - Ward est parti sur **une petite expérimentation** sur _AveragedColumn_, pour vérifier si le multi-currency y était possible dans un temps raisonnable.
    - Il a remplacé _Dollar_ par un objet _Currency_ plus générique.
    - Il a finalement fait passer les tests existants, et s’est retrouvé suffisamment confiant pour dire à son boss que le multi-currency pouvait être implémenté.
- Pour pouvoir profiter de telles opportunités business, il faut :
  - De la **méthode** : que l’équipe de dev pratique le design incrémental au quotidien, et puisse utiliser cette expérience pour faire ce gros changement.
  - De la **motivation** : que l’équipe de devs comprenne l'importance de la tâche d’un point de vue business, pour se lancer dans un grand changement de design.
  - De l’**opportunité** : que le code et les tests associés soient dans un état qui permettent de facilement mettre en place ce changement sans tout casser.
- Au final, le TDD permet à une équipe de développeurs moyens de faire la même chose. Il suffit de suivre deux règles avec discipline :
  - **Écrire un test qui échoue avant d’écrire du code**.
  - **Enlever la duplication**.

## Part I - The Money Example

- Les étapes fondamentales du TDD sont :
  - 1 - Ajouter un test rapidement.
  - 2 - Jouer tous les tests, et voir un seul en erreur.
  - 3 - Faire un petit changement.
  - 4 - Jouer tous les tests et les voir en succès.
  - 5 - Refactorer pour enlever la duplication.
- Parmi les choses qui seront surprenantes :
  - A quel point chaque test couvre peu de fonctionnalités.
  - A quel point les changements initiaux sont petits et sales.
  - A quel point on joue souvent les tests.
  - Le nombre important d’étapes pour le refactoring.

### 1 - Multi-Currency Money

- Le logiciel gère des actions d’entreprises, et permet à un client de calculer le montant total de ses actions en dollars, en fonction du prix de chaque action.
  - La nouvelle fonctionnalité “multi-currency” consiste à ce que le montant des actions puisse être renseigné dans d’autres devises, sachant qu’à la fin on voudra quand même calculer le total de l’ensemble des actions en dollars.
  - On a l’information du taux de conversion entre devises dans une table.
- La première chose à faire en TDD est de se poser la question des** fonctionnalités qu’on veut, exprimées sous forme de tests**, qui s’ils passent prouveront que le code fait ce qu’on veut.
- On va créer une** todo list, qu’on va maintenir tout au long** de nos changements : dès qu’on a une nouvelle idée de chose qu’il faudra implémenter on l’ajoute, et dès qu’on en a fini une on la coche ou barre.
  - Dans l’état actuel, on a deux idées :
    - [ ] $5 + 10CHF = $10 si le taux est de 2:1
    - [ ] $5 2 = $10
- On commence par **écrire un test** pour la fonctionnalité de multiplication :
  ```typescript
  it("multiplies money value with given value", () => {
    const five = new Dollar(5);
    five.times(2);
    expect(five.amount).toBe(10);
  });
  ```
  - Des problèmes nous viennent en tête à propos de notre test :
    - Quid des side-effects dans la classe Dollar ?
    - La variable membre _amount_ devrait être privée.
    - Est-ce qu’on veut vraiment utiliser des entiers pour les valeurs ?
    - **On les met dans notre todo list, et on garde notre objectif de faire passer le test au vert rapidement**.
      - [ ] $5 + 10CHF = $10 si le taux est de 2:1
      - [ ] $5 2 = $10
      - [ ] Mettre "amount" en privé
      - [ ] Quid des side-effects de Dollar ?
- Il nous faut déjà **régler les erreurs de compilation**.
  - On va les régler une par une :
    - Créer la classe _Dollar_.
    - Lui ajouter une méthode _times_ qui ne fait rien.
    - Lui ajouter une variable membre _amount_.
    ```typescript
    class Dollar {
      public amount: number = 0;
      times(multiplier: number) {}
    }
    ```
- On peut enfin **jouer le test et le voir échouer**.
- On fait **passer le test de la manière la plus rapide** :
  ```typescript
  class Dollar {
    public amount: number = 10;
    times(multiplier: number) {}
  }
  ```
- On va maintenant **enlever la duplication** :

  - Elle se situe ici entre le code et le test.
  - On peut commencer par remplacer `10` par `5 * 2`.
    ```typescript
    class Dollar {
      public amount: number = 5 * 2;
      times(multiplier: number) {}
    }
    ```
  - On peut ensuite déplacer le `5 * 2` dans la méthode _times_.

    ```typescript
    class Dollar {
      public amount: number;

      constructor() {
        this.mount = 0;
      }

      times(multiplier: number) {
        return 5 * 2;
      }
    }
    ```

  - Puis on peut remplacer le 5 qui est en fait la variable member _amount_.

    ```typescript
    class Dollar {
      public amount: number;

      constructor() {
        this.mount = 0;
      }

      times(multiplier: number) {
        this.amount *= 2;
      }
    }
    ```

  - Et enfin on peut remplacer le 2 qui est le paramètre _multiplier_.

    ```typescript
    class Dollar {
      public amount: number;

      constructor() {
        this.mount = 0;
      }

      times(multiplier: number) {
        this.amount *= multiplier;
      }
    }
    ```

  - Le test passe toujours.

- La raison pour laquelle on enlève la duplication est pour enlever des dépendances, parce que **la duplication est le symptôme de la dépendance**.
  - L’idée est de faire en sorte que le prochain test puisse être passé au vert en un seul changement, et non pas en ayant à changer le code en plusieurs endroits.
- Les étapes au moment du refactoring sont **extrêmement petites**. Kent **ne code pas toujours comme ça, mais il _peut_ coder comme ça**.
  - Il faut s’exercer à le faire : si on sait coder par étapes extrêmement petites, alors on saura doser jusqu'à la bonne étape, alors que si on ne sait coder que par grandes étapes, on ne saura pas si on descend suffisamment petit.

### 2 - Degenerate Objects

- Le TDD consiste vraiment à **privilégier le fait que ça marche en premier**, avant de faire en sorte d’avoir du clean code.
  - Si on a une solution évidente en tête, on peut toujours l’écrire, mais si la solution “évidente” met une minute, il vaut mieux commencer par une solution qui marche en quelques secondes.
- On en est à cet état de la todo list :
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5\* 2 = $10
  - [ ] Mettre "amount" en privé
  - [ ] Quid des side-effects de Dollar ?
- Avec la version actuelle, on a un problème de side-effect : si on appelle plusieurs fois _times()_ sur un objet _Dollar_, la valeur du dollar sera modifiée plusieurs fois.
  - Une idée qui nous vient immédiatement est de faire en sorte que _times()_ retourne une nouvelle instance de _Dollar_ au lieu de modifier celle sur laquelle il est appelé.
  - On va donc changer le test pour qu’il vérifie que ce side-effect ne se produise plus.
    ```typescript
    it("multiplies money value with given value", () => {
      const five = new Dollar(5);
      let product = five.times(2);
      expect(product.amount).toBe(10);
      product = five.times(3);
      expect(product.amount).toBe(15);
    });
    ```
    - Le fait d’avoir un sentiment de code smell, et de pouvoir le retranscrire facilement sous forme de test est un skill qui arrive avec l’expérience.
  - Puis on change la déclaration de Dollar pour que le code compile.
    ```typescript
    class Dollar {
      // ...
      times(multiplier: number) {
        this.amount *= multiplier;
        return new Dollar();
      }
    }
    ```
  - Et enfin on fait passer le test en changeant l’implémentation de times de la bonne manière.
    ```typescript
    class Dollar {
      // ...
      times(multiplier: number) {
        return new Dollar(this.amount * multiplier);
      }
    }
    ```
- Et voilà un item de plus fait sur notre todo list :
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5\* 2 = $10
  - [ ] Mettre "amount" en privé
  - [x] Quid des side-effects de Dollar ?
- Ca fait deux techniques pour faire passer le test :
  - 1 - **Utiliser d’abord des valeurs en dur**, puis remplacer graduellement par des variables et du vrai code comme dans le chapitre 1.
  - 2 - **Écrire directement l’implémentation évidente** comme dans ce chapitre.
  - Kent utilise la 2 tant que tout va bien, et dès qu’il tombe sur des tests qui restent rouges, il repasse sur la 1 et reprend une approche plus incrémentale pour faire passer le test au vert. Puis il repasse à la 2 dès qu’il reprend confiance.
  - Il y a une 3ème technique exposée dans le chapitre d’après.

### 3 - Equality for All

- _Dollar_ est en fait un **Value Object**.
  - Ça a l’avantage qu’il ne posera pas de problèmes d’_aliasing_, c’est-à-dire qu’une instance quelque part n’affectera pas une autre instance ailleurs dans le code.
  - Il lui manque une méthode _equals()_ parce que deux _value objects_ qui ont les mêmes attributs sont censés être égaux, et une méthode _hashCode()_ pour qu’il puisse être la clé d’une hashMap.
  - On ajoute ces éléments à notre todo list :
    - [ ] $5 + 10CHF = $10 si le taux est de 2:1
    - [x] $5\* 2 = $10
    - [ ] Mettre "amount" en privé
    - [x] Quid des side-effects de Dollar ?
    - [ ] equals()
    - [ ] hashCode()
- On va implémenter _equals()_, pour ça on commence par un test.
  ```typescript
  it("equals to object with the same attributes", () => {
    expect(new Dollar(5).equals(new Dollar(5))).toBe(true);
  });
  ```
- On fait ensuite une implémentation minimale.
  ```typescript
  class Dollar {
    // ...
    equals(object: Dollar) {
      return true;
    }
  }
  ```
- On va alors ajouter un deuxième cas dans le test, pour créer une **triangulation**.
  ```typescript
  it("equals to object with the same attributes", () => {
    expect(new Dollar(5).equals(new Dollar(5))).toBe(true);
    expect(new Dollar(5).equals(new Dollar(6))).toBe(false);
  });
  ```
- On va donc **généraliser le code** pour qu’il réponde aux deux exemples.
  ```typescript
  class Dollar {
    // ...
    equals(object: Dollar) {
      return this.amount === object.amount;
    }
  }
  ```
- On peut cocher equals :
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 2 = $10
  - [ ] Mettre "amount" en privé
  - [x] Quid des side-effects de Dollar ?
  - [x] equals()
  - [ ] hashCode()
- La **technique de la triangulation** est à utiliser quand on n’arrive pas à trouver la solution, elle permet de réfléchir d’un autre point de vue.

### 4 - Privacy

- Si on regarde notre premier test, on peut maintenant **le refactorer en utilisant la méthode _equals_ qu’on vient d’implémenter**.
  - On va commencer par modifier la première assertion :
    ```typescript
    it("multiplies money value with given value", () => {
      const five = new Dollar(5);
      let product = five.times(2);
      expect(product.equals(new Dollar(10))).toBe(true);
      product = five.times(3);
      expect(product.amount).toBe(15);
    });
    ```
  - Puis on peut modifier la 2ème assertion :
    ```typescript
    it("multiplies money value with given value", () => {
      const five = new Dollar(5);
      let product = five.times(2);
      expect(product.equals(new Dollar(10))).toBe(true);
      product = five.times(3);
      expect(product.equals(new Dollar(15))).toBe(true);
    });
    ```
  - Et enfin on peut inliner la variable product qui n’est plus utile :
    ```typescript
    it("multiplies money value with given value", () => {
      const five = new Dollar(5);
      expect(five.times(2).equals(new Dollar(10))).toBe(true);
      expect(five.times(3).equals(new Dollar(15))).toBe(true);
    });
    ```
- L’attribut amount dans Dollar n’étant plus utilisé nulle part en dehors de sa classe, on peut le rendre privé.
  ```typescript
  class Dollar {
    private amount: number;
    // ...
  }
  ```
- On peut alors cocher l’élément dans la todo list :
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 2 = $10
  - [x] Mettre "amount" en privé
  - [x] Quid des side-effects de Dollar ?
  - [x] equals()
  - [ ] hashCode()
- On vient d’**utiliser dans le test une fonctionnalité qu’on a développée dans le code**, pour réduire le couplage entre le test et le code.
  - Cet usage nous expose au potentiel échec de notre test si la fonctionnalité equals se met à ne plus marcher.
  - On va le faire malgré ce risque, parce qu’on estime que l’avantage est plus important que l’inconvénient.

### 5 - Franc-ly Speaking

- Le 1er item de la todo list est **trop complexe pour l’implémenter d’un coup**. On va donc ajouter un autre item qui consiste à faire la même chose que ce qu’on a fait avec des dollars, mais cette fois avec des francs suisses.
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 2 = $10
  - [x] Mettre "amount" en privé
  - [x] Quid des side-effects de Dollar ?
  - [x] equals()
  - [ ] hashCode()
  - [ ] 5 CHF \* 2 = 10 CHF
- On peut copier notre test de multiplication de dollars, et l’adapter pour les francs :
  ```typescript
  it("multiplies francs value with given value", () => {
    const five = new Franc(5);
    expect(five.times(2).equals(new Franc(10))).toBe(true);
    expect(five.times(3).equals(new Franc(15))).toBe(true);
  });
  ```
- Ensuite on va faire passer le test le plus vite possible. Pour ça, on duplique la classe _Dollar_ :

  ```typescript
  class Franc {
    private amount: number;

    constructor() {
      this.mount = 0;
    }

    times(multiplier: number) {
      return new Franc(this.amount * multiplier);
    }

    equals(object: Franc) {
      return this.amount === object.amount;
    }
  }
  ```

- On peut cocher l’item de multiplication avec des francs, mais on doit ajouter d’autres problèmes à régler à propos de la duplication entre _Franc_ et _Dollar_.
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 2 = $10
  - [x] Mettre "amount" en privé
  - [x] Quid des side-effects de Dollar ?
  - [x] equals()
  - [ ] hashCode()
  - [x] 5 CHF \* 2 = 10 CHF
  - [ ] Duplication entre Dollar et Franc
  - [ ] equals à mettre en commun
  - [ ] times à mettre en commun

### 6 - Equality for All, Redux

- On va s’attaquer à la **duplication entre les deux classes**, et mettre en commun le _equals_. On **joue les tests** après chaque étape de refactoring.
- On va créer une classe mère _Money_.
  ```typescript
  class Money {}
  ```
- On peut alors faire hériter _Dollar_ de _Money_ :
  ```typescript
  class Dollar extends Money {
    // …
  }
  ```
- On peut maintenant déplacer la variable _amount_ vers Money.

  ```typescript
  class Money {
    protected amount: number;

    constructor() {
      this.amount = 0;
    }
  }
  ```

- On va passer à equals, en changeant le type de ce qu’il prend en paramètre.
  ```typescript
  class Dollar extends Money {
    // …
    equals(object: Money) {
      return this.amount === object.amount;
    }
  }
  ```
- On peut alors déplacer _equals_ vers _Money_.
  ```typescript
  class Money {
    // …
    equals(object: Money) {
      return this.amount === object.amount;
    }
  }
  ```
- On peut maintenant s’occuper du _equals_ dans _Franc_. Mais on se rend compte qu’il n’est **pas couvert par des tests**. On va alors **ajouter ces tests** avant de faire le refactoring.
  ```typescript
  it("equals to object with the same attributes", () => {
    expect(new Dollar(5).equals(new Dollar(5))).toBe(true);
    expect(new Dollar(5).equals(new Dollar(6))).toBe(false);
    expect(new Franc(5).equals(new Franc(5))).toBe(true);
    expect(new Franc(5).equals(new Franc(6))).toBe(false);
  });
  ```
- On peut faire hériter Franc de Money, supprimer la variable membre _amount_ dans _Franc_.
  ```typescript
  class Franc extends Money {
    // …
  }
  ```
- On peut alors refactorer _equals_ suffisamment pour **qu’il soit le même que le parent**, auquel cas on pourra le supprimer.
- Voilà, on peut cocher la mise en commun d’_equals_.
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 2 = $10
  - [x] Mettre "amount" en privé
  - [x] Quid des side-effects de Dollar ?
  - [x] equals()
  - [ ] hashCode()
  - [x] 5 CHF \* 2 = 10 CHF
  - [ ] Duplication entre Dollar et Franc
  - [x] equals à mettre en commun
  - [ ] times à mettre en commun
  - [ ] Comparer les Francs et les Dollars

### 7 - Apples and Oranges

- On va traiter la comparaison entre les Francs et les Dollars. Pour ça on ajoute un cas dans le test d’égalité, disant que les Dollars ne sont pas égaux aux Francs.
  ```typescript
  it("equals to object with the same attributes", () => {
    expect(new Dollar(5).equals(new Dollar(5))).toBe(true);
    expect(new Dollar(5).equals(new Dollar(6))).toBe(false);
    expect(new Franc(5).equals(new Franc(5))).toBe(true);
    expect(new Franc(5).equals(new Franc(6))).toBe(false);
    expect(new Franc(5).equals(new Dollar(5))).toBe(false);
  });
  ```
- Le test échoue. On peut le faire passer en vérifiant la classe au moment de l’égalité.
  ```typescript
  class Money {
    // …
    equals(object: Money) {
      return (
        this.amount === object.amount && this.constructor === object.constructor
      );
    }
  }
  ```
- Il y a un code smell à utiliser un élément technique de TypeScript pour la vérification d’égalité, on aurait sans doute besoin du concept de devise, mais on met de côté cette idée pour l’instant en l’ajoutant à notre todo list.
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 2 = $10
  - [x] Mettre "amount" en privé
  - [x] Quid des side-effects de Dollar ?
  - [x] equals()
  - [ ] hashCode()
  - [x] 5 CHF \* 2 = 10 CHF
  - [ ] Duplication entre Dollar et Franc
  - [x] equals à mettre en commun
  - [ ] times à mettre en commun
  - [ ] Ajouter le concept devise
  - [x] Comparer les Francs et les Dollars
