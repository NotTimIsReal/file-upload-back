FROM node:16
SHELL ["/bin/bash", "-c"]
RUN apt -y update
RUN apt -y install python3 git curl 
RUN git clone https://github.com/NotTimIsReal/file-upload-back 
RUN cd nestjs-test-trial && yarn install
WORKDIR /file-upload-back
RUN yarn build
CMD ["yarn", "start:prod" ]