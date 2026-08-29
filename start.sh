#!/bin/bash
echo "🚀 Démarrage Jloodna | Global Trading..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  Fichier .env créé depuis .env.example — configurez vos valeurs!"
fi
if [ ! -d node_modules ]; then
  echo "📦 Installation des dépendances..."
  npm install
fi
echo "✅ Serveur lancé sur http://localhost:3000"
npm run dev
