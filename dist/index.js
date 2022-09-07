/* istanbul ignore file */
import http from 'http';
import { app } from './app.js';
const PORT = process.env.PORT || 3500;
const onError = (err) => {
    console.log(err.message);
};
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : addr?.address === '::'
            ? `http://localhost:${addr.port}`
            : addr.address + addr.port;
    console.log(`Listening on ${bind}`);
};
app.set('port', PORT);
export const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(PORT);
console.log('Escuchando en el puerto ' + PORT);
