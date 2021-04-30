# Сайт

Создаёт папку для сайта

```
mkdir -p /var/www/example.com/html
```

Добавляет индексный файл

```
nano /var/www/example.com/html/index.html
```

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Например</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>Например</h1>
</body>
</html>
```

Создаёт папки для конфига

```
mkdir -p /etc/nginx/sites-available/
mkdir -p /etc/nginx/sites-enabled/
```

Правит конфиг

```
nano /etc/nginx/sites-available/example.com.conf
```

```
server {
    listen 80;
    listen [::]:80;

    server_name example.com www.example.com;
    root /var/www/example.com/html;
    index index.html index.xml;
}
```

Включает конфиг

```
ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/
```

Проверяет конфиг

```
nginx -t
```

Рестартует nginx

```
systemctl restart nginx
```

Проверяет домен

```
curl example.com
```
