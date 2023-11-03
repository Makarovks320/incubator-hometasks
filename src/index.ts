import {runDb, runMongooseClient} from "./db/db";
import {app} from "./app_settings";

const PORT = process.env.PORT || 3000;


async function startApp() {
    await runDb();
    await runMongooseClient();
    app.listen(PORT, async () => {
        console.log(`Server is running at http://localhost:${PORT}/`);
    });
}

startApp();
