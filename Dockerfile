FROM alpine

RUN apk add --update nodejs npm

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# nodejs port
EXPOSE 5000:5000

# mysql port
EXPOSE 3306:3306

CMD [ "npm", "run", "dev" ]