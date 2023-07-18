# whodis-react

React hooks and components for secure, best practices authentication in seconds

Supports both react-browser and react-native

![ci_on_commit](https://github.com/whodisio/whodis-react/workflows/ci_on_commit/badge.svg)
![deploy_on_tag](https://github.com/whodisio/whodis-react/workflows/deploy_on_tag/badge.svg)

# usage

### install

```sh
npm install --save whodis-react
```

### choose your storage mechanism

if you're running this *in the browser*
```sh
npm install --save whodis-react-storage-browser
```
```ts
import { storage } from 'whodis-react-storage-browser';
```

if you're running this *on native devices*
```sh
npm install --save whodis-react-storage-native
```
```ts
```

and if you're using react-native web, you'll want both 🙂
```ts
import { storage as browserStorage } from 'whodis-react-storage-browser';
import { storage as nativeStorage } from 'whodis-react-storage-native';

const storage = environment.runtime.platform === 'native' ? nativeStorage : browserStorage;
```


### add the authentication provider to your app

```tsx
import { storage } from 'whodis-react-storage-browser'; // !: if you're running in reac

  <AuthenticationProvider
    storage={storage}
    directoryUuid={'__YOUR_DIR_UUID__'}
    clientUuid={'__YOUR_CLIENT_UUID__'}>
    {...}
  <AuthenticationProvider />
```

_see [whodis-cli](https://github.com/whodisio/whodis-cli) to create an account and generate a directoryUuid and clientUuid_

### check if a user is signed in

```tsx
import { useAuthenticationClaims } from 'whodis-react';

// in a component, declaratively, with a hook
const claims = useAuthenticationClaims();
```

_see also `getAuthenticationClaims` for imperative access to that data_

### get the user id

```tsx
import { useAuthenticationClaims } from 'whodis-react';

// in a component, declaratively, with a hook
const claims = useAuthenticationClaims();
const userId = claims?.sub; // claims are only defined if user is authenticated; sub = userId
```

_see also `getAuthenticationClaims` for imperative access to that data_

### signup or login, using confirmation code challenge

```tsx
import { useConfirmationCodeChallenge } from 'whodis-react';

expose Login = () => {
  const {
    askConfirmationCodeChallenge,
    answerConfirmationCodeChallenge,
    challengeHasBeenAsked,
  } = useConfirmationCodeChallenge({ storage });

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
import { getAuthorizationHeader } from 'whodis-react';

const url = `anysubdomain.yourdomain.com/...`; // <- must be "same-site" as the website (i.e., domains must be same, subdomains can vary)
await fetch(url, {
  method: 'POST',
  credentials: 'same-origin', // <- required in order to send the authorization token from cookie storage (the raw auth token in client-side-rendering, safe from the XSS vulnerabilities of the client)
  headers: {
    authorization: await getAuthorizationHeader({ storage }), // <- required in order to send the authorization token from local storage (anti-csrf token in client-side-rendering, the raw auth token in server-side-rendering)
  },
  body: JSON.stringify(event),
});
```

### log a user out

```ts
import { forgetAuthenticationToken } from 'whodis-react';

await forgetAuthenticationToken({ storage }); // log the user out by forgetting their authentication token
```

# nuances

### browser storage

please see the documentation for [whodis-react-storage-browser](https://github.com/whodisio/whodis-react-storage-browser) to learn about nuances with
- cookie based authentication -vs- local development
- server side rendering
