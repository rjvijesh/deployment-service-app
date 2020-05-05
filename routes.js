const mongoose = require('mongoose');
const { mongourl } = require('./config/keys');

//require model file
const Deployment = require('./models/deployment');
const Template = require('./models/template');

//mongo connection
mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = (app) => {
    //setting cors policy 
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
        res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.post('/addTemplate', (req, res) => {
        var output = {};
        const TemplateDetails = new Template({
            templateName: req.body.templateName,
            version: req.body.version,
            status: 1,
            createdAt: new Date(),
        })
        TemplateDetails.save()
            .then(data => {
                output = { status: 1, msg: "Template details added successfully!", data: data };
                res.send(output);
            })
            .catch(err => {
                //throw err;
                output = { status: -1, msg: "Template details addition failed, Try Again!", err: err };
                res.send(output);
            });
    });

    app.get('/getDeployments', (req, res) => {
        var output = {};
        Deployment.find({ status: true })
            .then(data => {
                if (data !== '') {
                    Template.find({})
                        .then(templateData => {
                            output = { deploymentdetails: data, templateDetails: templateData };
                            res.send(output);
                        });
                }
            });
    });

    app.post('/addDeployment', (req, res) => {
        var output = {};
        if (req.body.templateName === '') {
            output = { status: 2, msg: "Template name not found!" };
            res.send(output);
            return;
        }
        if (req.body.version === '') {
            output = { status: 2, msg: "Version name not found!" };
            res.send(output);
            return;
        }
        if (req.body.url === '') {
            output = { status: 2, msg: "Url not found!" };
            res.send(output);
            return;
        }
        const DeploymentDetails = new Deployment({
            url: req.body.url,
            templateName: req.body.templateName,
            version: req.body.version,
            deployedAt: new Date(),
            status: 1
        })
        DeploymentDetails.save()
            .then(data => {
                output = { status: 1, msg: "Deployment details added successfully!", data: data };
                res.send(output);
            })
            .catch(err => {
                //throw err;
                output = { status: -1, msg: "Deployment details addition failed, Try Again!", err: err };
                res.send(output);
            });

    });

    app.get('/deleteDeployment/:deploymentid', (req, res) => {
        var output = {};
        if (req.params.deploymentid !== '') {
            Deployment.updateOne({ _id: req.params.deploymentid }, {
                $set: {
                    "status": 0
                }
            }, function (err, results) {
                if (err) {
                    output = { status: 2, msg: "Deployment details delete failed, Try again!" };
                    res.send(output);
                    return;
                } else {
                    output = { status: 1, msg: "Deployment details deleted successfully!" };
                    res.send(output);
                }
            })
        } else {
            output = { status: 3, msg: "No deployment id found!" };
            return res.send(output);
        }
    });
}

