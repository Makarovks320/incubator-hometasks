import express, {Request, Response} from 'express';
import {runDb} from "./Repositories/db";
import {postsRouter} from "./Routers/postsRouter";

const PORT = process.env.PORT || 3000;
export const app = express();

const jsonParser = express.json();
app.use(jsonParser);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/posts', postsRouter);

async function startApp() {
    app.listen(PORT, async () => {
        await runDb();
        console.log(`Server is running at http://localhost:${PORT}/`);
    });
}
startApp();
