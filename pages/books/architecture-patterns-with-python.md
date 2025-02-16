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

### 3 - A Brief Interlude: on Coupling and Abstractions

- Le **couplage** consiste à devoir changer un composant quand un autre composant est changé. La **cohésion** c’est quand deux composants couplés sont proches.
- La création d’**abstractions** est un des moyens de **diminuer le couplage** : en dépendant de l’abstraction, l’autre composant a moins de raisons de changer si le premier a des changements.
- On peut **isoler la logique métier des side effects** en choisissant de lui donner des abstractions en entrée, et en faisant en sorte qu’elle retourne d’autres abstractions en sortie. Les side effects seront alors ajoutés derrière ces abstractions.
  - La testabilité s’en retrouve grandement facilitée, parce qu’on peut abondamment tester la logique métier avec des tests unitaires.
  - Le fait d’avoir du code métier pur, qui ne fait que retourner des valeurs, et les side effects qui sont en dehors s’appelle le **Functional Code, Imperative Shell**, formalisé par Gary Bernhardt.
  - L’exemple classique est celui du programme qui copie des fichiers : on isole la logique de copie / déplacement / suppression derrière des abstractions comme `('MOVE', '/path/in', '/path/out')` (_functional core_), et on utilise le résultat de cette logique pour l’appliquer sur un vrai filesystem, avec du code qui ne fait qu’appliquer les décisions de la logique métier (_imperative shell_).
- En plus des tests unitaires et d’intégration (ou end to end), les auteurs proposent l’**edge to edge testing** : on va tester unitairement l’_imperative shell_ et le functional core en même temps, en injectant juste des **objets minimaux** dans l’_imperative shell_, pour que les side effects n’en soient pas.
  - Par exemple, on va injecter un _FakeFileSystem_ in-memory, qui va avoir le comportement des `os` et `shutil` natifs de Python, avec un port qui permet de ne garder que ce dont on a besoin.
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

### 4 - Our First Use Case: Flask API and Service Layer

- L’objectif dans ce chapitre est :
  - D’exposer le _domain service_ allocate via un API endpoint Flask, en le testant end-to-end.
  - Ajouter un _(application) service layer_ entre le _domain layer_ et l’API endpoint, en le testant unitairement (edge to edge).
  - Améliorer les tests du _service layer_ pour les rendre indépendants de la business logic.
- On commence par un test d’intégration (ou end to end), qui crée les objets _Order_, _OrderLine_, _Batch_ etc. en base via du SQL, puis envoie une requête POST sur notre endpoint REST _/allocate_, et vérifie la réponse.
  - Les auteurs utilisent les données random pour créer leurs objets en DB, pour éviter que les tests ne se gênent entre eux.
- L’implémentation de l’input adapter REST ressemble à ça :
  ```typescript
  @app.route("/allocate", methods=['POST'])
  def allocate_endpoint():
    session = get_session()
    batches = repository.SqlAlchemyRepository(session).list()
    line = model.OrderLine(
      request.json['orderid'],
      request.json['sku'],
      request.json['quantity'],
    )
    batchref = model.allocate(line, batches)
    return jsonify({'batchref': batchref}), 201
  ```
  - Les auteurs sont **réticents à vérifier le contenu de la base dans le test d’intégration**, et donc préfèrent ajouter un deuxième test qui va consommer le contenu d’un batch, puis vérifier que c’est le batch suivant qui est alloué par une autre requête POST.
- Les auteurs continuent avec des vérifications d’erreurs liées au SKU qui peut être invalide ou ne pas exister. Il ne s’agit pas de logique du domaine, mais plutôt de sanity checks.
  - On va donc créer des **tests d’intégration supplémentaires** pour ça, en vérifiant le statut 400 et les messages d’erreurs, et implémenter la logique dans l’endpoint Flask.
- Pour éviter de multiplier les tests d’intégration et la logique dans l’input adapter, on va introduire un _application service layer_, qui va récupérer la **logique d’orchestration** : récupérer des objets du domaine à partir de repositories, appeler des méthodes dessus, valider les données et gérer les erreurs.
  - Les tests vont être unitaires, et utiliser un fake repository.
  - Exemple :
    ```typescript
    def test_returns_allocation():
      line = model.OrderLine("o1", "COMPLICATED-LAMP", 10)
      batch = model.Batch("b1", "COMPLICATED-LAMP", 100, eta=None)
      repo = FakeRepository([batch])
      result = services.allocate(line, repo, FakeSession())
      assert result == "b1"
    ```
  - L’implémentation de l'_application service_ :
    ```typescript
    def allocate(line: OrderLine, repo: AbstractRepository, session) -> str:
      batches = repo.list()
      if not is_valid_sku(line.sku, batches):
        raise InvalidSku(f'Invalid sku {line.sku}')
      batchref = model.allocate(line, batches)
      session.commit()
      return batchref
    ```
  - Et l’API endpoint Flask :
    ```typescript
    @app.route("/allocate", methods=['POST'])
    def allocate_endpoint():
      session = get_session()
      repo = repository.SqlAlchemyRepository(session)
      line = model.OrderLine(
        request.json['orderid'],
        request.json['sku'],
        request.json['qty'],
      )
      try:
        batchref = services.allocate(line, repo, session)
      except (model.OutOfStock, services.InvalidSku) as e:
        return jsonify({'message': str(e)}), 400
      return jsonify({'batchref': batchref}), 201
    ```
  - Et ils proposent de ne garder que deux tests d’intégration : un pour le happy path et un pour un des unhappy paths (par exemple erreur 400).
- Côté organisation des fichiers, on peut avoir :
  - Un dossier pour le code du _domain layer_
  - Un dossier pour le code de l’_application service layer_
  - Un dossier pour les _entrypoints_ (_input adapters_, aussi appelés _primary_, _driving_ ou encore _inward-facing_ adapters)
  - Un dossier pour les _output adapters_ (aussi appelés _secondary_, _driven_ ou encore _outward-facing_ adapters)
  - Les tests séparés en :
    - Unit : tests partant de l’application service layer
    - Integration : tests d’intégration pour un output adapter par exemple
    - e2e : tests d’intégration partant d’un input adapter
- L’introduction de l’_application service layer_ :
  - A les **avantages** suivants :
    - On sépare clairement ce qui concerne la techno (ici HTTP) de la logique métier.
    - On peut écrire des tests unitaires pour la logique métier.
  - A les **désavantages** suivants :
    - Plus de boilerplate avec un layer en plus.
    - Si on cède sur la testabilité, on peut très bien mettre la logique d’orchestration du domaine dans l’input adapter.
- Il y a encore deux problèmes qu’il va s’agir de résoudre dans la suite:
  - Le _service layer_ est couplé au _domain layer_ au travers de la notion d’_OrderLine_.
  - Le service layer est couplé à l’objet _session_.

### 5 - TDD in High Gear and Low Gear

- Si on analyse le nombre de tests de chaque type qu’on a :
  - 12 tests unitaires du _domain layer_
  - 3 unit tests du _service layer_
  - 6 integration tests des _output adapters_
  - 2 integration tests d’input adapter (e2e tests)
- On va s’intéresser maintenant à ce qui se passe si **on traduit les tests du domain layer vers le service layer**.

  - C’est assez facile à faire : puisque le _service layer_ utilise le _domain layer_, il suffit de l’instancier avec le fake repository, et de le run, puis de vérifier le contenu du fake repository.

    ```typescript
    def test_prefers_current_stock_batches_to_shipments():
      in_stock_batch = Batch("in-stock-batch", "RETRO-CLOCK", 100, eta=None)
      shipment_batch = Batch("shipment-batch", "RETRO-CLOCK", 100, eta=tomorrow)
      line = OrderLine("oref", "RETRO-CLOCK", 10)

      allocate(line, [in_stock_batch, shipment_batch])

      assert in_stock_batch.available_quantity == 90
      assert shipment_batch.available_quantity == 100
    ```

  - L’avantage qu’on va avoir c’est qu’on peut **refactorer notre domain layer beaucoup plus facilement** vu qu’il n’y a pas de tests qui le figent.
  - Le désavantage c’est qu’écrire des tests de service layer nous donne un **feedback moins rapide** que des tests de domain layer. Avec moins de feedback on profite moins de l’avantage du TDD où les tests nous permettent de réfléchir au design de notre code.
    - Un autre désavantage est que dans certains cas, on peut avoir une **explosion combinatoire** du nombre de tests nécessaires pour tester tous les cas à travers plusieurs use-cases, plutôt qu’une seule fois la fonctionnalité directement dans le _domain layer_.

- Les auteurs utilisent souvent **les tests du _domain layer_ au départ** pour aider à l'écrire au départ, ou dès qu’ils font face à un problème métier compliqué, **puis les bougent au niveau du _service layer_ et effacent les tests de _domain layer_** pour avoir une meilleure maintenabilité.
  - Ils prennent la métaphore du changement de vitesse sur un vélo : au départ on a une vitesse faible pour commencer à rouler, puis on augmente la vitesse pour aller plus vite, et en cas de pente on réduit la vitesse.
- Pour permettre de refactorer plus facilement le code du domain layer, on peut **découpler le service layer du domain layer**.
  - On peut **ne plus prendre des objets du _domain layer_ en entrée des fonctions du _service layer_**, en prenant des types primitifs à la place.
    - On passe de :
      ```typescript
      def allocate(line: OrderLine, repo: AbstractRepository, session) -> str:
      ```
    - à :
      ```typescript
      def allocate(
        orderid: str, sku: str, qty: int, repo: AbstractRepository, session
      ) -> str:
      ```
  - Pour aller un cran plus loin encore, on peut **créer des fonctions factory** sur notre fake repository pour ne plus utiliser les objets du _domain layer_ directement dans les tests du _service layer_.
    - Fonction factory :
      ```typescript
      class FakeRepository(set):
        @staticmethod
        def for_batch(ref, sku, qty, eta=None):
          return FakeRepository([
            model.Batch(ref, sku, qty, eta),
          ])
      ```
    - Exemple de test :
      ```typescript
      def test_allocation_returns_allocation():
        repo = FakeRepository.for_batch("batch1", "COMPLICATED-LAMP", 100, eta=None)
        result = services.allocate("o1", "COMPLICATED-LAMP", 10, repo, FakeSession())
        assert result == "batch1"
      ```
  - Et enfin, pour un découplage ultime, on peut **remplacer les fonctions factory par des use-cases**, déjà existants ou supplémentaires, du _service layer_.
    - Attention cependant à ne pas écrire du code qui ne servira qu’au test, il vaut mieux ne les écrire que si ils vont être nécessaires au code aussi.
      ```typescript
      def test_allocate_returns_allocation():
        repo, session = FakeRepository([]), FakeSession()
        services.add_batch("batch1", "COMPLICATED-LAMP", 100, None, repo, session)
        result = services.allocate("o1", "COMPLICATED-LAMP", 10, repo, session)
        assert result == "batch1"
      ```
    - Le **même raisonnement peut s’appliquer pour les tests d’intégration** e2e : au lieu de setup la DB avec du code SQL couplé à la structure des tables, on peut faire appel à un API endpoint qui fait déjà ce qu’on veut pour le setup.
