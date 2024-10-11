import express, {Request, Response} from "express"
export const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = {
    courses: [
        {id: 1, title: "front-end"},
        {id:2, title: "back-end"},
        {id:3, title: "devops"}
    ]
}

app.get("/courses", (req: Request, res: Response) => {
    let foundCourses = db.courses;

    if (req.query.title) {
        foundCourses = foundCourses
            .filter(c => c.title.indexOf(req.query.title as string) > -1)
    }
    res.json(foundCourses);


});

app.get("/courses/:id", (req: Request, res: Response) => {
    const foundCourses = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourses) {
        res.sendStatus(404);
        return;
    }
    res.json(foundCourses);
});

// app.delete("/__test__/data", (req: Request, res: Response) => {
//     db.courses = [];
//     res.sendStatus(204);
//
// })

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
