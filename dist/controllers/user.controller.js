import { BasicController } from './basic.controller.js';
import * as aut from '../services/authorization.js';
export class UserController extends BasicController {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
    getAllController = async (req, resp) => {
        req;
        resp.setHeader('Content-type', 'application/json');
        resp.send(await this.model.find().populate('workouts').populate('done'));
    };
    getController = async (req, resp, next) => {
        resp.setHeader('Content-type', 'application/json');
        let result;
        try {
            result = await this.model
                .findById(req.params.id)
                .populate('workouts');
        }
        catch (error) {
            next(error);
            return;
        }
        if (result) {
            resp.send(JSON.stringify(result));
        }
        else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };
    getControllerByToken = async (req, resp, next) => {
        resp.setHeader('Content-type', 'application/json');
        let user;
        req;
        try {
            user = await this.model
                .findById(req.tokenPayload.id)
                .populate('workouts')
                .populate('done');
        }
        catch (error) {
            next(error);
            return;
        }
        if (user) {
            resp.send(JSON.stringify(user));
        }
        else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };
    loginController = async (req, resp, next) => {
        const findUser = await this.model
            .findOne({
            email: req.body.email,
        })
            .populate('workouts');
        if (!findUser ||
            !(await aut.compare(req.body.passwd, findUser.passwd))) {
            const error = new Error('Invalid user or password');
            error.name = 'UserAuthorizationError';
            next(error);
            return;
        }
        const tokenPayLoad = {
            id: findUser.id,
            name: findUser.name,
        };
        const token = aut.createToken(tokenPayLoad);
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify({ token, user: findUser }));
    };
    registerController = async (req, resp, next) => {
        let newItem;
        try {
            req.body.passwd = await aut.encrypt(req.body.passwd);
            newItem = await this.model.create(req.body);
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(newItem));
        }
        catch (error) {
            next(RangeError);
        }
    };
    addWorkoutController = async (req, resp, next) => {
        try {
            const idWorkout = req.params.id;
            const { id } = req.tokenPayload;
            let findUser = (await this.model
                .findById(id)
                .populate('workouts')
                .populate('done'));
            if (findUser === null) {
                next('UserError');
                return;
            }
            if (findUser.workouts.some((item) => item._id.toString() === idWorkout)) {
                const error = new Error('Workout already added to favorites');
                error.name = 'ValidationError';
                next(error);
                return;
            }
            else {
                findUser.workouts.push(idWorkout);
                findUser = await (await findUser.save()).populate('workouts');
                resp.setHeader('Content-type', 'application/json');
                resp.status(201);
                resp.send(JSON.stringify(findUser));
            }
        }
        catch (error) {
            next('RangeError');
        }
    };
    deleteWorkoutController = async (req, resp, next) => {
        const idWorkout = req.params.id;
        const { id } = req.tokenPayload;
        const findUser = (await this.model
            .findById(id)
            .populate('workouts')
            .populate('done'));
        if (findUser === null) {
            next('UserError');
            return;
        }
        findUser.workouts = findUser.workouts.filter((item) => item._id.toString() !== idWorkout);
        findUser.save();
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(findUser));
    };
    addDoneController = async (req, resp, next) => {
        try {
            const idWorkout = req.params.id;
            const { id } = req.tokenPayload;
            let findUser = (await this.model
                .findById(id)
                .populate('done')
                .populate('workouts'));
            if (findUser === null) {
                next('UserError');
                return;
            }
            if (findUser.done.some((item) => item._id.toString() === idWorkout)) {
                resp.send(JSON.stringify(findUser));
                const error = new Error('Workout already done');
                error.name = 'ValidationError';
                next(error);
            }
            else {
                findUser.done.push(idWorkout);
                findUser = await (await findUser.save()).populate('done');
                resp.setHeader('Content-type', 'application/json');
                resp.status(201);
                resp.send(JSON.stringify(findUser));
            }
        }
        catch (error) {
            next('RangeError');
        }
    };
    deleteDoneController = async (req, resp, next) => {
        const idWorkout = req.params.id;
        const { id } = req.tokenPayload;
        const findUser = (await this.model
            .findById(id)
            .populate('done')
            .populate('workouts'));
        if (findUser === null) {
            next('UserError');
            return;
        }
        findUser.done = findUser.done.filter((item) => item.toString() !== idWorkout);
        findUser.save();
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(findUser));
    };
}
