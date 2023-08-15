# Grokking algorithms

## 1 - Introduction to algorithms

- Le **binary search** consiste à faire de la dichotomie : on coupe à chaque fois en deux pour éliminer la moitié des éléments restants.
  - La time complexity est en `O(log(n))`.
  - Il faut que le tableau qu’on a soit **trié**.
  - Code :
    ```typescript
    function binarySearch(array: number[], target: number) {
      let left = 0;
      let right = array.length - 1;
      while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const current = array[middle];
        if (current === target) {
          return current;
        } else if (current > target) {
          right = middle - 1;
        } else {
          left = middle + 1;
        }
      }
      return null;
    }
    ```
    - La boucle s’arrête quand on a atteint le dernier élément possible, et dans ce cas soit c’est lui, soit il n’existe pas.
    - A chaque fois qu’on tombe sur le mauvais élément, on repart du milieu + 1, ou milieu - 1 selon que l’élément du milieu est plus petit ou plus grand.
- La **time complexity** représente le nombre d’étapes d’un algorithme quand le nombre d’éléments _n_ devient très grand. C’est la manière dont le nombre d’étapes va augmenter par rapport à _n_.
  - On utilise en général la notation `O()` pour le _worst case scenario_.
  - Les complexités les plus courantes sont :
    - `O(log(n))` : le binary search.
    - `O(n)` : la recherche par brute force dans un tableau.
    - `O(n * log(n))` : le tri avec _quicksort_.
    - `O(n²)` : le tri _selection sort_.
    - `O(n!)` : l’algorithme _traveling salesperson_.
      - Un vendeur veut visiter un nombre _n_ de villes de manière à minimiser son trajet.
      - Il faut à chaque fois qu’il essaye l’ensemble des permutations possibles pour savoir quel trajet global est le plus court, et ça fait _n!_ permutations à tester.

## 2 - Selection sort

- Les **arrays** sont constitués d’emplacements mémoire physiques contigus.
- Les **linked lists** sont constituées d’emplacements mémoire éparpillés, mais chacun d’entre eux a l’adresse de l’élément suivant de la liste.
- **L’array est efficace pour la lecture**, alors que **la linked list est efficace pour l’insertion**.
  - **Insertion** :
    - Si on veut insérer un élément à la fin d’un _array_, on prend le risque de ne pas avoir assez de place contiguë.
      - On aura donc besoin de déplacer l’ensemble des éléments dans un autre espace, ou alors il faut réserver des espaces vides en plus “au cas où” mais ça a ses limites.
      - S’il y a suffisamment d’espace mémoire libre pour notre _array_, mais qu’elle n’est pas contiguë, on ne pourra pas le créer, alors qu’on pourrait créer une _linked list_.
    - Dans le cas où on veut insérer un élément au milieu de l’array, il va falloir au minimum déplacer tous les éléments suivants pour lui faire de la place.
      - Et c’est la même chose si on veut supprimer un élément.
  - **Lecture** :
    - Si on veut lire un élément dans la _linked list_, on est obligé de lire les précédents pour aller d’adresse en adresse.
    - L’_array_ au contraire permet d’aller lire n’importe quel élément d’un coup parce qu’ils sont contigus, et qu’il suffit d’ajouter un offset à l’adresse du 1er emplacement.
  - La _time complexity_ est la suivante :
    - Linked list :
      - Insertion : `O(1)`
      - Lecture : `O(n)`
    - Array :
      - Insertion : `O(n)`
      - Lecture : `O(1)`
- Globalement les arrays sont plus souvent utilisés que les linked lists :
  - Ils permettent d’accéder à n’importe quel élément en lecture.
  - La lecture des éléments est plus efficace du point de vue de l’OS quand ils sont physiquement contigus.
- On peut créer des structures hybrides, par exemple un _array_ de taille 26, dont chaque emplacement contiendrait l’adresse d’une _linked list_.
  - Ça peut permettre une insertion rapide grâce à l’_array_ immutable et aux _linked lists_ optimisées pour l’insertion, et une lecture plus rapide qu’avec une _linked list_ unique.
- Le **selection sort** consiste à trier en mode “brute force” : on va regarder chaque élément pour trouver le plus petit pour le mettre de côté, puis regarder encore chaque élément pour trouver le 2ème plus petit etc.

  - La time complexity est de `O(n²)`.
  - Le code :

    ```typescript
    function selectionSort(array: number[]) {
    const result = [];
    const input = array.slice();
    for(let num of array) {
        const smallestIndex = findSmallest(input);
        result.push(input.splice(smallestIndex, 1));
    }
    return result;
    }

    function findSmallest(array: number[]) {
    let smallestIndex = 0;
    for(let i = 0; i &lt; array.length; i++) {
        if(array[i] &lt; array[smallestIndex]) {
        smallestIndex = i;
        }
    }
    return smallestIndex;
    }
    ```
