import express from 'express';

const router = express.Router();

router.get('/profile', async (req: any, res) => {
  const user = req.user;

  res.json({
    id: user._id,
    username: user.username,
    role: user.role,
  });
});

export default router;
