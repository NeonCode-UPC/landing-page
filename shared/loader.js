// The page markup is embedded in index.html so it also works when opened with file://.
// Initialize after all component scripts and the page markup have loaded.
if (typeof window.initializeMedicalSmartBox === "function") {
    window.initializeMedicalSmartBox();
}