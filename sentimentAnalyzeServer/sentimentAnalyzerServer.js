const express = require('express');
const app = new express();

app.use(express.static('client'))

const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');
    const nlu = new NaturalLanguageUnderstandingV1({
        authenticator: new IamAuthenticator({ apikey: process.env.API_KEY }),
        version: '2021-03-25',
        serviceUrl: process.env.API_URL
    });
    return nlu;
}

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req, res) => {
    const nlu = getNLUInstance();
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
                'emotion': true,
                'limit': 1,
            },
            'keywords': {
                'emotion': true,
                'limit': 1,
            },
        },
        "language": "en"
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(Object.entries(analysisResults.result.keywords[0].emotion));
        })
        .catch(err => {
            console.log('Error U/E:', err);
        });
});

app.get("/url/sentiment", (req, res) => {
    const nlu = getNLUInstance();
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
                'sentiment': true,
                'limit': 1,
            },
            'keywords': {
                'sentiment': true,
                'limit': 50,
            },
        },
        "language": "en"
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.keywords[0].sentiment.label);
        })
        .catch(err => {
            console.log('Error U/S:', err);
        });
});

app.get("/text/emotion", (req, res) => {    
    const nlu = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': {
                'emotion': true,
            },
            keywords: {
                'emotion': true
                , limit: 1
            }
        },
        "language": "en"
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(Object.entries(analysisResults.result.keywords[0].emotion));
        })
        .catch(err => {
            console.log('Error T/E:', err);
        });
});

app.get("/text/sentiment", (req, res) => {
    const nlu = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': {
                'sentiment': true,
            },
            'keywords': {
                'sentiment': true,
                'limit': 1
            }
        },
        "language": "en"
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.keywords[0].sentiment.label);
        })
        .catch(err => {
            console.log('Error T/S:', err);
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

