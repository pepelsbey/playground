# Пользователь

Добавляет пользователя

```
adduser user
```

Даёт права sudo

```
adduser user sudo
```

Открывает настройку ssh

```
nano /etc/ssh/sshd_config
```

```
PermitRootLogin no
```

Рестартует ssh

```
systemctl restart sshd
```

Выходит

```
exit
```

Подключается от user

```
ssh user@ip
```

Создаёт папку для ключей

```
mkdir ~/.ssh
```

Локально: копирует публичный ключ

```
cat ~/.ssh/id_rsa.pub
```

Сервер: вставляет ключ

```
nano ~/.ssh/authorized_keys
```

Выставляет папке права

```
chmod -R 700 ~/.ssh/
```

Открывает настройку ssh

```
sudo nano /etc/ssh/sshd_config
```

Отключает вход по паролю

```
PasswordAuthentication no
```

Рестартует ssh

```
sudo systemctl restart sshd
```

Открывает настройку sudo

```
sudo visudo
```

Настраивает sudo без пароля

```
%sudo   ALL=(ALL:ALL) NOPASSWD:ALL
```

Забирает права на папку для сайтов

```
sudo chown -R $USER:$USER /var/www/
```
