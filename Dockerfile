FROM node:14
RUN npm ci
COPY /src /src/
CMD ["npm start"]
EXPOSE 80