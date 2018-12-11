let border = document.getElementById('background-border');
let wrapper = document.getElementById('ad-root-wrapper');
let root = document.getElementById('adRoot');

export function animateExpand() {
  let tl = new TimelineMax({});
  tl.add([
    TweenMax.set(border, {className: "size-expanded"}),
    TweenMax.set(wrapper, {className: "wrapper-expanded"}),
    TweenMax.set(root, {className: "size-expanded"})
  ]);
  return tl;
}



export function animateCollapse() {
  let tl = new TimelineMax({});
  tl.add([
    TweenMax.set(border, {className: "size-collapsed"}),
    TweenMax.set(wrapper, {className: "wrapper-collapsed"}),
    TweenMax.set(root, {className: "size-collapsed"})
  ]);
  return tl;
}

