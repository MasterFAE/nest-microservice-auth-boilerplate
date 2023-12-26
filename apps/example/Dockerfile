FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY proto proto

RUN npm install && npx prisma generate

COPY libs libs
COPY apps/example apps/example

RUN npm run build example
CMD [ "npm", "run", "start:dev", "example" ]

FROM node:alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --omit=dev && npx prisma generate

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma

CMD ["node", "dist/apps/example/src/main"]