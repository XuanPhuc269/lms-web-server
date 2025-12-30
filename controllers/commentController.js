import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

// Thêm bình luận mới
export const addComment = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId, lectureId, text } = req.body;

        const user = await User.findById(userId);
        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({ success: false, message: 'Bạn phải đăng ký khóa học để bình luận.' });
        }

        const newComment = await Comment.create({
            lectureId,
            userId,
            text
        });

        const populatedComment = await newComment.populate('userId', 'name imageUrl');

        res.status(201).json({ success: true, comment: populatedComment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy tất cả bình luận cho một bài giảng
export const getComments = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const comments = await Comment.find({ lectureId }).populate('userId', 'name imageUrl').sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};