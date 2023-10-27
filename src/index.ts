import {runDb} from "./db/db";
import {app} from "./app_settings";

const PORT = process.env.PORT || 3000;


async function startApp() {
    app.listen(PORT, async () => {
        await runDb();
        console.log(`Server is running at http://localhost:${PORT}/`);
    });
}

startApp();
