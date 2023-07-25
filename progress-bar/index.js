const scrolledHistories = {};

function printCards(cards, target) {
  const template = document.querySelector("#card-template");

  cards.forEach((card, index) => {
    const clone = template.cloneNode(true);
    clone.dataset.index = index;
    const body = clone.querySelector(".body");
    const title = clone.querySelector("h3");
    const content = clone.querySelector("p");
    
    clone.removeAttribute("id");
    clone.style.display = "block";
    title.textContent = card.title;
    content.textContent = card.body;

    target.appendChild(clone);
  });
}

function handleProgressBar() {
  const observer = new IntersectionObserver(handleIntersect, {
    root: null,
    rootMargin: "0px",
    threshold: [0.5, 1],
  });
  const historyDetailBoxes = document.querySelectorAll(
    ".card"
  );
  const historyDetailHeights = [];
  let gapHeight = 100;
  let dividerHeight = 0;

  historyDetailBoxes.forEach(function(historyDetailBox, index) {
    const boxHeight =
      historyDetailBox.getBoundingClientRect().height + gapHeight;
    historyDetailHeights.push(boxHeight);
    observer.observe(historyDetailBox);

    if (index !== historyDetailBoxes.length - 1) {
      dividerHeight += boxHeight;
    }
  });

  const divider = document.querySelector(
    "section .divider"
  );
  divider.style.height = `${dividerHeight}px`;

  function handleIntersect(entries, observer) {
    entries.forEach(function(entry) {
      const index = Number(entry.target.dataset.index);

      if (entry.intersectionRatio === 1) {
        scrolledHistories[index] = true;
      } else if (scrolledHistories[index]) {
        delete scrolledHistories[index];
      }
    });

    document
      .querySelector(".card .left-point.emphasis")
      ?.classList.remove("emphasis", "active");
    const target = Math.max(...Object.keys(scrolledHistories));

    let calculatedHeight = 0;
    for (let i = 0; i <= target; i++) {
      const activeLeftPoint = document.querySelector(
        `.card[data-index='${i}'] .left-point`
      );
      activeLeftPoint?.classList.add("active");
      calculatedHeight += historyDetailHeights[i];
      console.log(i, );
    }

    const activeLeftPoint = document.querySelector(
      `.card[data-index='${target}'] .left-point`
    );
    activeLeftPoint?.classList.add("active", "emphasis");

    const progressBar = document.querySelector(
      "section .progress-bar"
    );
    progressBar.style.height = calculatedHeight + "px";
  }
}

function init() {
  // make cards item 10
  const cards = [];
  for (let i = 0; i < 10; i++) {
    cards.push({
      title: `title ${i}`,
      body: `body ${i}`,
    });
  }

  printCards(cards, document.querySelector(".cards"));
  handleProgressBar();
}

init();