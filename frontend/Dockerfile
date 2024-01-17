FROM node:18.19.0-alpine3.18
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
CMD ["yarn", "dev"]
EXPOSE 3000