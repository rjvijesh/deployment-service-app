const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deploymentSchema = Schema({
    url: String,
    templateName: String,
    version: String,
    deployedAt: Date,
    status: Boolean,
});
module.exports = mongoose.model("deployment", deploymentSchema)
