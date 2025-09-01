#!/bin/bash
# Build the TypeScript code first
npm run build

# Create an instrumented version of the code for coverage
npx nyc instrument dist/ .nyc_output/dist/

# Run the tests with coverage
NODE_ENV=test npx nyc --reporter=text --reporter=lcov npm test

# Display the coverage report
npx nyc report