#!/bin/bash

CONTAINER_NAME="chatroom-frontend-container"

# 檢查容器是否存在
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "容器已存在，正在刪除..."
    docker rm -f $CONTAINER_NAME
fi

# 啟動容器
docker run -d -p 8081:80 --name $CONTAINER_NAME chatroom-frontend
