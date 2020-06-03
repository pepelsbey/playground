npm install live-server node-sass postcss-cli postcss-custom-properties
npx node-sass index.scss --watch index.css
npx postcss index.css --use postcss-custom-properties --no-map --watch --output post.css
