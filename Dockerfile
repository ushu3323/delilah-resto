FROM alpine

RUN apk add --update nodejs npm

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# nodejs port
EXPOSE 5000:5000

CMD ["/bin/sh", "./start_server.sh"]