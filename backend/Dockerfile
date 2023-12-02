FROM node:20.9.0

ENV APP_HOME /app

WORKDIR $APP_HOME

COPY . ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
