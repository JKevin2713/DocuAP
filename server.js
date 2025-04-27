process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


import app from './appExpress.js'

app.listen(3000);

console.log('Server iniciado');