import express from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';
import { Engine } from 'json-rules-engine';
import { readFile, existsSync } from 'fs';

let engine =
    new Engine();
const app =
    express();

app.use(
    bodyParser.json()
);

app.post('/rules/:pattern/:field', function(req, res) {
    const { pattern, field } =
        req.params;
    const { body } =
        req;
    const facts =
        './' + pattern + '/' + field + '.json';
    const payload = {
        pattern,
        field,
        body
    };

    if(!existsSync(facts)) {
        res.send({
            'status' : 500,
            'pass' : false,
            'message' : `${pattern} + ${field} has no rule set.`,
            payload
        });

        return;
    }

    readFile(facts,
        (err, data) => {
            if (err) res.send(err);

            engine.addRule(
                JSON.parse(data)
            );

            engine
                .run(body)
                .then(results =>
                {
                    // Passes
                    if(results.events.length<1) {
                        res.send({
                            'status' : 200,
                            'pass' : true,
                            payload
                        });
                    }

                    // Fails
                    results.events.map(
                        event =>
                            res.send({
                                'status' : 200,
                                'pass' : false,
                                'message' : event.params.message,
                                payload
                            })
                    );
                }
            ).catch(err => {
                if(err) res.send({
                    'status' : 500,
                    'pass' : false,
                    'message' : err.code,
                    payload
                });
            });
        });

    return false;
});

/*app.listen(3001, () =>
    console.log('Rules engine listening on port 3001!')
);*/

module.exports.handler = serverless(app);