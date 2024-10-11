import express, {Request, Response} from "express"
export const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

type CourseType = {
    id: number,
    title: string
}

const db: { courses: CourseType[]} = {
    courses: [
        {id: 1, title: "front-end"},
        {id:2, title: "back-end"},
        {id:3, title: "devops"}
    ]
}

app.get("/courses", (req: Request<{}, {}, {}, {title: string}>,
                     res: Response<CourseType[]>) => {
    let foundCourses = db.courses;

    if (req.query.title) {
        foundCourses = foundCourses
            .filter(c => c.title.indexOf(req.query.title) > -1)
    }
    res.json(foundCourses);


});

app.get("/courses/:id", (req: Request<{id: string}>,
                         res: Response<CourseType>) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }
    res.json(foundCourse);
});

app.post("/courses", (req: Request<{},{}, { title: string }>,
                      res: Response<CourseType>) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }
    const createdCourse = {
        id: db.courses.length + 1,
        title: req.body.title
    }
    db.courses.push(createdCourse);
    res
        .status(201)
        .json(createdCourse)
});

app.delete("/courses/:id", (req: Request<{ id: string}>,
                            res: Response) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id);
    res.sendStatus(204);
});

app.put("/courses/:id", (req: Request<{ id: string }, {}, {title: string}>,
                          res: Response) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }

    const foundCourse = db.courses.find(c => c.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }
    foundCourse.title = req.body.title;
    res.sendStatus(204);

});




// app.delete("/__test__/data", (req: Request, res: Response) => {
//     db.courses = [];
//     res.sendStatus(204);
//
// })

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
