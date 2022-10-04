#
# BUILD
#
FROM node:alpine3.16 as build

# Copy app files
WORKDIR /recipes
COPY srcs/ srcs/
COPY nest-cli.json nest-cli.json
COPY package-lock.json package-lock.json
COPY package.json package.json
COPY tailwind.config.js tailwind.config.js
COPY tsconfig.json tsconfig.json

# Install dependencies
RUN npm install

# Build app
RUN npm run build

#
# SERVER
#
FROM node:alpine3.16 as main

# Copy built app
WORKDIR /recipes
COPY --from=build /recipes/dist/ dist/
COPY --from=build /recipes/srcs/public/ srcs/public/
COPY --from=build /recipes/srcs/views/ srcs/views/
COPY --from=build /recipes/package-lock.json package-lock.json
COPY --from=build /recipes/package.json package.json

# Install production only dependencies
RUN npm install --only=production

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start:prod"]
