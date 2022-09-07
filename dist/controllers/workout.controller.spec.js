import { WorkoutController } from './workout.controller';
describe('Given a instantiated controller WorkoutController', () => {
    let req;
    let resp;
    let next;
    let mockModel;
    let controller;
    beforeEach(() => {
        mockModel = {
            find: jest.fn().mockReturnValue({ populate: jest.fn() }),
            findById: jest.fn().mockReturnValue({ populate: jest.fn() }),
            create: jest.fn(),
            findOne: jest.fn().mockResolvedValue({
                populate: jest.fn(),
                comments: [
                    {
                        text: 'Comment test',
                        user: '62c31e157e6d3bb95caded9a',
                        _id: '62c5659c245f7c999e3b5a3c',
                    },
                ],
                save: jest.fn(),
            }),
        };
        controller = new WorkoutController(mockModel);
        req = {
            params: { id: '62b9e534a202c8a096e0d7ba' },
            body: {
                user: '62bb10cb54f3a58a2faa20c5',
                text: 'Comentario de prueba',
                score: 9,
                idComment: '62c47bf57596507010f450ad',
            },
            tokenPayload: {
                id: '62b9e534a202c8a096e0d7ba',
            },
        };
        resp = {
            setHeader: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
    });
    describe('When method getAllController is called', () => {
        test('Then res.send should be called', async () => {
            await controller.getAllController(req, resp);
            expect(resp.send).toHaveBeenCalled();
        });
    });
    describe('When method getController is called', () => {
        test('Then res.send should be called', async () => {
            await controller.getController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then resp.send should be called without data', async () => {
            const result = null;
            mockModel.findById = jest.fn().mockResolvedValueOnce(result);
            await controller.getController(req, resp, next);
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify({}));
            expect(resp.status).toHaveBeenCalledWith(404);
        });
        test('And response is not ok, then next should be called', async () => {
            const result = null;
            mockModel.findById = jest.fn().mockRejectedValueOnce(result);
            await controller.getController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method addCommentController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            mockModel.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue({
                    comments: [
                        {
                            text: 'Comment test',
                            user: '62c31e157e6d3bb95caded9a',
                            _id: '62c5659c245f7c999e3b5a3c',
                        },
                    ],
                    save: jest.fn(),
                }),
            });
            await controller.addCommentController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is ok, then next should be called when not found a workout', async () => {
            req = {
                params: { id: '62b9e534a202c8a096e0d7ba' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
                body: {
                    user: '62bb10cb54f3a58a2faa20c5',
                    text: 'Comentario de prueba',
                    score: 9,
                    idComment: '62c47bf57596507010f450ad',
                },
            };
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockResolvedValueOnce(null),
            });
            await controller.addCommentController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method deleteCommentController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            req = {
                params: { id: '62b9e534a202c8a096e0d7ba' },
                body: { commentId: '62c5659c245f7c999e3b5a3c' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            mockModel.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue({
                    comments: [
                        {
                            text: 'Comment test',
                            user: '62c31e157e6d3bb95caded9a',
                            _id: '62c5659c245f7c999e3b5a3c',
                        },
                    ],
                    save: jest.fn(),
                }),
            });
            await controller.deleteCommentController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is ok, then resp.send should be called', async () => {
            req = {
                params: { id: '62b9e534a202c8a096e0d7ba' },
                body: { commentId: '62c5659c247c999e3b5a3c' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            mockModel.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue({
                    comments: [
                        {
                            text: 'Comment test',
                            user: '62c31e157e6d3bb95caded9a',
                            _id: '62c5659c245f7c999e3b5a3c',
                        },
                    ],
                    save: jest.fn(),
                }),
            });
            await controller.deleteCommentController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is ok, then next should be called when not found a workout', async () => {
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockResolvedValueOnce(null),
            });
            await controller.deleteCommentController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
