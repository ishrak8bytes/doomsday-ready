export interface MoviePrerequisite {
  movie_imdb_id: string;      
  prerequisite_imdb_ids: string[]; 
}

export const moviePrerequisites: MoviePrerequisite[] = [
  // ─────────── Phase 1 ───────────
  {
    movie_imdb_id: "tt0371746", // Iron Man (2008)
    prerequisite_imdb_ids: [],
  },
  {
    movie_imdb_id: "tt1228705", // Iron Man 2 (2010)
    prerequisite_imdb_ids: ["tt0371746"], // Iron Man
  },
  {
    movie_imdb_id: "tt0800369", // Thor (2011)
    prerequisite_imdb_ids: ["tt0371746"], // Iron Man (introduces SHIELD/Avengers initiative context)
  },
  {
    movie_imdb_id: "tt0458339", // Captain America: The First Avenger (2011)
    prerequisite_imdb_ids: ["tt0371746"], // Iron Man (Howard Stark / Tesseract context)
  },
  {
    movie_imdb_id: "tt0848228", // The Avengers (2012)
    prerequisite_imdb_ids: ["tt0371746", "tt1228705", "tt0800369", "tt0458339"], // Iron Man, IM2, Thor, Cap 1
  },

  // ─────────── Phase 2 ───────────
  {
    movie_imdb_id: "tt1300854", // Iron Man 3 (2013)
    prerequisite_imdb_ids: ["tt0371746", "tt1228705", "tt0848228"], // Iron Man, IM2, Avengers
  },
  {
    movie_imdb_id: "tt1981115", // Thor: The Dark World (2013)
    prerequisite_imdb_ids: ["tt0800369", "tt0848228"], // Thor, Avengers
  },
  {
    movie_imdb_id: "tt1843866", // Captain America: The Winter Soldier (2014)
    prerequisite_imdb_ids: ["tt0458339", "tt0848228"], // Cap 1, Avengers
  },
  {
    movie_imdb_id: "tt2395427", // Avengers: Age of Ultron (2015)
    prerequisite_imdb_ids: ["tt0371746", "tt1228705", "tt0800369", "tt0458339", "tt0848228", "tt1300854", "tt1981115", "tt1843866"], // all Phase 1 + IM3, TDW, TWS
  },
  {
    movie_imdb_id: "tt0478970", // Ant-Man (2015)
    prerequisite_imdb_ids: ["tt2395427"], // Age of Ultron (Falcon cameo / post-Ultron context)
  },

  // ─────────── Phase 3 ───────────
  {
    movie_imdb_id: "tt3498820", // Captain America: Civil War (2016)
    prerequisite_imdb_ids: ["tt0458339", "tt0848228", "tt1843866", "tt2395427", "tt0478970"], // Cap1, Avengers, TWS, AoU, Ant-Man
  },
  {
    movie_imdb_id: "tt1211837", // Doctor Strange (2016)
    prerequisite_imdb_ids: [], // origin story; stands alone (though set after AoU)
  },
  {
    movie_imdb_id: "tt3501632", // Thor: Ragnarok (2017)
    prerequisite_imdb_ids: ["tt0800369", "tt1981115", "tt0848228", "tt2395427"], // Thor, TDW, Avengers, AoU
  },
  {
    movie_imdb_id: "tt1825683", // Black Panther (2018)
    prerequisite_imdb_ids: ["tt3498820"], // Civil War (T'Challa introduction / father's death)
  },
  {
    movie_imdb_id: "tt4154756", // Avengers: Infinity War (2018)
    prerequisite_imdb_ids: ["tt0371746", "tt1228705", "tt0800369", "tt0458339", "tt0848228", "tt1300854", "tt1981115", "tt1843866", "tt2395427", "tt0478970", "tt3498820", "tt1211837", "tt3501632", "tt1825683"], // basically all prior MCU films
  },
  {
    movie_imdb_id: "tt5095030", // Ant-Man and the Wasp (2018)
    prerequisite_imdb_ids: ["tt0478970", "tt3498820"], // Ant-Man, Civil War
  },
  {
    movie_imdb_id: "tt4154796", // Avengers: Endgame (2019)
    prerequisite_imdb_ids: ["tt4154756", "tt5095030", "tt3498820", "tt3501632", "tt1825683", "tt1211837"], // Infinity War + key setup films (esp. Ant-Man & Wasp for quantum realm)
  },
  {
    movie_imdb_id: "tt9376612", // Shang-Chi (2021)
    prerequisite_imdb_ids: ["tt4154796"], // Endgame (post-Blip setting; Wong/Abomination context)
  },
  {
    movie_imdb_id: "tt9419884", // Doctor Strange in the Multiverse of Madness (2022)
    prerequisite_imdb_ids: ["tt1211837", "tt4154796"], // Doctor Strange, Endgame (plus WandaVision, but that's not in this dataset)
  },
  {
    movie_imdb_id: "tt9114286", // Black Panther: Wakanda Forever (2022)
    prerequisite_imdb_ids: ["tt1825683", "tt4154796"], // Black Panther, Endgame (T'Challa's fate)
  },
  {
    movie_imdb_id: "tt10954600", // Ant-Man and the Wasp: Quantumania (2023)
    prerequisite_imdb_ids: ["tt0478970", "tt5095030", "tt4154796"], // Ant-Man, AM&W, Endgame
  },
  {
    movie_imdb_id: "tt10676048", // The Marvels (2023)
    prerequisite_imdb_ids: ["tt4154796"], // Endgame (Captain Marvel & WandaVision/Ms. Marvel shows not in dataset)
  },
  {
    movie_imdb_id: "tt6263850", // Deadpool & Wolverine (2024)
    prerequisite_imdb_ids: ["tt1431045", "tt5463162", "tt3315342"], // Deadpool, Deadpool 2, Logan
  },
  {
    movie_imdb_id: "tt14513804", // Captain America: Brave New World (2025)
    prerequisite_imdb_ids: ["tt0458339", "tt3498820", "tt4154796"], // Cap 1, Civil War, Endgame (Sam as Cap; Ross)
  },
  {
    movie_imdb_id: "tt20969586", // Thunderbolts* (2025)
    prerequisite_imdb_ids: ["tt3498820", "tt4154796"], // Civil War (Zemo/Black Widow context), Endgame
  },
  {
    movie_imdb_id: "tt10676052", // The Fantastic Four: First Steps (2025)
    prerequisite_imdb_ids: [], // standalone reboot in alternate universe
  },

  // ─────────── X-Men (separate continuity) ───────────
  {
    movie_imdb_id: "tt0120903", // X-Men (2000)
    prerequisite_imdb_ids: [],
  },
  {
    movie_imdb_id: "tt0290334", // X2 (2003)
    prerequisite_imdb_ids: ["tt0120903"], // X-Men
  },
  {
    movie_imdb_id: "tt0376994", // X-Men: The Last Stand (2006)
    prerequisite_imdb_ids: ["tt0120903", "tt0290334"], // X-Men, X2
  },
  {
    movie_imdb_id: "tt1877832", // X-Men: Days of Future Past (2014)
    prerequisite_imdb_ids: ["tt0120903", "tt0290334", "tt0376994"], // original trilogy (soft-reboot bridging)
  },
  {
    movie_imdb_id: "tt3385516", // X-Men: Apocalypse (2016)
    prerequisite_imdb_ids: ["tt1877832"], // Days of Future Past (new timeline)
  },
  {
    movie_imdb_id: "tt6565702", // X-Men: Dark Phoenix (2019)
    prerequisite_imdb_ids: ["tt3385516"], // Apocalypse
  },
  {
    movie_imdb_id: "tt1431045", // Deadpool (2016)
    prerequisite_imdb_ids: [], // standalone (loosely in X-Men universe)
  },
  {
    movie_imdb_id: "tt5463162", // Deadpool 2 (2018)
    prerequisite_imdb_ids: ["tt1431045"], // Deadpool
  },
  {
    movie_imdb_id: "tt3315342", // Logan (2017)
    prerequisite_imdb_ids: ["tt0120903", "tt0290334", "tt0376994", "tt1877832"], // Wolverine's arc across original trilogy + DOFP (loose but useful)
  },
  {
    movie_imdb_id: "tt21357150", // Avengers: Dooms Day
    prerequisite_imdb_ids: ["tt4154796", "tt9419884", "tt10872600", "tt6263850", "tt0848228"], 
  }
];