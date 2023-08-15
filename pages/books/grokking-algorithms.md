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
        const middle = Math.floor(left + right);
        const current = array[middle];
        if (current === target) {
          return current;
        } else if (current > target) {
          right = middle - 1;
        } else {
          left = middle - 1;
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
