var express = require('express');
var router = express.Router();
var fs = require('fs');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var requestCounter = 0;

var visualRecognition = new VisualRecognitionV3({
    url: 'https://gateway.watsonplatform.net/visual-recognition/api',
    version: '2018-09-28',
    iam_apikey: 'jt_m1gA7Poj0lAbQUDEOZBTGfqa_Z1csSwkhr688Ylhb'
});

/* GET home page. */
router.post('/', function (req, res, next) {
    requestCounter++;
    if(requestCounter % 100 === 0) {
        console.log('calling watson after : ' + requestCounter);
        requestCounter = 0;
        callWatson(req, res);
    } else {
        res.send({"response": "normal"})
    }
    /**/
});

function callWatson(req, res) {
    var base64Decoded = req.body.imgBase64.replace('data:image/png;base64','');
    var buf = Buffer.from(base64Decoded, 'base64'); // Ta-da
    fs.writeFile('frame.png', buf, 'binary', function(err){
        if (err) throw err
        console.log('File saved.')
        var images_file = fs.createReadStream('frame.png');
        var owners = ["me"];
        var threshold = 0.92;

        var params = {
            images_file: images_file,
            owners: owners,
            threshold: threshold
        };

        visualRecognition.classify(params, function (err, response) {
            if (err)
                console.log(err);
            else{
                // console.log(JSON.stringify(response, null, 2))
                res.send(response);
            }
        });
    });
}
module.exports = router;
