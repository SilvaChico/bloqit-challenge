import { Router } from 'express';
import {
    getBloqs,
    createBloq,
    updateBloq,
    deleteBloq,
    getBloq,
    getBloqLockers
} from './controllers/bloqs';
import {
    getLockers,
    createLocker,
    updateLocker,
    deleteLocker,
    getLocker,
    getLockersRents
} from "./controllers/lockers";
import {
    getRents,
    createRent,
    updateRent,
    deleteRent,
    getRent,
    getRentLocker
} from './controllers/rents';

const router = Router();

router.get('/bloqs', getBloqs);
router.post('/bloqs', createBloq);
router.put('/bloqs/:id', updateBloq);
router.delete('/bloqs/:id', deleteBloq);
router.get('/bloqs/:id', getBloq);
router.get('/bloqs/:id/lockers', getBloqLockers);

router.get('/lockers', getLockers);
router.post('/lockers', createLocker);
router.put('/lockers/:id', updateLocker);
router.delete('/lockers/:id', deleteLocker);
router.get('/lockers/:id', getLocker);
router.get('/lockers/:id/rents', getLockersRents);

router.get('/rents', getRents);
router.post('/rents', createRent);
router.put('/rents/:id', updateRent);
router.delete('/rents/:id', deleteRent);
router.get('/rents/:id', getRent);
router.get('/rents/:id/locker', getRentLocker);

router

export default router;