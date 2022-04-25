FROM alpine
# Install nodejs and clean package manager cache
RUN apk add --no-cache nodejs npm && rm -rf /var/cache/apk

WORKDIR /app

# copy npm files
COPY package*.json ./

# Install dependencies without modifing package-lock.json
RUN npm ci

# copy source code
COPY . .

# nodejs port
EXPOSE 5000:5000

CMD ["/bin/sh", "./start_server.sh"]