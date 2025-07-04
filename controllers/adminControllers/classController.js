// const Class = require('../../models/adminModel/Class');
// const mongoose = require("mongoose");

// exports.getAllClasses = async (req, res) => {
//   try {
//     console.log('Headers:', req.headers);
//     const list = await Class.find()
//       .populate('createdBy','name email')
//       .sort({ createdAt: -1 });
//     res.json(list);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error.' });
//   }
// };

// exports.getClassById = async (req, res) => {
//   const { id } = req.params;
//   if (!mongoose.isValidObjectId(id)) {
//     return res.status(400).json({ error: 'Invalid class ID.' });
//   }
//   try {
//     const cls = await Class.findById(id)
//       .populate('createdBy','name email');
//     if (!cls) return res.status(404).json({ error: 'Class not found.' });
//     res.json(cls);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error.' });
//   }
// };

// exports.createClass = async (req, res) => {
//   const { name, section } = req.body;

  
//   if (!name || typeof name !== 'string' || !name.trim()) {
//     return res.status(400).json({ error: "'name' is required and must be a non-empty string." });
//   }
//   if (!section || typeof section !== 'string' || !section.trim()) {
//     return res.status(400).json({ error: "'section' is required and must be a non-empty string." });
//   }


//   const createdBy = req.user?._id;
//   if (!createdBy || !mongoose.isValidObjectId(createdBy)) {
//     return res.status(401).json({ error: "Unauthorized: missing or invalid user." });
//   }

//   try {
    
//     const newClass = await Class.create({
//       name: name.trim(),
//       section: section.trim(),
//       createdBy,
//     });

    
//     const populated = await Class.findById(newClass._id)
//       .populate('createdBy', 'name email');

    
//     res.status(201).json(populated);

//   } catch (err) {
//     console.error("Error creating class:", err);
//     res.status(500).json({ error: "Server error while creating class." });
//   }
// };

const Class = require('../../models/adminModel/Class');
const mongoose = require('mongoose');

// GET all classes
exports.getAllClasses = async (req, res) => {
  try {
    const list = await Class.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET class by ID
exports.getClassById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid class ID.' });
  }
  try {
    const cls = await Class.findById(id);
    if (!cls) return res.status(404).json({ error: 'Class not found.' });
    res.json(cls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// CREATE a new class (only 'name' field)
exports.createClass = async (req, res) => {
  const { name } = req.body;

  // Validate name
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: "'name' is required and must be a non-empty string." });
  }

  try {
    // Create and return the new class
    const newClass = await Class.create({ name: name.trim() });
    res.status(201).json(newClass);
  } catch (err) {
    console.error('Error creating class:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Class name already exists.' });
    }
    res.status(500).json({ error: 'Server error while creating class.' });
  }
};
