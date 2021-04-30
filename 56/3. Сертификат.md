# Сертификат

Генерирует ключ

```
openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

Создаёт папку для снипетов

```
mkdir -p /etc/nginx/snippets/
```

Создаёт снипет для SSL

```
nano /etc/nginx/snippets/ssl-params.conf
```

```
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;

ssl_dhparam /etc/ssl/certs/dhparam.pem;

ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;

add_header Strict-Transport-Security "max-age=63072000" always;
```

Обновляет snapd

```
snap install core
```

Устанавливает certbot

```
snap install --classic certbot
```

Проверка certbot

```
ln -s /snap/bin/certbot /usr/bin/certbot
```

Выпускает сертификат

```
certbot certonly --nginx
```

Меняет конфиг сайта

```
nano /etc/nginx/sites-available/example.com.conf
```

```
server {
    listen 80;
    listen [::]:80;

    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name www.example.com;
    return 301 https://example.com$request_uri;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;

    include snippets/ssl-params.conf;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name example.com;
    root /var/www/example.com/html;
    index index.html index.xml;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;

    include snippets/ssl-params.conf;
}
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

- `curl http://example.com` — редирект
- `curl https://example.com` — сайт
