import MaestroIFrameSDK, { EventType } from '@maestro_io/web-sdk';
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
      slug: 'insert-your-slug'
    });
    
    maestroRef.current!.on(EventType.SUBSCRIPTION_REQUIRED, (event: any) => {
      // add event handler
      console.log(event);
    });

    maestroRef.current!.on(EventType.LOCALE_CHANGE, (event: any) => {
      console.log(event);
    });

    maestroRef.current!.on(EventType.CHANNEL_CHANGE, async (event: any) => {
      console.log(event);
    });

    maestroRef.current!.on(EventType.REQUEST_LOGOUT, (event: any) => {
      console.log(event);
    });

    maestroRef.current!.on(EventType.REQUEST_LOGIN, async (event: any) => {
      // @ts-ignore
      console.log(event);
      const test = await maestroRef.current!.login({
        email: '',
        name: '',
        service: '',
        thirdPartyAccountId: '',
        // tslint:disable-next-line: max-line-length
        jwt: 'insert-jwt'
      });
      console.log(test);
    });

    // render the maestro platform see documentation for view options arg
    // tslint:disable-next-line: max-line-length
    maestroRef.current!.render();
    return () => {
      maestroRef.current!.logout();
    };
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
