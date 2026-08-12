(() => {
  const NEW_KEY = 'mathDoorCollection.v1';
  const LEGACY_KEY = 'intellectualToysAnimalBook.v1';
  const LEGACY_KEYS = ['intellectualToysAnimalBook','animalBook','animalCollection','intellectualToysAnimals'];

  function normalizeId(value){
    const id=String(value);
    return /^\d{1,3}$/.test(id)?id.padStart(3,'0'):id;
  }
  function normalizeIds(value){
    if(Array.isArray(value)) return value.map(normalizeId);
    if(value&&typeof value==='object') return Object.keys(value).filter(k=>value[k]).map(normalizeId);
    return [];
  }
  function readJson(key){
    try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch(e){return null}
  }
  function readState(){
    const current=readJson(NEW_KEY);
    const state=(current&&typeof current==='object')?current:{animals:[],dinosaurs:[]};
    state.animals=normalizeIds(state.animals);
    state.dinosaurs=normalizeIds(state.dinosaurs);

    const migrated=new Set(state.animals);
    [LEGACY_KEY,...LEGACY_KEYS].forEach(key=>normalizeIds(readJson(key)).forEach(id=>migrated.add(id)));
    state.animals=[...migrated].sort();
    try{localStorage.setItem(NEW_KEY,JSON.stringify(state))}catch(e){}
    return state;
  }
  function acquire(category,id){
    const state=readState();
    if(!state[category]) state[category]=[];
    const set=new Set(state[category].map(normalizeId));
    set.add(normalizeId(id));
    state[category]=[...set].sort();
    try{localStorage.setItem(NEW_KEY,JSON.stringify(state))}catch(e){}
    return state;
  }
  window.MathDoorCollection={readState,acquire,storageKey:NEW_KEY};
})();
