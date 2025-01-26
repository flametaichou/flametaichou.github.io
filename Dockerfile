FROM ruby:3.3-alpine

RUN apk update && apk add --no-cache make build-base

WORKDIR /src/site
COPY Gemfile .
RUN bundle install

EXPOSE 4000 80
CMD jekyll serve -d /_site --watch --force_polling --drafts -H 0.0.0.0 -P 4000