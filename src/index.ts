import express, {Request, Response} from "express"
import {TypedRequestBody, TypedRequestParams, TypedRequestParamsBody, TypedRequestQuery} from "./types";
import {QueryCourseModel} from "./models/QueryCourseModel";
import {CreateCourseModel} from "./models/CreateCourseModel";
import {PathParamsCourseIdModel} from "./models/PathParamsCourseIdModel";
import {CourseViewModel} from "./models/CourseViewModel";
import {UpdateCourseModel} from "./models/UpdateCourseModel";
export const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

type CourseType = {
    id: number,
    title: string,
    studentsCount: number
}

const db: { courses: CourseType[]} = {
    courses: [
        {id: 1, title: "front-end", studentsCount: 10},
        {id:2, title: "back-end", studentsCount: 10},
        {id:3, title: "devops", studentsCount: 10}
    ]
}

const getCourseViewModel = (dbCourse: CourseType) => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

app.get("/courses", (req: TypedRequestQuery<QueryCourseModel>,
                     res: Response<CourseViewModel[]>) => {
    let foundCourses = db.courses;

    if (req.query.title) {
        foundCourses = foundCourses
            .filter(c => c.title.indexOf(req.query.title) > -1)
    }
    res.json(foundCourses.map(getCourseViewModel) );


});

app.get("/courses/:id", (req: TypedRequestParams<PathParamsCourseIdModel>,
                         res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }
    res.json(getCourseViewModel(foundCourse));
});

app.post("/courses", (req: TypedRequestBody<CreateCourseModel>,
                      res: Response<CourseViewModel>) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }
    const createdCourse: CourseType = {
        id: db.courses.length + 1,
        title: req.body.title,
        studentsCount: 0
    }
    db.courses.push(createdCourse);
    res
        .status(201)
        .json(getCourseViewModel(createdCourse))
});

app.delete("/courses/:id", (req: TypedRequestParams<PathParamsCourseIdModel>,
                            res: Response) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id);
    res.sendStatus(204);
});

app.put("/courses/:id", (req: TypedRequestParamsBody<PathParamsCourseIdModel, UpdateCourseModel>,
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
