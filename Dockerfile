FROM node:19 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:1.23-alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
