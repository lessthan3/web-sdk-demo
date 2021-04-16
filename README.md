# Maestro Web SDK
This SDK is meant for developers to more easily and programmatically integrate Maestro into their existing sites. Events from Maestro are fired and made available so that your application can handle them in whichever way you deem appropriate. In particular, one of the main objectives of this SDK and the methods contained herein is to streamline authentication so that users never have to log into Maestro directly. In fact, Maestro's login modals are suppressed in favor of you handling those various events.

Integrating as a Provider is a requirement to use the SDK. It is appropriate to use this when you have your own authentication or account system. You will need to register as a Provider within our platform to take advantage of this. See below on how to do so.

## Table of Contents

1.  [Authorization Provider Configuration](#before-you-begin)
2.  [Methods](#methods)
3.  [EventTypes](#event-types)
4.  [Handling Events](#handling-events)
5.  [ViewOptions](#view-options)
6.  [Quick Start Example](#quick-start-example)

# Before you begin: Register as a Provider

<a name="before-you-begin"></a>

#### `api.maestro.io/providers/v1`

To enable authorization from the Maestro Web SDK into the Maestro Platform you need to create a provider configuration.
Make a `POST` request to this api to setup your maestro provider configuration. The request should have the following heders:

```javascript
{
  "x-maestro-client-id": "your-maestro-siteId",
  "x-maestro-developer-key": "maestro-dev-api-key" // generate a key in the Maestro admin develper settings
}
```

The body of the request should contain the following properties.

```json
{
  "applicationId": "semantic-or-unique-id",
  "service": "your-preferred-service-name",
  "siteId": "your-maestro-client-id", // found developer ui tab in Maestro Admin CMS
  "jwtPublicCertOrKey": "public-key-to-verify-jwt-signed-by-private-key"
}
```
This will return a JSON representation of your provider configuration. You will the service property from this response in the Maestro IFrameSDK `login()` method.

```json
{
  "_id": "provider-config-id",
  "jwtPublicCertOrKey": "your-public-key-or-cert",
  "service": "your-service",
  "siteId": "maestro-site-id",
  "created": 123456789,
  "modified": 234567891
}
```

To update your provider configuration in the future, make a `PUT` request to the following route. This request expects updates to what was returned back to you in the `POST` request. Include the same headers as in the `POST` request.

#### `api.maestro.io/providers/v1/:id`

```json 6
{
  "service": "your-preferred-service-name",
  "siteId": "your-maestro-site-id",
  "jwtPublicCertOrKey": "public-key-to-verify-jwt-signed-by-private-key"
}
```
# Methods

<a name="methods"></a>

#### `render(viewOptions?: IViewOptions)`

Renders the maestro platform.

---

#### `on(type: EventType, callback: (data: any) => void)`

Register a listener that fires whenever the event is fired from the Maestro Platform.

---

#### `off(type: EventType, callback: (data: any) => void)`
Remove a listener function previously regestered with the `maestro.on()` method.

---

#### `login({ service: string, name: string, thirdPartyAccountId: string, jwt: string })`

Call this method to complete authentication within the maestro platform. The jwt
value will be used to authenticate the request.

---

#### `logout()`

Call this method to signal the maestro platform to logout the user.

#### `setLocale()`

Call this method to change the locale on the Maestro platform.

#### `setParentHref()`

Call this method to change the parentHref on the Maestro platform.

#### `getUserAccount()`

Call this method to get the user account information of a user logged in to maestro.

# Event Types

<a name="event-types"></a>

#### `SUSCRIPTION_REQUIRED`

This event fires whenever there is a subscription gate in the maestro platform. Regester an event listener with the `maestro.on(EventType.SUBSCRIPTION_REQUIRED || 'subscription_required', listener)` method to handle subscription required events events.

---

#### `REQUEST_LOGIN`

This event fires whenever there is a login required by the maestro platform. Regester an event listener with the `maestro.on(EventType.REQUEST_LOGIN || 'request:login', listener)` method to handle login required events events. Often you will call the `maestro.login()` method in this listener to login users when this event is emitted.

---

#### `REQUEST_LOGOUT`

This event fires whenever there is a logout required by the maestro platform. Regester an event listener with the `maestro.on(EventType.REQUEST_LOGOUT || 'request:logout', listener)` method to handle logout required events events. This event is rarely emmitted, but is emitted anytime a user logs out through the Maestro Platform logout button.

#### `LOCALE_CHANGE`

This event fires whenever a locale change occurs from within the Maestro platform.

#### `CHANNEL_CHANGE`

This event fires whenever a user changes channels within the Maestro platform. The slug the user is navigating too bubbles up with the event too.

# Handling Events

<a name="handling-events"></a>
Events in maestro bubble up from different sources and sometimes contain data too. Every event contains and `eventDetails` property, which contains pertinent information regarding the event.

#### `Event Source`

Every event emitted from the Maestro platform contains the `eventSource` property. This tells you where the event was emitted from in the Maestro platform. This can be used to filter events based on where they are emmitted from within the Maestro platform.

#### `Event Details`

Every event that is emmitted comes with an `eventDetails`
property there you will find relevant information for the event. The `eventSource` can be found here.

# View Options

<a name="view-options"></a>

View Options are optional ways to render the maestro platform in different view formats. Pass the view options object to the `maestro.render(viewOptions?)`
method to enable the supported view options.

#### `IViewOptions`

Here is the interface for the ViewOptions object. We provide an enum for you to import, which allows you to safely set the values of the object properties. If you are not in an environment where you can easily import variables, then you may pass a boolean. In this case `true` enables and `false` disables. If you notice, several of the view options include gate suppression. Gates are a feature of the Maestro platform that allow you to place channels behind a gate.

```typescript
 {
    gdpr?: GDPR.ENABLED | GDPR.DISABLED | boolean;
    loginGate?: LoginGate.ENABLED | LoginGate.DISABLED | boolean;
    passwordGate?: PasswordGate.ENABLED | PasswordGate.DISABLED | boolean;
    subscriptionGate?: SubscriptionGate.ENABLED | SubscriptionGate.DISABLED | boolean;
    theater?: TheaterMode.ENABLED | TheaterMode.DISABLED | boolean;
  }
```

Below is an explanation of how the various View Options affect the Maestro platform.

---

#### `gdpr?: GDPR.ENABLED | GDPR.DISABLED | boolean`

This view option will supress the GDPR modal rendered by maestro. Important Note: regardless of whether or not you suppress the modal, Maestro will automatically collect anonymous user information and, if you authenticate users to us using the login() method, Maestro will collect user information as well. Therefore, we recommend being certain of your choice and handling privacy policy related issues appropriately. This is not legal advice. By default the Maestro platform will render with gdpr enabled.
`maestro.render({ gdpr: GDPR.DISABLED })`

---

#### `loginGate?: LoginGate.ENABLED | LoginGate.DISABLED | boolean`

This view option suppresses login gates regardless of the authentication state of the user. If present in the render method, than any login gated channel will not be rendered. This is usefui if you wish to gate a channel and perform your own gating independent of the Maestro platform. By default the Maestro platform will
render with loginGate enabled.
`maestro.render({ loginGate: LoginGate.DISABLED })`

---

#### `passwordGate?: PasswordGate.ENABLED | PasswordGate.DISABLED | boolean`

This view option suppresses password gates regardless of whether there is a password gate on the channel. By default the Maestro platform will render with passwordGate enabled.

`maestro.render({ passwordGate: PasswordGate.DISABLED })`

---

#### `theater?: TheaterMode.ENABLED | TheaterMode.DISABLED | boolean`

This view option renders the Maestro platform at the given slug in theater mode. By default the Maestro platform will render with theater mode disabled.

`maestro.render(theater: TheaterMode.ENABLED)`

### The Maestro Iframe Element
The render method of the sdk creates an Iframe element and appends it to the DOM. 
The following attributes are applied to the element. 

```javascript
    maestroIframe.allowFullscreen = true;
    maestroIframe.frameBorder = '0';
    maestroIframe.marginHeight = '0';
    maestroIframe.marginWidth = '0';
    maestroIframe.width = '100%';
    maestroIframe.height = '100%';
    maestroIframe.className = 'Maestro-Iframe';
    maestroIframe.id = 'Embedded-Maestro-Iframe';
    maestroIframe.allow = 'camera; microphone; document-domain';
    maestroIframe.allowPaymentRequest = true;
    maestroIframe.src = <your-maestro-instance>;
```
### Constructor Function Parameters

```javascript
{
    element: HTMLElement,
    component?: string; // pass in panels-mobile to only render maestro mobile panels
    slug: string; // provided by Maestro,
    locale?: string;
    platform?: string; // used for some maestro-web-validation Ex: mobile_embebedded
    env?: string; //used to point to different maestro environments
}
```

### Quick Start Example

<a name="quick-start-example"></a>

```html
<!-- create the element where the embedded platform will render -->
<div id="my-embedded-maestro-platform" />
<script src="path-to-MaestroIFrameSDK-script"></script>
<script>
  // This example assumes you hae another script tag above. But the same steps apply to if you were importing the sdk into a react component.
  import MaestroIFrameSDK, {
    EventType,
    GDPR, // these are optional enums that allow you to set how Maestro renders. See render method below for example
    SubscriptionGate,
    LoginGate,
    PasswordGate,
    TheaterMode,
  } from '@maestro_io/iframe-sdk'

  const maestro = new MaestroIFrameSDK({
    element: document.getElementById("my-embedded-maestro-platform"),
    component?: string; // pass in panels-mobile to only render maestro mobile panels
    slug: 'my-site-slug/optional-channel-slug' // provided by Maestro,
    locale?: // optionally initialize the Maestro Platform in a specific locale. The default is en.
    platform?: // used for some maestro-web-validation Ex: mobile_embebedded
    env?: //used to point to different environments
  });

  // add your event listeners
  maestro.on(EventType.REQUEST_LOGIN ||'request:login', () => {
    // perform your login request
    authenticateUser().then((account) => {
      // pass account data to maestro to complete login
      maestro.login({
        name: account.Name,
        service: 'my-service-name', // use the service property returned when you registered as a provider
        thirdPartyAccountId: account.Id, // your internal account id
        jwt: account.verificationToken,
      });
    })
  });

  maestro.on(EventType.REQUEST_LOGOUT, (account) => {
    // perform your logout
    deauthenticateUser(account.thirdPartyAccountId);
    maestro.logout();
  });

  // render the platform inside the SDK
  maestro.render({ gdpr: GDPR.DISABLED, theater: TheaterMode.ENABLED });
</script>
```
