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
      - **BM25** est une version de TF-IDF un peu modifiée qui le rend plus facilement utilisable et efficace.
  - **3 - Generation** : on crée le prompt en intégrant les chunks dedans, et on envoie tout ça au LLM.
- Le **parsing de PDF** est globalement assez complexe : il faut récupérer le texte, les images et aussi les objets et leur positionnement. Il existe des outils spécialisés qui font l’extraction, ou alors on peut en extraire une image et la donner à un LLM multi-modal.
- Si la **totalité des documents rentrent dans le contexte** du LLM, il peut mieux valoir de tout lui donner et lui poser la question, plutôt que de risquer de lui donner des données partielles via RAG.
- **Limitations du pattern** :
  - Si les **mots exacts** qu’on recherche ne se trouvent pas dans les chunks pertinents pour nous, les chunks ne seront pas remontés par l’algo TF-IDF.
  - Le **chunking** lui-même peut être limitant : par exemple amener une partie du texte pertinent, mais pas la suite qui serait dans le chunk suivant.
- Les patterns 7 à 12 permettent d’améliorer ce RAG basique **mais ont un coût**.
  - Il faut d’abord vérifier qu’on en a besoin, et qu’ils vont apporter une vraie plus value.
  - Ils viennent **en complément du RAG basique** : il faut éviter par exemple la tentation de mettre en place un RAG à embedding sans recherche exacte type TD-IDF.
