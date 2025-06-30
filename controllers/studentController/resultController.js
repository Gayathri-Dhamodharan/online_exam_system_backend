
const Result = require("../../models/studentModel/result");

exports.getAllResults = async (req, res) => {
  try {
  
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: admins only' });
    }

    const results = await Result
      .find()
      .populate('studentId', 'firstName lastName role')   
      .populate('examId',   'subject totalMark passMark'); 

    return res.json(results);
  } catch (err) {
    console.error('getAllResults error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getResultById = async (req, res) => {
  try {
    const resultId = req.params.id;

    const result = await Result
      .findById(resultId)
      .populate('studentId', 'firstName lastName role')
      .populate('examId',   'subject totalMark passMark');

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    if (req.user.role === 'student' &&
        result.studentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: 'Forbidden: not your result' });
    }

    return res.json(result);
  } catch (err) {
    console.error('getResultById error:', err);


    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid result ID' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
