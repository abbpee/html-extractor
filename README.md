# html-extractor
Извлекает html spa-сайтов на nodejs с помощью headless браузера

# Установка
1. установка nodejs и браузера хром и либ
```
sudo apt-get install nodejs npm chromium-browser libx11-xcb1 libxcomposite1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6
```
2. установка приложения
```
git clone https://github.com/abbpee/html-extractor.git && \
cd html-extractor && sudo npm install
```

# Использование
1. запустить или остановить сервер
```
pm2 start index.js // старт сервера
pm2 stop index.js // остановить
```
2. для автозапуска при рестарте сервере:
```
pm2 startup
```

# Примеры запроса

## Успешный ответ

**REQUEST**
```http
GET /get-html?url=https://google.com HTTP/1.1
HOST: 127.0.0.1:3000
```

**RESPONSE**
```http
HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8
<html>
<head>
   <title>Google</title>
</head>
<body>
   <h1>Google</h1>
</body>
</html>
```

## Не передан урл

**REQUEST**
```http
GET /get-html?url= HTTP/1.1
HOST: 127.0.0.1:3000
```

**RESPONSE**
```http
HTTP/1.1 404 Not Found
Content-Type: text/plain;charset=UTF-8
URL NOT FOUND
```

## Ошибка запроса или ошибка приложения

**REQUEST**
```http
GET /get-html?url=helloworld HTTP/1.1
HOST: 127.0.0.1:3000
```

**RESPONSE**
```http
HTTP/1.1 500 Internal Server Error
Content-Type: text/plain;charset=UTF-8
ProtocolError: Protocol error (Page.navigate): Cannot navigate to invalid URL
```

Так же ошибки выбрасываются в консоль 