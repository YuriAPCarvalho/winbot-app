
# Parar o container
docker stop hml-winbot-app

# Remover o container
docker rm hml-winbot-app

# Remover a imagem
docker rmi hml-winbot-app

# Atualizar o repositÃ³rio
git pull

# Construir a nova imagem
docker build -t image/hml-winbot-app .

# Executar o novo container
docker run -d --env-file .env -p 3001:3001 -e PORT=3001 --name hml-winbot-app image/hml-winbot-app