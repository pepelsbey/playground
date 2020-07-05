# 23. Веб-сервер на Ubuntu с нуля: nginx, HTTP/2, brotli и HTTPS

[Видео](https://youtu.be/oanbIqkS9LM)

Проверено на Ubuntu 18.04.4 LTS

## Настройка root

Подключаемся

```
ssh root@IP
```

Меняем пароль

```
passwd
```

Обновляем систему

```
apt-get update
apt-get upgrade
apt-get dist-upgrade
apt-get autoremove
```

Добавляем пользователя

```
adduser USER
```

Даём права sudo

```
adduser USER sudo
```

Открываем настройку ssh

```
nano /etc/ssh/sshd_config
```

Запрещаем логин root

```
PermitRootLogin no
```

Рестартуем ssh

```
systemctl restart sshd
```

Выходим

```
exit
```

## Настройка пользователя

Подключаемся

```
ssh USER@IP
```

Делаем папку .ssh для ключа

```
mkdir -p ~/.ssh
```

Вводим ключ

```
nano ~/.ssh/authorized_keys
cat ~/.ssh/id_rsa.pub | pbcopy
```

Выставляем права

```
sudo chmod -R 700 ~/.ssh/
```

Открываем настройку ssh

```
sudo nano /etc/ssh/sshd_config
```

Отключаем вход по паролю

```
PasswordAuthentication no
```

Рестартуем ssh

```
sudo systemctl restart sshd
```

Открываем настройку sudo

```
sudo visudo
```

Настраиваем sudo без пароля

```
%sudo   ALL=(ALL:ALL) NOPASSWD:ALL
```

## Установка сервера

Устанавливаем файрвол

```
sudo apt install ufw
```

Добавляем репозиторий

```
sudo apt-add-repository -y ppa:hda-me/nginx-stable
```

Устанавливаем сервер и модули

```
sudo apt-get install brotli nginx nginx-module-brotli
```

Чиним сервис nginx

```
sudo systemctl unmask nginx.service
```

Открываем настройки сервера

```
sudo nano /etc/nginx/nginx.conf
```

Включаем brotli

```
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
```

Настраиваем brotli

```
    # Brotli
        brotli on;
        brotli_comp_level 6;

        brotli_types
          text/xml
          image/svg+xml
          application/x-font-ttf
          image/vnd.microsoft.icon
          application/x-font-opentype
          application/json
          font/eot
          application/vnd.ms-fontobject
          application/javascript
          font/otf
          application/xml
          application/xhtml+xml
          text/javascript
          application/x-javascript
          text/$;
```

## Настройка файрвола

Проверяем статус

```
sudo ufw status
```

Проверяем список приложений

```
sudo ufw app list
```

```
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
```

Добавляем nginx в ufw, если его нет

```
sudo nano /etc/ufw/applications.d/nginx.ini
```

```
[Nginx HTTP]
title=Web Server
description=Enable NGINX HTTP traffic
ports=80/tcp

[Nginx HTTPS] \
title=Web Server (HTTPS) \
description=Enable NGINX HTTPS traffic
ports=443/tcp

[Nginx Full]
title=Web Server (HTTP,HTTPS)
description=Enable NGINX HTTP and HTTPS traffic
ports=80,443/tcp
```

Проверяем список приложений

```
sudo ufw app list
```

Включаем

```
sudo ufw enable
```

Разрешаем nginx

```
sudo ufw allow 'Nginx Full'
```

Разрешаем OpenSSH

```
sudo ufw allow 'OpenSSH'
```

Проверяем статус

```
sudo ufw status
```

```
Status: active

To                         Action      From
--                         ------      ----
Nginx Full                 ALLOW       Anywhere
OpenSSH                    ALLOW       Anywhere
Nginx Full (v6)            ALLOW       Anywhere (v6)
OpenSSH (v6)               ALLOW       Anywhere (v6)
```

## Установка certbot

Добавляем источники

```
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
```

Обновляемся

```
sudo apt-get update
```

Ставим certbot

```
sudo apt-get install python-certbot-nginx
```

Генерируем ключ

```
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

Создаём папку для снипетов nginx

```
sudo mkdir -p /etc/nginx/snippets/
```

Создаём снипет для SSL

```
sudo nano /etc/nginx/snippets/ssl-params.conf
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

## Добавление сайта

Задаём права для папки

```
sudo chown -R $USER:$USER /var/www/
```

Создаём папку сайта

```
mkdir -p /var/www/example.com/html
```

Создаём конфиг сайта

```
sudo nano /etc/nginx/sites-available/example.com.conf
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

Активируем сайт

```
sudo ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/
```

Проверяем конфиги nginx

```
sudo nginx -t
```

Рестартуем nginx

```
sudo systemctl restart nginx
```

## Добавление сертификата

Запускаем certbot

```
sudo certbot --nginx certonly
```

Обновляем конфиг сайта

```
sudo nano /etc/nginx/sites-available/example.com.conf
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

Проверяем конфиг в nginx

```
sudo nginx -t
```

Рестартуем nginx

```
sudo systemctl restart nginx
```

Проверяем сайт

```
curl example.com
```
