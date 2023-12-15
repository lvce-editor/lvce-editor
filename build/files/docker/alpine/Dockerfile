FROM node:18.18.2-alpine

RUN npm install --global @lvce-editor/server@0.21.1

EXPOSE 3000

CMD ["npx",  "@lvce-editor/server", "--public"]