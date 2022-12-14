import { Workout } from '../models/workout.model';
import { SeekerController } from './seeker.controller';
describe('Given a instantiated controller SeekerController', () => {
    let req;
    let resp;
    let controller = new SeekerController();
    describe('When method getSeekerTitle is called', () => {
        test('Then res.send should be called', async () => {
            req = {
                params: { id: '14512dsf1432acv134' },
                query: { q: 'pierna' },
            };
            resp = {
                setHeader: jest.fn(),
                send: jest.fn(),
                status: jest.fn(),
            };
            Workout.find = jest.fn().mockResolvedValueOnce(req.query);
            await controller.getSeekerTitle(req, resp);
            expect(resp.send).toHaveBeenCalled();
        });
    });
});
