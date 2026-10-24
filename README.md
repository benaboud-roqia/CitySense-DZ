# CitySense DZ — Plateforme Intelligente de Gestion Urbaine & Mobilité

**CitySense DZ** est un système d'exploitation urbain d'aide à la décision conçu spécifiquement pour les collectivités locales algériennes (Communes / APC, Directions des Travaux Publics - DTP, et Wilayas). 

Il associe la **Vision par Ordinateur**, la **Cartographie interactive SIG**, l'**Intelligence Artificielle générative (Gemini 3.8 Flash)** et la **Data Science** pour analyser les flux de circulation en temps réel, détecter automatiquement les embouteillages et anomalies de voirie, et optimiser les infrastructures publiques.

---

## 🎯 Fonctionnalités Principales

### 1. Supervision Cartographique Interactive (SIG / GIS)
- **Cartographie dynamique du réseau routier** pour 5 grandes Wilayas algériennes :
  - **Wilaya 16 (Alger)** : Rocade Sud, Boulevard Colonel Amirouche, Autoroute A1, Chéraga.
  - **Wilaya 04 (Oum El Bouaghi)** : Route Nationale 10 (RN10), Boulevard de l'Université Larbi Ben M'hidi, Aïn Beïda, Aïn M'lila.
  - **Wilaya 31 (Oran)** : 3ème Périphérique, Front de Mer, Bir El Djir.
  - **Wilaya 25 (Constantine)** : Viaduc Transrhumel Salah Bey, Ville nouvelle Ali Mendjeli.
  - **Wilaya 19 (Sétif)** : Boulevard 8 Mai 1945, Aïn Fouara, Rocade Est.
- **Indicateurs en temps réel** : classification colorimétrique par niveau d'engorgement (*Fluide*, *Dense*, *Saturé*, *Bloqué*), vitesse moyenne, débit horaire et taux d'occupation.
- **Couches commutables** : flux de trafic, caméras CCTV, alertes d'incidents, signalisation connectée.

### 2. Vision par Ordinateur & Surveillance IA (Computer Vision)
- **Matrice CCTV multi-caméras** : flux haute définition avec incrustation télémétrique en temps réel (code caméra, résolution 1080p, 30 FPS, localisation).
- **Détection automatique d'objets (YOLO / Vision IA)** :
  - Boîtes englobantes (*Bounding Boxes*) catégorisant les véhicules légers, bus collectifs (ETUSA / privés), camions, deux-roues et taxis.
  - Calcul de la densité de trafic et estimation de vitesse par flux optique.
  - Détection précoce d'anomalies : décélération brutale, stationnement illicite sur bande d'urgence, obstacle ou carrefour bloqué.
- **Diagnostic IA Multimodal (Gemini 3.8 Flash)** :
  - Analyse d'images en temps réel avec classification d'impact.
  - Recommandations d'intervention immédiate transmises aux services communaux.
  - Module d'importation d'images/captures pour tester n'importe quel flux routier en direct.

### 3. Gestion des Incidents & Déclenchement d'Urgence
- **File de traitement des alertes routières** : filtrage par sévérité (*Critique*, *Majeur*, *Modéré*) et état opérationnel (*Détecté*, *Équipe dépêchée*, *Sécurisation*, *Résolu*).
- **Interfaçage opérationnel direct** :
  - Déclenchement d'intervention **Protection Civile (14)**.
  - Notification régulation **Sûreté Urbaine / DGSN (1548)**.
  - Mobilisation des brigades de voirie et de maintenance signalisation de l'APC.
- **Signalement participatif** : formulaire pour déclarer en un clic un accident, un nid-de-poule ou une panne de feu tricolore.

### 4. Aide à la Décision Municipale & Infrastructures (APC & DTP)
- **Régulation « Onde Verte » Adaptative** :
  - Calcul et ajustement automatisé des cycles de feux tricolores (60s à 140s) selon les heures de pointe (matin, soir, scolaire/midi, nuit).
  - Synchronisation de corridors complets pour traversée sans arrêt à 45 km/h.
- **Plans de Déviation Dynamique & PMV Bilingues** :
  - Scénarios d'itinéraires alternatifs pour délester les autoroutes et rocades.
  - Panneaux à Messages Variables (PMV) affichant des consignes en **arabe et français**.
- **Audit Prédictif de Voirie & Chiffrage DTP** :
  - Inventaire des nids-de-poule et dégradations de chaussée avec indice PCI (Pavement Condition Index).
  - Estimation budgétaire chiffrée en **Dinars Algériens (DZD)**.
- **Générateur de Notes Stratégiques pour le P/APC** :
  - Rédaction automatisée par IA de rapports de synthèse pour le Maire ou le Wali avec prévisions d'impact (gain de temps, % de congestion évitée, tonnes de CO2 réduites).

### 5. Data Science & Modélisation Prédictive
- **Courbes journalières sur 24 heures** : débit, congestion et vitesses moyennes.
- **Répartition modale des déplacements** (voitures 61%, transports en commun 21%, utilitaires 12%, deux-roues 6%).
- **Modèle prédictif à 6 heures** (prévision des congestions de pointe avant qu'elles ne se forment).
- **Exportation des données au format CSV** pour les services d'études techniques et de planification urbaine.

---

## 🛠️ Stack Technique

- **Frontend** : React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Cartographie & SIG** : Leaflet avec fond de carte sombre CartoDB / OpenStreetMap et styles personnalisés.
- **Backend** : Node.js, Express, `tsx`.
- **Intelligence Artificielle & Vision** : SDK officiel `@google/genai` (modèle `gemini-3.8-flash`) avec résilience automatique face aux surcharges réseau.
- **Polices & Typographie** : Plus Jakarta Sans (titres et navigation), JetBrains Mono (télémétrie et chiffres tabulaires).

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (version 20 ou supérieure recommandée)
- npm

### Installation
```bash
# Installation des dépendances
npm install
```

### Configuration des Clés d'API
Le projet utilise la variable d'environnement `GEMINI_API_KEY` pour les fonctionnalités d'analyse multimodale et de prise de décision municipale. Dans Google AI Studio, la clé est automatiquement injectée via le panneau **Settings > Secrets**.

Pour une exécution locale :
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Renseigner votre clé dans .env :
# GEMINI_API_KEY="AIzaSy..."
```

### Lancement du Serveur de Développement
```bash
npm run dev
```
L'application démarre sur : [http://localhost:3000](http://localhost:3000)

### Compilation pour la Production
```bash
npm run build
npm start
```

---

## 📡 Endpoints de l'API Backend

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/traffic/analyze-frame` | Analyse d'image/CCTV par Vision par Ordinateur avec détection d'objets, comptage, classification d'anomalies et recommandations |
| `POST` | `/api/municipal/strategy` | Moteur stratégique d'aide à la décision municipale (Onde Verte, déviations, audits de voirie) |
| `GET` | `/api/health` | Vérification de l'état du serveur et de la disponibilité du moteur IA |

---
<img width="1916" height="899" alt="image" src="https://github.com/user-attachments/assets/c3008938-e50a-40b8-92a7-ede0cbfdfb16" />

## 🏛️ Contexte Territorial

Développé pour répondre aux enjeux de mobilité urbaine en Algérie, en prenant en compte :
- La congestion des grandes rocades et carrefours giratoires.
- Les axes universitaires et de transit inter-wilayas.
- La coordination inter-services entre les APC (Communes), la DTP (Travaux Publics), la Sûreté Nationale (DGSN) et la Protection Civile.
