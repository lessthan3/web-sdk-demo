# Maestro Iframe SDK Demo
## Demonstration of the Maestro Iframe SDK 

# Getting Started

## Prerequisites
### Run the following scripts 
```javascript 
Yarn 
Yarn Build
``` 
### After these commannds you are ready to start the demo, which features a small React App with the I think you should use an `@maestro_io/iframe-sdk` installed as a dependency. 

## React App Implementation

```tsx
import MaestroIFrameSDK, { EventType } from '@maestro_io/iframe-sdk';
import React, {
  createRef,
  useEffect,
  useRef,
} from 'react';
import { hot } from 'react-hot-loader/root';

// create login and logout events
const requestLoginEvent = new Event('request:login');


function App() {
  // we create a ref to the parent div. 
  const parentDiv = createRef<HTMLDivElement>();

  // We create a ref for the sdk also in order to manage the current state of the sdk. 
  const maestroRef = useRef<MaestroIFrameSDK>();

  // If we try to instantiate the sdk outside of this useEffect then the parent div will not have rendered yet.
  useEffect(() => {
    maestroRef.current = new MaestroIFrameSDK({
      // SDK details here
      element: parentDiv.current,
      slug: 'site slug'/'optional channel slug',
    });

    /* 
     Since, we impoted the Event Type Enum so we can pass that here for the login event. 
    */
    maestroRef.current!.on
    (EventType.REQUEST_LOGIN, () => {
      maestroRef.current!.login({
        // pass account information here
      });
    });

    // render the maestro platform
    maestroRef.current.render();
  });

  /* 
     You can create event handlers for the login and logout events to dispatch maestro login and logout events
  */

  const handleLoginClick = () => {
    const { current: maestro } = maestroRef;
    maestro!.dispatchEvent(requestLoginEvent);
  };

  const style = { '--aspect-ratio': '16/9' };

  return (
    <>
      <div className='App' style={style as any}>

       {
         /* 
         Don't forget to pass the parent div the ref you created above 
         */
       }

        <div ref={parentDiv} id='test' className='maestro-iframe-container'/>
      </div>
      <div className='login'>

        {/* create elements to dispatch events */}

        <button onClick={handleLoginClick}>Click me to Dispatch Logins</button>
      </div>
    </>
  );
}
```
### This is the the implmentation of the React app included in this repository. Notice that you can dispatch events to the `@maestro_io/iframe-sdk` by creating a new `request:login` event. The Maestro platform, however, also lissens for `request:login` events throuhgout the platform and bubbles those events to the `@maestro_io/iframe-sdk` too. 

## Start the App
```javascript 
Yarn Start
``` 
