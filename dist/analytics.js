// Public write-only PostHog project token. Never put a personal API key here.
(() => {
  const local = !location.hostname.endsWith('.chatgpt.site');
  let disabled = false;
  try { disabled = localStorage.getItem('nook-analytics-disabled') === 'true'; } catch {}
  const blocked = () => disabled || navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  window.nookTrack = (event, properties = {}) => {
    if (local || blocked()) return;
    try { window.posthog?.capture(event, {app:'nook', ...properties}); } catch {}
  };
  window.nookAnalyticsDisabled = () => blocked();
  window.nookToggleAnalytics = () => {
    disabled = !blocked();
    try {localStorage.setItem('nook-analytics-disabled',String(disabled));} catch {}
    if(disabled) window.posthog?.opt_out_capturing();
    location.reload();
  };
  if (local || blocked()) return;
  // PostHog's asynchronous snippet queues events until the SDK finishes loading.
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],o="init capture register register_once identify reset opt_in_capturing opt_out_capturing has_opted_out_capturing".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('phc_BUmt4umEZevLB2PKmdNmWQWBo244mz46UGaRep99QFkX', {
    api_host:'https://us.i.posthog.com',
    defaults:'2026-08-30',
    autocapture:false,
    capture_pageview:true,
    debug:new URLSearchParams(location.search).has("analytics_debug"),
    capture_pageleave:false,
    disable_session_recording:true,
    disable_surveys:true,
    person_profiles:'never',
    ip:false,
    persistence:'localStorage',
    property_denylist:['$current_url','$referrer','$initial_referrer','$initial_current_url'],
    loaded: ph => {
      // Use the initialized instance; window.posthog can still be the loader queue here.
      ph.register({app:'nook'});
      if (localStorage.getItem('nook-analytics-disabled') === 'false') ph.opt_in_capturing({captureEventName:false});
    }
  });
})();
