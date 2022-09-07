import { BasicController } from './basic.controller.js';
let req;
let resp;
let next = jest.fn();
let mockItem = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};
let newController = new BasicController(mockItem);
describe('Given a instantiated controller BasicController', () => {
    beforeEach(() => {
        req = {
            params: { id: '1' },
        };
        resp = {
            setHeader: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
    });
    describe('When method getAllController is called', () => {
        test('Then res.send should be called', async () => {
            const mockResult = [{ test: 'test' }];
            mockItem.find.mockResolvedValue(mockResult);
            await newController.getAllController(req, resp);
            expect(resp.send).toHaveBeenCalled();
        });
    });
    describe('When method getController is called', () => {
        test('Then res.end should be called', async () => {
            const mockResult = [{ test: 'test' }];
            mockItem.findById.mockResolvedValue(mockResult);
            await newController.getController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
    });
    describe('When method getController is called with a null', () => {
        test('Then res.status toHaveBeenCalledWith 404 ', async () => {
            const mockResult = null;
            mockItem.findById.mockResolvedValue(mockResult);
            await newController.getController(req, resp, next);
            expect(resp.status).toHaveBeenCalledWith(404);
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify({}));
        });
    });
    describe('When method postController is called', () => {
        test('Then res.end should be called', async () => {
            const mockResult = [{ test: 'test' }];
            mockItem.create.mockResolvedValue(mockResult);
            await newController.postController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
    });
    describe('When method postController is called with a null', () => {
        test('Then next should be called', async () => {
            const mockResult = null;
            mockItem.create.mockRejectedValue(mockResult);
            await newController.postController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method patchController is called', () => {
        test('Then res.send should be called', async () => {
            const mockResult = [{ test: 'test' }];
            mockItem.findByIdAndUpdate.mockResolvedValue(mockResult);
            await newController.patchController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
    });
    describe('When method patchController is called with a null', () => {
        test('Then next should be called', async () => {
            const mockResult = null;
            mockItem.findByIdAndUpdate.mockRejectedValue(mockResult);
            await newController.patchController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method deleteController is called', () => {
        test('Then res.send is called', async () => {
            const mockResult = true;
            mockItem.findByIdAndDelete.mockResolvedValue(mockResult);
            await newController.deleteController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
    });
    describe('When method deleteController is called', () => {
        test('Then res.send is called', async () => {
            const mockResult = null;
            mockItem.findByIdAndDelete.mockResolvedValue(mockResult);
            await newController.deleteController(req, resp, next);
            expect(resp.send).toHaveBeenCalled();
        });
    });
    describe('When method deleteController is called with a null', () => {
        test('Then next should be called', async () => {
            const mockResult = null;
            mockItem.findByIdAndDelete.mockRejectedValue(mockResult);
            await newController.deleteController(req, resp, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
