cd moretrees-client

for pid in `ps aux | grep [s]erver.js | awk '{print $2}'` ; do kill -9 $pid ; done

echo "After kill command, node processes => "
ps aux | grep '[s]erver.js'

npm run build
npm run start:prod