# Serverless rules engine example

A simple Rules Engine fact checking demo showing 
how a rules engine can be used to automate the auditing 
of design pattern policies within content management systems.

This example is for a simply Navbox.

## Deploy
Deploy to serverless function

`serverless deploy --aws-profile ##`

Run locally

- Open `server.js`
- Uncomment from line `89` to `91`
- Run `node app.js` or `nodemon app.js`

## Example requests

`https://endpoint/dev/rules/navbox/title`

```
// Fails
{
  "charcount": 30
}

// Passes
{
  "charcount": 15
}
```

`https://endpoint/dev/rules/navbox/thumbnail`
```
// Fails
{
  "width": 900,
  "height": 800,
}

// Passes
{
  "width": 300,
  "height": 200,
}
```

`https://endpoint/dev/rules/navbox/title`

```
// Fails
{
  "charcount": 700
}

// Passes
{
  "charcount": 350
}
```

