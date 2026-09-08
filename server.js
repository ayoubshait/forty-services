// Point d'entrée : démarre le serveur HTTP
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Forty Services en ligne : http://localhost:${PORT}`);
});
