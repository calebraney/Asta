import { attr, checkBreakpoints, runSplit, getClipDirection } from '../utilities';

export const scrollIn = function (gsapContext) {
  //animation ID
  const ANIMATION_ID = 'scrollin';
  // selectors
  const ELEMENT = 'data-ix-scrollin';
  // types of scrolling elements (value for scrollin element attribute)
  const HEADING = 'heading';
  const TITLE = 'title';
  const ITEM = 'item';
  const CONTAINER = 'container';
  const STAGGER = 'stagger';
  const RICH_TEXT = 'rich-text';
  const IMAGE_WRAP = 'image-wrap';
  const IMAGE = 'image';
  const LINE = 'line';

  //options
  const SCROLL_TOGGLE_ACTIONS = 'data-ix-scrollin-toggle-actions';
  const SCROLL_SCRUB = 'data-ix-scrollin-scrub';
  const SCROLL_START = 'data-ix-scrollin-start';
  const SCROLL_END = 'data-ix-scrollin-end';
  const CLIP_DIRECTION = 'data-ix-scrollin-direction';
  const SCROLL_STAGGER = 'data-ix-scrollin-stagger';

  // DEFAULTS
  const EASE_SMALL = 0.1;
  const EASE_LARGE = 0.2;
  const DURATION = 0.8;
  const EASE = 'power3.inOut';

  //resuable timeline creation with option attributes for individual customization per element
  const scrollInTL = function (item) {
    // default GSAP options
    const settings = {
      scrub: false,
      toggleActions: 'play none none none',
      start: 'top 90%',
      end: 'top 75%',
    };
    //override settings if an attribute is present and a valid type.
    settings.toggleActions = attr(settings.toggleActions, item.getAttribute(SCROLL_TOGGLE_ACTIONS));
    settings.scrub = attr(settings.scrub, item.getAttribute(SCROLL_SCRUB));
    settings.start = attr(settings.start, item.getAttribute(SCROLL_START));
    settings.end = attr(settings.end, item.getAttribute(SCROLL_END));
    const tl = gsap.timeline({
      defaults: {
        duration: DURATION,
        ease: EASE,
      },
      scrollTrigger: {
        trigger: item,
        start: settings.start,
        end: settings.end,
        toggleActions: settings.toggleActions,
        scrub: settings.scrub,
      },
    });
    return tl;
  };

  //resuable timeline creation with option attributes for individual customization per element
  const defaultTween = function (item, tl, options = {}) {
    const varsFrom = {
      opacity: 0,
      x: '1rem',
      rotateY: 8,
    };
    const varsTo = {
      opacity: 1,
      x: '0rem',
      rotateY: 0,
    };
    //optional adjustments to the tween
    // {stagger: 0.2}
    if (options.stagger) {
      varsTo.stagger = { each: options.stagger, from: 'start' };
    }
    // {stagger: large}
    if (options.stagger === 'small') {
      varsTo.stagger = { each: EASE_SMALL, from: 'start' };
    }
    if (options.stagger === 'large') {
      varsTo.stagger = { each: EASE_LARGE, from: 'start' };
    }
    if (options.move === 'none') {
      varsFrom.x = '0rem';
      varsTo.ease = 'expo.out';
    }
    // putting tween together
    const tween = tl.fromTo(item, varsFrom, varsTo);
    return tween;
  };

  const scrollInHeading = function (item) {
    //check if item is rich text
    if (item.classList.contains('w-richtext')) {
      item = item.firstChild;
    }
    //split the text
    const splitText = runSplit(item);
    if (!splitText) return;
    //set heading to full opacity (check to see if needed)
    // item.style.opacity = 1;
    const tl = scrollInTL(item);
    const tween = defaultTween(splitText.words, tl, { stagger: 'small' });
    //add event calleback to revert text on completion
    tl.eventCallback('onComplete', () => {
      // splitText.revert();
    });
  };

  const scrollInTitle = function (item) {
    //check if item is rich text
    if (item.classList.contains('w-richtext')) {
      item = item.firstChild;
    }
    //split the text
    const splitText = runSplit(item, 'words chars');
    if (!splitText) return;
    //set heading to full opacity (check to see if needed)
    // item.style.opacity = 1;
    const tl = scrollInTL(item);
    const tween = defaultTween(splitText.chars, tl, { stagger: 0.075, move: 'none' });
    //add event calleback to revert text on completion
    tl.eventCallback('onComplete', () => {
      // splitText.revert();
    });
  };

  const scrollInItem = function (item) {
    if (!item) return;
    //check if item is rich text and if it is apply animation to each child
    if (item.classList.contains('w-richtext')) {
      //get the children of the item
      const children = gsap.utils.toArray(item.children);
      if (children.length === 0) return;
      children.forEach((child) => {
        const tl = scrollInTL(child);
        const tween = defaultTween(child, tl);
      });
    } else {
      const tl = scrollInTL(item);
      const tween = defaultTween(item, tl);
    }
  };

  const scrollInImage = function (item) {
    //item is the image wrap for this animation
    if (!item) return;
    //set clip path directions
    const clipStart = getClipDirection('left');
    const clipEnd = getClipDirection('full');
    //create timeline
    const tl = scrollInTL(item);
    tl.fromTo(
      item,
      {
        clipPath: clipStart,
      },
      {
        clipPath: clipEnd,
        duration: 1.2,
      }
    );
  };

  const scrollInLine = function (item) {
    if (!item) return;
    //set clip path directions
    const clipAttr = attr('left', item.getAttribute(CLIP_DIRECTION));
    const clipStart = getClipDirection(clipAttr);
    const clipEnd = getClipDirection('full');
    //create timeline
    const tl = scrollInTL(item);
    tl.fromTo(
      item,
      {
        clipPath: clipStart,
      },
      {
        clipPath: clipEnd,
      }
    );
  };

  const scrollInContainer = function (item) {
    if (!item) return;
    //get the children of the item
    const children = gsap.utils.toArray(item.children);
    if (children.length === 0) return;
    children.forEach((child) => {
      const tl = scrollInTL(child);
      const tween = defaultTween(child, tl);
    });
  };

  const scrollInStagger = function (item) {
    if (!item) return;
    const ease = attr(EASE_LARGE, item.getAttribute(SCROLL_STAGGER));
    // get the children of the item
    const children = gsap.utils.toArray(item.children);
    if (children.length === 0) return;
    const tl = scrollInTL(item);
    const tween = defaultTween(children, tl, { stagger: ease });
  };

  const scrollInRichText = function (item) {
    if (!item) return;
    //get the children of the item
    const children = gsap.utils.toArray(item.children);
    if (children.length === 0) return;
    children.forEach((child) => {
      const childTag = child.tagName;
      //apply the items animation based on the child type
      if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(childTag)) {
        scrollInHeading(child);
      }
      if (childTag === 'FIGURE') {
        scrollInImage(child);
      } else {
        scrollInItem(child);
      }
    });
  };

  //get all elements and apply animations
  const items = gsap.utils.toArray(`[${ELEMENT}]`);
  items.forEach((item) => {
    if (!item) return;
    //check breakpoints and quit function if set on specific breakpoints
    let runOnBreakpoint = checkBreakpoints(item, ANIMATION_ID, gsapContext);
    if (runOnBreakpoint === false) return;
    //find the type of the scrolling animation
    const scrollInType = item.getAttribute(ELEMENT);
    if (scrollInType === TITLE) {
      scrollInTitle(item);
    }
    if (scrollInType === HEADING) {
      scrollInHeading(item);
    }
    if (scrollInType === ITEM) {
      scrollInItem(item);
    }
    if (scrollInType === IMAGE) {
      scrollInImage(item);
    }
    if (scrollInType === LINE) {
      scrollInLine(item);
    }
    if (scrollInType === CONTAINER) {
      scrollInContainer(item);
    }
    if (scrollInType === STAGGER) {
      scrollInStagger(item);
    }
    if (scrollInType === RICH_TEXT) {
      scrollInRichText(item);
    }
  });
};
