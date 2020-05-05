const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateSchema = Schema({
    templateName: String,
    version: String,
    status: Boolean,
    createdAt: Date,
});
module.exports = mongoose.model("template", templateSchema)
