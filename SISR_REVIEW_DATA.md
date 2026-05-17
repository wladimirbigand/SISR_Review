# Épreuve Pratique SISR — Halieutis Sud-Ouest

## Contexte général

**Organisation** : Halieutis Sud-Ouest — structure régionale gérant plusieurs sites de pêche et d'observation faunique.

**Mission** : Modernisation de l'infrastructure numérique. Le site institutionnel, les espaces internes et les outils métier doivent être hébergés sur un serveur Linux Debian 13 mutualisé.

**Scénario** : Six techniciens travaillent en parallèle, chacun sur une VM individuelle reliée au réseau de tests. Chaque technicien prend en charge un lot de configuration distinct.

**Environnement technique** :
- Machine virtuelle sous Debian 13 à jour
- Accès root local et accès SSH activé
- Paquets disponibles : apache2, nginx, openssl, apache2-utils
- Nom de domaine local : `halieutis.local` (via `/etc/hosts`)
- Réseau de laboratoire isolé

**Contraintes** :
- Aucune ouverture vers l'extérieur
- Configurations lisibles, commentées et reproductibles
- Chaque service démarre automatiquement au boot
- Fichiers de configuration dans les emplacements standards Debian
- Comptes et mots de passe documentés

**Organisation de l'épreuve** : 70 minutes par technicien (15 min étude, 15 min échange formateur, 30 min réalisation, 10 min recette).

---

## Situation 1 — Site vitrine Apache avec VirtualHost dédié

### Objectif
Publier un site vitrine public servi par Apache via un VirtualHost dédié, distinct du site par défaut.

### Étape 1 : Création de l'arborescence et de la page web

**Commande :**
```bash
mkdir -p /var/www/vitrine
```
**Explication :** Crée le dossier racine qui va héberger les fichiers du site web.

**Commande :**
```bash
echo "<h1>Hello world !</h1>" > /var/www/vitrine/index.html
```
**Explication :** Crée une page d'accueil de test pour vérifier que le serveur répond correctement.

### Étape 2 : Création du fichier de configuration VirtualHost

**Commande :**
```bash
nano /etc/apache2/sites-available/vitrine.conf
```

**Contenu du fichier :**
```apache
<VirtualHost *:80>
    ServerName halieutis.local
    DocumentRoot /var/www/vitrine
</VirtualHost>
```

**Explication des directives :**
- `ServerName` : définit le nom de domaine à écouter.
- `DocumentRoot` : indique le répertoire contenant les fichiers du site.

### Étape 3 : Activation du site et désactivation du site par défaut

**Commande :**
```bash
a2ensite vitrine.conf
```
**Explication :** Active le nouveau site vitrine.

**Commande :**
```bash
a2dissite 000-default.conf
```
**Explication :** Désactive le site par défaut d'Apache pour éviter les conflits.

### Étape 4 : Prise en compte de la configuration

**Commande :**
```bash
systemctl reload apache2
```
**Explication :** Recharge la configuration d'Apache en douceur (sans couper les connexions existantes).

### Étape 5 : Test de fonctionnement (Recette)

**Commande :**
```bash
curl http://halieutis.local
```
**Résultat attendu :** `<h1>Hello world !</h1>`

**Explication :** Simule la requête d'un navigateur pour prouver le bon fonctionnement.

### Points clés à retenir
- Le fichier de configuration se place dans `/etc/apache2/sites-available/`
- On active un site avec `a2ensite`, on le désactive avec `a2dissite`
- `reload` applique les changements sans coupure, `restart` relance complètement le service
- Le VirtualHost doit être distinct du site par défaut `000-default.conf`

---

## Situation 2 — Proxy inversé Nginx devant Apache

### Objectif
Positionner Nginx en frontal (port 80) devant Apache (port 8080), pour préparer l'arrivée de futurs services et masquer la chaîne d'hébergement.

### Étape 1 : Déplacer Apache sur un port interne

**Commande :**
```bash
nano /etc/apache2/ports.conf
```
**Action :** Remplacer `Listen 80` par `Listen 8080`.

**Commande :**
```bash
nano /etc/apache2/sites-available/vitrine.conf
```
**Action :** Modifier l'en-tête du VirtualHost en `<VirtualHost *:8080>`.

**Commande :**
```bash
systemctl restart apache2
```
**Explication :** Redémarrage complet (pas un simple reload) pour forcer Apache à libérer le port 80 et basculer sur le 8080.

### Étape 2 : Création de la configuration Nginx

**Commande :**
```bash
nano /etc/nginx/sites-available/proxy
```

**Contenu du fichier :**
```nginx
server {
    listen 80;
    server_name halieutis.local;

    location / {
        proxy_pass http://localhost:8080;
    }
}
```

**Explication :** Nginx écoute sur le port 80 (frontal). La directive `proxy_pass` redirige tout le trafic vers Apache sur le port 8080.

### Étape 3 : Activation du proxy Nginx

**Commande :**
```bash
ln -s /etc/nginx/sites-available/proxy /etc/nginx/sites-enabled/
```
**Explication :** Crée un lien symbolique pour activer le site (équivalent manuel du `a2ensite` d'Apache).

**Commande :**
```bash
systemctl start nginx
```
**Explication :** Lance le service Nginx.

### Étape 4 : Test de fonctionnement (Recette)

**Commande :**
```bash
curl http://halieutis.local
```
**Résultat attendu :** `<h1>Hello world !</h1>`

**Explication :** En apparence rien ne change pour le visiteur, mais la requête frappe Nginx (port 80) qui va chercher la réponse auprès d'Apache (port 8080).

### Points clés à retenir
- Apache passe en backend sur le port 8080, Nginx prend le port 80
- `restart` est nécessaire (et non `reload`) quand on change de port d'écoute
- Nginx utilise des liens symboliques (`ln -s`) pour activer les sites
- Le proxy inversé est transparent pour l'utilisateur final
- `proxy_pass` est la directive centrale du reverse proxy Nginx

---

## Situation 3 — HTTPS avec certificat auto-signé

### Objectif
Sécuriser le site vitrine avec HTTPS (certificat auto-signé) et rediriger automatiquement le HTTP vers HTTPS.

### Étape 1 : Génération du certificat et de la clé privée

**Commande :**
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/halieutis.key -out /etc/ssl/certs/halieutis.crt
```

**Explication :** Génère un certificat auto-signé (.crt) valide 365 jours et sa clé privée (.key) sans mot de passe, dans les dossiers standards Debian.

**Point critique :** À la question `Common Name`, répondre impérativement : `halieutis.local`.

### Étape 2 : Activation du module SSL

**Commande :**
```bash
a2enmod ssl
```
**Explication :** Active le module SSL natif d'Apache pour gérer le trafic HTTPS.

### Étape 3 : Configuration du VirtualHost HTTPS + redirection

**Commande :**
```bash
nano /etc/apache2/sites-available/vitrine.conf
```

**Contenu du fichier :**
```apache
<VirtualHost *:80>
    ServerName halieutis.local
    Redirect permanent / https://halieutis.local/
</VirtualHost>

<VirtualHost *:443>
    ServerName halieutis.local
    DocumentRoot /var/www/vitrine
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/halieutis.crt
    SSLCertificateKeyFile /etc/ssl/private/halieutis.key
</VirtualHost>
```

**Explication :**
- Le bloc `*:80` capture le HTTP et redirige vers HTTPS (code 301).
- Le bloc `*:443` sert le site de manière chiffrée via les fichiers du certificat.

### Étape 4 : Prise en compte de la configuration

**Commande :**
```bash
systemctl restart apache2
```
**Explication :** Redémarrage nécessaire pour charger le module SSL et les nouveaux ports.

### Étape 5 : Test de fonctionnement (Recette)

**Commande :**
```bash
curl -kI https://halieutis.local
```
**Résultat attendu :** `HTTP/1.1 200 OK` (l'option `-k` ignore l'avertissement lié à l'auto-signature).

### Points clés à retenir
- Le certificat va dans `/etc/ssl/certs/`, la clé privée dans `/etc/ssl/private/`
- Le `Common Name` doit correspondre exactement au nom de domaine
- Le module `ssl` doit être activé avec `a2enmod ssl`
- La redirection HTTP→HTTPS se fait avec `Redirect permanent` dans le bloc port 80
- `SSLEngine on` active le chiffrement dans le VirtualHost 443
- L'option `-k` de curl permet de tester un certificat auto-signé

---

## Situation 4 — Espace protégé par authentification HTTP

### Objectif
Créer un espace documentaire interne accessible uniquement aux agents disposant d'un compte (authentification HTTP Basic).

### Étape 1 : Création du fichier de mots de passe

**Commande :**
```bash
htpasswd -c /etc/apache2/.htpasswd agent1
```

**Explication :** Utilise l'outil du paquet `apache2-utils` pour générer un fichier contenant les identifiants chiffrés. Le `-c` crée le fichier (ne pas remettre ce flag pour ajouter un second utilisateur).

**Attention :** Le compte et le mot de passe doivent être documentés sur la fiche de configuration.

### Étape 2 : Création du dossier cible

**Commande :**
```bash
mkdir -p /var/www/vitrine/interne
```
**Explication :** Crée le répertoire physique de l'espace documentaire des agents.

### Étape 3 : Configuration du verrou dans Apache

**Commande :**
```bash
nano /etc/apache2/sites-available/vitrine.conf
```

**Contenu à ajouter dans le VirtualHost :**
```apache
<Directory "/var/www/vitrine/interne">
    AuthType Basic
    AuthName "Espace Agents"
    AuthUserFile /etc/apache2/.htpasswd
    Require valid-user
</Directory>
```

**Explication des directives :**
- `AuthType Basic` : type d'authentification utilisé.
- `AuthName` : message affiché dans la fenêtre de connexion.
- `AuthUserFile` : chemin vers le fichier contenant les identifiants.
- `Require valid-user` : tout utilisateur présent dans le fichier est accepté.

### Étape 4 : Prise en compte de la configuration

**Commande :**
```bash
systemctl reload apache2
```
**Explication :** Recharge Apache pour appliquer la restriction d'accès.

### Étape 5 : Test de fonctionnement (Recette)

**Commande :**
```bash
curl -u agent1:motdepasse http://halieutis.local/interne/
```
**Résultat attendu :** Affichage du contenu protégé sans erreur 401.

### Points clés à retenir
- `htpasswd` appartient au paquet `apache2-utils`
- Le flag `-c` ne sert qu'à la création initiale du fichier
- La directive `<Directory>` cible un chemin physique sur le disque
- `AuthType Basic` envoie les identifiants en base64 (non chiffré sans HTTPS)
- `Require valid-user` accepte tout utilisateur du fichier `.htpasswd`

---

## Situation 5 — Journalisation Apache et rotation des logs

### Objectif
Mettre en place une gestion structurée des journaux d'accès et d'erreurs avec format personnalisé et rotation automatique.

### Étape 1 : Configuration des journaux dans le VirtualHost

**Commande :**
```bash
nano /etc/apache2/sites-available/vitrine.conf
```

**Contenu à ajouter :**
```apache
ErrorLog ${APACHE_LOG_DIR}/vitrine_error.log
LogFormat "%h %t \"%r\" %>s %O" format_perso
CustomLog ${APACHE_LOG_DIR}/vitrine_access.log format_perso
```

**Explication des directives :**
- `ErrorLog` : isole les erreurs du site dans un fichier dédié.
- `LogFormat` : définit un format personnalisé avec les champs suivants :
  - `%h` : adresse IP du client
  - `%t` : date et heure de la requête
  - `%r` : ligne de requête complète (méthode + URI + protocole)
  - `%>s` : code de statut HTTP final
  - `%O` : taille de la réponse en octets
- `CustomLog` : applique le format personnalisé au journal d'accès du site.

### Étape 2 : Prise en compte de la configuration

**Commande :**
```bash
systemctl reload apache2
```
**Explication :** Recharge Apache pour qu'il écrive dans les nouveaux fichiers journaux.

### Étape 3 : Test des journaux (Recette)

**Action :** Générer une visite :
```bash
curl http://halieutis.local
```

**Vérification :**
```bash
cat /var/log/apache2/vitrine_access.log
```
**Résultat attendu :** Une ligne formatée avec l'IP (127.0.0.1), la date, la commande GET et le code 200.

### Étape 4 : Vérification et test de la rotation

**Vérification de la config de rotation :**
```bash
cat /etc/logrotate.d/apache2
```
**Explication :** Prouve que le système natif Debian cible tous les `*.log` du répertoire Apache avec les options `daily` et `compress`.

**Test de rotation forcée :**
```bash
logrotate -f /etc/logrotate.d/apache2
```
**Vérification :**
```bash
ls /var/log/apache2/
```
**Résultat attendu :** Les anciens journaux renommés en `.1` ou `.gz`, prouvant que le mécanisme fonctionne.

### Points clés à retenir
- `${APACHE_LOG_DIR}` pointe vers `/var/log/apache2/` sous Debian
- `LogFormat` définit la structure, `CustomLog` l'applique
- Les codes de format : `%h` (IP), `%t` (date), `%r` (requête), `%>s` (statut), `%O` (taille)
- La rotation est gérée nativement par `logrotate` sous Debian
- `logrotate -f` permet de forcer une rotation immédiate pour tester

---

## Situation 6 — Réécriture d'URL et redirections

### Objectif
Prendre en charge les anciennes URL du site historique par redirections et réécritures, sans rupture pour les visiteurs.

### Étape 1 : Activation du module de réécriture

**Commande :**
```bash
a2enmod rewrite
```
**Explication :** Active le module natif d'Apache `mod_rewrite` permettant de modifier les URL à la volée.

### Étape 2 : Configuration des règles dans le VirtualHost

**Commande :**
```bash
nano /etc/apache2/sites-available/vitrine.conf
```

**Contenu à ajouter :**
```apache
RewriteEngine On
Redirect permanent /vieille-page.html https://halieutis.local/
RewriteRule ^/vieux-dossier/(.*)$ /nouveau-dossier/$1 [R=301,L]
```

**Explication des directives :**
- `RewriteEngine On` : active le moteur de réécriture.
- `Redirect permanent` : redirige une URL simple vers une autre (code 301).
- `RewriteRule` : utilise une expression régulière pour capturer dynamiquement une partie de l'ancienne URL `(.*)` et la réinjecter dans la nouvelle `$1`.

**Détail des flags :**
- `R=301` : indique une redirection permanente.
- `L` : dernière règle à appliquer (arrête le traitement).

### Étape 3 : Prise en compte de la configuration

**Commande :**
```bash
systemctl restart apache2
```
**Explication :** Redémarrage nécessaire pour charger le module `rewrite` et les règles.

### Étape 4 : Test de fonctionnement (Recette)

**Commande :**
```bash
curl -kI https://halieutis.local/vieille-page.html
```
**Résultat attendu :** `HTTP/1.1 301 Moved Permanently` avec une ligne `Location:` pointant vers la nouvelle URL.

### Points clés à retenir
- Le module `rewrite` s'active avec `a2enmod rewrite`
- `Redirect permanent` gère les cas simples (une URL → une autre)
- `RewriteRule` gère les cas complexes avec expressions régulières
- `(.*)` capture tout ce qui suit, `$1` le réinjecte
- Les flags `[R=301,L]` combinent redirection permanente et arrêt du traitement
- Objectif : aucune rupture de navigation pour les visiteurs venant d'anciens liens
