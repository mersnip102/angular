FROM node:16-alpine3.16

WORKDIR /app

COPY . .

RUN npm install --force

EXPOSE 4200

CMD ["npm", "start"]