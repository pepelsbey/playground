npm install postcss-cli postcss-import postcss-media-minmax postcss-csso
npx postcss styles/index.css --use postcss-import --use postcss-media-minmax --use postcss-csso --no-map --output styles/index.min.css
