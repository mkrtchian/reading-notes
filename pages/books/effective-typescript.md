# Effective TypeScript

## 1 - Getting to Know TypeScript

### Item 1 : Understand the Relationship Between TypeScript and JavaScript

- Tout programme JavaScript est un programme TypeScript, mais l’inverse n’est pas vrai.
- Le transpiler TypeScript indique des problèmes y compris sur du code JavaScript pur.
- Il y a une **différence entre transpiler et type-checker** du code.
  - Le type-check est plus strict, et ne laisse pas passer certaines des bizarreries de JavaScript.

### Item 2 : Know Which TypeScript Options You’re Using

- On a la possibilité de choisir des options pour le type-checker. Parmi les plus importants que l’auteur conseille d’activer :
  - **noImplicitAny** : on empêche l’inférence automatique de type `any`. Les `any` ne seront autorisés que s’ils sont explicitement écrits.
  - **strictNullChecks** : on empêche l’assignation de `null` et d’`undefined` à n’importe quelle variable, sauf si on le définit explicitement.
    - Par exemple, on n’aura plus le droit de faire `const x: number = null;`.
    - Ca aide à repérer les cas où on va avoir une erreur _“Cannot read properties on undefined”_ au runtime.
  - **strict** : empêche la plupart des erreurs runtime que TypeScript peut éviter, et inclut les deux autres.

### Item 3 : Understand That Code Generation Is Independent of Types

- Le type-checking et la transpilation sont **indépendants**. On peut tout à fait transpiler avec _tsc_ du code qui a des erreurs au type-checker.
  - Un des avantages c’est qu’on peut exécuter le code avant même d’avoir fixé toutes les erreurs de type.
- Les types disparaissent et n’ont **aucun impact au runtime**.

  - Pour faire du type-checking au runtime, il faut se baser sur des objets JavaScript : par exemple des classes.
  - Les _tagged unions_ sont aussi courants :

    ```typescript
    interface Square {
      kind: "square";
      width: number;
    }
    interface Rectangle {
      kind: "rectandle";
      width: number;
      height: number;
    }
    type Shape = Square | Rectangle;

    function calculateArea(shape: Shape) {
      if(shape.kind === "rectangle") {
    // [...]
    ```

### Item 4 : Get Comfortable with Structural Typing

- Le typage de TypeScript est **structurel**. Ca veut dire qu’une valeur avec un type structurellement compatible sera acceptée, même si le type n’est pas exactement le même.
  - En pratique, ça veut surtout dire qu’un objet qui a des attributs supplémentaires pourra être passé là où on attendait un objet avec moins d’attributs.
  - C’est pour cette raison par exemple qu’`Object.keys(v)` ne renvoie pas le type des keys de l’objet mais des strings : **on n’est pas sûr qu’il n’y ait pas des attributs en plus**.
  - Ca s’applique aussi aux classes : attendre un type d’une classe ne garantit pas qu’on n’aura pas un objet custom ou une autre classe qui a au moins les mêmes attributs et éventuellement d’autres en plus.

### Item 5 : Limit Use of the `any` Type

- L’utilisation d’`any` ou d’`as any` permet de **désactiver le type-checking**, il faut l’éviter au maximum.
  - Il permet de “casser les contrats”, par exemple une fonction attendant un type précis acceptera quand même un objet qu’on a typé `any`.
  - Il empêche l’autocomplétion, et même le **renommage automatique d’attribut** (si une variable est marquée comme `any`, l’éditeur ne pourra pas savoir qu’il faut renommer un de ses attributs).
  - Il sape la confiance dans le type system.

### Item 6 : Use Your Editor to Interrogate and Explore the Type System

- TypeScript fournit un compilateur (tsc), mais aussi un serveur standalone (tsserver) permettant notamment de faire de l’introspection de types. C’est ça qui est utilisé par l’éditeur.
- Il ne faut pas hésiter à passer la souris sur un appel de fonction dans une chaîne d’appels pour connaître les types inférés à ce moment-là.

### Item 7 : Think of Types as Sets of Values

- Le typage de TypeScript peut être **interprété comme un set de types**.
  - `never` est le set vide.
  - Un littéral contient une seule valeur dans le set.
  - `A | B` réalise l’union entre A et B.
  - `A & B` réalise l’intersection entre A et B.
    - `&` entre deux objets permet d’obtenir le type d’un objet avec l’ensemble des attributs des deux.
      - Exemple :
        ```typescript
        interface Person {
          name: string;
        }
        interface Lifespan {
          birth: Date;
          death?: Date;
        }
        type PersonSpan = Person & Lifespan;
        ```
      - C’est le cas parce qu’on peut ajouter autant d’attributs en plus qu’on veut, vu que c’est du structural typing. Donc l’intersection se trouve être un objet avec les propriétés des deux obligatoirement (sinon ce ne serait pas une intersection), et d’autres propriétés non indiquées optionnellement.
- Pour assigner une valeur à une variable, il faut que tous les éléments du set du type de la valeur soient contenus dans le type de la variable.
  - `extends` permet d’indiquer la même chose : tous les éléments du type qui était doivent être inclus dans le type qui est étendu.

### Item 8 : Know How to Tell Whether a Symbol Is in the Type Space or Value Space

- Il existe **deux espaces différents** dans lesquels des symboles peuvent se référer à des choses : le **Type space** et le **Value space**.
  - Un même symbole peut être défini dans l’un et l’autre de ces espaces pour désigner différentes choses.
  - Le fait d’être dans l’un ou l’autre de ces espaces dépend du contexte dans lequel on se trouve. Par exemple en assignation à un `type`, en assignation à une variable `let` ou `const`, après une variable suivie d’un `:` etc…
  - Le TypeScript Playground permet facilement de se rendre compte de ce qui est dans le _Type space_ : ça disparaît à la transpiration.
- Les classes et les enums créent en même temps un symbole dans le _Type space_, et un autre dans le _Value space_.
  - Le type issu d’une classe représente sa structure d’attributs.
- Le mot clé `typeof` agit différemment en fonction de l’espace où il est utilisé :
  - Dans le _Value space_ il va renvoyer un string caractérisant la valeur, par exemple `"object"` ou `"function"`.
  - Dans le _Type space_ il va renvoyer le type caractérisant la valeur.
  - `typeof MaClasse` (si utilisé dans le _Type space_) retourne le type de la classe elle-même, alors que `MaClasse` (si utilisé dans le _Type space_) représente le type d’une instance de cette classe.
  - `InstanceType<T>` permet de retrouver le type de l’instance à partir du type de la classe. Par exemple :
    ```typescript
    InstanceType<typeof MaClasse>; // donne le type MaClasse
    ```
- On peut accéder aux attributs d’un objet :
  - Si c’est une valeur, avec `objet["nom"]` ou `objet.nom`.
  - Si c’est un type, avec seulement `Type["nom"]`.

### Item 9 : Prefer Type Declarations to Type Assertions

- Il vaut mieux utiliser **les _type declarations_ plutôt que les _type assertions_**.
  - Exemple :
    ```typescript
    type Person = { name: string };
    // Type declaration, à préférer
    const alice: Person = { name: "Alice" };
    // Type assertion, déconseillé
    const bob = { name: "Bob" } as Person;
    ```
  - La raison est que **le type declaration va vérifier le type** qu’on assigne, alors que **le type assertion ne vérifie pas**, et permet d’outrepasser TypeScript dans le cas où on en sait plus que lui sur le contexte d’un cas particulier.
  - Pour autant, même avec le type type assertion, on ne peut pas assigner n’importe quoi, il faut au minimum que la valeur qu’on assigne soit d’un sous-type de la valeur à laquelle on l’assigne.
    - Pour forcer un type complètement arbitraire, on peut passer par `unknown` ou `any`.
      ```typescript
      document.body as unknown as Person;
      ```
  - En plus du `as`, on a aussi le `!` placé en suffixe qui permet de faire une forme de type assertion, en indiquant qu’on est sûr que la valeur n’est pas `null`.
    ```typescript
    const el = document.getElementById("foo")!;
    ```
- Pour utiliser le type declaration dans la fonction passée à un `map`, on peut typer sa valeur de retour.
  ```typescript
  ["alice", "bob"].map((name): Person => ({ name }));
  ```
  - Ici on demande à TypeScript d’inférer la valeur de name, et on indique que la valeur de retour devra être Person.

### Item 10 : Avoid Object Wrapper Types (String, Number, Boolean, Symbol, BigInt)

- Les types primitifs (_string_, _number_, _boolean_, _symbol_ et _bigint_) ne possèdent pas d’attributs comme peuvent en posséder les objets.
  - Quand on utilise un attribut connu sur l’un d’entre eux, JavaScript crée un un objet éphémère correspondant (respectivement _String_, _Number_, _Boolean_, _Symbol_ et _BigInt_) pour le wrapper et fournir l’attribut en question.
    ```typescript
    // l'attribut charAt vient de l'objet String
    "blabla".charAt(3);
    ```
  - C’est pour ça que si on assigne une propriété à une valeur primitive, la propriété disparaît (avec l’objet associé créé pour l’occasion et détruit aussitôt).
- Il vaut mieux **éviter d’instancier les objets correspondant aux types primitifs**, ça n’apporte rien à part de la confusion.
  - Exemple :
    ```typescript
    const person = new String("Alice");
    ```
  - En revanche, utiliser ces objets sans le new est tout à fait OK, ça nous donne une valeur primitive comme résultat.
    ```typescript
    Boolean(3); // renvoie true
    ```
- Il vaut mieux **éviter d’utiliser les objets correspondant aux types primitifs dans le Type space**. Ça pose le problème que le type primitif est assignable au type objet wrapper, alors que l’inverse n’est pas vrai.
  - Exemple :
    ```typescript
    function getPerson(person: string) {
      // [...]
    }
    getPerson(new String("Alice")); // Erreur de type
    ```
