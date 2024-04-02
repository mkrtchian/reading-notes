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
- On va créer une **todo list, qu’on va maintenir tout au long** de nos changements : dès qu’on a une nouvelle idée de chose qu’il faudra implémenter, on l’ajoute, et dès qu’on en a fini une on la coche ou la barre.
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
      constructor(public amount: number) {}

      times(multiplier: number) {
        return 5 * 2;
      }
    }
    ```

  - Puis on peut remplacer le 5 qui est en fait la variable member _amount_.

    ```typescript
    class Dollar {
      constructor(public amount: number) {}

      times(multiplier: number) {
        this.amount *= 2;
      }
    }
    ```

  - Et enfin on peut remplacer le 2 qui est le paramètre _multiplier_.

    ```typescript
    class Dollar {
      constructor(public amount: number) {}

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
    constructor(private amount: number) {}

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
    constructor(protected amount: number) {}
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

### 8 - Makin’ Objects

- On aimerait aller vers la mise en commun de _times_, pour aboutir à **l’élimination des classes Dollar et Franc qui ne sont pas suffisamment différentes pour justifier leur existence**, mais c’est un peu complexe.
- On peut déjà typer la méthode _equals_ dans les deux classes, pour dire qu’elle retourne un _Money_.
  ```typescript
  class Dollar extends Money {
    // ...
    times(multiplier: number): Money {
      return new Dollar(this.amount * multiplier);
    }
  }
  ```
- On peut ensuite faire en sorte de ne plus utiliser les classes _Dollar_ et _Franc_ dans les tests. Pour ça on va remplacer l’instanciation des classes par des **méthodes factory sur la classe Money**.
  ```typescript
  it("multiplies dollars value with given value", () => {
    const five = new Money.dollar(5);
    expect(five.times(2).equals(Money.dollar(10))).toBe(true);
    expect(five.times(3).equals(Money.dollar(15))).toBe(true);
  });
  ```
- Le compilateur indique que _Money_ n’a pas de méthode _times_. On va l’ajouter en mode _abstract_, et en profiter pour faire de _Money_ une classe _abstract_ aussi.
  ```typescript
  abstract class Money {
    // ...
    abstract times(multiplier: number): Money;
  }
  ```
- Puis on crée la méthode factory.
  ```typescript
  class Money {
    // ...
    static dollar(amount: number) {
      return new Dollar(amount);
    }
  }
  ```
- On peut maintenant remplacer toutes les instanciations de _Dollar_ dans les tests par la méthode factory.
- On fait le même changement pour _Franc_, en changeant un test, ajoutant la méthode factory dans Money, puis enlevant toutes les instanciations dans les tests.
- On remarque au passage que **le test de multiplication du Franc sera redondant** avec celui de Dollar dès que la méthode times sera mise en commun.
- On l’ajoute à notre todo list :
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
  - [ ] Supprimer le test de multiplication du Franc

### 9 - Times We’re Livin’ In

- On va s’attaquer au concept de **devise**, en commençant par un test.
  ```typescript
  it("returns the currency", () => {
    expect(Money.dollar(1).currency()).toBe("USD");
    expect(Money.franc(1).currency()).toBe("CHF");
  });
  ```
- On ajoute currency dans _Money_ en tant que méthode abstraite.
  ```typescript
  class Money {
    abstract currency(): string;
    // ...
  }
  ```
- Puis on l’implémente dans les classes filles.
  ```typescript
  class Dollar extends Money {
    // ...
    currency() {
      return "USD";
    }
  }
  ```
- On peut **refactorer** pour avoir la devise dans une variable membre, sur Dollar et Franc.

  ```typescript
  class Dollar extends Money {
    private _currency: string;

    constructor(protected amount: number) {
      this._currency = currency;
    }
    // ...
    currency() {
      return this._currency;
    }
  }
  ```

- On peut alors faire remonter la déclaration de la variable \__currency_ et de la méthode _currency_ dans la classe parente.
  ```typescript
  class Money {
    protected _currency: string;
    // ...
    currency() {
      return this._currency;
    }
  }
  ```
- On remarque qu’on instancie les classes _Franc_ et _Dollar_ dans leurs méthodes _times_. On peut les remplacer par l’appel à la méthode factory du parent.
  - Il s’agit d’une digression, mais tant qu’elle est rapide c’est OK.
  - Jim Coplien a dit à Kent la règle qu’**une digression ne doit pas être elle-même interrompue par une autre digression**.
  ```typescript
  class Dollar extends Money {
    // ...
    times(multiplier: number) {
      return Money.dollar(this.amount * multiplier);
    }
  }
  ```
- On remarque que le constructeur des deux classes _Dollar_ et _Franc_ est presque identique, il n’y a que \__currency_ qu’il faut extraire pour le déplacer dans _Money_. On va l’extraire dans la méthode factory.
  - D’abord on ajoute currency au constructeur de _Dollar_ et _Franc_.
    ```typescript
    class Dollar extends Money {
      // ...
      constructor(
        protected amount: number,
        currency: string
      ) {
        this._currency = "USD";
      }
    }
    ```
  - Puis on peut mettre la valeur de la _currency_ en dur dans les méthodes factory.
    ```typescript
    class Money {
      dollar(amount: number) {
        return new Dollar(amount, "USD");
      }
    }
    ```
  - Et enfin on peut assigner le paramètre currency du constructeur à la variable membre.
    ```typescript
    class Dollar extends Money {
      // ...
      constructor(
        protected amount: number,
        protected _currency: string
      ) {}
    }
    ```
- On va ensuite faire la même chose pour _Franc_, cette fois avec une grande étape plutôt que 3 petites, parce qu’on se sent à l’aise.
- Les deux constructeurs sont identiques. On peut pousser l’implémentation dans la classe mère.

  ```typescript
  class Money {
    // ...
    constructor(
      protected amount: number,
      protected _currency: string
    ) {}
  }

  class Dollar extends Money {
    // ...
    constructor(amount: number, currency: string) {
      super(amount, currency);
    }
  }
  ```

- On peut cocher l'histoire des devises :
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
  - [x] Ajouter le concept devise
  - [x] Comparer les Francs et les Dollars
  - [ ] Supprimer le test de multiplication du Franc

### 10 - Interesting Times

- On va maintenant essayer de rendre les deux méthodes _times_ identiques pour pouvoir le **remonter dans la classe parente**.
- On va défaire ce qu’on a fait au chapitre précédent : on va inliner l’appel à la méthode factory dans les deux méthodes _times_.
  ```typescript
  class Dollar extends Money {
    // ...
    times(multiplier: number) {
      return new Dollar(this.amount * multiplier, "USD");
    }
  }
  ```
- On peut alors remplacer la valeur de la devise en dur par la variable membre _\_currency_.
  ```typescript
  class Dollar extends Money {
    // ...
    times(multiplier: number) {
      return new Dollar(this.amount * multiplier, this._currency);
    }
  }
  ```
- On se demande maintenant si on peut remplacer l’instanciation de _Dollar_ par celle de _Money_ pour que les méthodes _times_ soient identiques. Kent propose qu’**au lieu d’y réfléchir, on essaye, et on laisse les tests nous dire si ça marche**.
  - On fait le remplacement dans les méthodes _times_.
    ```typescript
    class Dollar extends Money {
      // ...
      times(multiplier: number) {
        return new Money(this.amount * multiplier, this._currency);
      }
    }
    ```
  - Pour pouvoir compiler, il faut que la classe _Money_ ne soit plus abstraite.
    ```typescript
    class Money {
      // ...
      times(amount: number) {
        return null;
      }
    }
    ```
  - On obtient une erreur de l’un des tests, il semblerait que la méthode equals ne passe pas parce qu’elle vérifie que la classe est exactement la bonne en vérifiant l’égalité par rapport au constructeur de _Franc_ et _Dollar_.
  - On pourrait écrire un nouveau test et modifier _equals_, mais on a déjà un test rouge, et **il ne faut pas écrire de test sur un test rouge**. On va donc **revenir en arrière** sur notre changement de _Dollar_ par _Money_, le temps de corriger _equals_.
    ```typescript
    class Dollar extends Money {
      // ...
      times(multiplier: number) {
        return new Dollar(this.amount * multiplier, this._currency);
      }
    }
    ```
- On va ensuite ajouter un test pour vérifier l’égalité d’un _Money_ et d’un _Dollar_ avec la même valeur et la même devise.
  ```typescript
  it("money and dollar with same parameters are equal", () => {
    expect(new Money(10, "USD").equals(new Dollar(10, "USD"))).toBe(true);
  });
  ```
- Le test échoue, et on peut le faire passer.
  ```typescript
  class Dollar extends Money {
    // ...
    equals(object: Money) {
      return (
        this.amount === object.amount && this.currency() === object.currency()
      );
    }
  }
  ```
- On peut maintenant retourner à nouveau un _Money_ dans les deux implémentations de _times_, et les tests passent.
  ```typescript
  class Dollar extends Money {
    // ...
    times(multiplier: number) {
      return new Money(this.amount * multiplier, this._currency);
    }
  }
  ```
- Les deux implémentations de times étant identiques, on peut le remonter.
  ```typescript
  class Money {
    // ...
    times(multiplier: number) {
      return new Money(this.amount * multiplier, this._currency);
    }
  }
  ```
- Et on peut cocher la méthode times à mettre en commun :
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 2 = $10
  - [x] Mettre "amount" en privé
  - [x] Quid des side-effects de Dollar ?
  - [x] equals()
  - [ ] hashCode()
  - [x] 5 CHF \* 2 = 10 CHF
  - [ ] Duplication entre Dollar et Franc
  - [x] equals à mettre en commun
  - [x] times à mettre en commun
  - [x] Ajouter le concept devise
  - [x] Comparer les Francs et les Dollars
  - [ ] Supprimer le test de multiplication du Franc

### 11 - The Root of All Evil

- On va supprimer l’utilisation des classes _Dollar_ et _Franc_ pour pouvoir les supprimer.
  - D’abord on remplace par _Money_ dans les méthodes factory.
    ```typescript
    class Money {
      // ...
      dollar(amount: number) {
        return new Money(amount, "USD");
      }
    }
    ```
  - On venait juste de faire un test pour vérifier l’égalité entre instances de _Money_ et _Dollar_, **ce test peut être supprimé**.
  - On en profite pour revoir l’autre test qui porte sur l’égalité pour enlever des assertions qui ont l’air redondantes avec les autres.
    ```typescript
    it("equals to object with the same attributes", () => {
      expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true);
      expect(Money.dollar(5).equals(Money.dollar(6))).toBe(false);
      expect(Money.franc(5).equals(Money.dollar(5))).toBe(false);
    });
    ```
  - On remarque que maintenant que _Franc_ et _Dollar_ disparaissent, le test de multiplication utilisant des francs n’est plus vraiment nécessaire, celui qui teste en utilisant des dollars est suffisant . On le supprime.
- On peut alors supprimer **effectivement les classes _Dollar_ et _Franc_** qui ne sont plus utilisées nulle part.
- Notre todo list :
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 2 = $10
  - [x] Mettre "amount" en privé
  - [x] Quid des side-effects de Dollar ?
  - [x] equals()
  - [ ] hashCode()
  - [x] 5 CHF \* 2 = 10 CHF
  - [x] Duplication entre Dollar et Franc
  - [x] equals à mettre en commun
  - [x] times à mettre en commun
  - [x] Ajouter le concept devise
  - [x] Comparer les Francs et les Dollars
  - [x] Supprimer le test de multiplication du Franc

### 12 - Addition, Finally

- On va réécrire notre todo list, en enlevant ce qui n’est pas pertinent :
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
- L’addition avec des devises différentes est trop complexe pour être implémentée d’un coup, on va donc **ajouter un cas plus simple d’addition**.
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [ ] $5 + $5 = $10
- On va ajouter un test pour ce cas simple.
  ```typescript
  it("adds two money values in the resulting one", () => {
    const sum = Money.dollar(5).plus(Money.dollar(5));
    expect(sum).toBe(10);
  });
  ```
- Et on va écrire le code du premier coup.
  ```typescript
  class Money {
    // ...
    plus(addend: Money) {
      return new Money(this.amount + addend.amount, this._currency);
    }
  }
  ```
- On se pose un peu et **on réfléchit à notre test** : on aimerait que l’essentiel du code ne soit pas au courant qu’il y a plusieurs devises.
  - On pourrait convertir immédiatement une valeur monétaire en une monnaie de référence, mais ça ne permet pas de faire varier facilement les taux de change.
  - On peut créer un **objet imposteur**, qui va avoir la même interface, mais se comporter différemment. Il va s’agir d’une **expression**, pouvant prendre la forme la plus simple qui est la valeur monétaire, mais aussi des formes plus complexes comme une somme de plusieurs valeurs monétaires.
    - Il s’agit ici d’une idée de design qui nous est venue.
    - Le TDD ne garantit pas qu’on en aura, mais il permet de faire en sorte que le code soit dans un état qui permet facilement d’appliquer les idées de design qui nous viennent.
    - Et il nous fait réfléchir au design en réfléchissant d’abord à la manière d’utiliser notre code.
- On va donc **réécrire notre test**, on a déjà l’assertion finale en tête.
  ```typescript
  it("adds two money values in the resulting one", () => {
    // ...
    expect(Money.dollar(10).equals(reduced)).toBe(true);
  });
  ```
- On va introduire un élément qui fait la réduction vers la valeur monétaire à partir de la somme obtenue. Ça peut être une banque.
  ```typescript
  it("adds two money values in the resulting one", () => {
    // ...
    const reduced = bank.reduce(sum, "USD");
    expect(Money.dollar(10).equals(reduced)).toBe(true);
  });
  ```
  - On aurait pu tout autant choisir de mettre la logique de réduction dans l’objet _sum_ lui-même, mais on fait ce choix dans un premier temps parce que :
    - 1 - Les expressions semblent être un élément central, et donc on préfère les laisser simples et indépendants, pour qu’ils soient facilement testables et réutilisables.
    - 2 - Il risque d’y avoir beaucoup d’opérations du même genre, et les mettre dans le concept d’expression risque de le faire trop grossir.
- On peut alors introduire la banque, la somme qui est une expression, et la monnaie initiale.
  ```typescript
  it("adds two money values in the resulting one", () => {
    const five = Money.dollar(5);
    const sum = five.plus(five);
    const bank = new Bank();
    const reduced = bank.reduce(sum, "USD");
    expect(Money.dollar(10).equals(reduced)).toBe(true);
  });
  ```
- On va maintenant faire l’implémentation.
  - D’abord on fait compiler :
    ```typescript
    interface Expression {}
    ```
    ```typescript
    class Money implements Expression {
      // ...
      plus(addend: number): Expression {
        return new Money(this.amount + addend.amount, this._currency);
      }
    }
    ```
    ```typescript
    class Bank {
      reduce(source: Expression, to: string) {
        return null;
      }
    }
    ```
  - Ensuite on peut faire une fausse implémentation pour faire passer le test.
    ```typescript
    class Bank {
      reduce(source: Expression, to: string) {
        return Money.dollar(10);
      }
    }
    ```

### 13 - Make It

- Notre addition a une valeur en dur pour l’implémentation. Il faut enlever la duplication avec la valeur 10 dans les tests.
- Ici Kent trouve que le cas est plus difficile que quand il s’agissait de juste ajouter une variable au lieu de la valeur en dur, et donc **on va plutôt avancer** en ajoutant un point plus précis dans notre todo list, pour obtenir un objet Money à partir de la somme.
  - Et on ne coche pas l’addition dans notre todo list parce qu’il reste de la duplication et qu’on va l’enlever.
    - [ ] $5 + 10CHF = $10 si le taux est de 2:1
    - [ ] $5 + $5 = $10
    - [ ] Retourner Money à partir de $5 + $5
- On va écrire un **test plus précis** pour nous guider sur ce qu’est la somme. Ce test sera probablement **supprimé plus tard** parce qu’il va trop dans le bas niveau, mais là il nous aide à avancer.
  ```typescript
  it("returns a sum when using plus", () => {
    const five = Money.dollar(5);
    const sum = five.plus(five);
    expect(sum.augend.equals(five)).toBe(true);
    expect(sum.addend.equals(five)).toBe(true);
  });
  ```
- Puis on crée le code pour faire passer le test au vert.

  ```typescript
  class Sum implements Expression {
    constructor(
      public augend: Money,
      public addend: Money
    ) {}
  }

  class Money implements Expression {
    // ...
    plus(addend: Money): Expression {
      return new Sum(this, addend);
    }
  }
  ```

- Puis on écrit un autre test précis sur le cas de la réduction de l’objet _sum_.
  ```typescript
  it("reduces a sum of dollars to a dollar", () => {
    const sum = new Sum(Money.dollar(3), Money.dollar(4));
    const bank = new Bank();
    const result = bank.reduce(sum, "USD");
    expect(Money.dollar(7).equals(result)).toBe(true);
  });
  ```
- Puis on écrit l’implémentation de _Bank.reduce_ pour passer le test :
  ```typescript
  class Bank {
    reduce(source: Expression, to: string) {
      const sum = source;
      const amount = sum.augend.amount + sum.addend.amount;
      return new Money(amount, to);
    }
  }
  ```
  - On passe le test, mais on aimerait que **la méthode soit utilisable avec n’importe quelle _Expression_** et pas juste les _Sum_. Et on aimerait que les champs publics _amount_ soient encapsulés.
- On va donc déplacer une partie du code dans la classe _Sum_ pour que la **responsabilité de l’addition** soit au bon endroit.

  ```typescript
  class Bank {
    reduce(source: Expression, to: string) {
      const sum = source;
      return sum.reduce(to);
    }
  }

  class Sum implements Expression {
    // ...
    reduce(to: string) {
      const amount = this.augend.amount + this.addend.amount;
      return new Money(amount, to);
    }
  }
  ```

- Il nous vient aussi à l’idée que _Bank.reduce_ doit marcher quand il s’agit de traiter une expression qui est un objet _Money_. On l’ajoute à la todo list.
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [ ] $5 + $5 = $10
  - [ ] Retourner Money à partir de $5 + $5
  - [ ] Bank.reduce(Money)
- Et on va écrire un test pour ça.
  ```typescript
  it("reduces a dollar to a dollar", () => {
    const bank = new Bank();
    const result = bank.reduce(Money.dollar(1), "USD");
    expect(Money.dollar(1).equals(result)).toBe(true);
  });
  ```
- Puis on fait passer le test rapidement.
  ```typescript
  class Bank {
    reduce(source: Expression, to: string) {
      if (source instanceof Money) return source;
      const sum = source;
      return sum.reduce(to);
    }
  }
  ```
- Le test passe, mais c’est très moche. On voudrait en réalité que ça marche quelle que soit la classe, et idéalement avec **une interface uniforme**. On va donc utiliser le polymorphisme.
- La première étape est d’ajouter _reduce()_ sur _Money_ aussi.

  ```typescript
  class Bank {
    reduce(source: Expression, to: string) {
      if (source instanceof Money) return source.reduce(to);
      const sum = source;
      return sum.reduce(to);
    }
  }

  class Money implements Expression {
    // ...
    reduce(to: string) {
      return this;
    }
  }
  ```

- On peut alors ajouter _reduce()_ à _Expression_, et rendre _Bank.reduce_ plus agréable.

  ```typescript
  interface Expression {
    reduce(to: string);
  }

  class Bank {
    reduce(source: Expression, to: string) {
      return source.reduce(to);
    }
  }
  ```

- On peut cocher _Bank.reduce_ dans notre todo list, et en même temps il nous vient en tête la possibilité d’utiliser _Bank.reduce_ avec une conversion de devise, et la possibilité de donner l’objet _bank_ à _reduce_.
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [ ] $5 + $5 = $10
  - [ ] Retourner Money à partir de $5 + $5
  - [x] Bank.reduce(Money)
  - [ ] Reduce avec une conversion
  - [ ] Reduce(Bank, string)

### 14 - Change

- On va s’intéresser au cas de la **réduction avec conversion**.
  ```typescript
  it("reduces money from different currencies", () => {
    const bank = new Bank();
    bank.addRate("CHF", "USD", 2);
    const result = bank.reduce(Money.franc(2), "USD");
    expect(Money.dollar(1).equals(result)).toBe(true);
  });
  ```
- On fait passer le test rapidement.
  ```typescript
  class Money implements Expression {
    // ...
    reduce(to: string) {
      const rate = this.currency === "CHF" && to === "USD";
      return new Money(this.amount / rate, to);
    }
  }
  ```
- On préférerait que **la logique concernant les taux ne soit que dans la banque** et pas dans les expressions. On va donc passer la banque en paramètre à _Expression.reduce()_, comme on l’avait déjà pressenti en le mettant dans notre todo list.

  ```typescript
  interface Expression {
    reduce(bank: Bank, to: string);
  }

  class Sum implements Expression {
    // ...
    reduce(bank: Bank, to: string) {
      const amount = this.augend.amount + this.addend.amount;
      return new Money(amount, to);
    }
  }

  class Money implements Expression {
    // ...
    reduce(bank: Bank, to: string) {
      const rate = this.currency === "CHF" && to === "USD";
      return new Money(this.amount / rate, to);
    }
  }
  ```

- On peut maintenant déplacer la logique concernant le taux dans la banque.

  ```typescript
  class Bank {
    // ...
    rate(from: string, to: string) {
      return from === "CHF" && to === "USD" ? 2 : 1;
    }
  }

  class Money implements Expression {
    // ...
    reduce(bank: Bank, to: string) {
      const rate = bank.rate(this.currency, to);
      return new Money(this.amount / rate, to);
    }
  }
  ```

- Il reste encore de la duplication entre le test et le code du taux dans la banque qu’il faut généraliser. On va créer un objet _Pair_ pour porter les deux devises, et l’utiliser comme clé dans une hashmap, avec les taux comme valeur.

  - L’objet en question a besoin d’être un value object et donc avoir _equals_ et _hashCode_., mais on n’a pas besoin de le tester directement parce qu’il est déjà testé via la banque.
  - Pour le _hashCode_ on va mettre une valeur en dur pour l’instant.

  ```typescript
  class Pair {
    constructor(private from: string, private to: string) {}

    equals(other: Pair) {
      return this.from === other.from && this.to === other.to;
    }

    hashCode() {
      return 0;
    }
  }

  class Bank {
    constructor(private rates: Map&lt;number, number>) {}

    addRate(from: string, to: string, rate: number) {
      rates.set(new Pair(from, to).hashCode(), rate);
    }

    rate(from: string, to: string) {
      return this.rates.get(new Pair(from, to).hashCode());
    }
  }
  ```

- On tombe sur un test rouge, et en fait il se trouve que le cas où on demande le taux entre deux mêmes devises n’est pas par défaut traité comme un taux de conversion de 1.

  - On va donc écrire un test pour expliciter ce cas-là, et faire repasser les tests au vert.

  ```typescript
  it("uses a rate of 1 for the same currencies", () => {
    const bank = new Bank();
    expect(bank.rate("USD", "USD")).toBe(1);
  });

  class Bank {
    // ...
    rate(from: string, to: string) {
      if (from === to) return 1;
      return this.rates.get(new Pair(from, to).hashCode());
    }
  }
  ```

- On a donc réglé le cas du _reduce_ avec conversion, le fait que _reduce_ prenne la banque en paramètre, et plus généralement le cas de l’addition avec la même devise.
  - [ ] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 + $5 = $10
  - [ ] Retourner Money à partir de $5 + $5
  - [x] Bank.reduce(Money)
  - [x] Reduce avec une conversion
  - [x] Reduce(Bank, string)

### 15 - Mixed Currencies

- On va traiter la fameuse **addition multi-devise**. On écrit d’abord un test.
  ```typescript
  it("adds two expressions with different currencies", () => {
    const fiveBucks = Money.dollar(5);
    const tenFrancs = Money.francs(10);
    const bank = new Bank();
    bank.addRate("CHF", "USD", 2);
    const result = bank.reduce(fiveBucks.plus(tenFrancs), "USD");
    expect(result.equals(Money.dollar(10))).toBe(true);
  });
  ```
- On obtient quelques erreurs de typage, et le test échoue, on obtient 15 au lieu de 10. On va corriger le code de _Sum_ et appliquer le reduce sur les deux éléments de l’addition.
  ```typescript
  class Sum implements Expression {
    // ...
    reduce(bank: Bank, to: string) {
      const amount =
        this.augend.reduce(bank, to).amount +
        this.addend.reduce(bank, to).amount;
      return new Money(amount, to);
    }
  }
  ```
- On va généraliser les objets de type _Money_, en acceptant dans la plupart des cas des _Expression_.

  ```typescript
  class Sum implements Expression {
    constructor(
      public augend: Expression,
      public addend: Expression
    ) {}
    // ...
  }

  class Money implements Expression {
    // ...
    plus(addend: Expression) {
      return new Sum(this, addend);
    }

    times(multiplier: number): Expression {
      return new Money(this.amount * multiplier, this.currency);
    }
  }
  ```

- On va devoir ajouter _plus()_ et _times()_ dans _Expression_. On commence par _plus()_ qui est nécessaire pour le test qu’on a écrit.
  ```typescript
  interface Expression {
    // ...
    plus(addend: Expression): Expression;
  }
  ```
- On doit alors avoir le plus dans tous les objets qui implémentent l’interface, y compris dans _Sum_, dans lequel on peut pour l’instant mettre une fausse implémentation.
  ```typescript
  class Sum implements Expression {
    // ...
    plus(addend: Expression) {
      return null;
    }
  }
  ```
- On a donc notre addition avec différentes devises qui marche, et on ajoute dans la todo list l’implémentation de _Sum.plus_, et le fait de mettre _times_ dans _Expression_ aussi.
  - [x] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 + $5 = $10
  - [ ] Retourner Money à partir de $5 + $5
  - [x] Bank.reduce(Money)
  - [x] Reduce avec une conversion
  - [x] Reduce(Bank, string)
  - [ ] Implémentation de Sum.plus
  - [ ] Mettre times dans Expression

### 16 - Abstraction, Finally

- On va traiter l’implémentation de _Sum.plus_.
  ```typescript
  it("adds a sum and a money", () => {
    const fiveBucks = Money.dollar(5);
    const tenFrancs = Money.francs(10);
    const bank = new Bank();
    bank.addRate("CHF", "USD", 2);
    const sum = new Sum(fiveBucks, tenFrancs).plus(fiveBucks);
    const result = bank.reduce(sum, "USD");
    expect(result.equals(Money.dollar(15))).toBe(true);
  });
  ```
- Et ensuite le code.
  ```typescript
  class Sum implements Expression {
    // ...
    plus(addend: Expression) {
      return new Sum(this, addend);
    }
  }
  ```
- Pour Kent Beck, le TDD va en moyenne amener à produire **autant de code de test que de code de production**.
- On passe maintenant à _times_ qu’on veut remonter dans l’interface _Expression_. Il s’agit d'abord de le faire marcher sur _Sum_.
  ```typescript
  it("multiplies a sum with a value", () => {
    const fiveBucks = Money.dollar(5);
    const tenFrancs = Money.francs(10);
    const bank = new Bank();
    bank.addRate("CHF", "USD", 2);
    const sum = new Sum(fiveBucks, tenFrancs).times(2);
    const result = bank.reduce(sum, "USD");
    expect(result.equals(Money.dollar(20))).toBe(true);
  });
  ```
- Et le code.
  ```typescript
  class Sum implements Expression {
    // ...
    times(multiplier: number) {
      return new Sum(
        this.augend.times(multiplier),
        this.addend.times(multiplier)
      );
    }
  }
  ```
- Et on peut ajouter _times_ à _Expression_.
  ```typescript
  interface Expression {
    // ...
    times(multiplier: number): Expression;
  }
  ```
- On peut donc cocher nos deux derniers items.
  - [x] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 + $5 = $10
  - [ ] Retourner Money à partir de $5 + $5
  - [x] Bank.reduce(Money)
  - [x] Reduce avec une conversion
  - [x] Reduce(Bank, string)
  - [x] Implémentation de Sum.plus
  - [x] Mettre times dans Expression
- Il reste un élément dans notre todo list : le fait de retourner un objet Money à partir d’une addition dans l'objet Money. On va d’abord écrire le test, qui n’est pas tip top vu qu’il doit tester l’instance de classe renvoyée.
  ```typescript
  it("returns a money from the plus operation", () => {
    const sum = Money.dollar(1).plus(Money.dollar(1));
    expect(sum instanceof Money).toBe(true);
  });
  ```
- En regardant le code, on voit mal comment on ferait ça de manière à peu près propre.
  ```typescript
  class Money implements Expression {
    // ...
    plus(addend: Expression) {
      return new Sum(this, addend);
    }
  }
  ```
- On décide d’abandonner ce point et de supprimer ce test.
  - [x] $5 + 10CHF = $10 si le taux est de 2:1
  - [x] $5 + $5 = $10
  - [x] Retourner Money à partir de $5 + $5
  - [x] Bank.reduce(Money)
  - [x] Reduce avec une conversion
  - [x] Reduce(Bank, string)
  - [x] Implémentation de Sum.plus
  - [x] Mettre times dans Expression

### 17 - Money Retrospective

- Pour aller plus loin, on pourrait transformer _Expression_ en classe, pour porter la logique commune entre classes filles, comme par exemple la méthode _plus_.
- Kent considère que le code n’est jamais vraiment fini. Il conseille de manière générale de **faire en sorte que le code qu’on touche souvent soit super solide**, à la fois d’un point de vue du code et des tests, **alors que le code qui est plus périphérique peut être un peu plus négligé**.
  - L’important c’est d’être en permanence dans une situation où on a **confiance** dans le code qu’on maintient.
- Quand on a traité sa todo list, c’est le bon moment pour prendre un peu de recul et se demander si le design est cohérent, et s’il y a de la duplication de fond qui persiste.
- Kent est lui-même surpris par le fait que le choix des mots et les métaphores qu’on prend pour désigner les objets influencent grandement la manière dont on voit le problème, et donc le design du code qui en résulte.
- Quelques stats sur le Money example :
  - Pour coder cet exemple, Kent a joué les tests 125 fois, avec une minute entre les jeux en moyenne.
  - On se retrouve bien avec environ autant de code de test que de code de production, même si ici on pourrait factoriser le code des tests.
  - En moyenne, il a fallu changer un à deux endroits (faire passer le test, enlever la duplication) pour répondre à un test qui a été écrit.
- Quand les développeurs adoptent une technique comme le TDD, **le rôle des testeurs se rapproche de facilitateur entre les personnes qui ont les idées et ceux qui développent le code**.
- Parmi les métriques qu’on peut surveiller à propos des tests, il y a le **coverage**, et le _defect insertion_ (connu plus récemment comme **mutation testing**). Le TDD devrait amener à avoir un score très élevé sur les deux.
- Parmi les choses notables dans cette partie, on peut retenir :
  - Les **3 techniques** pour faire passer un test rapidement : la valeur en dur, la triangulation et l’implémentation évidente.
  - Le fait qu’**enlever la duplication** entre le code et le test aide à faire **avancer le design**.
  - Le fait de pouvoir **passer à du plus bas niveau sur les tests** quand on est face à une difficulté, et à l’inverse passer sur du plus haut niveau quand ça devient plus facile.

## II - The xUnit Example

### 18 - First Steps to xUnit

- Il s’agit d’**implémenter un framework de test**, donc on part du principe qu’on n’en a pas. C’est un exemple un peu plus compliqué que le premier.
- En réfléchissant un peu aux premières fonctionnalités, on a cette todo list en tête.
  - [ ] Exécuter la méthode à tester
  - [ ] Exécuter setUp en premier
  - [ ] Exécuter tearDown à la fin
  - [ ] Exécuter tearDown même si la méthode à tester échoue
  - [ ] Exécuter plusieurs tests
  - [ ] Montrer les résultats
- Pour vérifier qu’on exécute la méthode à tester, on peut choisir une méthode qui ne fait que mettre une variable à _true_. Le framework va initialiser la variable à _false_ au début, va exécuter la méthode, et vérifier qu’elle est passée à _true_.
  - Puisqu’on n’a pas de framework de test, **on écrit notre test directement dans un module qu’on va exécuter à la main**, et on observe le résultat dans la sortie standard.
    ```typescript
    const test = WasRun("testMethod");
    console.log(test.wasRun);
    test.testMethod();
    console.log(test.wasRun);
    ```
- On va écrire du code pour faire passer le test. D’abord la classe de test qui contient aussi la méthode à tester.

  ```typescript
  class WasRun {
    public wasRun: boolean;
    constructor() {
      this.wasRun = false;
    }

    testMethod() {}
  }
  ```

- On n’a plus d’erreurs à l’exécution, mais on obtient deux fois _false_. Il faut le corps de la méthode testée.
  ```typescript
  class WasRun {
    // ...
    testMethod() {
      this.wasRun = true;
    }
  }
  ```
- Maintenant qu’on a notre test au “vert”, on va faire des refactorings.
  - On va commencer par appeler une méthode plus générique dans le test pour lancer l’exécution du test, et utiliser le nom de la méthode donnée dans le constructeur de _WasRun_ pour la méthode qui sera appelée.
    ```typescript
    const test = WasRun("testMethod");
    console.log(test.wasRun);
    test.run();
    console.log(test.wasRun);
    ```
- Côté implémentation, il faut créer la méthode _run()_ pour faire passer rapidement le test au vert.
  ```typescript
  class WasRun {
    // ...
    run() {
      this.testMethod();
    }
  }
  ```
- On peut ensuite appeler la méthode à tester dynamiquement, depuis le nom donné au constructeur.

  ```typescript
  class WasRun {
    public wasRun: boolean;
    constructor(private name: string) {
      this.wasRun = false;
    }

    run() {
      const method = (this as any)[this.name];
      method && method();
    }
  }
  ```

- Comme notre classe _WasRun_ fait maintenant deux choses (savoir si la méthode a été appelée, et appeler la méthode dynamiquement), on peut créer une classe mère pour porter la 2ème fonctionnalité.

  - D’abord on la crée et on lui donne la variable _name_.

    ```typescript
    class TestCase {
      constructor(private name: string) {}
    }

    class WasRun extends TestCase {
      public wasRun: boolean;
      constructor(name: string) {
        super(name);
        this.wasRun = false;
      }

      run() {
        const method = (this as any)[this.name];
        method && method();
      }
      // ...
    }
    ```

  - Puis on y déplace la méthode _run()_.

    ```typescript
    class TestCase {
      constructor(private name: string) {}

      run() {
        const method = (this as any)[this.name];
        method && method();
      }
    }

    class WasRun extends TestCase {
      public wasRun: boolean;
      constructor(name: string) {
        super(name);
        this.wasRun = false;
      }
      // ...
    }
    ```

- On peut maintenant **utiliser notre classe _TestCase_ dans le test lui-même**, et en profiter pour **remplacer les affichages par des assertions**.

  ```typescript
  class TestCaseTest extends TestCase {
    testRunning() {
      const test = WasRun("testMethod");
      assert.strictEqual(test.wasRun, false);
      test.run();
      assert.strictEqual(test.wasRun, true);
    }
  }

  new TestCaseTest("testRunning").run();
  ```

- On a donc complété la 1ère étape de notre todo list.
  - [x] Exécuter la méthode à tester
  - [ ] Exécuter setUp en premier
  - [ ] Exécuter tearDown à la fin
  - [ ] Exécuter tearDown même si la méthode à tester échoue
  - [ ] Exécuter plusieurs tests
  - [ ] Montrer les résultats

### 19 - Set the Table

- Il arrive souvent que la partie arrange des tests se répète, pour autant, Kent déconseille de ne la jouer qu’une fois pour gagner en performance, parce que **le couplage entre les tests est très problématique**.
- On va créer un test pour notre fonctionnalité suivante : la méthode _setUp_.

  ```typescript
  class TestCaseTest extends TestCase {
    // ...
    testSetUp() {
      const test = WasRun("testMethod");
      test.run();
      assert.strictEqual(test.wasSetUp, true);
    }
  }

  new TestCaseTest("testSetUp").run();
  ```

- Pour faire passer le test, il nous faut ajouter la méthode _setUp_ dans _WasRun_, et l’appeler dans le parent _TestCase_ qui est le code de production (le code du framework de test).

  ```typescript
  class WasRun extends TestCase {
    public wasRun: boolean;
    public wasSetUp: boolean;

    constructor(name: string) {
      super(name);
      this.wasRun = false;
      this.wasSetUp = false;
    }

    setUp() {
      this.wasSetUp = true;
    }
  }

  class TestCase {
    constructor(private name: string) {}

    run() {
      this.setUp();
      const method = (this as any)[this.name];
      method && method();
    }

    setUp() {}
  }
  ```

- On peut maintenant faire des refactorings.

  - On commence par déplacer l’assignation initiale de la variable wasRun dans la méthode _setUp_ dans _WasRun_.

    ```typescript
    class WasRun extends TestCase {
      // ...

      constructor(name: string) {
        super(name);
        this.wasSetUp = false;
      }

      setUp() {
        this.wasRun = false;
        this.wasSetUp = true;
      }
    }
    ```

  - Vu que la méthode _setUp_ est testée, on peut maintenant se permettre de ne plus tester qu’à l’instanciation de _WasRun_, la variable _wasRun_ est _false_.
    ```typescript
    class TestCaseTest extends TestCase {
      testRunning() {
        const test = WasRun("testMethod");
        test.run();
        assert.strictEqual(test.wasRun, true);
      }
      // ...
    }
    ```
  - On va ensuite pouvoir surcharger la méthode _setUp_ sur notre classe de test _TestCaseTest_, pour soulager chaque méthode de test de la phase _arrange_. On sait que ce _setUp_ sera appelé au bon moment puisque c’est maintenant une fonctionnalité testée de notre framework de test.

    ```typescript
    class TestCaseTest extends TestCase {
      private test: WasRun | null;
      constructor() {
        this.test = null;
      }

      setUp() {
        this.test = new WasRun("testMethod");
      }

      testRunning() {
        this.test.run();
        assert.strictEqual(test.wasRun, true);
      }

      testSetUp() {
        this.test.run();
        assert.strictEqual(test.wasSetUp, true);
      }
    }
    ```

- On a donc terminé l’implémentation de la fonctionnalité setUp.
  - [x] Exécuter la méthode à tester
  - [x] Exécuter setUp en premier
  - [ ] Exécuter tearDown à la fin
  - [ ] Exécuter tearDown même si la méthode à tester échoue
  - [ ] Exécuter plusieurs tests
  - [ ] Montrer les résultats

### 20 - Cleaning Up After

- On réfléchit à la fonctionnalité _tearDown_, et il nous vient l’idée de vouloir tester correctement l’ordre d’exécution entre _setUp_, la méthode testée, et _tearDown_, on se dit qu’on peut le faire avec un log plutôt que des flags.
  - [x] Exécuter la méthode à tester
  - [x] Exécuter setUp en premier
  - [ ] Exécuter tearDown à la fin
  - [ ] Exécuter tearDown même si la méthode à tester échoue
  - [ ] Exécuter plusieurs tests
  - [ ] Montrer les résultats
  - [ ] Logger un string dans WasRun pour vérifier l'ordre d'exécution
- On va refactorer _WasRun_ pour qu’il utilise un log en interne.
  ```typescript
  class WasRun extends TestCase {
    // ...
    setUp() {
      this.wasRun = false;
      this.wasSetUp = true;
      this.log = "setUp ";
    }
  }
  ```
- Puis on peut changer le test de _setUp_ pour se baser sur le log.
  ```typescript
  class TestCaseTest extends TestCase {
    // ...
    testSetUp() {
      this.test.run();
      assert.strictEqual(this.test.log, "setUp ");
    }
  }
  ```
- On peut alors supprimer le flag _wasSetUp_ sur _WasRun_, et ajouter le log dans la méthode de test.
  ```typescript
  class WasRun extends TestCase {
    // ...
    testMethod() {
      this.wasRun = false;
      this.log = `${this.log}testMethod `;
    }
  }
  ```
- On peut alors mettre à jour le contenu du test de _setUp_ qui joue l’ensemble du code et donc contient l’ensemble du log.
  ```typescript
  class TestCaseTest extends TestCase {
    // ...
    testSetUp() {
      this.test.run();
      assert.strictEqual(this.test.log, "setUp testMethod");
    }
  }
  ```
  - On va en profiter pour supprimer le test de la méthode principale qui fait maintenant doublon, et renommer celui de _setUp_ en _testTemplateMethod_.
    ```typescript
    class TestCaseTest extends TestCase {
      // ...
      testTemplateMethod() {
        this.test.run();
        assert.strictEqual(this.test.log, "setUp testMethod");
      }
    }
    ```
  - Vu que la méthode _setUp_ dans _TestCaseTest_ n’est plus utile qu’à un seul test, on peut rapatrier son contenu dans le test (on défait le refactoring qu’on avait fait).
    ```typescript
    class TestCaseTest extends TestCase {
      // ...
      testTemplateMethod() {
        const test = WasRun("testMethod");
        test.run();
        assert.strictEqual(test.log, "setUp testMethod");
      }
    }
    ```
- On a donc terminé l’ajout de log dans _WasRun_ pour vérifier l’ordre d’exécution.
  - [x] Exécuter la méthode à tester
  - [x] Exécuter setUp en premier
  - [ ] Exécuter tearDown à la fin
  - [ ] Exécuter tearDown même si la méthode à tester échoue
  - [ ] Exécuter plusieurs tests
  - [ ] Montrer les résultats
  - [x] Logger un string dans WasRun pour vérifier l'ordre d'exécution
- On peut maintenant ajouter le cas de _tearDown_ dans le seul test qui teste déjà l’ordre d’exécution des deux autres méthodes.
  ```typescript
  class TestCaseTest extends TestCase {
    // ...
    testTemplateMethod() {
      const test = WasRun("testMethod");
      test.run();
      assert.strictEqual(test.log, "setUp testMethod tearDown ");
    }
  }
  ```
- Et on peut modifier le code directement pour faire passer le test.

  ```typescript
  class TestCase {
    // ...
    run() {
      this.setUp();
      const method = (this as any)[this.name];
      method && method();
      this.tearDown();
    }

    setUp() {}

    tearDown() {}
  }

  class WasRun extends TestCase {
    // ...
    setUp {
      this.log = "setUp ";
    }

    testMethod() {
      this.wasRun = false;
      this.log = `${this.log}testMethod `;
    }

    tearDown {
      this.log = `${this.log}tearDown `;
    }
  }
  ```

- On a donc implémenté _tearDown_.
  - [x] Exécuter la méthode à tester
  - [x] Exécuter setUp en premier
  - [x] Exécuter tearDown à la fin
  - [ ] Exécuter tearDown même si la méthode à tester échoue
  - [ ] Exécuter plusieurs tests
  - [ ] Montrer les résultats
  - [x] Logger un string dans WasRun pour vérifier l'ordre d'exécution
