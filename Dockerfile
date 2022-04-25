FROM alpine
# Install nodejs and clean package manager cache
RUN apk add --no-cache nodejs npm && rm -rf /var/cache/apk

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# nodejs port
EXPOSE 5000:5000

CMD ["/bin/sh", "./start_server.sh"]