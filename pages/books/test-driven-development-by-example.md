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
    ```
    $5 + 10CHF = $10 si le taux est de 2:1
    $5 * 2 = $10
    ```
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
    ```
    $5 + 10CHF = $10 si le taux est de 2:1
    $5 * 2 = $10
    Mettre "amount" en privé
    Quid des side-effects de Dollar ?
    ```
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
        return this.amount * 2;
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
        return this.amount * multiplier;
      }
    }
    ```

  - Le test passe toujours.

- La raison pour laquelle on enlève la duplication est pour enlever des dépendances, parce que **la duplication est le symptôme de la dépendance**.
  - L’idée est de faire en sorte que le prochain test puisse être passé au vert en un seul changement, et non pas en ayant à changer le code en plusieurs endroits.
- Les étapes au moment du refactoring sont **extrêmement petites**. Kent **ne code pas toujours comme ça, mais il _peut_ coder comme ça**.
  - Il faut s’exercer à le faire : si on sait coder par étapes extrêmement petites, alors on saura doser jusqu'à la bonne étape, alors que si on ne sait coder que par grandes étapes, on ne saura pas si on descend suffisamment petit.
