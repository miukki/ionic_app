# ionic_app
Tech: AngularJS v1.3.13 + Ionic + Cordova

- ionic CLI : npm install -g ionic, then ionic --help
- npm install
- bower install
- run server: ionic serve
- gulp watch
- for release: gulp release


#hint: Proxy apache server for resolve CORS issue, cookie issue:
# dev.local for ionic
<VirtualHost *:80>

    DocumentRoot /Users/miukki/Sites/dev.local
    ServerName dev.local

    ErrorLog "/private/var/log/apache2/dev.local-error_log"
    CustomLog "/private/var/log/apache2/dev.local-access_log" common

    ProxyPass /axis/mob http://localhost:8100

    ProxyPass / http://lolita.englishtown.com/
    ProxyPassReverse / http://lolita.englishtown.com/
    ProxyPassReverseCookieDomain lolita.englishtown.com dev.local

</VirtualHost>