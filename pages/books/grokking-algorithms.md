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
      for (let num of array) {
        const smallestIndex = findSmallest(input);
        result.push(input.splice(smallestIndex, 1));
      }
      return result;
    }

    function findSmallest(array: number[]) {
      let smallestIndex = 0;
      for (let i = 0; i < array.length; i++) {
        if (array[i] < array[smallestIndex]) {
          smallestIndex = i;
        }
      }
      return smallestIndex;
    }
    ```

## 3 - Recursion

- La récursion peut être légèrement moins efficace, mais elle peut **rendre l’algorithme plus clair**.
- Une fonction récursive a deux parties :
  - 1 - Le **base case** qui consiste à arrêter l’auto-appel si la condition d’arrêt est remplie.
  - 2 - Le **recursive case** qui consiste à ce que la fonction s’appelle elle-même.
  - Exemple :
    ```typescript
    function countDown(num: number) {
      if (num <= 1) {
        return;
      }
      countDown(num - 1);
    }
    ```
- Une **stack** est une structure qui permet d’empiler des éléments à la fin, et de les dépiler depuis la fin aussi.
  - La **call stack** est constituée des appels successifs de fonction qui ont conduit à l’exécution du code actuel.
    - Chaque appel contient un espace mémoire où il stocke ses variables.
    - S’il appelle une autre fonction, ces variables restent et peuvent être utilisées quand la fonction appelée sera terminée.
    - Quand lui-même sera terminé, les variables de son espace seront détruites, puisque son espace sera dépilé aussi de la call stack.
  - Une fonction récursive **stocke la liste des opérations dans la call stack** sous forme d’appels à elle-même non terminés, qu’elle dépile au bout d’un moment.
    - La conséquence c’est que la _call stack_ peut occuper trop d’espace.
    - Certains langages optimisent le processus grâce à la _tail recursion_, où il s’agit de passer les variables de la fonction appelante à la fonction appelée pour pouvoir supprimer la fonction appelante de la _call stack_ dès l’appel.

## 4 - Quicksort

- **Divide and conquer** est une méthode pour trouver une **solution algorithmique récursive** à un problème.
  - Il consiste en deux étapes :
    - 1 - Trouver un cas de base simple.
    - 2 - Trouver un moyen de réduire notre problème au cas de base par étapes successives.
  - Exemple :
    - On veut coder la fonction `sum()` qui prend un tableau de nombres et renvoie la somme de manière récursive.
    - 1 - On trouve le cas de base : le cas le plus simple est d’avoir un tableau vide en entrée.
      - Quand on écrit une fonction récursive qui prend un tableau, le cas de base est souvent un tableau vide ou un tableau avec un seul élément en entrée.
    - 2 - On cherche des étapes successives pour se ramener au cas de base : il suffit de reprendre chaque élément et de l’ajouter à la fonction _sum_, qui prend le reste des éléments.
      - On réduit à chaque fois notre problème d’un élément, jusqu’à arriver au cas de base qui est `sum([])`.
        ```typescript
        sum([2, 4, 6]);
        2 + sum([4, 6]);
        2 + 4 + sum([6]);
        2 + 4 + 6 + sum([]);
        ```
    - Le code récursif donne :
      ```typescript
      function sum(array: number[]) {
        if (array.length === 0) {
          return 0;
        }
        return array[0] + sum(array.slice(1));
      }
      ```
- **Quicksort** est un algorithme de tri efficace.
  - Si on essaye d'appliquer _divide and conquer_ pour écrire l’algo récursif :
    - 1 - Le cas de base est représenté par le tableau vide ou avec un seul élément : dans ce cas il n’y a rien à faire, le tableau est déjà trié.
      ```typescript
      if (array.length < 2) {
        return array;
      }
      ```
    - 2 - On va chercher à réduire les autres cas au cas de base :
      - Pour un tableau de 2 éléments, on peut choisir l’un des éléments comme **pivot**, et placer l’autre avant ou après selon s’il est plus petit ou plus grand.
      - Pour un tableau de 3 éléments, on choisit encore un élément comme pivot, puis on place les deux autres avant ou après en fonction du fait que chacun est plus petit ou plus grand que le pivot.
        - Si les deux éléments sont placés avant ou les deux sont placés après le pivot, il va falloir une étape de plus pour les trier entre eux : il suffit d’appeler _quicksort_ en lui donnant juste ces deux éléments, puisqu’on sait faire le tri avec 2 éléments.
      - Pour un tableau de 4 éléments on fait la même chose avec le pivot, et on appelle _quicksort_ avec le groupe d’éléments avant le pivot, et le groupe d’éléments après.
      - On remarque qu'au-delà d’un élément, on peut en réalité à chaque fois choisir un pivot, placer les éléments avant ou après le pivot, et ensuite appeler quicksort sur le groupe avant et le groupe après. Si un groupe est vide ça donne le cas de base qui renvoie une liste vide aussi.
  - Le code :
    ```typescript
    function quicksort(array: number[]) {
      if (array.length < 2) {
        return array;
      }
      const pivot = array[0];
      const remainingArray = array.slice(1);
      const smallerGroup = remainingArray.filter((num) => num <= pivot);
      const greaterGroup = remainingArray.filter((num) => num > pivot);
      return [...quicksort(smallerGroup), pivot, ...quicksort(greaterGroup)];
    }
    ```
- **Merge sort** et **quicksort** ont tous les deux une _time complexity_ de `O(n * log(n))`.
  - Il se trouve que quicksort est plus rapide d’une constante (qu’on ne retrouve donc pas dans la notation `O`). Comme les deux ont la même _time complexity_, la constante compte.
  - Quicksort a une _worst case time complexity_ de `O(n²)`, mais sa best case time complexity est de `O(n * log(n))`, et son _average time complexity_ est aussi de `O(n * log(n))`.
    - Il se trouve qu’on est sûr d’atteindre l’_average time complexity_ si à chaque fois **on choisit le pivot au hasard**.

## 5 - Hash tables

- Les **hash tables** permettent de trouver un élément en temps `O(1)`.
  - Ce sont des structures impliquant un peu de calcul :
    - 1 - On donne l’input en entrée qui représente la clé à chercher en `O(1)`.
    - 2 - La hash table va passer l’input dans une **hash function** qui est censée renvoyer une adresse mémoire dans un endroit réservé comme avec un _array_.
    - 3 - On peut stocker la valeur qu’on veut dans cet emplacement, et la prochaine fois qu’on donnera la même clé en input, on accèdera à nouveau au même emplacement.
  - Ils permettent aussi de filtrer les clés dupliquées : il suffit de vérifier si la clé existe déjà dans la hash table.
  - Un des cas d’usage est la mise en cache de la donnée, qu’on peut ensuite retrouver instantanément en donnant une clé qui a servi à créer l’entrée de l’élément en cache.
- En réalité, il est très difficile de mapper des clés à un espace mémoire limité sans créer de **collisions**, c’est-à-dire que la _hash function_ renvoie le même emplacement mémoire pour plusieurs clés.
  - Pour gérer ces cas, une des possibilités est de créer une _linked list_ à partir de l’emplacement où on se retrouve à avoir plusieurs éléments. Mais on va alors perdre en performance, en particulier si nos _linked lists_ sont longues.
    - On se retrouve donc avec un temps d’accès en lecture/écriture qui est en `O(1)` pour l’average case, et `O(n)` pour le worst case.
    - Il existe d’autres implémentations de la hash table, par exemple la méthode _cuckoo hashing_ permet de faire plus d’opérations à l’insertion, pour s’assurer que la lecture reste en `O(1)`.
  - Un des facteurs qui va déterminer la performance d’une _hash table_ est le **load factor** : le nombre d’emplacements occupés divisé par le nombre d’emplacements disponibles dans l’espace mémoire de la hash table.
    - Plus le load factor est élevé, plus notre hash table est “saturée” et va provoquer des collisions. Si on dépasse un load factor de 1, on est sûr de ne pas pouvoir stocker chaque élément dans un emplacement unique.
    - Quand le load factor devient grand (par exemple 0.7), on peut faire un _resizing_, c’est-à-dire allouer un espace mémoire plus grand, et y déplacer l’ensemble des éléments actuels.

## 6 - Breadth-first search

- Les **graphs** sont une structure qui permet de relier des choses les unes aux autres.
  - Il s’agit simplement d’avoir des nœuds, reliés entre eux par des flèches.
  - Ils permettent des applications très intéressantes :
    - Trouver des corrections de mots.
    - Trouver le chemin le plus court pour aller quelque part, ou la liste des commerces proches.
    - Créer un robot d’indexation de pages web.
- La plupart du temps, on voudra résoudre un problème du type “**trouver le plus court chemin**” dans le _graph_, et pour ça on a un algorithme qui s’appelle **breadth-first search (BFS)**.

  - Il s’agit de consulter tous les éléments des nœuds du niveau 1, avant d’aller aux nœuds du niveau 2 etc.
  - On peut utiliser une **queue** pour représenter les éléments du _graph_ qu’on va choisir de consulter dans le bon ordre.
    - Une _queue_ est une structure qui permet d’ajouter un élément d’un côté, et de dépiler de l’autre côté. Les éléments ajoutés en premier seront dépilés en premier (FIFO).
  - Le _graph_ en lui-même peut être exprimé à l’aide d’une _hash table_. où une clé représente un nœud, et sa valeur représente les nœuds vers lesquels il a un lien.
  - Imaginons qu’on ait un _graph_ représentant des personnes liées entre-elles. Et on cherche la personne la plus proche qui est un vendeur à partir d’un nom donné. Le code est le suivant :

    ```typescript
    function findSellerBFS(graph: Record<string, string[]>, name: string) {
      let queue = [...graph[name]];
      const alreadySearched = new Set();
      while (queue.length) {
        const currentPerson = queue.pop();
        if (!alreadySearched.has(currentPerson)) {
          if (isSeller(currentPerson)) {
            return currentPerson;
          } else {
            queue = [...graph[currentPerson], ...queue];
            alreadySearched.add(currentPerson);
          }
        }
      }
      return false;
    }

    function isSeller(name: string) {
      return name.startsWith("s");
    }
    ```

    - On commence par ajouter les amis de la personne initiale à la liste des personnes à vérifier.
    - A chaque fois qu’on en vérifie une, si ce n’est pas elle qu’on veut, on ajoute ses amis à l'entrée de la _queue_ et on continue avec la personne suivante.
    - On a besoin d’un set qui retient les personnes déjà cherchées, pour éviter les _graphs_ circulaires.
    - On parcourt chaque personne au pire une fois, et on parcourt la liste des associations au pire une fois, donc la time complexity est de `O(nombre de personnes + nombre de liens)`.

## 7 - Trees

- Les **trees** sont des graphs dont les flèches ne vont que dans un seul sens, et qui ne bouclent pas sur eux-mêmes.
  - Le _root node_ est le tout premier dont tous les autres découlent, et on appelle les nœuds finaux qui n’ont pas d’enfants les _leaf nodes_.
  - Le code d’un BFS parcourant le _tree_ n’aura pas besoin de garder un _set_ des nœuds déjà visités, puisque les _trees_ n’ont pas de cycles.
- Les **binary trees** sont des _trees_ avec au plus deux enfants par nœud.
- **Huffman coding** est un algorithme utilisant les _binary trees_ pour compresser du texte.
  - La manière habituelle d’encoder du texte est de le faire avec des blocs fixes de bits, ce qui permet d’interpréter chaque bloc comme une lettre.
  - _Huffman coding_ va créer un _binary tree_ contenant seulement les lettres qui composent les mots qu’on veut encoder.
  - Il suffit à chaque nœud de suivre le nœud de gauche si on a un 0, et celui de droite si on a un 1. Dès qu’on arrive à un _leaf node_, on a la lettre.
  - Ça donne l’avantage de pouvoir encoder les lettres sur peu de bits, avec un nombre variable de bits : plus le mot est récurrent, et plus il sera encodé sur un nombre faible de bits.
