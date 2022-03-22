const express = require('express');
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const faker = require('faker');
const bodyParser = require('body-parser');
require('dotenv').config();

const {
  LTI_CLIENT_KEY,
  LTI_CLIENT_SECRET,
  LTI_LAUNCH_URL,
  PORT,
} = process.env;

const oauth = OAuth({
  consumer: { key: LTI_CLIENT_KEY, secret: LTI_CLIENT_SECRET},
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
});

const app = express();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  const test_body = {
    "tool_consumer_info_product_family_code": "ims",
    "resource_link_title": "Graded External Tool",
    "context_title": "Cognitive Class ITL Integration Test Course",
    "roles": "Learner",
    "tool_consumer_instance_guid": "ondemand.coursera.org",
    "ext_basiclti_submit": "Launch Endpoint with BasicLTI Data",
    "resource_link_id": "ondemand~xjRuZQwoEei0yArwZLk67A!~Dlcc8",
    "lti_version": "LTI-1p0",
    "lis_person_contact_email_primary": faker.internet.email(),
    "custom_cognitive_class_itl_test_course_user_id": "4c9e172531ee6ec5e6ea4eb4ed398960712560f2",
    "custom_url": "https://s3-api.us-geo.objectstorage.softlayer.net/cf-courses-data/CognitiveClass/ML0101ENv3/labs/ML0101EN-Reg-Simple-Linear-Regression-Co2-py-v1.ipynb",
    "custom_path": "/labs/coursera/ML0101EN/ML0101EN-Reg-Simple-Linear-Regression-Co2-py-v1.ipynb",
    "custom_next": "/tools/jupyterlab/lab/tree/labs/coursera/ML0101EN/ML0101EN-Reg-Simple-Linear-Regression-Co2-py-v1.ipynb",
    "tool_consumer_instance_description": "Coursera",
    "lis_person_name_full": faker.name.findName(),
    "lis_result_sourcedid": "ondemand~94571250daaa2f4b2ed5ce4d7759d766!~xjRuZQwoEei0yArwZLk67A!~Dlcc8!~NKzPpAxEEeis9Q4x0eJ6Wg",
    "lti_message_type": "basic-lti-launch-request",
    "user_id": faker.random.uuid(),
    "tool_consumer_info_version": "1.1",
    "context_id": "ondemand~xjRuZQwoEei0yArwZLk67A",
    "context_label": "cognitive-class-itl-test-course"
  }

  const data = oauth.authorize({
    url: LTI_LAUNCH_URL,
    method: 'POST',
    data: {
      ...test_body,
      oauth_callback: 'about:blank'
    }
  });
  console.log(JSON.stringify(data));
  res.render('index.pug', {
    data,
    launch_url: LTI_LAUNCH_URL
  });
})

app.use('/lti', bodyParser.urlencoded({ extended: false }));
app.use('/lti', bodyParser.json());

app.post('/lti', (req, res) => {
  res.render('lti.pug', {
    headers: JSON.stringify(req.headers, null, 4),
    body: JSON.stringify(req.body, null, 2)
  })
})

const port = PORT || 4000;
app.listen(port, () => console.log(`Listening at localhost:${port}`));
