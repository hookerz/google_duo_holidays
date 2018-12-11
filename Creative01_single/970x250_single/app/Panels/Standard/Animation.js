"use strict";
import {smoothify, patchChromeSVG} from "display-browser-quirks";
import bowser from "bowser";
function ctaOverHandler(e) {
	TweenMax.to('#ctaShape', .2, { fill: "#174ea6", ease: Power3.easeOut });
    console.log('collapsed cta over')
}

function ctaOutHandler(e) {
	TweenMax.to('#ctaShape', .2, { fill: "#1a73e8", ease: Power3.easeOut });
    console.log('collapsed cta out')
}

function bind() {
    document.querySelector('.cta').addEventListener('mouseover', ctaOverHandler);
    document.querySelector('.cta').addEventListener('mouseout', ctaOutHandler);
    document.querySelector('.cta').addEventListener('click', ctaOutHandler);
}

export function animateIn() {
    //smoothify(document.querySelectorAll('div'));
    //patchChromeSVG (document.querySelectorAll('svg path,svg circ,svg rect, svg g'));
    document.body.style.opacity = 1;
    let content = document.querySelector('.content');
    let startHandler = function (e) {
		bind();
        console.log('Standard animateIn START');
    };
    let completeHandler = function (e) {
        bind();
        console.log('Standard animateIn COMPLETE');
    };
        console.log('!!! BROWSER CHECK', bowser.name, bowser.safari, parseFloat(bowser.version));
    if (bowser.safari === true && parseFloat(bowser.version) >= 12) {
        console.log("!!!!! safari timing hack");
        window.addEventListener('blur', function () {
            console.log("!!!!! Timing Hack Engaged");
            TweenMax.ticker.useRAF(false);
//    TweenMax.ticker.fps(60);
            TweenLite.lagSmoothing(0);
        });
    }
	


        
		


    let tl = new TimelineMax({
        id: 'StandardRootTimeline',
        onStart: startHandler,
        onComplete: completeHandler,
    });
    window.endframe = function () {
        tl.seek(15)
    };
	tl.add([
       TweenMax.to(content, 1, {opacity: 1})
    ], 0);
//    Main Animation
	tl.add([
       TweenMax.staggerFrom("#copy01_ln01, #copy01_ln02, #copy01_ln03", 2, { y: 40, ease: Power4.easeOut }, 0.25),
	   TweenMax.staggerFrom("#copy01_ln01, #copy01_ln02, #copy01_ln03", 1, { autoAlpha: 0, ease: Power4.easeInOut }, 0.25),
	   TweenMax.from("#ctaSVG", 2, { y: 10, autoAlpha: 0, delay: 1.25, ease: Power4.easeOut }),
	   
	   TweenMax.fromTo("#phone_container", 7, {transformPerspective: 600, rotationX:10, rotationY:20, x: 9, rotationZ:0}, {x: 0, rotationY: -20, rotationX: 4, ease: Power4.easeOut }),
	   TweenMax.fromTo("#phone_edge", 7, {x: -3, y: 2}, {x: 3, y: 0, ease: Power4.easeOut }),
	   TweenMax.fromTo("#phone_shine", 6, {x: -50, y: -20, rotation: 25, autoAlpha: 0.15}, {x: 40, y: -20, autoAlpha: 0.08, ease: Power4.easeOut }),
	   
	   TweenMax.from("#snowflake01", 7, { rotation: 150, y: -100, delay: 0.2, autoAlpha: 0, ease: Power4.easeOut }),
	   TweenMax.from("#snowflake02", 7, { rotation: -100, y: -50, delay: 1, autoAlpha: 0, ease: Power4.easeOut }),
	   TweenMax.from("#snowflake03", 7, { rotation: 150, y: -100, autoAlpha: 0, ease: Power4.easeOut }),
	   
//    Makes CTA clickable
	   TweenMax.from(".cta", 0.1, { x: 1000, delay: 1, ease: Power4.easeOut }),
    ], 0);
	return tl;
	}

