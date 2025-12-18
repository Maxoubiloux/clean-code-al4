# Leitner System – Application Front & Back

Application web de révision basée sur le **système de Leitner**.  
Le projet est composé d’un **backend Node.js / Express** et d’un **frontend React / Vite**.

Le front et le back respectent **strictement le contrat OpenAPI (Swagger)** fourni avec l’énoncé afin d’assurer la compatibilité avec les services de l’examinateur.

---

## Prérequis

- Node.js **>= 18**
- npm (ou yarn / pnpm)

---

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Démarrage de l’application

### Lancer le backend (port 8080)

```bash
cd backend
npm run dev
```

Le backend est accessible à l’adresse :  
http://localhost:8080

### Lancer le frontend (Vite – port 5173)

```bash
cd frontend
npm run dev
```

Le frontend est accessible à l’adresse :  
http://localhost:5173

Le frontend communique par défaut avec l’API backend sur :  
http://localhost:8080

---

## Configuration (optionnelle)

Il est possible de configurer l’URL de l’API backend via une variable d’environnement.

Créer un fichier `frontend/.env` :

```env
VITE_API_URL=http://localhost:8080
```

---

## Tests et couverture de code

Des tests sont développés **pour le backend et pour le frontend**, conformément aux exigences de l’énoncé.

### Backend – tests et couverture

```bash
cd backend
npm test
npm run coverage
```

Les rapports de couverture sont générés dans :

```
backend/coverage/
```

### Frontend – tests et couverture

```bash
cd frontend
npm test
npm run coverage
```

Les rapports de couverture sont générés dans :

```
frontend/coverage/
```

---

## Structure du projet

### Backend

```
backend/
└─ src/
   ├─ domain/           # Logique métier (Leitner, catégories)
   ├─ application/      # Cas d’usage
   ├─ ports/            # Interfaces (ports)
   └─ infrastructure/   # Adapters (HTTP, repository in-memory, clock)
```

### Frontend

```
frontend/
└─ src/
   ├─ api/              # Appels HTTP vers l’API
   ├─ components/       # Composants React
   └─ pages/            # Pages principales (cards, quiz)
```

---

## API – Swagger

Le contrat API est défini dans le fichier Swagger fourni avec l’énoncé et **ne doit pas être modifié**.

Endpoints principaux :

- `GET /cards`
- `POST /cards`
- `GET /cards/quizz`
- `PATCH /cards/{cardId}/answer`

Toute la logique métier (règles Leitner, fréquences, 1 quiz par jour, etc.) est implémentée côté backend **sans modifier le contrat API**.

---

## Remarques

- Le stockage des données est réalisé via un **repository in-memory**
- L’architecture suit les principes **DDD**, **SOLID** et **Architecture Hexagonale**
- La gestion des utilisateurs et des notifications est prévue au niveau de l’architecture, mais non implémentée fonctionnellement, conformément à l’énoncé