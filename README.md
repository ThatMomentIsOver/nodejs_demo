# Nodejs Demo

## Required
MySQL 5.5
Nodejs v4.2.6+
Express v4.14.1+

## Build

### Docker Build

#### Supported Platforms
Linux Kernel 3.10+
Windows 10+

#### Build
```
// build nodejs 
docker build -t node_demo .

// build mysql
docker pull mysql:5.5
```

## Usage

### On Docker
```
docker run -p 3000:3000 -d node_demo
docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -d -p 3306:3306 mysql:5.5
```
import mysql data:
```
mysql -uroot -ppassword < ./conf/importsql.sql
```

### On NPM 

```
npm start
```

## Windows PortProxy 
Google Oauth2 只允许通过 顶级域名或是 localhost 来访问 callback URL, 如果通过 Docker 地址 (172.0.xx.xx) 或者虚拟机地址(192.168.xx.xx) 使用 Google 登录, 将会被拒绝。所以需要进行端口映射。
在 Windows 下可以通过以下命令映射:

```
netsh interface portproxy add v4tov4 listenaddress="127.0.0.1" listenport=3000 connectaddress="192.168.116.184" connectport=3000
```
