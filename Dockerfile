FROM jekyll/jekyll:pages

COPY * /srv/jekyll/

WORKDIR /srv/jekyll

#RUN apk update && \
#	apk add ruby-dev gcc make curl build-base libc-dev libffi-dev zlib-dev libxml2-dev libgcrypt-dev libxslt-dev python2

#RUN bundle config build.nokogiri --use-system-libraries && \
#	bundle install

RUN bundle config set --local path 'vendor/bundle'
RUN bundle install
RUN bundle exec jekyll serve

EXPOSE 4000