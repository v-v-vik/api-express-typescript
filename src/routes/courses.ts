import {TypedRequestBody, TypedRequestParams, TypedRequestParamsBody, TypedRequestQuery} from "../types";
import {QueryCourseModel} from "../models/QueryCourseModel";
import express, {Express, Response} from "express";
import {CourseViewModel} from "../models/CourseViewModel";
import {PathParamsCourseIdModel} from "../models/PathParamsCourseIdModel";
import {CreateCourseModel} from "../models/CreateCourseModel";
import {UpdateCourseModel} from "../models/UpdateCourseModel";
import {CourseType, DBType} from "../db/db";



export const getCourseViewModel = (dbCourse: CourseType) => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}



export const getCoursesRouter = (db: DBType) => {

    const router = express.Router()

    router.get("/", (req: TypedRequestQuery<QueryCourseModel>,
                            res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses;

        if (req.query.title) {
            foundCourses = foundCourses
                .filter(c => c.title.indexOf(req.query.title) > -1)
        }
        res.json(foundCourses.map(getCourseViewModel) );


    });

    router.get("/:id", (req: TypedRequestParams<PathParamsCourseIdModel>,
                                res: Response<CourseViewModel>) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id);
        if (!foundCourse) {
            res.sendStatus(404);
            return;
        }
        res.json(getCourseViewModel(foundCourse));
    });

    router.post("/", (req: TypedRequestBody<CreateCourseModel>,
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

    router.delete("/:id", (req: TypedRequestParams<PathParamsCourseIdModel>,
                                   res: Response) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id);
        res.sendStatus(204);
    });

    router.put("/:id", (req: TypedRequestParamsBody<PathParamsCourseIdModel, UpdateCourseModel>,
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
    return router
}


export const getInterestingRouter = (db: DBType) => {

    const router = express.Router()

    router.get("/:id(\\d*)", (req: TypedRequestParams<PathParamsCourseIdModel>,
                        res) => {

        res.json({title: "data by id:" + req.params.id});
    });



    router.get("/books", (req: TypedRequestQuery<QueryCourseModel>,
                     res) => {

        res.json({
            title: "books handler"
        } );


    });



    return router
}