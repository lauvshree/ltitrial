# Test LTI Oauth

You can test the LTI Oauth flow like launching CC Labs from Coursera or OpenEdx.

- [LTI 1.1 Specs](https://www.imsglobal.org/specs/ltiv1p1/implementation-guide)

## Get Started

### Install Node dependencies

```sh
$ yarn install # install dependencies
```

### Setup environment variable

```sh
$ cp .env.example .env # set variable as needed
```

You can also modify `const test_body` inside [`app.js`](./app.js) for testing purpose.

### Test

- `yarn start`
- Open in browser `http://localhost:3000`
- Click the buttom

### Debug LTI Consumer Payload

You may configure the LTI launch URL to `http://localhost:4000/lti` in learning platform (consumer) end, it will render the both payload body and headers in the view.

## Author

- Michael Lin <michael.lin1@ibm.com>
