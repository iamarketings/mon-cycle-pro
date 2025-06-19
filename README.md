# Mon Cycle Pro 🌸

Application web progressive (PWA) complète pour le suivi menstruel avec prédictions intelligentes.

## 🚀 Fonctionnalités

### ✨ Tableau de bord intelligent
- **Statut en temps réel** : Période sûre, fertile, ovulation ou règles
- **Timeline visuelle** : Visualisation claire de votre cycle
- **Prédictions précises** : Dates des prochaines règles et ovulations
- **Indicateurs colorés** : Code couleur intuitif pour chaque phase

### 📅 Calendrier complet
- **Vue mensuelle** : Visualisation de vos cycles sur le calendrier
- **Codes couleur** : Identification rapide des périodes importantes
- **Navigation facile** : Naviguez entre les mois simplement
- **Résumé mensuel** : Statistiques du mois en cours

### 📊 Statistiques avancées
- **Analyse de régularité** : Calculez la régularité de vos cycles
- **Tendances** : Évolution de vos cycles dans le temps
- **Comparaisons** : Comparez avec les moyennes générales
- **Prédictions améliorées** : Plus de données = prédictions plus précises

### 📚 Historique complet
- **Tous vos cycles** : Ajoutez et gérez vos cycles passés
- **Notes personnelles** : Ajoutez des notes pour chaque cycle
- **Suppression facile** : Corrigez les erreurs de saisie
- **Recherche** : Retrouvez facilement vos données

### 🔒 Sécurité et confidentialité
- **Stockage local uniquement** : Vos données restent sur votre appareil
- **Pas de serveur externe** : Aucune transmission de données personnelles
- **Chiffrement local** : Protection de vos informations sensibles
- **Suppression complète** : Effacez toutes vos données quand vous voulez

### 📱 Application mobile (PWA)
- **Installation possible** : Ajoutez l'app à votre écran d'accueil
- **Fonctionne hors ligne** : Utilisez l'app sans connexion internet
- **Notifications** : Rappels pour vos cycles (optionnel)
- **Interface responsive** : Optimisée pour mobile et desktop

## 🔧 Installation

### Option 1 : Serveur web local
1. Téléchargez tous les fichiers dans un dossier
2. Utilisez un serveur web local (ex: `python -m http.server 8000`)
3. Ouvrez http://localhost:8000 dans votre navigateur

### Option 2 : Hébergement web
1. Uploadez tous les fichiers sur votre serveur web
2. Assurez-vous que les fichiers sont accessibles via HTTPS
3. L'app sera automatiquement installable

### Option 3 : GitHub Pages
1. Créez un repository GitHub
2. Uploadez les fichiers
3. Activez GitHub Pages dans les paramètres
4. Votre app sera disponible à l'adresse fournie

## 📁 Structure des fichiers

```
mon-cycle-pro/
├── index.html          # Page principale de l'application
├── app.js              # Logique JavaScript complète
├── manifest.json       # Manifeste PWA
├── service-worker.js   # Service Worker pour fonctionnement hors ligne
├── robots.txt          # Configuration robots
├── .htaccess          # Configuration Apache (si applicable)
├── README.md          # Documentation principale
├── icons/             # Icônes de l'application
│   ├── icon.svg       # Icône source vectorielle
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   └── README.md      # Guide génération icônes
└── screenshots/       # Captures d'écran (optionnel)
```

## 🎯 Guide d'utilisation

### Première utilisation
1. **Configuration initiale** : Suivez les 3 étapes de configuration
2. **Date des dernières règles** : Entrez la date de début de vos dernières règles
3. **Paramètres du cycle** : Configurez vos durées habituelles
4. **Objectif** : Choisissez votre utilisation principale

### Utilisation quotidienne
1. **Consultez le tableau de bord** : Voyez votre statut actuel
2. **Ajoutez de nouveaux cycles** : Enregistrez vos nouvelles règles
3. **Consultez les prédictions** : Planifiez vos prochaines dates
4. **Analysez vos tendances** : Suivez l'évolution de vos cycles

### Gestion des données
- **Ajout de cycles** : Onglet "Données" > "Ajouter un nouveau cycle"
- **Historique** : Onglet "Historique" > Ajoutez vos cycles passés
- **Suppression** : Bouton 🗑️ à côté de chaque cycle
- **Sauvegarde** : Automatique dans le navigateur

## ⚠️ Avertissements importants

### Utilisation médicale
- **Cette application est un outil de suivi uniquement**
- **Ne remplace pas un avis médical professionnel**
- **Pour contraception ou conception, consultez un médecin**
- **En cas d'irrégularités importantes, consultez un professionnel**

### Fiabilité des prédictions
- **Les prédictions sont basées sur vos cycles passés**
- **Plus vous avez de données, plus c'est précis**
- **Les cycles peuvent naturellement varier**
- **Facteurs externes peuvent influencer le cycle**

## 🔧 Développement

### Technologies utilisées
- **HTML5** : Structure sémantique
- **CSS3** : Design responsive et animations
- **JavaScript vanilla** : Pas de dépendances externes
- **PWA APIs** : Service Worker, Web App Manifest
- **Local Storage** : Stockage des données local

### Contribution
1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

### Fonctionnalités futures
- [ ] Synchronisation cloud optionnelle
- [ ] Export/Import des données
- [ ] Notifications push personnalisées
- [ ] Mode sombre
- [ ] Multi-langues
- [ ] Graphiques avancés
- [ ] Intégration calendrier système

## 📞 Support

Pour toute question ou problème :
- Consultez d'abord cette documentation
- Vérifiez que vous avez la dernière version
- Ouvrez une issue sur GitHub (si applicable)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour les détails.

## 🙏 Remerciements

Merci à tous ceux qui contribuent à améliorer cette application pour aider les femmes dans leur suivi menstruel.

---

**Version :** 1.0.0  
**Dernière mise à jour :** Juin 2025  
**Compatibilité :** Tous navigateurs modernes  
**PWA Ready :** ✅