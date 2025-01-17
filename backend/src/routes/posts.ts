import { Router } from 'express';
import { createPost, getPosts, updatePost, deletePost } from '../controllers/postController';
import { auth } from '../middleware/auth';
import { upload } from '../config/multer';

const router = Router();

router.get('/', getPosts);
router.post('/', auth, upload.single('media'), createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

export default router; 