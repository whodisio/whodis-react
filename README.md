# whodis-react

React hooks and components for secure, best practices authentication in seconds

![ci_on_commit](https://github.com/whodisio/whodis-react/workflows/ci_on_commit/badge.svg)
![deploy_on_tag](https://github.com/whodisio/whodis-react/workflows/deploy_on_tag/badge.svg)

# usage

### install

```sh
npm install --save whodis-react
```

### add the authentication provider to your app

```tsx
  <AuthenticationProvider directoryUuid={'__YOUR_DIR_UUID__'} clientUuid={'__YOUR_CLIENT_UUID__'}>
    {...}
  <AuthenticationProvider />
```

_see [whodis-cli](https://github.com/whodisio/whodis-cli) to create an account and generate a directoryUuid and clientUuid_

### check if a user is signed in

```tsx
import { useAuthentication } from 'whodis-react';

// in a component, declaratively, with a hook
const { authenticated } = useAuthentication();
```

_see also `getAuthentication` for imperative access to that data_

### get the user id

```tsx
import { useAuthentication } from 'whodis-react';

// in a component, declaratively, with a hook
const { claims } = useAuthentication();
const userId = claims?.sub; // claims are only defined if user is authenticated; sub = userId
```

_see also `getAuthentication` for imperative access to that data_

### signup or login, using confirmation code challenge

```tsx
import { useConfirmationCodeChallenge } from 'whodis-react';

expose Login = () => {
  const {
    askConfirmationCodeChallenge,
    answerConfirmationCodeChallenge,
    challengeHasBeenAsked,
  } = useConfirmationCodeChallenge();

  // if not already asked, get their email and ask the confirmation challenge (i.e., send them an email with a conf code)
  if (!challengeHasBeenAsked) {
    return (
      <AskForEmail onSubmit={(email) => askConfirmationCodeChallenge({
        goal: ChallengeGoal.LOGIN,
        contactMethod: { type: ContactMethodType.EMAIL, address: email },
      })}>
    )
  }

  // if challenge has been asked, then ask them for the answer
  return (
    <AskForConfirmationCode onSubmit={(code) => answerConfirmationCodeChallenge({
      answer: code
    })}>
  )
}
```

### send the token to the backend on api calls

```ts
const url = `anysubdomain.yourdomain.com/...`; // <- must be "same-site" as the website (i.e., domains must be same, subdomains can vary)
await fetch(url, {
  method: 'POST',
  credentials: 'same-origin', // <- required in order to send the authorization token from cookie storage (the raw auth token in client-side-rendering, safe from the XSS vulnerabilities of the client)
  headers: {
    authorization: await getAuthorizationHeader(), // <- required in order to send the authorization token from local storage (anti-csrf token in client-side-rendering, the raw auth token in server-side-rendering)
  },
  body: JSON.stringify(event),
});
```

# nuances

### cookie based authentication -vs- local development

Cookies are used in the web environment because they are the only way to securely store an auth token in a browser.

- `HTTPOnly` flag prevents javascript from accessing the cookie, protecting the token against XSS attacks.
- `Secure` flag prevents the token from being sent without HTTPS encryption, protecting the token against MITM attacks.
- `Same-Site` flag (+ additional server side validation) prevents the token from being sent from _any_ website, protecting the token against CSRF attacks.

So, using a cookie is a fundamental requirement of securing an auth token in the browser. However, browsers have a lot of rules setup around cookies in order to protect users. There are two that affect us in local development specifically.

##### 1. website must be `same-site` in order for a browser to set and send a cookie

Browsers protect the user by making sure that the cookie is intended for the website it is sent to - and that the cookie is only sent to the intended website. These are critical to the security of cookies - but do add some extra complexity to working with cookies in local development. Specifically:

- if the domain of the cookie does not match the domain of the website that the cookie was sent to, the browser will not set it.
- if the domain of the api that the website is contacting does not match the domain of the cookie, the browser will not send it.
- if the domain of the api that the website is contacting does not match the domain of the website, the browser will not send the cookie.

In order to solve for this for local development, while still making sure that `development` and `production` environments are as similar as possible, you can ask your local computer's DNS to forward requests from `localhost.yourdomain.com` to `localhost`.

For example, on UNIX machines, if your website is `yourdomain.com`, [add the following line](https://unix.stackexchange.com/a/421500/77522) to `/etc/hosts` to access your site from `localhost.yourdomain.com`:

```
127.0.0.1       localhost.yourdomain.com
```

##### 2. website must be served over HTTPS in order for the browser to send the cookie

Browsers support a `secure` flag on cookies which eliminates the potential of man-in-the-middle (MITM) attacks. When this flag is set on a cookie, the cookie will not be sent to a server over HTTP - nor will the cookie be sent from a website served over HTTP.

In order to solve this for local development, while still making sure that `development` and `production` environments are as similar as possible, you can serve your website on localhost through HTTPS.

For example, on UNIX machines, if your website is `yourdomain.com` you can easily generate a self signed certificate for `localhost.yourdomain.com` [with the following](https://letsencrypt.org/docs/certificates-for-localhost/):

```sh
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost.yourdomain.com' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost.yourdomain.com\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost.yourdomain.com\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

### server side rendering

Special consideration is to support server-side rendering frameworks, like Next.JS.

The auth-token is not accessible from the browser's storage mechanisms (e.g., localStorage, cookieStorage) when in server-side-rendering. Therefore, we have to load the token securely into your app's context from the headers of the request payload your server gets.

To do that, this library exposes the `loadAuthenticationFromSSRReq` method.

For example, generically:

```ts
import { loadAuthenticationFromSSRReq } from 'whodis-react';

// ... somewhere with access to `req` ...
loadAuthenticationFromSSRReq({ req });
```

For example, for Next.JS specifically:

```ts
import { loadAuthenticationFromSSRReq } from 'whodis-react';

export const getServerSideProps = async ({ req }) => {
  loadAuthenticationFromSSRReq({ req });
};
```
