FROM node:18-alpine

ENV HOME=/home/node
# auth port
EXPOSE 9099
# storage port
EXPOSE 9199
# ui port
EXPOSE 4000

RUN apk --no-cache add openjdk11-jre bash && \
    yarn global add firebase-tools@${VERSION} && \
    yarn cache clean && \
    firebase setup:emulators:database && \
    # firebase setup:emulators:firestore && \
    firebase setup:emulators:storage && \
    chown -R node:node $HOME tmp

USER node

COPY ./infrastructures/firebase/firebase.json ./infrastructures/firebase/.firebaserc ./infrastructures/firebase/emulator/export.sh ./infrastructures/firebase/storage.rules $HOME

WORKDIR $HOME

CMD ["sh"]
