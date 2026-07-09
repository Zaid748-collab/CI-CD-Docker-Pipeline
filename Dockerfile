FROM nginx:1.27-alpine

COPY index.html styles.css script.js /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
