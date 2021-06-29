import * as http from 'http';
import * as fs from 'fs';

import { colors } from './colors.js';
import { random } from './random.js';

const server = http.createServer();

server.listen(3000, error => {
    if (error) {
        return console.error(error);
    }
});

server.on('request', (request, response) => {
    if (request.url === '/') {
        response.setHeader('Content-Type', 'text/html');
        response.statusCode = 200;
        response.end(`<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Цветная тема вкладки</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="">
    <style>
        body {
            background-color: ${ random(colors) };
            font-family: sans-serif;
        }

        button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 0.4em 0.8em;
            border-radius: 2em;
            border: none;
            background-color: ${ random(colors) };
            color: ${ random(colors) };
            font-size: 80px;
            font-family: inherit;
        }
    </style>
</head>
<body>
    <button>Крась!</button>
    <script type="module">
        import { colors } from './colors.js';
        import { random } from './random.js';

        const button = document.querySelector('button');
        const theme = document.querySelector('meta[name=theme-color]');

        button.addEventListener('click', function() {
            theme.content = random(colors);
        });
    </script>
</body>
</html>`);
    }

    if (request.url.endsWith('.js')) {
        fs.access(request.url.slice(1), fs.constants.F_OK, () => {
            response.setHeader('Content-Type', 'text/javascript');
            response.statusCode = 200;
            fs.createReadStream(request.url.slice(1)).pipe(response);
        });
    }
});
