// All pedagogical content sourced exclusively from SISR_REVIEW_DATA.md.
// Do not invent or modify technical information.

export const context = {
  organization:
    "Halieutis Sud-Ouest — structure régionale gérant plusieurs sites de pêche et d'observation faunique.",
  mission:
    "Modernisation de l'infrastructure numérique. Le site institutionnel, les espaces internes et les outils métier doivent être hébergés sur un serveur Linux Debian 13 mutualisé.",
  scenario:
    "Six techniciens travaillent en parallèle, chacun sur une VM individuelle reliée au réseau de tests. Chaque technicien prend en charge un lot de configuration distinct.",
  environment: [
    "Machine virtuelle sous Debian 13 à jour",
    "Accès root local et accès SSH activé",
    "Paquets disponibles : apache2, nginx, openssl, apache2-utils",
    "Nom de domaine local : halieutis.local (via /etc/hosts)",
    "Réseau de laboratoire isolé",
  ],
  constraints: [
    "Aucune ouverture vers l'extérieur",
    "Configurations lisibles, commentées et reproductibles",
    "Chaque service démarre automatiquement au boot",
    "Fichiers de configuration dans les emplacements standards Debian",
    "Comptes et mots de passe documentés",
  ],
  exam:
    "70 minutes par technicien (15 min étude, 15 min échange formateur, 30 min réalisation, 10 min recette).",
};

export const situations = [
  // =====================================================================
  // SITUATION 1 — Apache VirtualHost
  // =====================================================================
  {
    id: 1,
    number: 1,
    title: "Site vitrine Apache avec VirtualHost dédié",
    icon: "Server",
    objective:
      "Publier un site vitrine public servi par Apache via un VirtualHost dédié, distinct du site par défaut.",
    steps: [
      {
        title: "Création de l'arborescence et de la page web",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "mkdir -p /var/www/vitrine",
            tooltips: [
              {
                match: "-p",
                text: "Le flag -p crée les dossiers parents si nécessaires et ne renvoie pas d'erreur si le dossier existe déjà.",
              },
              {
                match: "/var/www",
                text: "Emplacement standard Debian pour les fichiers servis par Apache.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Crée le dossier racine qui va héberger les fichiers du site web.",
          },
          {
            type: "command",
            title: "Terminal",
            code: 'echo "<h1>Hello world !</h1>" > /var/www/vitrine/index.html',
            tooltips: [
              {
                match: ">",
                text: "Redirection avec écrasement : crée ou écrase le fichier de destination. Utilise >> pour ajouter à la fin.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Crée une page d'accueil de test pour vérifier que le serveur répond correctement.",
          },
        ],
      },
      {
        title: "Création du fichier de configuration VirtualHost",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "nano /etc/apache2/sites-available/vitrine.conf",
            tooltips: [
              {
                match: "sites-available",
                text: "Dossier Debian qui contient TOUS les fichiers de configuration de sites, qu'ils soient actifs ou non. Le dossier sites-enabled ne contient que des liens symboliques vers ceux qu'on veut activer.",
              },
            ],
          },
          {
            type: "config",
            filename: "vitrine.conf",
            language: "apache",
            code: `<VirtualHost *:80>
    ServerName halieutis.local
    DocumentRoot /var/www/vitrine
</VirtualHost>`,
            tooltips: [
              {
                match: "*:80",
                text: "Écoute sur le port 80 (HTTP standard) de toutes les interfaces réseau de la machine.",
              },
            ],
          },
          {
            type: "directives",
            title: "Explication des directives",
            items: [
              {
                name: "ServerName",
                desc: "définit le nom de domaine à écouter.",
                tooltip:
                  "Doit correspondre à une entrée du fichier /etc/hosts ou à un DNS résolvable. Si plusieurs VirtualHosts coexistent, c'est ServerName qui les départage.",
              },
              {
                name: "DocumentRoot",
                desc: "indique le répertoire contenant les fichiers du site.",
                tooltip:
                  "Apache lira l'index.html par défaut dans ce dossier. Aucun / final n'est nécessaire.",
              },
            ],
          },
        ],
      },
      {
        title: "Activation du site et désactivation du site par défaut",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "a2ensite vitrine.conf",
            tooltips: [
              {
                match: "a2ensite",
                text: "Commande Debian spécifique. Crée un lien symbolique de sites-available vers sites-enabled.",
              },
            ],
          },
          { type: "explanation", text: "Active le nouveau site vitrine." },
          {
            type: "command",
            title: "Terminal",
            code: "a2dissite 000-default.conf",
            tooltips: [
              {
                match: "a2dissite",
                text: "Inverse de a2ensite : supprime le lien symbolique du dossier sites-enabled (le fichier reste dans sites-available).",
              },
              {
                match: "000-default.conf",
                text: "Site par défaut Apache, présent dès l'installation. Le préfixe 000 force son chargement en premier dans l'ordre alphabétique.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Désactive le site par défaut d'Apache pour éviter les conflits.",
          },
        ],
      },
      {
        title: "Prise en compte de la configuration",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "systemctl reload apache2",
            tooltips: [
              {
                match: "reload",
                text: "reload recharge la config sans couper les connexions actives. Utilise restart uniquement si tu changes un port d'écoute ou charges un nouveau module.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Recharge la configuration d'Apache en douceur (sans couper les connexions existantes).",
          },
        ],
      },
      {
        title: "Test de fonctionnement (Recette)",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "curl http://halieutis.local",
            tooltips: [
              {
                match: "curl",
                text: "Outil en ligne de commande qui envoie une requête HTTP. Sans option supplémentaire, il affiche le corps de la réponse.",
              },
            ],
          },
          {
            type: "expected",
            text: "<h1>Hello world !</h1>",
          },
          {
            type: "explanation",
            text: "Simule la requête d'un navigateur pour prouver le bon fonctionnement.",
          },
        ],
      },
    ],
    recap: {
      commands: [
        "mkdir -p /var/www/vitrine",
        'echo "<h1>Hello world !</h1>" > /var/www/vitrine/index.html',
        "nano /etc/apache2/sites-available/vitrine.conf",
        "a2ensite vitrine.conf",
        "a2dissite 000-default.conf",
        "systemctl reload apache2",
      ],
      files: [
        {
          path: "/etc/apache2/sites-available/vitrine.conf",
          note: "VirtualHost *:80 avec ServerName halieutis.local et DocumentRoot /var/www/vitrine",
        },
        {
          path: "/var/www/vitrine/index.html",
          note: "Page de test contenant <h1>Hello world !</h1>",
        },
      ],
      test: {
        command: "curl http://halieutis.local",
        expected: "<h1>Hello world !</h1>",
      },
      keyPoints: [
        "Le fichier de configuration se place dans /etc/apache2/sites-available/",
        "On active un site avec a2ensite, on le désactive avec a2dissite",
        "reload applique les changements sans coupure, restart relance complètement le service",
        "Le VirtualHost doit être distinct du site par défaut 000-default.conf",
      ],
    },
    quiz: [
      {
        type: "mcq",
        question:
          "Dans quel dossier Debian place-t-on les fichiers de configuration des VirtualHosts Apache ?",
        choices: [
          "/etc/apache2/conf.d/",
          "/etc/apache2/sites-available/",
          "/var/www/sites/",
          "/etc/httpd/sites/",
        ],
        answer: 1,
        explanation:
          "Sous Debian, les fichiers de configuration des sites se placent dans /etc/apache2/sites-available/, puis sont activés par lien symbolique dans /etc/apache2/sites-enabled/ via a2ensite.",
      },
      {
        type: "fill",
        question:
          "Complète la commande qui active le site vitrine :",
        prefix: "",
        suffix: " vitrine.conf",
        answer: "a2ensite",
        explanation:
          "a2ensite est la commande Debian qui crée le lien symbolique de sites-available vers sites-enabled.",
      },
      {
        type: "tf",
        question:
          "La commande systemctl reload apache2 redémarre complètement Apache et coupe les connexions actives.",
        answer: false,
        explanation:
          "Faux. reload recharge la configuration en douceur, sans coupure. C'est restart qui relance complètement le service.",
      },
      {
        type: "mcq",
        question:
          "Quelle directive du VirtualHost définit le nom de domaine à écouter ?",
        choices: ["DocumentRoot", "ServerName", "Listen", "VirtualHostName"],
        answer: 1,
        explanation:
          "ServerName définit le nom de domaine. DocumentRoot indique le dossier contenant les fichiers du site.",
      },
      {
        type: "mcq",
        question:
          "Comment désactive-t-on le site par défaut d'Apache sous Debian ?",
        choices: [
          "a2dissite 000-default.conf",
          "rm /etc/apache2/sites-available/000-default.conf",
          "systemctl stop default-apache",
          "a2endisable default",
        ],
        answer: 0,
        explanation:
          "a2dissite supprime le lien symbolique dans sites-enabled sans toucher au fichier d'origine.",
      },
    ],
  },

  // =====================================================================
  // SITUATION 2 — Reverse proxy Nginx
  // =====================================================================
  {
    id: 2,
    number: 2,
    title: "Proxy inversé Nginx devant Apache",
    icon: "ArrowRightLeft",
    objective:
      "Positionner Nginx en frontal (port 80) devant Apache (port 8080), pour préparer l'arrivée de futurs services et masquer la chaîne d'hébergement.",
    steps: [
      {
        title: "Déplacer Apache sur un port interne",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "nano /etc/apache2/ports.conf",
            tooltips: [
              {
                match: "ports.conf",
                text: "Fichier global Apache qui liste tous les ports d'écoute. À ne pas confondre avec les VirtualHost qui doivent eux aussi être alignés sur ces ports.",
              },
            ],
          },
          {
            type: "action",
            text: "Remplacer Listen 80 par Listen 8080.",
          },
          {
            type: "command",
            title: "Terminal",
            code: "nano /etc/apache2/sites-available/vitrine.conf",
          },
          {
            type: "action",
            text: "Modifier l'en-tête du VirtualHost en <VirtualHost *:8080>.",
          },
          {
            type: "command",
            title: "Terminal",
            code: "systemctl restart apache2",
            tooltips: [
              {
                match: "restart",
                text: "Un simple reload ne suffit pas pour changer de port. Le service doit libérer l'ancien port en se relançant complètement.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Redémarrage complet (pas un simple reload) pour forcer Apache à libérer le port 80 et basculer sur le 8080.",
          },
        ],
      },
      {
        title: "Création de la configuration Nginx",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "nano /etc/nginx/sites-available/proxy",
            tooltips: [
              {
                match: "sites-available",
                text: "Nginx adopte la même convention que Debian/Apache : sites-available contient tous les fichiers, sites-enabled contient les liens symboliques actifs.",
              },
            ],
          },
          {
            type: "config",
            filename: "proxy",
            language: "nginx",
            code: `server {
    listen 80;
    server_name halieutis.local;

    location / {
        proxy_pass http://localhost:8080;
    }
}`,
            tooltips: [
              {
                match: "listen 80",
                text: "Nginx prend la place qu'occupait précédemment Apache : c'est lui qui répond directement au client.",
              },
              {
                match: "proxy_pass",
                text: "Directive cœur du reverse proxy. Nginx transfère la requête telle quelle au backend indiqué.",
              },
              {
                match: "localhost:8080",
                text: "Nginx et Apache tournent sur la même machine : Apache n'est joignable que localement et n'est plus exposé publiquement.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Nginx écoute sur le port 80 (frontal). La directive proxy_pass redirige tout le trafic vers Apache sur le port 8080.",
          },
        ],
      },
      {
        title: "Activation du proxy Nginx",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "ln -s /etc/nginx/sites-available/proxy /etc/nginx/sites-enabled/",
            tooltips: [
              {
                match: "ln -s",
                text: "Crée un lien symbolique. Nginx n'a pas l'équivalent de a2ensite : on utilise ln -s à la main.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Crée un lien symbolique pour activer le site (équivalent manuel du a2ensite d'Apache).",
          },
          {
            type: "command",
            title: "Terminal",
            code: "systemctl start nginx",
          },
          { type: "explanation", text: "Lance le service Nginx." },
        ],
      },
      {
        title: "Test de fonctionnement (Recette)",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "curl http://halieutis.local",
          },
          {
            type: "expected",
            text: "<h1>Hello world !</h1>",
          },
          {
            type: "explanation",
            text: "En apparence rien ne change pour le visiteur, mais la requête frappe Nginx (port 80) qui va chercher la réponse auprès d'Apache (port 8080).",
          },
        ],
      },
    ],
    recap: {
      commands: [
        "nano /etc/apache2/ports.conf  # Listen 80 → Listen 8080",
        "nano /etc/apache2/sites-available/vitrine.conf  # <VirtualHost *:8080>",
        "systemctl restart apache2",
        "nano /etc/nginx/sites-available/proxy",
        "ln -s /etc/nginx/sites-available/proxy /etc/nginx/sites-enabled/",
        "systemctl start nginx",
      ],
      files: [
        {
          path: "/etc/apache2/ports.conf",
          note: "Listen 80 remplacé par Listen 8080",
        },
        {
          path: "/etc/apache2/sites-available/vitrine.conf",
          note: "VirtualHost passé en *:8080",
        },
        {
          path: "/etc/nginx/sites-available/proxy",
          note: "server { listen 80; proxy_pass http://localhost:8080; }",
        },
      ],
      test: {
        command: "curl http://halieutis.local",
        expected: "<h1>Hello world !</h1> (servi via Nginx → Apache)",
      },
      keyPoints: [
        "Apache passe en backend sur le port 8080, Nginx prend le port 80",
        "restart est nécessaire (et non reload) quand on change de port d'écoute",
        "Nginx utilise des liens symboliques (ln -s) pour activer les sites",
        "Le proxy inversé est transparent pour l'utilisateur final",
        "proxy_pass est la directive centrale du reverse proxy Nginx",
      ],
    },
    quiz: [
      {
        type: "mcq",
        question:
          "Sur quel port Apache écoute-t-il une fois le reverse proxy en place ?",
        choices: ["80", "443", "8080", "8000"],
        answer: 2,
        explanation:
          "Apache passe en backend sur 8080, libérant le port 80 pour Nginx.",
      },
      {
        type: "tf",
        question:
          "Un simple systemctl reload apache2 suffit après avoir changé le port d'écoute d'Apache.",
        answer: false,
        explanation:
          "Faux. Le changement de port nécessite un restart complet : le service doit libérer l'ancien port en se relançant.",
      },
      {
        type: "fill",
        question:
          "Complète la directive Nginx qui transfère la requête au backend :",
        prefix: "",
        suffix: " http://localhost:8080;",
        answer: "proxy_pass",
        explanation:
          "proxy_pass est la directive cœur du reverse proxy : elle redirige les requêtes vers le backend indiqué.",
      },
      {
        type: "mcq",
        question:
          "Comment active-t-on un site dans Nginx sous Debian ?",
        choices: [
          "n2ensite proxy",
          "ln -s /etc/nginx/sites-available/proxy /etc/nginx/sites-enabled/",
          "nginx-enable proxy",
          "systemctl enable nginx-proxy",
        ],
        answer: 1,
        explanation:
          "Contrairement à Apache (a2ensite), Nginx n'a pas de commande dédiée : on crée manuellement un lien symbolique avec ln -s.",
      },
      {
        type: "mcq",
        question:
          "Quel est l'objectif principal du reverse proxy dans ce scénario ?",
        choices: [
          "Économiser la mémoire vive du serveur",
          "Préparer l'arrivée de futurs services et masquer la chaîne d'hébergement",
          "Servir le HTTPS automatiquement",
          "Compresser les réponses HTTP",
        ],
        answer: 1,
        explanation:
          "Le proxy inversé prépare l'arrivée de futurs services et masque la chaîne d'hébergement au visiteur final.",
      },
    ],
  },

  // =====================================================================
  // SITUATION 3 — HTTPS auto-signé
  // =====================================================================
  {
    id: 3,
    number: 3,
    title: "HTTPS avec certificat auto-signé",
    icon: "ShieldCheck",
    objective:
      "Sécuriser le site vitrine avec HTTPS (certificat auto-signé) et rediriger automatiquement le HTTP vers HTTPS.",
    steps: [
      {
        title: "Génération du certificat et de la clé privée",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/halieutis.key -out /etc/ssl/certs/halieutis.crt",
            tooltips: [
              {
                match: "-x509",
                text: "Génère un certificat X.509 auto-signé plutôt qu'une CSR à envoyer à une autorité.",
              },
              {
                match: "-nodes",
                text: "No DES : la clé privée n'est PAS protégée par une passphrase. Apache pourra la lire au démarrage sans intervention.",
              },
              {
                match: "-days 365",
                text: "Durée de validité du certificat. Au-delà, il faudra le regénérer.",
              },
              {
                match: "rsa:2048",
                text: "Taille de clé RSA en bits. 2048 est le minimum acceptable aujourd'hui.",
              },
              {
                match: "/etc/ssl/private",
                text: "Emplacement standard Debian pour les clés privées. Les permissions y sont restrictives par défaut.",
              },
              {
                match: "/etc/ssl/certs",
                text: "Emplacement standard Debian pour les certificats publics.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Génère un certificat auto-signé (.crt) valide 365 jours et sa clé privée (.key) sans mot de passe, dans les dossiers standards Debian.",
          },
          {
            type: "note",
            kind: "warning",
            text: "Point critique — à la question Common Name, répondre impérativement : halieutis.local.",
          },
        ],
      },
      {
        title: "Activation du module SSL",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "a2enmod ssl",
            tooltips: [
              {
                match: "a2enmod",
                text: "Commande Debian qui active un module Apache. Équivalent à un lien symbolique dans mods-enabled.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Active le module SSL natif d'Apache pour gérer le trafic HTTPS.",
          },
        ],
      },
      {
        title: "Configuration du VirtualHost HTTPS + redirection",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "nano /etc/apache2/sites-available/vitrine.conf",
          },
          {
            type: "config",
            filename: "vitrine.conf",
            language: "apache",
            code: `<VirtualHost *:80>
    ServerName halieutis.local
    Redirect permanent / https://halieutis.local/
</VirtualHost>

<VirtualHost *:443>
    ServerName halieutis.local
    DocumentRoot /var/www/vitrine
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/halieutis.crt
    SSLCertificateKeyFile /etc/ssl/private/halieutis.key
</VirtualHost>`,
            tooltips: [
              {
                match: "Redirect permanent",
                text: "Génère une réponse HTTP 301 (redirection permanente). Les navigateurs et moteurs de recherche mémorisent la nouvelle URL.",
              },
              {
                match: "*:443",
                text: "Port standard HTTPS. Apache l'écoute après activation du module SSL.",
              },
              {
                match: "SSLEngine on",
                text: "Active le déchiffrement TLS pour ce VirtualHost. Sans cette ligne, Apache ignorera le certificat.",
              },
              {
                match: "SSLCertificateFile",
                text: "Chemin du certificat public (.crt). Ce qu'on présente au client.",
              },
              {
                match: "SSLCertificateKeyFile",
                text: "Chemin de la clé privée (.key). Ne JAMAIS la diffuser : elle reste sur le serveur uniquement.",
              },
            ],
          },
          {
            type: "directives",
            title: "Explication",
            items: [
              {
                name: "Bloc *:80",
                desc: "capture le HTTP et redirige vers HTTPS (code 301).",
              },
              {
                name: "Bloc *:443",
                desc: "sert le site de manière chiffrée via les fichiers du certificat.",
              },
            ],
          },
        ],
      },
      {
        title: "Prise en compte de la configuration",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "systemctl restart apache2",
          },
          {
            type: "explanation",
            text: "Redémarrage nécessaire pour charger le module SSL et les nouveaux ports.",
          },
        ],
      },
      {
        title: "Test de fonctionnement (Recette)",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "curl -kI https://halieutis.local",
            tooltips: [
              {
                match: "-k",
                text: "L'option -k de curl ignore les avertissements liés à un certificat non vérifié (cas typique d'un auto-signé).",
              },
              {
                match: "-I",
                text: "Demande uniquement les en-têtes HTTP (HEAD), sans le corps de la réponse.",
              },
            ],
          },
          {
            type: "expected",
            text: "HTTP/1.1 200 OK (l'option -k ignore l'avertissement lié à l'auto-signature).",
          },
        ],
      },
    ],
    recap: {
      commands: [
        "openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/halieutis.key -out /etc/ssl/certs/halieutis.crt",
        "a2enmod ssl",
        "nano /etc/apache2/sites-available/vitrine.conf",
        "systemctl restart apache2",
      ],
      files: [
        {
          path: "/etc/ssl/certs/halieutis.crt",
          note: "Certificat public auto-signé (Common Name = halieutis.local)",
        },
        {
          path: "/etc/ssl/private/halieutis.key",
          note: "Clé privée RSA 2048 bits, sans passphrase",
        },
        {
          path: "/etc/apache2/sites-available/vitrine.conf",
          note: "Deux VirtualHosts : *:80 redirige en 301, *:443 sert le site avec SSLEngine on",
        },
      ],
      test: {
        command: "curl -kI https://halieutis.local",
        expected: "HTTP/1.1 200 OK",
      },
      keyPoints: [
        "Le certificat va dans /etc/ssl/certs/, la clé privée dans /etc/ssl/private/",
        "Le Common Name doit correspondre exactement au nom de domaine",
        "Le module ssl doit être activé avec a2enmod ssl",
        "La redirection HTTP→HTTPS se fait avec Redirect permanent dans le bloc port 80",
        "SSLEngine on active le chiffrement dans le VirtualHost 443",
        "L'option -k de curl permet de tester un certificat auto-signé",
      ],
    },
    quiz: [
      {
        type: "mcq",
        question:
          "Dans quel dossier la clé privée doit-elle être placée sous Debian ?",
        choices: [
          "/etc/ssl/certs/",
          "/etc/ssl/private/",
          "/etc/apache2/ssl/",
          "/var/ssl/private/",
        ],
        answer: 1,
        explanation:
          "Sous Debian, /etc/ssl/private/ est réservé aux clés privées (permissions restrictives). Les certificats publics vont dans /etc/ssl/certs/.",
      },
      {
        type: "fill",
        question: "Complète la commande qui active le module SSL :",
        prefix: "a2enmod ",
        suffix: "",
        answer: "ssl",
        explanation:
          "a2enmod ssl active le module SSL natif d'Apache nécessaire au HTTPS.",
      },
      {
        type: "tf",
        question:
          "Le Common Name du certificat peut différer du nom de domaine demandé sans poser de problème.",
        answer: false,
        explanation:
          "Faux. Le Common Name doit correspondre exactement au nom de domaine, sinon le client refuse le certificat.",
      },
      {
        type: "mcq",
        question:
          "Quel code HTTP est utilisé par la directive Redirect permanent ?",
        choices: ["200", "301", "302", "308"],
        answer: 1,
        explanation:
          "Redirect permanent renvoie un code 301 (redirection permanente). Navigateurs et moteurs mémorisent la nouvelle URL.",
      },
      {
        type: "mcq",
        question: "À quoi sert l'option -k de curl ?",
        choices: [
          "Afficher les en-têtes HTTP",
          "Ignorer l'avertissement lié à l'auto-signature du certificat",
          "Forcer une connexion keep-alive",
          "Afficher la clé du certificat",
        ],
        answer: 1,
        explanation:
          "L'option -k indique à curl d'ignorer les avertissements de validation du certificat, ce qui est indispensable pour un auto-signé.",
      },
    ],
  },

  // =====================================================================
  // SITUATION 4 — Authentification HTTP Basic
  // =====================================================================
  {
    id: 4,
    number: 4,
    title: "Espace protégé par authentification HTTP",
    icon: "Lock",
    objective:
      "Créer un espace documentaire interne accessible uniquement aux agents disposant d'un compte (authentification HTTP Basic).",
    steps: [
      {
        title: "Création du fichier de mots de passe",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "htpasswd -c /etc/apache2/.htpasswd agent1",
            tooltips: [
              {
                match: "htpasswd",
                text: "Outil fourni par le paquet apache2-utils. Crée et met à jour un fichier d'identifiants chiffrés (bcrypt, MD5, etc.).",
              },
              {
                match: "-c",
                text: "Le flag -c crée le fichier. Ne le remets pas pour ajouter un 2e utilisateur, sinon tu écrases tout !",
              },
              {
                match: ".htpasswd",
                text: "Convention : préfixe . pour le rendre invisible en listing standard. Le nom n'est pas imposé par Apache mais référencé par AuthUserFile.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Utilise l'outil du paquet apache2-utils pour générer un fichier contenant les identifiants chiffrés. Le -c crée le fichier (ne pas remettre ce flag pour ajouter un second utilisateur).",
          },
          {
            type: "note",
            kind: "warning",
            text: "Attention : le compte et le mot de passe doivent être documentés sur la fiche de configuration.",
          },
        ],
      },
      {
        title: "Création du dossier cible",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "mkdir -p /var/www/vitrine/interne",
          },
          {
            type: "explanation",
            text: "Crée le répertoire physique de l'espace documentaire des agents.",
          },
        ],
      },
      {
        title: "Configuration du verrou dans Apache",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "nano /etc/apache2/sites-available/vitrine.conf",
          },
          {
            type: "config",
            filename: "vitrine.conf (extrait)",
            language: "apache",
            code: `<Directory "/var/www/vitrine/interne">
    AuthType Basic
    AuthName "Espace Agents"
    AuthUserFile /etc/apache2/.htpasswd
    Require valid-user
</Directory>`,
            tooltips: [
              {
                match: "<Directory",
                text: "La directive <Directory> cible un chemin physique sur le disque (contrairement à <Location> qui cible une URL).",
              },
              {
                match: "AuthType Basic",
                text: "Authentification HTTP basique : les identifiants sont envoyés en base64 (non chiffré). À ne JAMAIS utiliser sans HTTPS.",
              },
              {
                match: "AuthName",
                text: "Texte affiché dans la popup d'authentification du navigateur.",
              },
              {
                match: "Require valid-user",
                text: "Accepte n'importe quel utilisateur listé dans AuthUserFile. Pour un user précis, utiliser Require user agent1.",
              },
            ],
          },
          {
            type: "directives",
            title: "Explication des directives",
            items: [
              {
                name: "AuthType Basic",
                desc: "type d'authentification utilisé.",
                tooltip:
                  "Encodage base64 — c'est lisible si quelqu'un intercepte la requête sans HTTPS.",
              },
              {
                name: "AuthName",
                desc: "message affiché dans la fenêtre de connexion.",
              },
              {
                name: "AuthUserFile",
                desc: "chemin vers le fichier contenant les identifiants.",
              },
              {
                name: "Require valid-user",
                desc: "tout utilisateur présent dans le fichier est accepté.",
              },
            ],
          },
        ],
      },
      {
        title: "Prise en compte de la configuration",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "systemctl reload apache2",
          },
          {
            type: "explanation",
            text: "Recharge Apache pour appliquer la restriction d'accès.",
          },
        ],
      },
      {
        title: "Test de fonctionnement (Recette)",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "curl -u agent1:motdepasse http://halieutis.local/interne/",
            tooltips: [
              {
                match: "-u",
                text: "Passe à curl un couple identifiant:motdepasse pour l'authentification Basic.",
              },
            ],
          },
          {
            type: "expected",
            text: "Affichage du contenu protégé sans erreur 401.",
          },
        ],
      },
    ],
    recap: {
      commands: [
        "htpasswd -c /etc/apache2/.htpasswd agent1",
        "mkdir -p /var/www/vitrine/interne",
        "nano /etc/apache2/sites-available/vitrine.conf",
        "systemctl reload apache2",
      ],
      files: [
        {
          path: "/etc/apache2/.htpasswd",
          note: "Fichier d'identifiants chiffrés (agent1 et son mot de passe)",
        },
        {
          path: "/var/www/vitrine/interne/",
          note: "Dossier protégé par authentification HTTP Basic",
        },
        {
          path: "/etc/apache2/sites-available/vitrine.conf",
          note: "Bloc <Directory> avec AuthType Basic, AuthUserFile, Require valid-user",
        },
      ],
      test: {
        command: "curl -u agent1:motdepasse http://halieutis.local/interne/",
        expected: "Contenu affiché sans erreur 401",
      },
      keyPoints: [
        "htpasswd appartient au paquet apache2-utils",
        "Le flag -c ne sert qu'à la création initiale du fichier",
        "La directive <Directory> cible un chemin physique sur le disque",
        "AuthType Basic envoie les identifiants en base64 (non chiffré sans HTTPS)",
        "Require valid-user accepte tout utilisateur du fichier .htpasswd",
      ],
    },
    quiz: [
      {
        type: "mcq",
        question: "À quoi sert le flag -c de htpasswd ?",
        choices: [
          "Compresser le fichier de mots de passe",
          "Créer le fichier (à n'utiliser qu'à la première fois)",
          "Chiffrer les mots de passe en SHA-256",
          "Confirmer l'ajout sans demander de saisie",
        ],
        answer: 1,
        explanation:
          "Le flag -c crée le fichier. Le remettre pour ajouter un nouvel utilisateur écrase tous les identifiants existants !",
      },
      {
        type: "fill",
        question:
          "Complète la directive qui accepte tout utilisateur du fichier .htpasswd :",
        prefix: "Require ",
        suffix: "",
        answer: "valid-user",
        explanation:
          "Require valid-user accepte n'importe quel utilisateur listé dans AuthUserFile.",
      },
      {
        type: "tf",
        question:
          "AuthType Basic chiffre les identifiants envoyés par le client.",
        answer: false,
        explanation:
          "Faux. Les identifiants sont uniquement encodés en base64 (lisible). Sans HTTPS au-dessus, c'est interceptable en clair.",
      },
      {
        type: "mcq",
        question:
          "Quelle directive Apache cible un chemin physique sur le disque pour appliquer une protection ?",
        choices: ["<Location>", "<Directory>", "<Files>", "<Path>"],
        answer: 1,
        explanation:
          "<Directory> cible un chemin sur le disque, contrairement à <Location> qui cible une URL.",
      },
      {
        type: "mcq",
        question: "Dans quel paquet Debian se trouve la commande htpasswd ?",
        choices: ["apache2", "openssl", "apache2-utils", "htpasswd-tools"],
        answer: 2,
        explanation:
          "htpasswd est fourni par apache2-utils, à installer séparément du serveur apache2.",
      },
    ],
  },

  // =====================================================================
  // SITUATION 5 — Logs Apache et rotation
  // =====================================================================
  {
    id: 5,
    number: 5,
    title: "Journalisation Apache et rotation des logs",
    icon: "FileText",
    objective:
      "Mettre en place une gestion structurée des journaux d'accès et d'erreurs avec format personnalisé et rotation automatique.",
    steps: [
      {
        title: "Configuration des journaux dans le VirtualHost",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "nano /etc/apache2/sites-available/vitrine.conf",
          },
          {
            type: "config",
            filename: "vitrine.conf (extrait)",
            language: "apache",
            code: `ErrorLog \${APACHE_LOG_DIR}/vitrine_error.log
LogFormat "%h %t \\"%r\\" %>s %O" format_perso
CustomLog \${APACHE_LOG_DIR}/vitrine_access.log format_perso`,
            tooltips: [
              {
                match: "ErrorLog",
                text: "Définit le fichier où sont écrites les erreurs (404, configuration cassée, etc.).",
              },
              {
                match: "${APACHE_LOG_DIR}",
                text: "Variable d'environnement Debian qui pointe vers /var/log/apache2/. Pratique pour éviter de coder en dur le chemin.",
              },
              {
                match: "LogFormat",
                text: "Définit la STRUCTURE d'un format de log, identifié par un nom (ici format_perso). À combiner avec CustomLog pour l'appliquer.",
              },
              {
                match: "CustomLog",
                text: "Applique un format de log à un fichier d'accès donné.",
              },
            ],
          },
          {
            type: "directives",
            title: "Codes de format LogFormat",
            items: [
              {
                name: "%h",
                desc: "adresse IP du client.",
                tooltip:
                  "Hostname ou IP, selon la configuration HostnameLookups (off par défaut → IP brute).",
              },
              {
                name: "%t",
                desc: "date et heure de la requête.",
                tooltip: "Format : [jour/mois/année:HH:MM:SS fuseau].",
              },
              {
                name: "%r",
                desc: "ligne de requête complète (méthode + URI + protocole).",
                tooltip: 'Exemple : "GET /index.html HTTP/1.1".',
              },
              {
                name: "%>s",
                desc: "code de statut HTTP final.",
                tooltip:
                  "Le > indique le statut après d'éventuelles redirections internes.",
              },
              {
                name: "%O",
                desc: "taille de la réponse en octets.",
                tooltip:
                  "Inclut les en-têtes HTTP. Le %b ne renvoie que le corps de la réponse.",
              },
            ],
          },
        ],
      },
      {
        title: "Prise en compte de la configuration",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "systemctl reload apache2",
          },
          {
            type: "explanation",
            text: "Recharge Apache pour qu'il écrive dans les nouveaux fichiers journaux.",
          },
        ],
      },
      {
        title: "Test des journaux (Recette)",
        blocks: [
          {
            type: "action",
            text: "Générer une visite :",
          },
          {
            type: "command",
            title: "Terminal",
            code: "curl http://halieutis.local",
          },
          {
            type: "command",
            title: "Terminal",
            code: "cat /var/log/apache2/vitrine_access.log",
          },
          {
            type: "expected",
            text: "Une ligne formatée avec l'IP (127.0.0.1), la date, la commande GET et le code 200.",
          },
        ],
      },
      {
        title: "Vérification et test de la rotation",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "cat /etc/logrotate.d/apache2",
            tooltips: [
              {
                match: "logrotate.d",
                text: "Dossier dans lequel chaque service dépose sa configuration de rotation. logrotate les agrège automatiquement.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Prouve que le système natif Debian cible tous les *.log du répertoire Apache avec les options daily et compress.",
          },
          {
            type: "command",
            title: "Terminal",
            code: "logrotate -f /etc/logrotate.d/apache2",
            tooltips: [
              {
                match: "-f",
                text: "Force la rotation immédiate, même si les conditions (taille, périodicité) ne sont pas réunies. Idéal pour valider la config.",
              },
            ],
          },
          {
            type: "command",
            title: "Terminal",
            code: "ls /var/log/apache2/",
          },
          {
            type: "expected",
            text: "Les anciens journaux renommés en .1 ou .gz, prouvant que le mécanisme fonctionne.",
          },
        ],
      },
    ],
    recap: {
      commands: [
        "nano /etc/apache2/sites-available/vitrine.conf",
        "systemctl reload apache2",
        "curl http://halieutis.local",
        "cat /var/log/apache2/vitrine_access.log",
        "cat /etc/logrotate.d/apache2",
        "logrotate -f /etc/logrotate.d/apache2",
        "ls /var/log/apache2/",
      ],
      files: [
        {
          path: "/etc/apache2/sites-available/vitrine.conf",
          note: "Directives ErrorLog, LogFormat \"format_perso\", CustomLog",
        },
        {
          path: "/var/log/apache2/vitrine_access.log",
          note: "Journal d'accès personnalisé",
        },
        {
          path: "/var/log/apache2/vitrine_error.log",
          note: "Journal d'erreurs isolé",
        },
        {
          path: "/etc/logrotate.d/apache2",
          note: "Configuration native Debian de rotation (daily + compress)",
        },
      ],
      test: {
        command: "logrotate -f /etc/logrotate.d/apache2 && ls /var/log/apache2/",
        expected: "Anciens journaux renommés en .1 ou .gz",
      },
      keyPoints: [
        "${APACHE_LOG_DIR} pointe vers /var/log/apache2/ sous Debian",
        "LogFormat définit la structure, CustomLog l'applique",
        "Les codes de format : %h (IP), %t (date), %r (requête), %>s (statut), %O (taille)",
        "La rotation est gérée nativement par logrotate sous Debian",
        "logrotate -f permet de forcer une rotation immédiate pour tester",
      ],
    },
    quiz: [
      {
        type: "mcq",
        question: "Que représente %h dans un LogFormat Apache ?",
        choices: [
          "L'heure de la requête",
          "Un en-tête HTTP",
          "L'adresse IP du client",
          "Le nom de l'hôte virtuel",
        ],
        answer: 2,
        explanation:
          "%h représente l'adresse IP du client (ou son hostname si HostnameLookups est activé).",
      },
      {
        type: "fill",
        question:
          "Complète la variable d'environnement Debian qui pointe vers /var/log/apache2/ :",
        prefix: "${",
        suffix: "}",
        answer: "APACHE_LOG_DIR",
        explanation:
          "${APACHE_LOG_DIR} pointe vers /var/log/apache2/ sous Debian, évitant de coder le chemin en dur.",
      },
      {
        type: "tf",
        question:
          "La rotation des logs Apache nécessite d'installer un paquet supplémentaire sous Debian.",
        answer: false,
        explanation:
          "Faux. logrotate est natif sur Debian et la config Apache est déjà déposée dans /etc/logrotate.d/apache2.",
      },
      {
        type: "mcq",
        question: "Que représente le code de format %>s ?",
        choices: [
          "La taille de la réponse",
          "Le code de statut HTTP final",
          "La méthode HTTP utilisée",
          "Le statut du serveur",
        ],
        answer: 1,
        explanation:
          "%>s donne le code de statut HTTP final (le > précise : après redirections internes).",
      },
      {
        type: "mcq",
        question:
          "Quelle commande force une rotation immédiate pour tester la configuration ?",
        choices: [
          "logrotate -t /etc/logrotate.d/apache2",
          "logrotate -f /etc/logrotate.d/apache2",
          "systemctl restart logrotate",
          "rotate --force apache2",
        ],
        answer: 1,
        explanation:
          "logrotate -f force la rotation immédiate, même si les conditions de période ou de taille ne sont pas remplies.",
      },
    ],
  },

  // =====================================================================
  // SITUATION 6 — Rewrite & Redirections
  // =====================================================================
  {
    id: 6,
    number: 6,
    title: "Réécriture d'URL et redirections",
    icon: "Link",
    objective:
      "Prendre en charge les anciennes URL du site historique par redirections et réécritures, sans rupture pour les visiteurs.",
    steps: [
      {
        title: "Activation du module de réécriture",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "a2enmod rewrite",
            tooltips: [
              {
                match: "a2enmod",
                text: "Commande Debian qui active un module Apache via lien symbolique dans /etc/apache2/mods-enabled/.",
              },
              {
                match: "rewrite",
                text: "Module mod_rewrite : moteur de réécriture d'URL à la volée, basé sur des expressions régulières.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Active le module natif d'Apache mod_rewrite permettant de modifier les URL à la volée.",
          },
        ],
      },
      {
        title: "Configuration des règles dans le VirtualHost",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "nano /etc/apache2/sites-available/vitrine.conf",
          },
          {
            type: "config",
            filename: "vitrine.conf (extrait)",
            language: "apache",
            code: `RewriteEngine On
Redirect permanent /vieille-page.html https://halieutis.local/
RewriteRule ^/vieux-dossier/(.*)$ /nouveau-dossier/$1 [R=301,L]`,
            tooltips: [
              {
                match: "RewriteEngine On",
                text: "Active le moteur de réécriture pour ce contexte. Sans cette ligne, les RewriteRule sont ignorées.",
              },
              {
                match: "Redirect permanent",
                text: "Redirection simple : une URL fixe vers une autre. Idéale quand il n'y a pas de motif dynamique à capturer.",
              },
              {
                match: "(.*)",
                text: "L'expression régulière capture tout le chemin restant. $1 le réinjecte dans la nouvelle URL.",
              },
              {
                match: "$1",
                text: "Référence au premier groupe capturé par la regex (entre parenthèses).",
              },
              {
                match: "[R=301,L]",
                text: "R=301 → redirection permanente côté client. L → Last, stoppe le traitement des règles suivantes.",
              },
            ],
          },
          {
            type: "directives",
            title: "Explication des directives",
            items: [
              {
                name: "RewriteEngine On",
                desc: "active le moteur de réécriture.",
              },
              {
                name: "Redirect permanent",
                desc: "redirige une URL simple vers une autre (code 301).",
              },
              {
                name: "RewriteRule",
                desc: "utilise une expression régulière pour capturer dynamiquement une partie de l'ancienne URL (.*) et la réinjecter dans la nouvelle $1.",
              },
            ],
          },
          {
            type: "directives",
            title: "Détail des flags",
            items: [
              {
                name: "R=301",
                desc: "indique une redirection permanente.",
                tooltip:
                  "Les navigateurs et moteurs de recherche mettront en cache la nouvelle URL.",
              },
              {
                name: "L",
                desc: "dernière règle à appliquer (arrête le traitement).",
                tooltip:
                  "L = Last. Évite que les règles suivantes ne réécrivent à nouveau l'URL déjà transformée.",
              },
            ],
          },
        ],
      },
      {
        title: "Prise en compte de la configuration",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "systemctl restart apache2",
            tooltips: [
              {
                match: "restart",
                text: "On utilise restart (et pas reload) parce qu'on charge un nouveau module : Apache doit recharger l'ensemble.",
              },
            ],
          },
          {
            type: "explanation",
            text: "Redémarrage nécessaire pour charger le module rewrite et les règles.",
          },
        ],
      },
      {
        title: "Test de fonctionnement (Recette)",
        blocks: [
          {
            type: "command",
            title: "Terminal",
            code: "curl -kI https://halieutis.local/vieille-page.html",
          },
          {
            type: "expected",
            text: "HTTP/1.1 301 Moved Permanently avec une ligne Location: pointant vers la nouvelle URL.",
          },
        ],
      },
    ],
    recap: {
      commands: [
        "a2enmod rewrite",
        "nano /etc/apache2/sites-available/vitrine.conf",
        "systemctl restart apache2",
        "curl -kI https://halieutis.local/vieille-page.html",
      ],
      files: [
        {
          path: "/etc/apache2/sites-available/vitrine.conf",
          note: "RewriteEngine On + Redirect permanent + RewriteRule avec flags [R=301,L]",
        },
      ],
      test: {
        command: "curl -kI https://halieutis.local/vieille-page.html",
        expected: "HTTP/1.1 301 Moved Permanently + Location vers la nouvelle URL",
      },
      keyPoints: [
        "Le module rewrite s'active avec a2enmod rewrite",
        "Redirect permanent gère les cas simples (une URL → une autre)",
        "RewriteRule gère les cas complexes avec expressions régulières",
        "(.*) capture tout ce qui suit, $1 le réinjecte",
        "Les flags [R=301,L] combinent redirection permanente et arrêt du traitement",
        "Objectif : aucune rupture de navigation pour les visiteurs venant d'anciens liens",
      ],
    },
    quiz: [
      {
        type: "mcq",
        question:
          "Quel module Apache faut-il activer pour utiliser RewriteRule ?",
        choices: ["mod_proxy", "rewrite", "headers", "alias"],
        answer: 1,
        explanation:
          "Le module rewrite s'active avec a2enmod rewrite. C'est lui qui fournit RewriteEngine, RewriteRule, etc.",
      },
      {
        type: "fill",
        question:
          "Complète la directive qui démarre le moteur de réécriture :",
        prefix: "",
        suffix: " On",
        answer: "RewriteEngine",
        explanation:
          "RewriteEngine On active le moteur de réécriture pour le contexte courant.",
      },
      {
        type: "tf",
        question:
          "Le flag L dans une RewriteRule signifie « Last » et arrête le traitement des règles suivantes.",
        answer: true,
        explanation:
          "Vrai. L = Last : la règle est la dernière appliquée pour la requête. Évite des réécritures en cascade.",
      },
      {
        type: "mcq",
        question:
          "Que fait l'expression (.*) dans une RewriteRule ?",
        choices: [
          "Vérifie qu'il y a au moins un caractère",
          "Capture tout le chemin restant pour le réinjecter via $1",
          "Bloque toute requête correspondante",
          "Indique un commentaire",
        ],
        answer: 1,
        explanation:
          "(.*) est une regex qui capture tout ce qui suit ; on récupère ensuite la capture avec $1 dans la nouvelle URL.",
      },
      {
        type: "mcq",
        question:
          "Après l'activation d'un nouveau module Apache, quelle action faut-il faire ?",
        choices: [
          "Recharger Apache (reload)",
          "Redémarrer Apache (restart)",
          "Redémarrer le serveur entier",
          "Rien, le module est chargé immédiatement",
        ],
        answer: 1,
        explanation:
          "Le chargement d'un nouveau module nécessite un restart complet d'Apache.",
      },
    ],
  },
];

export const totalSituations = situations.length;
