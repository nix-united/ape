#!/bin/bash

# Create a symbolic link for reveal.js
ln -sf "$(pwd)/node_modules/reveal.js" ./javascripts/reveal.js

# Copy reveal.js-menu plugin
rm -rf ./javascripts/reveal.js/plugin/menu
cp -r "$(pwd)/node_modules/reveal.js-menu" ./javascripts/reveal.js/plugin/menu

# Copy reveal.js-copycode plugin
rm -rf ./javascripts/reveal.js/plugin/copycode
cp -r "$(pwd)/node_modules/reveal.js-copycode/plugin/copycode" ./javascripts/reveal.js/plugin/copycode

# Copy reveal.js-mermaid-plugin
rm -rf ./javascripts/reveal.js/plugin/mermaid
cp -r "$(pwd)/node_modules/reveal.js-mermaid-plugin/plugin/mermaid" ./javascripts/reveal.js/plugin/mermaid
