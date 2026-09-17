/* ============================================================
   Hero Section Animations & Accessibility Motion Checks
   ============================================================ */
(function(){
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduceMotion){
    document.querySelectorAll(".hero animateMotion").forEach(anim => anim.remove());
  }
})();
