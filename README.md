# Tech Starter Kit

Static website project with gulp.
It is running in a docker-container.


1. build docker-image

`docker-compose build`

2. run docker container

`docker-compose up`

## Deployment

It is possible to deploy the `/dist`-folder per ftp to an server.

1. add ftp data to config.json (ftp_config part)

```
  "ftp_config": {
    "username": "ftp-username",
    "password": "xxx-123-xxx",
    "host": "ftp.somewhereintheinternet.com",
    "port": 21,
    "localRoot": "dist",
    "remoteRoot": "/websites/tech-starter-kit/"
  }
```
