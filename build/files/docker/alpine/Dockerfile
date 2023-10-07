FROM node:18.17.1-alpine

RUN npm install --global @lvce-editor/server@0.18.1

EXPOSE 3000

CMD ["npx",  "@lvce-editor/server", "--public"]