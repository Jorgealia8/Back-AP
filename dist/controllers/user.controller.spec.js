import { UserController } from './user.controller.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
describe('Given a instantiated controller UserController', () => {
    let req;
    let resp;
    let next;
    let mockPopulate = jest.fn();
    let mockModel = {
        find: jest.fn().mockReturnValue({
            populate: mockPopulate.mockReturnValue({
                populate: mockPopulate,
            }),
        }),
        findById: jest.fn().mockReturnValue({ populate: mockPopulate }),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findOne: jest.fn().mockReturnValue({
            populate: jest.fn(),
            id: '62b9e534a202c8a096e0d7ba',
            workouts: [
                {
                    _id: '62c3fa970a6339f727766546',
                },
            ],
            done: [{}],
            save: jest.fn(),
        }),
    };
    let controller = new UserController(mockModel);
    beforeEach(() => {
        req = {
            params: { id: '62b5d4943bc55ff0124f6c1d' },
            body: {
                _id: '62c3fa970a6339f727766546',
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
    describe('When method loginController is called with a valid user', () => {
        test('Then resp.send should be called ', async () => {
            const mockResult = {
                populate: jest.fn().mockResolvedValue({ id: 'test' }),
            };
            const mockedToken = 'test';
            mockModel.findOne.mockReturnValueOnce(mockResult);
            bcryptjs.compare.mockResolvedValue(true);
            jwt.sign.mockResolvedValue(mockedToken);
            req = { body: { name: 'test' } };
            await controller.loginController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
        test('Then next should be called ', async () => {
            const mockedToken = 'test';
            bcryptjs.compare.mockRejectedValueOnce(undefined);
            jwt.sign.mockResolvedValue(mockedToken);
            req = { body: { name: 'test' } };
            await controller.loginController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method getController is called', () => {
        test('Then with a ok response resp.send should be called with data', async () => {
            const mockResult = { test: 'test' };
            mockPopulate.mockResolvedValue(mockResult);
            await controller.getController(req, resp, next);
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify(mockResult));
        });
        test('And response is not ok, then resp.send should be called without data', async () => {
            const mockResult = null;
            mockPopulate.mockResolvedValueOnce(mockResult);
            await controller.getController(req, resp, next);
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify({}));
            expect(resp.status).toHaveBeenCalledWith(404);
        });
        test('And response is not ok, then next should be called', async () => {
            const mockResult = null;
            mockPopulate.mockRejectedValueOnce(mockResult);
            await controller.getController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method getControllerByToken is called', () => {
        test('Then should be call rest.status with 404', async () => {
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(undefined),
                }),
            });
            await controller.getControllerByToken(req, resp, next);
            expect(resp.status).toHaveBeenCalledWith(404);
        });
        test('Then resp.send should be called', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                workouts: [],
                save: jest.fn().mockReturnValue({
                    populate: jest.fn(),
                }),
            };
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.getControllerByToken(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
        test('Then resp.next should be called', async () => {
            await controller.getControllerByToken(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method registerController is called', () => {
        test('Then if not error resp.send should be called with data', async () => {
            const mockResult = { test: 'test' };
            req = { body: { pwd: 'test-2022' } };
            mockModel.create.mockResolvedValueOnce(mockResult);
            await controller.registerController(req, resp, next);
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify(mockResult));
        });
        test('Then if error next  should be called ', async () => {
            req = { body: { pwd: 'test-2022' } };
            mockModel.create.mockRejectedValueOnce(undefined);
            await controller.registerController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method addWorkoutController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                workouts: [],
                save: jest.fn().mockReturnValue({
                    populate: jest.fn(),
                }),
            };
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.addWorkoutController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then next should be called with RangeError', async () => {
            mockModel.findById.mockResolvedValueOnce(null);
            await controller.addWorkoutController(req, resp, next);
            expect(next).toHaveBeenCalledWith('RangeError');
        });
        test('Next it should be called, when User is not found ', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = null;
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.addWorkoutController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
        test('Next it should be called, when the workout already added to favorites ', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1d',
                workouts: [{ _id: '62b5d4943bc55ff0124f6c1d' }],
                save: jest.fn(),
            };
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.addWorkoutController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method deleteWorkoutController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                workouts: [{ _id: '62b5d4943bc55ff0124f6c1d' }],
                save: jest.fn().mockReturnValue({
                    populate: jest.fn(),
                }),
            };
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.deleteWorkoutController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then next should be called', async () => {
            const mockResult = null;
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.deleteWorkoutController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method addDoneController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                done: [],
                save: jest.fn().mockReturnValue({
                    populate: jest.fn(),
                }),
            };
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.addDoneController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then next should be called with RangeError', async () => {
            req = {};
            await controller.addDoneController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
        test('Next it should be called, when User is not found ', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = null;
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.addDoneController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
        test('Next it should be called, when the workout already added to favorites ', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                done: [{ _id: '62b5d4943bc55ff0124f6c1d' }],
                save: jest.fn(),
            };
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.addDoneController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method deleteDoneController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                done: [{ _id: '62b5d4943bc55ff0124f6c1d' }],
                save: jest.fn().mockReturnValue({
                    populate: jest.fn(),
                }),
            };
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.deleteDoneController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then next should be called', async () => {
            const mockResult = null;
            mockModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.deleteDoneController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
