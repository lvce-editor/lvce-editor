FROM node:22.16.0-alpine

RUN npm install --global @lvce-editor/server@0.24.1

EXPOSE 3000

CMD ["npx",  "@lvce-editor/server", "--public"]