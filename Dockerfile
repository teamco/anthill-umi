FROM node:14.8.0 As anthill_layout

#Add new user, set proxy
#RUN mkdir /anthill && export http_proxy=${HTTP_PROXY} && export https_proxy=${HTTPS_PROXY} && export no_proxy=${NO_PROXY}
RUN mkdir /teamco
WORKDIR /teamco
COPY ./package*.json ./

#Install node packages. Can be moved to other docker image to reduce size
RUN npm i

#COPY --chown=${UID}:${GID} . .
COPY . .

RUN npm run build

FROM httpd:2.4

ENV WEB_SERVER_PORT=8070
ARG USER=teamco
ARG UID=1001
ARG GID=1001
ARG PW=docker

COPY ./web_server/httpd/httpd.conf /usr/local/apache2/conf/httpd.conf

RUN addgroup --gid $GID $USER \
    && chmod 777 /usr/local/apache2/logs \
    && adduser \
    --disabled-password \
    --gecos "" \
    ##--home "$(pwd)" \
    --ingroup $USER \
    --no-create-home \
    --uid $UID \
    "$USER"
     #&& export http_proxy=${HTTP_PROXY} && export https_proxy=${HTTPS_PROXY} && export no_proxy=${NO_PROXY}

WORKDIR /home/${USER}
#Copy application built in 'anthill_layout' image
#COPY --chown=${UID}:${GID} --from=anthill_layout /home/teamco/build/ /usr/local/apache2/htdocs/
COPY --from=anthill_layout /teamco/dist/ /usr/local/apache2/htdocs/
RUN chown -R ${UID}:${GID} /usr/local/apache2/htdocs/
USER ${UID}:${GID}
ENTRYPOINT httpd-foreground -c "Listen $WEB_SERVER_PORT"
