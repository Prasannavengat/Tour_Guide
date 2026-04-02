FROM node:20-alpine

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/src ./src
COPY app ../app
COPY admin ../admin

EXPOSE 4000

CMD ["npm", "start"]
