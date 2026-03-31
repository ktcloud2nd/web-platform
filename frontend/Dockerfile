ARG APP_VARIANT=user
ARG NGINX_CONF_FILE=nginx.user.conf

FROM node:20-alpine AS build

ARG APP_VARIANT

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV VITE_APP_VARIANT=${APP_VARIANT}
RUN npm run build

FROM nginx:1.27-alpine

ARG NGINX_CONF_FILE
ARG APP_VARIANT

COPY nginx.conf /tmp/nginx/default.common.conf
COPY nginx.user.conf /tmp/nginx/nginx.user.conf
COPY nginx.operator.conf /tmp/nginx/nginx.operator.conf
RUN cp /tmp/nginx/${NGINX_CONF_FILE} /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

ENV APP_VARIANT=${APP_VARIANT}

EXPOSE 80
