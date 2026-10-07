
window.initializeMedicalSmartBox = function () {
  if (window.initI18n) window.initI18n();
  ["Nav", "Hero", "Platform", "Monitoring", "Alerts", "Traceability", "Solutions", "Features", "Videos", "Team", "Stories", "Testimonials", "DataLayer", "HowItWorks", "Plans", "Cta", "Contact", "Footer", "Modals"].forEach(function (name) {
    var initializer = window["init" + name];
    if (typeof initializer === "function") initializer();
  });
  if (window.initTelemetry) window.initTelemetry();
};