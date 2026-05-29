# Generative AI Design Patterns

## 3 - Adding Knowledge : Bass

- La notion de RAG est née en 2020, dans un papier de Facebook : _Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks_.
- Les patterns décrits dans les chapitres 3 et 4 ont des liens logiques les uns avec les autres : a chaque nouveau besoin on ajoute une couche de complexité supplémentaire.

### Pattern 6 : Basic RAG

- Le pattern basique n’est probablement pas utilisable tel quel pour la plupart des cas, mais permet de comprendre ce qui manque ou non en fonction de notre besoin.
- Le RAG vient répondre à des problèmes particuliers que posent les modèles de fondation :
  - Les données d’entraînement sont **arrêtées au cutoff** => le RAG apporte de la donnée fraîche.
  - La taille du modèle limite sa **capacité à retenir des choses** apprises => le RAG stocke l’information à l’extérieur du modèle.
  - Les **données privées** ne sont pas incluses dans l’entraînement => le RAG peut contenir des données privées d’une entreprise.
  - Le modèle peut **halluciner** s’il doit parler de choses qu’il ne connaît pas bien => le RAG donne les infos manquantes, pour réduire les chances d’hallucination.
  - Il ne peut pas **citer des extraits exacts** présents dans ses données d’entraînement => le texte est fourni directement, donc la citation peut avoir lieu.
- Les informations présentes dans le prompt influencent grandement la réponse (_grounding_).
  - Il suffit par exemple de parler de nourriture, pour que quand on demande les meilleures villes du pays, le LLM les mentionne sous l’angle de la nourriture. Le RAG consiste justement à ajouter des morceaux de données pertinentes dans le contexte, pour influencer la réponse.
  - Une bonne pratique pour éviter les hallucinations est de **dire au modèle quoi faire s’il ne trouve pas ce qu’on lui demande** : par exemple nous dire qu’il n’a pas trouvé.
- Le RAG est composé de 3 étapes :
  - **1 - Indexing** : on a besoin de documents sous forme de chunks qu’on va retrouver ensuite.
    - On veut des chunks **suffisamment petits** pour ne pas surcharger le contexte.
    - On veut des chunks **avec beaucoup d’infos**, donc on enlève ce qui est répétitif comme les espaces en trop.
    - Les chunks ont besoin de **metadata** pour être tracées.
    - La manière la plus simple de faire les chunks est d’utiliser le nombre de caractères, et d’ajouter un overloap pour éviter les phrases coupées.
  - **2 - Retrieval** : on retrouve les chunks pertinents.
    - Le moyen le plus simple est de **chercher les termes exacts** dans les chunks.
    - Si on a une phrase, on peut :
      - Enlever les stop words qui sont trop fréquents.
      - Et ensuite chercher **les chunks qui contiennent le plus de mots parmi les mots les plus rares dans l’ensemble des chunks** disponibles : on appelle ça **TF-IDF** (_Term Frequency - Inverse Document Frequency_).
      - **BM25** est une version de TF-IDF modifiée qui le rend plus efficace en évitant que les termes très répétés dans un même chunk prennent trop le pas.
  - **3 - Generation** : on crée le prompt en intégrant les chunks dedans, et on envoie tout ça au LLM.
- Le **parsing de PDF** est globalement assez complexe : il faut récupérer le texte, les images et aussi les objets et leur positionnement. Il existe des outils spécialisés qui font l’extraction, ou alors on peut en extraire une image et la donner à un LLM multi-modal.
- Si la **totalité des documents rentrent dans le contexte** du LLM, il peut mieux valoir de tout lui donner et lui poser la question, plutôt que de risquer de lui donner des données partielles via RAG.
- **Limitations du pattern** :
  - Si les **mots exacts** qu’on recherche ne se trouvent pas dans les chunks pertinents pour nous, les chunks ne seront pas remontés par l’algo TF-IDF.
  - Le **chunking** lui-même peut être limitant : par exemple amener une partie du texte pertinent, mais pas la suite qui serait dans le chunk suivant.
- Les patterns 7 à 12 permettent d’améliorer ce RAG basique **mais ont un coût**.
  - Il faut d’abord vérifier qu’on en a besoin, et qu’ils vont apporter une vraie plus value.
  - Ils viennent **en complément du RAG basique** : il faut éviter par exemple la tentation de mettre en place un RAG à embedding sans recherche exacte type TD-IDF.

### Pattern 7 : Semantic Indexing

- Le RAG basique trouve ses limites quand :
  - Les chunks contiennent des **synonymes** des mots clés recherchés plutôt que les mots exacts.
  - Il faut trouver les chunks par la **signification globale** de ce dont ça parle.
  - La query et les chunks sont dans des **langues différentes**.
  - Les chunks sont **autre chose que du texte** (images, vidéos, son).
  - Les chunks contiennent **un formatage particulier**, par exemple des données dans des tableaux.
- Le **semantic indexing** répond à ces problèmes en encodant la sémantique du texte et des autres modaux dans des vecteurs, stockés dans une base de données vectorielle.
- Il y a un trade off entre augmenter la dimensionnalité des vecteurs pour obtenir une représentation plus fine de la sémantique, et la question de la performance.
- Concernant les stratégies de **chunking de texte**, on peut :
  - Couper à un **nombre fixe de caractères** :
    - Avec un overlap.
    - En laissant la dernière phrase se terminer.
    - En laissant le dernier paragraphe se terminer.
  - Utiliser la nature structurée des documents (par exemple markdown) pour couper à un **niveau particulier de sous-section**. Par exemple, chaque titre de niveau 2 forme un chunk.
  - Couper **au niveau des changements sémantiques** plutôt que du nombre de caractères.
    - Il existe des techniques de topic modeling pour trouver les points de coupe sémantiques, par exemple _latent dirichlet_, et _nonnegative matrix factorization_.
    - On peut aussi utiliser des embeddings de sous sections de notre document pour essayer d’identifier là où la sémantique change.
- Concernant la stratégie de **chunking des images**, on peut :
  - Utiliser un LLM pour **décrire l’image sous forme de texte**, et chunker puis vectoriser ce texte.
  - Utiliser un LLM pour **directement générer des embeddings** à partir de l’image.
- Concernant la stratégie de **chunking des vidéos**, on peut :
  - Utiliser un LLM pour **décrire la vidéo sous forme de texte**, et chunker puis vectoriser ce texte.
  - **Sampler les images de la vidéo**, et pour chaque sample, le traiter comme une image qu’on veut indexer sémantiquement.
- Concernant la stratégie de **chunking des tableaux**, on peut :
  - Mettre le tableau dans **un seul chunk** dans le cas où il est suffisamment petit ou peu important.
  - Chunker le tableau **comme du text**e : par nombre de caractères ou par changements sémantiques. On peut en plus inclure les headers concernés dans chaque chunk.
  - Créer **un chunk par row**. Ça marche bien quand les rows sont indépendants, par exemple un tableau de transactions.
  - Créer **un chunk pour chaque colonne** entière. Ça marche bien quand les informations d’une même colonnes sont liées entre elles.
- Dans le cas où les documents indexés contiennent du **jargon complexe**, il est possible que les embeddings ne rapprochent pas suffisamment bien certains termes. Pour éviter ça, on va construire et maintenir un **dictionnaire des synonymes**, qu’on utilisera pour faire du **synonym expansion**.
  - Exemple : dans un contexte juridique où _discovery_ est parfois utilisé pour désigner _deposition_, _What was the timeline for discovery in federal court?_ devient _What was the timeline for discovery|disclosure|deposition in federal court?_
  - On peut faire ce dictionnaire **à la main** et le maintenir, ou alors utiliser des **techniques d’analyse statistique** pour le construire automatiquement, ou encore utiliser un **LLM pour faire l’expansion directement** sans dictionnaire.
- Une autre possibilité quand on est dans un domaine avec du jargon complexe c’est d’utiliser des **modèles d’embeddings domain specific**. Par exemple pour le médical ou le juridique.
- Pour rendre la recherche plus pertinente, on peut **ajouter du contexte à chaque chunk** au moment de l’indexation.
  - Anthropic [propose de le faire avec un appel LLM](https://www.anthropic.com/engineering/contextual-retrieval) où on donne le document entier, le chunk, et on demande le contexte en réponse.
    - Ils ont montré que ça réduit les erreurs de 67% dans plusieurs domaines.
    - On peut mettre le document entier au début du prompt et mettre en cache cette partie, pour que les appels LLM soient peu chers.
  - Cette pratique sera utile à la recherche sémantique comme à la recherche lexicale.
- Le trade off fondamental du chunking (si trop petit on récolte du contexte épars, si trop gros les vecteurs ne réussiront peut être pas à trouver les chunks parce qu’ils encoderont trop de choses, et donc pas assez de nuances sémantiques) peut être surmonté si on accepte de payer le coût d’appels LLM et d’une base vectorielle plus grosse : on peut faire un **chunking hiérarchique**.
  - Il s’agit de faire une structure sous forme d’arbre : d’abord des **chunks plutôt petits**, puis pour chaque cluster de chunks qui vont ensemble, un noeud qui les résume, puis un niveau au dessus qui résume les noeuds clusters etc. jusqu’à arriver à un seul noeud racine.
  - Chacun des nœuds intermédiaires contiennent du texte résumé qu’il a fallu produire par des appels LLM, et chacun d’entre eux ont un embedding associé et sont un nœud dans la base vectorielle.
  - Au moment du retrieve, on va chercher tous les nœuds qui peuvent matcher sémantiquement : les originaux comme ceux qui ont un texte qui résume d’autres nœuds. On va ensuite donner l’ensemble de la hiérarchie des nœuds qui ont matché en contexte à la génération.
  - Cette approche s’appelle RAPTOR (Recursive Abstractive Processing for Tree-Organized Retrieval) et est une forme simplifiée de GraphRAG.
- Le _semantic indexing_ a quelques limitations :
  - Les chunks sont représentés par un vecteur de dimension fixe, qui compresse beaucoup l’information.
  - La stratégie de chunking est en soi difficile à optimiser.
  - Quand on arrive à des millions ou milliards de nœuds, on commence à avoir des **problèmes de scalabilité**. On est obligés d’utiliser la recherche par **ANN (_Approximate Nearest Neighbors_)** qui est moins précis.
  - Le _semantic indexing_ en lui-même ne permet pas de prendre en compte **la date des documents** ni aucune forme de temporalité.
  - Il n’y a pas de raisonnement logique dans la recherche, seulement une ressemblance sémantique. Et donc on perd parfois des chunks importants qui sont pourtant liés à certains chunks qu’on a trouvés.
  - La recherche sémantique multimodale ne marche pas toujours très bien.
  - Dans le cas où on veut ajouter des dimensions numériques supplémentaires à notre embedding pour y caser des chiffres, il y a un risque que nos chiffres soient noyés dans la grande dimensionnalité du vecteur et donc n’aient pas suffisamment d’impact.

### Pattern 8 : Indexing at Scale

- Il y a plusieurs problèmes qui peuvent survenir avec un **RAG en production** :
  - **Ambiguïté** : plus la quantité de données en base augmente, plus on a un risque que certains mots soient mal interprétés sémantiquement à cause d’un manque de contexte.
  - **Fraîcheur de la donnée** : sans stratégie de mise à jour des chunks qui sont dans la base de données du RAG, les informations qu’ils contiennent risque de devenir petit à petit obsolètes, voire **contradictoires**.
  - **Performance** : à mesure que les données augmentent, la recherche est de plus en plus coûteuse.
  - **Cycle de vie du modèle** : dans le cas où on utilise un modèle propriétaire, s’il arrive en fin de vie et est déprécié, on va devoir réindexer l’ensemble de la base vectorielle avec un autre modèle plus récent, ce qui peut coûter très cher.
- L’usage des **métadata** permet de l’essentiel de mitiger ces problèmes.
  - L’auteur conseille d’inclure les metadata suivantes sur chaque noeud :
    - Au sujet du document :
      - L’identification de la source du document
      - Date de création / modification
      - L’auteur
      - Les catégories associées
      - La complexité du document
      - La longueur du document
    - Au sujet du chunk :
      - La position dans le document initial
      - Les entités mentionnées (personnes, organisations etc.)
      - Le rôle sémantique du chunk (introduction, exemple, définition etc.)
      - La langue du chunk
    - Au sujet du domaine : selon le domaine des choses pertinentes.
      - Si c’est de la doc d’API : la version de la doc, les langages de programmation si c’est un SDK.
      - Si c’est de la documentation scientifique sur l’IA : la méthodologie, la taille des samples, les trouvailles clés.
      - etc.
    - Au sujet des autorisations :
      - Quels rôles ont droit d’avoir accès à ces données
      - Comment ils doivent s’authentifier
      - S’il y a des consentements à obtenir avant de donner accès à ces données
      - Si la donnée doit être chiffrée, anonymisée
- L’**ambiguïté inter-domaines** peut être mitigée par le filtre par la metadata de **catégorie**.
  - En théorie ça peut aussi répondre en partie au problème de performance, puisqu’on fait une recherche vectorielle sur un sous-ensemble des nœuds. En pratique, toutes les bases de données vectorielles ne le supportent pas.
- Le problème des **informations contradictoires** peut être mitigé par certaines metadata :
  - Si la **date** des deux chunks contradictoires est différente, le LLM pourra en déduire que le plus récent est celui à suivre parce qu’il indique une mise à jour de l’info.
  - Si la **source** des deux chunks contradictoires est différente, le LLM pourra prioriser l’une sur l’autre en fonction de son niveau d’autorité.
  - Le fait de limiter à un même domaine par la **catégorie** permet de limiter aussi les informations contradictoires entre chunks.
- Le problème des **informations obsolètes** peut être mitigé en utilisant des metadata :
  - Au moment de la recherche :
    - On peut **filtrer les chunks trouvés** plus vieux qu’une certaine **date**.
    - On peut privilégier le contenu avec une **date plus récente** par un **rerank** des résultats de recherche.
  - De manière régulière sur la base elle-même : on peut **éliminer les chunks** plus vieux qu’une certaine **date**.
- Concernant le problème de **cycle de vie du modèle** : il faut **bien réfléchir au choix du modèle d’embedding** en fonction du besoin.
  - Bien regarder la performance des modèles (l’auteur conseille le _[Massive Text Embedding Benchmark de Hugging Face](https://huggingface.co/spaces/mteb/leaderboard)_) et leur caractéristiques (par exemple la langue supportée, la spécificité à un domaine).
  - Un modèle open weight ne sera jamais obsolète, et pour un modèle propriétaire on peut viser une durée de cycle de vie longue.
  - Dans certains cas, changer de modèle en vaut quand même la peine : par exemple, si le nouveau modèle permet la même performance en divisant la dimensionnalité par 4, ou si on a besoin d’un modèle entraîné sur des données récentes pour appréhender des éléments sémantiques récents.
- Les metadata ont aussi des **limites** :
  - Si les metadata ont des problèmes de qualité, ils ne permettront pas de mitiger les problèmes de manière fiable.
  - Certaines bases de données vectorielles ne supportent les metadata que de manière limitée.
  - Se fier **uniquement à la date des documents peut être insuffisant** pour régler les problèmes d’obsolescence selon le domaine.
  - Certains éléments de metadata vont être spécifiques à un domaine seulement, et donc potentiellement n’auront d'utilité que pour une partie des nœuds.
- Comme autres **solutions alternatives** :
  - On peut très bien créer **plusieurs indexes sémantiques** (l’équivalents de tables), par exemple un par domaine.
  - Pour le problème de l’obsolescence, on peut maintenir des metadata de **liens entre des chunks qui parlent de la même chose à des dates différentes**. De cette manière, on peut systématiquement récupérer l’ensemble de ces chunks, pour faire comprendre au LLM l’historique de l’évolution de l’information.

## 4 - Adding Knowledge : Syncopation

### Pattern 9 : Index-Aware Retrieval

- Trouver les bons chunks correspondant à la question de l'utilisateur peut poser des difficultés :
  - Les termes de la question peuvent très bien **ne pas être présents dans les chunks**, ni sémantiquement, ni lexicalement.
  - Les **termes techniques utilisés peuvent être différents** entre les queries et les chunks.
  - Des **détails importants** peuvent être **noyés** dans le texte des chunks et donc difficilement trouvables.
  - Parfois il est nécessaire de **retrouver plusieurs chunks liés entre eux de manière logique** pour pouvoir répondre à l’utilisateur, mais le RAG par mots clés ou sémantique ne permet pas de faire ces liens.
- **HyDE (Hypothetical Document Embedding)** :\*\* **une première possibilité est de demander à un LLM de **donner une réponse préalable à la question, à l'étape de retrieval\*\*, puis de chercher des documents concernant cette réponse, et enfin de passer ces documents et la première réponse du LLM au LLM à l’étape de génération.
  - On appelle cette technique de réponse intermédiaire .
  - Pour répondre au cas où il existe des points de vus divergents dans la documentation, on peut générer plusieurs réponses hypothétiques intermédiaires, et faire un retrieval sur chacune d’entre elles, avant de donner le tout au LLM de l’étape génération.
  - HyDE est notamment utile quand on a besoin de retrouver **des chunks qui ont une structure logique entre eux**, ou quand on a besoin de retrouver **des chunks qui ont des détails** qui seront potentiellement noyés dans le texte.
- **Query expansion** : on peut **enrichir la question initiale en ajoutant de nouvelles formulations et du contexte**, de manière à ce que le retrieval puisse retrouver plus facilement les documents à donner au LLM à l’étape génération.
  - C’est notamment utile quand les utilisateurs font des **queries avec un langage non technique**, mais que la base des chunks contient du vocabulaire technique : l’expansion ajoute les mots techniques concernés.
- **Hybrid search** : on peut faire **à la fois une recherche lexicale (BM25) et une recherche sémantique**. De nombreuses bases de données supportent la recherche hybride nativement, et acceptent un paramètre _alpha_ qui indique quel poids on met sur l’aspect lexical et quel poids sur l’aspect sémantique pour récupérer les k chunks les plus pertinents demandés.
- **GraphRAG** : il s’agit d’avoir une **base de données de graphe** (comme Neo4j) avec chacun des nœuds contenant le chunk sous forme de texte, sous forme d’embedding, et ayant des relations avec d’autres nœuds.
  - Quand chaque chunk est petit, ça permet d’aller chercher les chunks qui ont des relations logiques.
  - On peut aussi créer une structure en arbre (un peu comme l’approche RAPTOR cf. pattern 7) où l’embedding du parent sert d'appât et permet de récupérer ensuite les chunks enfants qui n’auraient peut être pas été récupérés par la recherche.
    - Et de la même manière, on peut générer un résumé du contenu dans les nœuds parents.
  - Le graphe doit normalement être **modélisé à la main** pour être pertinent, mais si on ne veut pas faire cet effort, on peut également **utiliser LangChain pour demander à un LLM de créer automatiquement une modélisation** en graphe à partir de chunks sans lien.
- Quelques limitations :
  - HyDE et query expansion dépendent de la **capacité du LLM à connaître le sujet**, sinon il peut donner un résultat hors sujet halluciné, ou même un résultat basé sur des considérations anciennes selon les connaissances qu’il a arrêtées à la date de son cutoff.
  - La query expansion peut parfois faire **dériver la question de l’utilisateur** vers un terrain qui en fait ne l’intéressait pas : on trouve plus de documents, mais potentiellement hors sujet.
  - Un GraphRAG mal modélisé peut aussi faire remonter des chunks non pertinents.
