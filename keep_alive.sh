#!/bin/bash

# URL do Render (padrão)
URL=${1:-"https://mood-mixer.onrender.com/api/health"}

echo "🚀 Iniciando monitoramento de Health Check para: $URL"
echo "⏱️  Intervalo: 10 minutos"

while true; do
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    echo "[$TIMESTAMP] Pingando $URL..."
    
    # Faz a requisição e mostra apenas o código HTTP e a resposta
    # O timeout (-m 10) evita que o script trave se o servidor demorar muito
    RESPONSE=$(curl -s -m 10 -w "\nStatus: %{http_code}" "$URL")
    
    echo "Resposta: $RESPONSE"
    echo "----------------------------------------"
    
    # Espera 10 minutos (600 segundos)
    sleep 600
done
