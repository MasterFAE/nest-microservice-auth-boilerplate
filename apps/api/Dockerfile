FROM node:alpine AS development
WORKDIR /usr/src/app

COPY package*.json ./

COPY tsconfig.json tsconfig.json 
COPY nest-cli.json nest-cli.json
EXPOSE 3000

RUN npm install

COPY apps/api apps/api
COPY libs libs
COPY proto proto

RUN npm run build api
CMD [ "npm", "run", "start:dev", "api" ]

FROM node:alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
EXPOSE 3000

RUN npm i --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/api/src/main"]