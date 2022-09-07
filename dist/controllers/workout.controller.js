import { BasicController } from './basic.controller.js';
export class WorkoutController extends BasicController {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
    getAllController = async (req, resp) => {
        req;
        resp.setHeader('Content-type', 'application/json');
        resp.send(await this.model.find().populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
                select: { email: 0, workouts: 0, done: 0, rol: 0 },
            },
        }));
    };
    getController = async (req, resp, next) => {
        resp.setHeader('Content-type', 'application/json');
        let result;
        try {
            result = await this.model.findById(req.params.id);
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
    addCommentController = async (req, resp, next) => {
        const idWorkout = req.params.id;
        const { id } = req.tokenPayload;
        const { text, score } = req.body;
        const findWorkout = (await this.model
            .findById(idWorkout)
            .populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
                select: {
                    email: 0,
                    workouts: 0,
                    done: 0,
                    rol: 0,
                },
            },
        }));
        if (findWorkout === null) {
            next('UserError');
            return;
        }
        findWorkout.comments.push({ text, user: id, score: score });
        findWorkout.save();
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(findWorkout));
    };
    deleteCommentController = async (req, resp, next) => {
        const idWorkout = req.params.id;
        const idComment = req.body.commentId;
        const { id } = req.tokenPayload;
        const findWorkout = (await this.model
            .findById(idWorkout)
            .populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
                select: {
                    email: 0,
                    workouts: 0,
                    done: 0,
                    rol: 0,
                },
            },
        }));
        if (findWorkout === null) {
            next('UserError');
            return;
        }
        else {
            findWorkout.comments = findWorkout.comments.filter((item) => {
                return item._id?.toString() !== idComment && id !== item.user;
            });
            findWorkout.save();
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(findWorkout));
        }
    };
}
