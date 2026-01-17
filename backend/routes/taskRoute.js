const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/taskControler');

// 🔐 protect all routes
router.use(auth);

router.post('/', ctrl.createTask);
router.get('/', ctrl.getTasks);

// 🔥 IMPORTANT for EditTask page
router.get('/:id', ctrl.getTaskById);

router.put('/:id', ctrl.updateTask);
router.delete('/:id', ctrl.deleteTask);

module.exports = router;
