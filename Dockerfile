# build stage
FROM node:16.18.0-alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:prd

# production stage
FROM nginx:1.23.2-alpine as production-stage
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/build .
CMD ["nginx", "-g", "daemon off;"]
