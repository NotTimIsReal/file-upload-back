FROM node:16
SHELL ["/bin/bash", "-c"]
RUN apt -y update
RUN apt -y install python3 git curl 
RUN npm install -g yarn
RUN git clone https://github.com/NotTimIsReal/nestjs-test-trial
RUN cd nestjs-test-trial
RUN yarn install 
CMD [ "yarn", "start" ]