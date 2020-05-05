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
  const parentDiv = createRef<HTMLDivElement>();
  const maestroRef = useRef<MaestroIFrameSDK>();
  useEffect(() => {
    maestroRef.current = new MaestroIFrameSDK({
      element: parentDiv.current,
      slug: 'umg-2',
      urlOverride: `http://localhost.maestro.io:4000`,
    });
    maestroRef.current!.on(EventType.REQUEST_LOGIN, () => {
      // @ts-ignore
      maestroRef.current!.login({
        email: 'jbanks@yahoo.com',
        // test jwt here
        name: 'jacob',
        service: 'umg',
        thirdPartyAccountId: 'testId',
      });
    });

    // render the maestro platform
    maestroRef.current.render();
  });

  // create event handlers for the login and logout events to dispatch maestro login and logout events
  const handleLoginClick = () => {
    const { current: maestro } = maestroRef;
    maestro!.dispatchEvent(requestLoginEvent);
  };

  const style = { '--aspect-ratio': '16/9' };
  return (
    <>
      <div className='App' style={style as any}>
        <div ref={parentDiv} id='test' className='maestro-iframe-container'/>
      </div>
      <div className='login'>
        {/* create elements to dispatch events */}
        <button onClick={handleLoginClick}>Click me to Dispatch Logins</button>
      </div>
    </>
  );
}

export default hot(App);
