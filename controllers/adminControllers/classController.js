// const Class = require("../../models/adminModel/Class");

// // exports.create = async (req, res) => {
// //   try {
// //     const cls = await Class.create(req.body);
// //     res.status(201).json(cls);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // };

// exports.create = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ error: "Only admin can create subjects" });
//     }
//     const cls = await Class.create({
//       ...req.body,
//       subject: req.body.subject,
//       createdBy: req.user._id,
//     });
//     res.status(201).json(cls);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // exports.getAll = async (req, res) => {
// //   try {
// //     const list = await Class.find();
// //     res.json(list);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// exports.getAll = async (req, res) => {
//   try {
//      let filter = {};
//      if (req.user.role === "admin") {
//        filter = { createdBy: req.user._id };
//      }
//     const list = await Class.find(filter);
//     res.json(list);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getById = async (req, res) => {
//   try {
//     const cls = await Class.findById(req.params.id);
//     if (!cls) return res.status(404).json({ error: "Not found" });
//     res.json(cls);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.update = async (req, res) => {
//   try {
//     const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!cls) return res.status(404).json({ error: "Not found" });
//     res.json(cls);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// exports.delete = async (req, res) => {
//   try {
//     await Class.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
