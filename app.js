const express = require('express');

const lti = require('ims-lti');

// MemoryStore shouldn't be used in production. Timestamps must be valid within a 5 minute grace period.
const nonceStore = new lti.Stores.MemoryStore();
const router = express.Router();

require('dotenv').config();

const {
  LTI_CLIENT_KEY,
  LTI_CLIENT_SECRET,
  LTI_LAUNCH_URL,
  PORT,
} = process.env;

const app = express();

app.set('view engine', 'pug');

router.post('/', async (req, res, next) => {
    const oauthReqest = req.body;
  
    const consumer_key = oauthReqest.oauth_consumer_key;
    const consumer_secret = LTI_CONSUMER_SECRET;
  
    const provider = new lti.Provider(consumer_key, consumer_secret, nonceStore, lti.HMAC_SHA1);
  
    provider.valid_request(req, (err, isValid) => {
      if (err) {
        return next(err);
      }
      if (isValid) {
        // All LTI parameters are stored in provider.body
        const {
          custom_skillup_param: skillup_param,
          resource_link_id: ltiResourceLinkId,
          lis_person_name_full: full_name,
          lis_person_contact_email_primary: learner_email
        } = provider.body;
  
        res.render('success.pug', {
          full_name,
          learner_email
        });
      } else {
        return next(err);
      }
    });
})

const port = PORT || 4000;
app.listen(port, () => console.log(`Listening at localhost:${port}`));
