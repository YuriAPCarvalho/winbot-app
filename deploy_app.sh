pm2 stop redis-homolog-app

pm2 delete redis-homolog-app

git pull origin staging

npm install

npm run build

pm2 start server.js --name redis-homolog-app

pm2 save