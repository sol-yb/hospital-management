FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
RUN mkdir -p uploads
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "src/index.js"]
