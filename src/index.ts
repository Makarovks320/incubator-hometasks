import express, {Request, Response} from 'express';

const PORT = process.env.PORT || 3000;
export const app = express();

const jsonParser = express.json();
app.use(jsonParser);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
