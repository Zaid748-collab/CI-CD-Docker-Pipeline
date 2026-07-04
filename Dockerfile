FROM ubuntu
RUN apt-get update && \
    apt-get install -y apache2 && \
    rm -rf /var/lib/apt/lists/*

COPY index.html /var/www/html/index.html
COPY style.css /var/www/html/style.css

EXPOSE 80

CMD ["apache2ctl", "-D", "FOREGROUND"]