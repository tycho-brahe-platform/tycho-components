const ACTIVE_CORPUS = '@Tycho:corpus';
const TOUR_AUTO_OPEN = '@Tycho:tourAutoOpen';

function getActiveCorpus() {
  return localStorage.getItem(ACTIVE_CORPUS);
}

function setActiveCorpus(corpus: string) {
  localStorage.setItem(ACTIVE_CORPUS, corpus);
}

function removeActiveCorpus() {
  localStorage.removeItem(ACTIVE_CORPUS);
}

function getTourAutoOpen(): boolean {
  return localStorage.getItem(TOUR_AUTO_OPEN) === 'true';
}

function setTourAutoOpen(value: boolean) {
  localStorage.setItem(TOUR_AUTO_OPEN, String(value));
}

function removeTourAutoOpen() {
  localStorage.removeItem(TOUR_AUTO_OPEN);
}

const Storage = {
  getActiveCorpus,
  setActiveCorpus,
  removeActiveCorpus,
  getTourAutoOpen,
  setTourAutoOpen,
  removeTourAutoOpen,
};

export default Storage;
