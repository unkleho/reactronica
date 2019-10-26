import * as React from 'react';
import ReactGA from 'react-ga';
import { useRouter } from 'next/router';

declare global {
  interface Window {
    GA_INITIALIZED: boolean;
  }
}

const useAnalytics = () => {
  const router = useRouter();
  const url = router.asPath;

  React.useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }

    logPageView();
  }, [url]);
};

export const initGA = () => {
  if (process.env.GOOGLE_ANALYTICS_ID) {
    // console.log('GA init');
    ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID);
  }
};

export const logPageView = () => {
  if (process.env.GOOGLE_ANALYTICS_ID) {
    ReactGA.set({ page: window.location.pathname + window.location.search });
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
};

export const logEvent = (category = '', action = '', label = '') => {
  if (process.env.GOOGLE_ANALYTICS_ID) {
    if (category && action && label) {
      ReactGA.event({ category, action, label });
    }
  }
};

export const logException = (description = '', fatal = false) => {
  if (process.env.GOOGLE_ANALYTICS_ID) {
    if (description) {
      ReactGA.exception({ description, fatal });
    }
  }
};

export default useAnalytics;
