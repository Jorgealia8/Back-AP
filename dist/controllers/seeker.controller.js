import { Workout } from '../models/workout.model.js';
export class SeekerController {
    getSeekerTitle = async (req, resp) => {
        const seeker = await Workout.find({
            title: { $regex: req.query.q, $options: 'i' },
        });
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(seeker));
    };
}
