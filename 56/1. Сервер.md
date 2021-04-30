# Сервер

Подключает

```
ssh root@ip
```

Обновляет систему

```
apt update -y
```

Меняет пароль root

```
passwd
```

Ставит зависимости

```
apt install dpkg-dev build-essential gnupg2 git gcc cmake libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev curl unzip -y
```

Добавляет GPG ключ nginx

```
curl -L https://nginx.org/keys/nginx_signing.key | apt-key add -
```

Добавляет репозитории nginx

```
nano /etc/apt/sources.list.d/nginx.list
```

```
deb http://nginx.org/packages/ubuntu/ focal nginx
deb-src http://nginx.org/packages/ubuntu/ focal nginx
```

Обновляет репозитории

```
apt update -y
```

Скачивает исходники nginx

```
cd /usr/local/src
apt source nginx
```

Ставит зависимости для сборки

```
apt build-dep nginx -y
```

Скачивает Brotli

```
git clone --recursive https://github.com/google/ngx_brotli.git
```

Обновляет правила сборки

```
cd /usr/local/src/nginx-*/
nano debian/rules
```

Найти блоки

- `config.env.nginx`
- `config.env.nginx_debug`

Добавить новый ключ в каждом `./configure`

```
--add-module=/usr/local/src/ngx_brotli
```

Компилирует и собирает nginx

```
dpkg-buildpackage -b -uc -us
```

Проверяет deb-файлы

```
ls /usr/local/src/*.deb
```

Устанавливает nginx из deb-файлов

```
dpkg -i /usr/local/src/*.deb
```

Настраивает nginx

```
nano /etc/nginx/nginx.conf
```

```conf
user www-data;
worker_processes auto;
pid /var/run/nginx.pid;

events {
    worker_connections 768;
}

include /etc/nginx/sites-enabled/*.stream;

http {

    # Basic

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    types_hash_max_size 2048;
    server_tokens off;
    ignore_invalid_headers on;

    # Decrease default timeouts to drop slow clients

    keepalive_timeout 40s;
    send_timeout 20s;
    client_header_timeout 20s;
    client_body_timeout 20s;
    reset_timedout_connection on;

    # Hash sizes

    server_names_hash_bucket_size 64;

    # Mime types

    default_type  application/octet-stream;
    include /etc/nginx/mime.types;

    # Logs

    log_format main '$remote_addr - $remote_user [$time_local] "$request" $status $bytes_sent "$http_referer" "$http_user_agent" "$gzip_ratio"';
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Limits

    limit_req_zone  $binary_remote_addr  zone=dos_attack:20m   rate=30r/m;

    # Gzip

    gzip on;
    gzip_disable "msie6";
    gzip_vary off;
    gzip_proxied any;
    gzip_comp_level 5;
    gzip_min_length 1000;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types
        application/atom+xml
        application/javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rss+xml
        application/vnd.geo+json
        application/vnd.ms-fontobject
        application/x-font-ttf
        application/x-web-app-manifest+json
        application/xhtml+xml
        application/xml
        font/opentype
        image/bmp
        image/svg+xml
        image/x-icon
        text/cache-manifest
        text/css
        text/plain
        text/vcard
        text/vnd.rim.location.xloc
        text/vtt
        text/x-component
        text/x-cross-domain-policy;

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

    # Virtual Hosts

    include /etc/nginx/sites-enabled/*;

    # Configs

    include /etc/nginx/conf.d/*.conf;
    include /usr/share/nginx/modules/*.conf;

}
```

Проверяет конфиг nginx

```
nginx -t
```

Запускает nginx

```
systemctl start nginx
systemctl status nginx
```

Фиксит ошибку с PID

```
mkdir /etc/systemd/system/nginx.service.d
printf "[Service]\nExecStartPost=/bin/sleep 0.1\n" > /etc/systemd/system/nginx.service.d/override.conf
systemctl daemon-reload
systemctl restart nginx
```

Проверяет Brotli

```
curl -H 'Accept-Encoding: br' -I http://localhost
```

```
Content-Encoding: br
```

Устанавливает файрвол

```
apt install ufw
```

Добавляет nginx

```
nano /etc/ufw/applications.d/nginx.ini
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

Проверяет список приложений

```
ufw app list
```

Включает файрвол

```
ufw enable
```

Разрешает сервисы

```
ufw allow 'Nginx Full'
ufw allow 'OpenSSH'
```

Проверяет статус

```
ufw status
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
