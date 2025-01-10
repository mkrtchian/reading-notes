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
      - Si on a un _batch_ de 10 BLUE*VASE, et qu’on alloue une_line* de 2 BLUE*VASE, si on réalloue la même_line*, le _batch_ ne changera pas, et restera à 8 BLUE_VASE.
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

### 2 - Repository Pattern

- On veut avoir un _domain model_ **ne dépendant d’aucune considération d’infrastructure**. Il peut dépendre de librairies utilitaires, mais **pas de choses stateful** comme un ORM ou un framework web.
- D’une certaine manière, l’ORM est déjà une forme d’inversion de dépendance : le code dépend de l’abstraction de l’ORM et ne se préoccupe pas du détail des considérations d’infrastructure spécifiques à la DB.
  - Malgré tout, l’ORM est une abstraction spécifique à la DB. On passe par lui dès qu’il faut personnaliser quelque chose sur une requête particulière. On veut que **notre _domain model_ soit couplé à une abstraction encore plus abstraite**.
- Les auteurs utilisent **_SQLAlchemy_** même dans les projets où il n’y a pas besoin d’ORM, ne serait-ce que pour créer des data models, gérer les migrations et les connexions.
- **_SQLAlchemy_** permet de **mapper automatiquement** un _domain model_ fait avec du pur code et un _data model_ fait avec SQLAlchemy.

  - Ca se fait avec la fonction sqlalchemy.orm.mapper :

    ```python
    from sqlalchemy.orm import mapper
    Import model

    order_lines = Table(...)

    def start_mapper():
      lines_mapper = mapper(model.OrderLine, order_lines)
    ```

  - Une fois le mapping fait, on peut facilement faire des insertions ou des recherches en donnant et recevant des objets de notre _domain model_.
    ```python
    # trouver tous les order lines à partir du domain model
    session.query(model.OrderLine).all()
    # insérer des order lines à partir d'objets du domain model
    session.add(model.OrderLine("order1", ...))
    session.commit()
    ```

- Pour faire **une classe abstraite** en Python, on peut étendre _abc.ABC_, et marquer les méthodes à implémenter par les enfants avec **@abc.abstractmethod**.
  Exemple :
  ```python
  class AbstractRepository(abc.ABC):
    @abc.abstractmethod
    def add(self, batch: model.Batch):
      raise NotImplementedError
  ```
      * L’autre possibilité est d’utiliser **typing.Protocol** : on crée un type qu’on peut utiliser comme outil de static type checking structurel.
          * Exemple :
            ```python
            class AbstractRepository(typing.Protocol):
              @abc.abstractmethod
              def add(self, batch: model.Batch):
                raise NotImplementedError
            ```
      * Les auteurs comptent souvent sur le duck typing lui-même et n’hésitent pas à **se passer d’interfaces**.
- Le _repository pattern_ consiste essentiellement à avoir une interface qui permet d’ajouter et consulter des objets, en cachant la manière dont le stockage est fait.
- On va écrire des tests pour notre repository.

  - Les auteurs conseillent de garder ces tests, en particulier pour les repositories non triviaux.

    ```python
    def test_repository_can_save_a_batch(session):
      batch = model.Batch("batch1", "RUSTY-SOAPDISH", 100, eta=None)
      repo = repository.SqlAlchemyRepository(session)

      repo.add(batch)
      session.commit()

      repo = list(session.execute(
        'SELECT reference, sku, _purchased_quantity, eta FROM "batches"'
      ))
      assert rows == [("batch1", "RUSTY-SOAPDISH", 100, None)]
    ```

    ```python
    def test_repository_can_retrieve_a_batch_with_allocations(session):
      orderline_id = insert_order_line(session)
      batch1_id = insert_batch(session, "batch1")
      insert_batch(session, "batch2")
      insert_allocation(session, orderline_id, batch1_id)
      repo = repository.SqlAlchemyRepository(session)

      retrieved = repo.get("batch1")

      expected = model.Batch("batch1", "GENERIC-SOFA", 100, eta=None)
      assert retrieved = expected
      assert retrieved.sku == expected.sku
      assert retrieved._purchased_quantity == expected._purchased_quantity
      assert retrieved._allocations == {
        model.orderLine("order1", "GENERIC-SOFA, 12")
      }
    ```

- Et le code :

  ```python
  class SqlAlchemyRepository(AbstractRepository):
    def __init__(self, session):
      self.session = session

    def add(self, batch):
      self.session.add(batch)

    def get(self, reference):
      return self.session.query(model.Batch)
        .filter_by(reference=reference).one()

    def list(self):
      return self.session.query(model.Batch).all()
  ```

- Le fake repository va être similaire au repository **_SQLAlchemy_**, mais il va tout contenir en mémoire.

  ```python
  class FakeRepository(AbstractRepository):
    def __init__(self, batches):
      self._batches = set(batches)

    def add(self, batch):
      self._batches.add(batch)

    def get(self, reference):
      return next(
        b for b in self._batches if b.reference == reference
      )

    def list(self):
      return list(self._batches)
  ```

  - Le stockage en mémoire peut être fait avec un set pour simuler ce que fait la DB

## 3 - A Brief Interlude: on Coupling and Abstractions

- Le **couplage** consiste à devoir changer un composant quand un autre composant est changé. La **cohésion** c’est quand deux composants couplés sont proches.
- La création d’**abstractions** est un des moyens de **diminuer le couplage** : en dépendant de l’abstraction, l’autre composant a moins de raisons de changer si le premier a des changements.
- On peut **isoler la logique métier des side effects** en choisissant de lui donner des abstractions en entrée, et en faisant en sorte qu’elle retourne d’autres abstractions en sortie. Les side effects seront alors ajoutés derrière ces abstractions.
  - La testabilité s’en retrouve grandement facilitée, parce qu’on peut abondamment tester la logique métier avec des tests unitaires.
  - Le fait d’avoir du code métier pur, qui ne fait que retourner des valeurs, et les side effects qui sont en dehors s’appelle le **Functional Code, Imperative Shell**, formalisé par Gary Bernhardt.
  - L’exemple classique est celui du programme qui copie des fichiers : on isole la logique de copie / déplacement / suppression derrière des abstractions comme `('MOVE', '/path/in', '/path/out')` (_functional core_), et on utilise le résultat de cette logique pour l’appliquer sur un vrai filesystem, avec du code qui ne fait qu’appliquer les décisions de la logique métier (_imperative shell_).
- En plus des tests unitaires et d’intégration (ou end to end), les auteurs proposent l’**edge to edge testing** : on va tester unitairement l’_imperative shell_ et le functional core en même temps, en injectant juste des **objets minimaux** dans l’_imperative shell_, pour que les side effects n’en soient pas.
  - Par exemple, on va injecter un _FakeFileSystem_ in-memory, qui va avoir le comportement des `os` et `shutil` natifs de Python, avec un port qui permet de ne lister que ce dont on a besoin.
  - Ce genre d’injection est appelée **Spy** par les auteurs.
    - Ils renvoient à [un article de Martin Fowler](https://martinfowler.com/articles/mocksArentStubs.html) pour la terminologie.
- DHH parle de _test-induced design damage_ pour qualifier l’injection de dépendance nécessaire aux unit tests de manière générale. Les auteurs quant à eux préfèrent **injecter explicitement, plutôt que monkey-patcher**.
  - 1 - Monkey-patcher n’améliore pas le design du code, contrairement à l'injection qui oblige à faire un meilleur design.
  - 2 - En injectant explicitement des dépendances, on crée des interfaces publiques explicites, et on évite de se coupler aux détails d’implémentation, chose qu’on fait facilement si on peut patcher ce qu’on veut pour vérifier des appels.
  - 3 - Les tests utilisant des mocks / patchs sont difficiles à lire.
- Dans ce livre, les auteurs utilisent le domain layer comme un _functional core_ (bien qu’il ne soit pas composé que de fonctions pures), et l'application service layer comme un _imperative shell_ qu’ils vont pouvoir unit tester _edge to edge_.
- Pour **trouver les bonnes abstractions**, les auteurs proposent les heuristiques suivantes :
  - Peut-on trouver une structure native qui peut contenir l’état de ce qu’on calcule, pour le renvoyer dans une fonction ?
  - Où est-ce qu’on peut tracer la ligne de séparation entre nos systèmes, et introduire un **seam**.
    - _Seam_ fait référence à **_Working Effectively with Legacy Code_** de Michael Feathers. Il s’agit de trouver un moyen d’isoler du code de ses dépendances sans toucher aux dépendances, et sans enlever explicitement la dépendance. Par exemple en ajoutant du code qui va masquer l’utilisation de la dépendance.
  - Comment expliciter les différentes responsabilités ?
  - Quelle est la logique business et quelles sont les dépendances ?
