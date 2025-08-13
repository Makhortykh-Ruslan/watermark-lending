(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
let slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.hasAttribute("data-fls-scrolllock")) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    setTimeout(() => {
      lockPaddingElements.forEach((lockPaddingElement) => {
        lockPaddingElement.style.paddingRight = "";
      });
      document.body.style.paddingRight = "";
      document.documentElement.removeAttribute("data-fls-scrolllock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    });
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.setAttribute("data-fls-scrolllock", "");
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
    const [value, type = "max"] = item.dataset[dataSetValue].split(",");
    return { value, type, item };
  });
  if (media.length === 0) return [];
  const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
  const uniqueQueries = [...new Set(breakpointsArray)];
  return uniqueQueries.map((query) => {
    const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
    const matchMedia = window.matchMedia(mediaQuery);
    const itemsArray = media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType);
    return { itemsArray, matchMedia };
  });
}
function menuInit() {
  document.addEventListener("click", function(e) {
    if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-fls-menu-open");
    }
  });
}
document.querySelector("[data-fls-menu]") ? window.addEventListener("load", menuInit) : null;
document.body.style.paddingRight = "0px";

let resendTimer = null;

const btn = document.querySelector('#button-send-again');
const countdown = document.querySelector('#countdown');

const TIMER_DURATION = 5;

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}

function startTimer() {
  let secondsLeft = TIMER_DURATION || 30;

  countdown.innerText = formatTime(secondsLeft);

  resendTimer = setInterval(() => {
    secondsLeft--;
    countdown.innerText = formatTime(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(resendTimer);
      btn.classList.remove('button--send');
      btn.classList.add('button--apply');

      countdown.innerText = '0:30';
      btn.innerText = 'Send again';
    }
  }, 1000);
}

function stopTimer() {
  const btn = document.querySelector('#button-send-again');
  const countdown = document.querySelector('#countdown');

  clearInterval(resendTimer);
  countdown.textContent = '';
  btn.classList.remove('button--apply');
  btn.classList.add('button--send');

  countdown.innerText = '0:30';
  btn.innerText = 'Send again';
}

async function sendCodeEmail(email) {
  const url = `https://watermarkadder.com/api/Activation/send-code/${email}`;

  try {
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) {
      stopTimer();
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Error sending verification email:', err);
    stopTimer();
    throw err;
  }
}

async function sendVerifyEmail(email, code) {
  const url = `https://watermarkadder.com/api/Activation/verify/${email}/${code}`;

  try {
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) {
      stopTimer();
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Error sending verification email:', err);
    stopTimer();
    throw err;
  }
}

async function requestConfirmPayment(email, plan) {
  const planNumber = plan ? '1' : '2';
  const url = `https://watermarkadder.com/api/Activation/pay/${email}/${planNumber}`;

  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${''}`);
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

function verificationFlow() {
  const buttonEmail = document.querySelector('#button-email');
  const buttonSendAgain = document.querySelector('#button-send-again');

  const emailInput = document.querySelector('#email-input');
  const codeInput = document.querySelector('#code-input');

  if(!buttonEmail || !buttonSendAgain) return;

  emailInput.addEventListener('input', () => {
    const hasValue = Boolean(emailInput.value.trim());

    sessionStorage.setItem('email', JSON.stringify(emailInput.value));
    buttonEmail.classList.toggle('button--apply', hasValue);
    buttonEmail.classList.toggle('button--send', !hasValue);
  });

  codeInput.addEventListener('input', () => {
    const hasValue = Boolean(codeInput.value.trim());
  });

  const handleEmailRequest = () => {
    const email = emailInput.value.trim();

    if (!email) {
      alert('Please enter a valid email address');
      return;
    }

    if(buttonEmail.innerText === 'Send code to email') {
      startTimer();
      buttonEmail.innerText = "Verify email";
      buttonSendAgain.classList.add('button--apply');

      sendCodeEmail(email)
          .then(response => console.log('sendCodeEmail', response));
      return;
    }

    if(!codeInput.value) {
      alert('Please enter a code from email');
      return;
    }


    sendVerifyEmail(email, codeInput.value)
        .then(response => {

          if(response) {
            window.location.href = 'payment.html';
          } else {
            alert('Something went wrong');
          }
        });
  };

  const handleSendAgainEmailRequest = () => {
    const email = emailInput.value.trim();

    if (!email || buttonEmail.innerText === 'Send code to email') {
      alert('Please enter a valid email address');
      return;
    }

    if(buttonSendAgain.innerText !== 'Send again') {
      alert('Please wait')
      return;
    }

    if(buttonSendAgain.innerText === 'Send again') {
      startTimer();
      buttonEmail.innerText = "Verify email";
      buttonSendAgain.classList.add('button--apply');

      sendCodeEmail(email)
          .then(response => console.log('sendCodeEmail', response));
    }
  };

  buttonEmail.addEventListener("click", handleEmailRequest);
  buttonSendAgain.addEventListener('click', handleSendAgainEmailRequest);
}

function downloadingFiles() {
  const windows = document.querySelector('#windows');
  const linux = document.querySelector('#linux');
  const mac = document.querySelector('#mac');

  if(!windows || !mac || !linux) return;

  function filenameFromContentDisposition(header) {
    if (!header) return null;
    const star = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(header);
    if (star) return decodeURIComponent(star[1]);
    const plain = /filename\s*=\s*"([^"]+)"|filename\s*=\s*([^;]+)/i.exec(header);
    return plain ? (plain[1] || plain[2]).trim() : null;
  }

  function filenameFromUrl(url) {
    try {
      const name = new URL(url).pathname.split('/').filter(Boolean).pop();
      return name || null;
    } catch { return null; }
  }

  async function downloadFile(url, { timeoutMs = 30_000 } = {}) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);

    const res = await fetch(url, { method: 'GET', signal: ctrl.signal });
    clearTimeout(t);

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);

    const blob = await res.blob();
    const header = res.headers.get('Content-Disposition');

    const name =
        filenameFromContentDisposition(header) ||
        filenameFromUrl(url) ||
        'download';

    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  }

  windows.addEventListener('click', async () => downloadFile('https://watermarkadder.com/api/Activation/install/windows'))
  linux.addEventListener('click', async () => downloadFile('https://watermarkadder.com/api/Activation/install/linux'))
  mac.addEventListener('click', async () => downloadFile('https://watermarkadder.com/api/Activation/install/mac'))
}

function activatePlan() {
  const annual = document.querySelector('#annual');
  const basic = document.querySelector('#basic');

  if(!annual || !basic) return;

  const selectedPlan = sessionStorage.getItem('selectedPlan');

  if(selectedPlan) {

     if(selectedPlan === '1') {
       annual.checked = true;
     }

    if(selectedPlan === '2') {
      basic.checked = true;
    }
  }

  annual.addEventListener('click', () => sessionStorage.setItem('selectedPlan', '1'))
  basic.addEventListener('click', () => sessionStorage.setItem('selectedPlan', '2'))
}

function confirmPayment() {
  const basicPlan = document.querySelector('#basic-plan');
  const annualPlan = document.querySelector('#annual-plan');
  const emailCard = document.querySelector('#email-card');
  const buttonConfirm = document.querySelector('#confirm');

  if(!basicPlan || !annualPlan || !emailCard || !buttonConfirm) return;

  basicPlan.style.display = 'none';
  annualPlan.style.display = 'none';

  emailCard.innerText = JSON.parse(sessionStorage.getItem('email'));

  const plan = sessionStorage.getItem('plan');

  if(plan === '1') {
    annualPlan.style.display = 'block';
  } else {
    basicPlan.style.display = 'block';
  }

  buttonConfirm.addEventListener('click', async () => {

    if(buttonConfirm.innerText === 'Please wait...') {
      alert('Please wait...');
      return;
    }

    buttonConfirm.innerText = 'Please wait...';
    buttonConfirm.classList.add('button--send');

    requestConfirmPayment(emailCard.innerText, plan).then((response) => {
      buttonConfirm.classList.remove('button--send');
      buttonConfirm.classList.add('button--apply');
      buttonConfirm.innerText = 'Confirm purchase';

      console.log('response', response.url);
      window.open(response.url);
    })
  });
}

activatePlan();
confirmPayment();
verificationFlow();
downloadingFiles();


export {
  slideUp as a,
  dataMediaQueries as d,
  slideToggle as s
};
