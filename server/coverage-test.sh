#!/bin/bash

# Build the TypeScript code first
npm run build

# Run tests with coverage on the compiled JavaScript
npx jest --coverage