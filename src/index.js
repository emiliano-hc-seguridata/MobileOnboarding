require("babel-core/register");
require("babel-polyfill");
let onBoarding;
let session;

const container = document.getElementById("camera-container");

function createOnBoarding() {
  const apiURL = "https://demo-api.incodesmile.com/";
  const apiKey = "570c70d1693636fdc200713415ebc3973afbdf19";
  return window.OnBoarding.create({
    apiKey: apiKey,
    apiURL: apiURL,
    lang: "es"
  });
}

function createSession() {
  return onBoarding.createSession("ALL");
}

function showError() {
  alert("Some error");
}

function renderFrontTutorial() {
  onBoarding.renderFrontTutorial(container, {
    onSuccess: renderFrontIDCamera,
    token: session
  });
}

function renderFrontIDCamera() {
  onBoarding.renderCamera("front", container, {
    onSuccess: renderBackIDCamera,
    onError: showError,
    token: session,
    numberOfTries: -1
  });
}

function renderBackIDCamera() {
  onBoarding.renderCamera("back", container, {
    onSuccess: processId,
    onError: showError,
    token: session,
    numberOfTries: -1
  });
}

function processId() {
  container.innerHTML = "<p>Loading...</p>";
  onBoarding.processId({ token: session.token }).then(() => {
    container.innerHTML = "";
    renderSelfieCamera();
  });
}

function renderSelfieCamera() {
  onBoarding.renderCamera("selfie", container, {
    onSuccess: () => {
      container.innerHTML = "<p>Success!<p>";
    },
    onError: showError,
    token: session,
    numberOfTries: 3
  });
}

async function app() {
  onBoarding = createOnBoarding(); // initialize the instance
  await onBoarding.warmup();
  const _session = await createSession();
  session = _session;
  renderFrontTutorial(); // render and start autodetect of the front ID camera
}
app();
