import app from "./app.js";
import config from "./config/index.js";
import { initDb } from "./database/index.js";


const main = async () => {
  await initDb();

  app.listen(config.PORT, () => {
    console.log(`Server listening on port -> ${config.PORT}`);
  });
}

await main();