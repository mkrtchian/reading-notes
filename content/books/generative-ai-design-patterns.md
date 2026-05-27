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
