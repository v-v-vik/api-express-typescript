import express from "express";
import {getCoursesRouter, getInterestingRouter} from "./routes/courses";
import {getTestsRouter} from "./routes/tests";
import {db} from "./db/db";


export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use("/__tests__", getTestsRouter(db));
app.use("/courses", getCoursesRouter(db));
app.use("/interesting", getInterestingRouter(db))
