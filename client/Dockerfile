# build environment
FROM node:16.13.0-alpine as build

WORKDIR /usr/src/app

# ENV PATH /usr/src/app/node_modules/.bin:$PATH

# COPY package.json ./

# COPY package-lock.json ./

# RUN npm ci --silent
# RUN npm install react-scripts@4.0.3 -g --silent

COPY . ./

ARG REACT_APP_SERVER_BASE_URL
ARG REACT_APP_TITLE
ARG REACT_APP_COOKIE_SUSTAINING_HOURS
ARG REACT_APP_SUBJECT_MAX_SIZE
ENV REACT_APP_SERVER_BASE_URL=$REACT_APP_SERVER_BASE_URL
ENV REACT_APP_TITLE=$REACT_APP_TITLE
ENV REACT_APP_COOKIE_SUSTAINING_HOURS=$REACT_APP_COOKIE_SUSTAINING_HOURS
ENV REACT_APP_SUBJECT_MAX_SIZE=$REACT_APP_SUBJECT_MAX_SIZE

# RUN npm run build

RUN yarn
RUN yarn build

# production environment
FROM nginx:stable-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY --from=build /usr/src/app/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]