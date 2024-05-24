import express from 'express';
import Task from './taskModel';

const router = express.Router(); // eslint-disable-line

// Get all tasks
router.get('/', async (req, res) => {
    const tasks = await Task.find().populate('userId', 'username');
    res.status(200).json(tasks);
});

// Create a task
router.post('/', async (req, res) => {
    const { title, description, deadline, priority, done, userId } = req.body;

    // Validate priority
    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({ status: 400, message: 'Invalid priority value' });
    }

    try {
        const task = new Task({
            title,
            description,
            deadline,
            priority,
            done,
            userId,
            created_at: new Date(),
            updated_at: new Date()
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ status: 500, message: 'Server error', error: err.message });
    }
}
);

// Update Task
router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    
    req.body.updated_at = new Date();

    const result = await Task.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'Task Updated Sucessfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to find Task' });
    }
}
);

// delete Task
router.delete('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await Task.deleteOne({
        _id: req.params.id,
    });
    if (result.deletedCount) {
        res.status(204).json();
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to find Task' });
    }
}
);

export default router;
