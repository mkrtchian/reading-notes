# Architecture Patterns with Python

### Introduction

- Le chaos dans l’architecture logicielle se caractérise par l’homogénéité : chaque partie du code a des responsabilités de toutes sortes.
  - Le logiciel tend naturellement vers ce chaos, qu’on appelle _big ball of mud_.
- Parmi les techniques pour **éviter le chaos** :
  - L’**encapsulation** et l’**abstraction** permettent de simplifier la compréhension du code, et d’améliorer sa maintenabilité.
    - L’abstraction peut passer par une _Abstract Base Class_ (ABC), mais en Python on va souvent utiliser un objet ou une fonction qui sert directement d’API publique.
  - Le **layering** permet de créer des zones où le code est classé, et où il y a des règles de dépendances, pour limiter celles-ci.
    - Le layering le plus connu est celui en 3 couches : présentation, business et data.
  - La **dependency inversion** (DIP) consiste à ce que :
    - Le code métier (haut niveau) ne dépende pas du code d’infrastructure (bas niveau), mais que les deux dépendent d’abstractions. La raison est qu’on veut changer les deux indépendamment, et avec un rythme différent.
    - Les abstractions ne dépendent pas des détails d’implémentation, mais plutôt l’inverse.
- L’un des problèmes principaux qui émerge au cours du temps, c’est **l’éparpillement du code du domaine** au travers de la codebase. Il faut mettre en place des techniques pour l’empêcher.

## Part I - Building an Architecture to Support Domain Modeling

- La plupart des développeurs ne conçoivent que le **data model**, et jamais le **domain model**. C’est pourtant le _domain model_, c’est-à-dire le comportement de l’application, qui doit être central.

### 1 - Domain Modeling

- Le **domain** **model** est une représentation simplifiée (model) du problème qu’on essaye de résoudre (domain).
  - Il apparaît naturellement dès qu’on travaille sur un problème, et se traduit par exemple par un langage spécifique qui émerge petit à petit, et qui permet d’exprimer des processus complexes en peu de mots.
  - Le concept de _domain modeling_ n’est pas issu du blue book d’Eric Evans, mais remonte par exemple à :
    - **_Object Design_** de Rebecca WirfsBrock et Alan McKean, qui parle de responsibility-driven design.
    - Les livres d’Ivar Jacobson et Grady Booch, qui datent des années 80.
- Les auteurs prennent l’**exemple** de leur propre entreprise, qui fait de l’achat-vente de biens.
  - Il y a 4 _bounded contexts_ :
    - Les clients utilisent l’**app d’e-commerce (1)** pour commander, et de l’autre côté l’équipe d’achat utilise l’**app d’achat (2)** pour acheter ce qui est nécessaire pour approvisionner les stocks.
    - Ces deux apps communiquent avec le **module d’allocation (3)** qui met à jour les besoins et disponibilités, et communique les instructions au **module de warehouse (4)** pour qu’il envoie les biens.
  - Ils veulent mettre en place le fait d’indiquer des produits disponibles avec un plus long délai de livraison, dès qu’ils sont commandés par l’équipe d’achat. De cette manière, la plupart des produits seront marqués comme disponibles.
  - Les auteurs parlent avec les **domain experts**, pour mettre au clair des règles business. Ils les écrivent **accompagnés d’exemples** pour enlever l’ambiguïté.
    - Exemple : “On ne peut pas allouer la même _line_ deux fois”
      - Si on a un _batch_ de 10 BLUE*VASE, et qu’on alloue une \_line* de 2 BLUE*VASE, si on réalloue la même \_line*, le _batch_ ne changera pas, et restera à 8 BLUE_VASE.
- L’étape après la discussion est la construction du **domain model** à l’aide de tests.

  - Exemple de test :

    ```python
    def test_allocating_to_a_batch_reduces_the_available_quantity():
      batch = Batch("batch-001", "SMALL-TABLE", qty=20, eta=date.today())
      line = OrderLine('order-ref', "SMALL-TABLE", 2)

      batch.allocate(line)

      assert batch.available_quantity == 18
    ```

  - Code associé :

    ```python
    @dataclass(frozen=True)
    class OrderLine:
      orderid: str
      sku: str
      qty: int

    class Batch:
      def init(
        self, ref: str, sku: str, qty: int, eta: Optional[date]
      ):
        self.reference = ref
        self.sku = sku
        self.eta = eta
        self.available_quantity = qty

      def allocate(self, line: OrderLine):
        self.available_quantity -= line.qty
    ```

- Les type hints sont controversés en Python, mais les auteurs les conseillent.

  - On peut typer les attributs avec des _str_, _int_ etc. mais on pourrait aussi utiliser **typing.NewType** pour créer des value objects pour pas cher pour chaque attribut.

    - Ex :

      ```python
      from typing import NewType

      Reference = NewType("Reference", str)
      Sku = NewType("Sky", str)

      class Batch:
        def __init__(self, ref: Reference, sku: Sku ...
      ```

    - Les auteurs sont plutôt réticents à cette idée.

- **dataclass** avec l’attribut _frozen=True_ permet d’obtenir des objets **immutables**, et donc représente bien un **value object**.

  - On peut obtenir la même chose avec _NamedTuple_

    ```python
    class Money(NamedTuple):
      currency: str
      value: int

    money = Money('gbp', 10)
    ```

  - On veut en général que notre _value object_ soit égal à tout autre _value object_ avec les mêmes attributs.
    - On veut en général aussi implémenter le comportement du hash qui contrôle l’utilisation de l’objet en tant que clé de dictionnaire et membre d’un set.
      - A propos des hashs et de l’opérateur d’égalité, les auteurs conseillent de lire [Python Hashes and Equality](https://hynek.me/articles/hashes-and-equality/).
    - On pourrait aussi penser à des opérateurs comme le +, -, * entre *value objects\*.

- Les **entities**, contrairement aux _value objects_, ont une identité, leur attributs peuvent bien changer, ils restent singuliers.

  - On va souvent implémenter les opérateurs d’égalité et de hash comme basés sur la référence de l’objet.

    ```python
    class Batch:
      ...
      def __eq__(self, other):
        if not isinstance(other, Batch):
          return False
        return other.reference == self.reference

      def __hash__(self):
        return hash(self.reference)`
    ```

- Les **domain services** représentent des concepts ou des process qui ne sont ni des _value objects_, ni des _entities_.

  - A ne pas confondre avec le _service layer_, qui représente des use-cases et utilise le _domain layer_.
  - Les auteurs conseillent d’utiliser des **fonctions**.
  - Exemple :

    ```python
    def allocate(line; OrderLine, batches: List[Batch]) -> str:
      batch = next(
        b for b in sorted(batches) if b.can_allocate(line)
      )
      batch.allocate(line)
      return batch.reference

    class Batch:
      ...
      def __gt__(self, other):
        if(self.eta is None:
          return False
        if other.eta is None:
          return True
        return self.eta > other.eta
    ```

- Les exceptions font aussi partie du _domain model_ et sont test drivées.
