# 使用官方 Node 鏡像作為基礎
FROM node:14-alpine AS build

# 設定工作目錄
WORKDIR /app

# 複製 package.json
COPY package.json ./

# 安裝依賴
RUN npm install

# 複製源代碼
COPY . .

# 建立應用
RUN npm run build

# 使用 nginx 來服務應用
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]
