#!/bin/bash

# Check if a parameter is provided
if [ -z "$1" ]; then
  echo "Usage: ./convert.sh <filename>"
  exit 1
fi

filename="$1"
length=${#filename}
pdf="${filename::length-4}.pdf"

npx decktape $filename $pdf
