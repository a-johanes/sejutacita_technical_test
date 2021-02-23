FROM node:14.15.5

WORKDIR /app 

COPY package.json package.json 

RUN npm install 

COPY . . 

EXPOSE 3000 

RUN npm install -g nodemon 

CMD [ "npm", "start" ] 