import React from 'react';
import loadable from '@loadable/component';
import LoadingIcon from './LoadingIcon';

const Loading = (props) => {
  if (props.error) {
    return (
      <div>
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else if (props.timedOut) {
    return (
      <div>
        Taking a long time... <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else if (props.pastDelay) {
    return <LoadingIcon show={true} />;
  } else {
    return null;
  }
};

// Using Loadable is simple. All you need to do is pass in a function which loads
// your component and a "Loading" component to show while your component loads.
export const Nav = loadable(() => import('../../components/Nav/Nav'), {
  fallback: Loading({
    pastDelay: true,
    error: false,
    timedOut: false
  })
});

export const Home = loadable(() => import('../../pages/Home/Home'), {
  fallback: Loading({
    pastDelay: true,
    error: false,
    timedOut: false
  })
});

export const Song = loadable(() => import('../../pages/Song/Song'), {
  fallback: Loading({
    pastDelay: true,
    error: false,
    timedOut: false
  })
});

export const About = loadable(() => import('../../pages/About/About'), {
  fallback: Loading({
    pastDelay: true,
    error: false,
    timedOut: false
  })
});

export const Login = loadable(() => import('../../pages/Login/Login'), {
  fallback: Loading({
    pastDelay: true,
    error: false,
    timedOut: false
  })
});

export const NotFound = loadable(() => import('../../pages/NotFound/NotFound'), {
  fallback: Loading({
    pastDelay: true,
    error: false,
    timedOut: false
  })
});
