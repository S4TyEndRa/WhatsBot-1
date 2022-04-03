#FROM buildkite/puppeteer:latest

#RUN apt update
#RUN apt install ffmpeg -y

#WORKDIR /app
#COPY . /app
#RUN npm install
#RUN npm install xhr2
CMD ["npm", "start"]
EXPOSE 8080
