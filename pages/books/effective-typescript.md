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
