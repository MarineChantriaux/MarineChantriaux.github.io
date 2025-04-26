const sheets = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3QTuQ76c803Vb5KvqrkecJUVaeqRNgI-jyHX_4E-yJafqaqWQArde8XbkBv96c9NEuPMDlMuuYsvV/pub?output=csv";
const response = await fetch(sheets);
const csvText = await response.text();

const sanitizeName = (name) => {
  const accentsMap = new Map([ ['á', 'a'], ['à', 'a'], ['â', 'a'], ['ä', 'a'], ['ã', 'a'], ['å', 'a'], ['é', 'e'], ['è', 'e'], ['ê', 'e'], ['ë', 'e'], ['í', 'i'], ['ì', 'i'], ['î', 'i'], ['ï', 'i'], ['ó', 'o'], ['ò', 'o'], ['ô', 'o'], ['ö', 'o'], ['õ', 'o'], ['ø', 'o'], ['ú', 'u'], ['ù', 'u'], ['û', 'u'], ['ü', 'u'], ['ý', 'y'], ['ÿ', 'y'], ['ñ', 'n'], ['ç', 'c'] ]);
  let sanitized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  sanitized = Array.from(sanitized).map(char => accentsMap.get(char) || char).join('');
  return sanitized.replace(/[^A-Za-z0-9_\-]/g, '_');
};



/**
 * Convertit une chaîne CSV en objet JSON en utilisant ES6
 * @param {string} csvString - La chaîne CSV à convertir
 * @returns {Array} - Tableau d'objets représentant les données CSV
 */
const csvToJson = (csvString) => {
  try {
    const lines = [];
    let currentLine = '';
    let insideQuotes = false;
    
    for (let i = 0; i < csvString.length; i++) {
      const char = csvString[i];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
        currentLine += char;
      } else if (char === '\n' && !insideQuotes) {
        lines.push(currentLine);
        currentLine = '';
      } else {
        currentLine += char;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      values.push(currentValue);
      
      const obj = {};
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        value = value.replace(/\r/g, '');

        if (value.includes('\n')) {
          value = value.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
        }
        
        obj[header] = value;
      });
      
      result.push(obj);
    }
    
    return result;
  } catch (error) {
    console.error("Erreur lors de la conversion CSV en JSON:", error);
    return [];
  }
};




// Add an infinite one-direction linear gradient animation to the background
const addInfiniteGradient = () => {
  const style = document.createElement("style");
  style.textContent = `
    body {
      background: linear-gradient(180deg, rgb(255, 242, 177), #ff6483, rgb(255, 242, 177), #ff6483);
      background-size: 100% 300%;
      animation: gradientShift 10s linear infinite;
    }

    @keyframes gradientShift {
      0% { background-position: 50% 0%; }
      50% { background-position: 50% 50%; }
      100% { background-position: 50% 100%; }
    }
  `;
  document.head.appendChild(style);
};

addInfiniteGradient();





let json = csvToJson(csvText);
console.log(json);
json = [...json, ...json, ...json, ...json];




const $projets = document.querySelector(".projets");

// parcourir le json et créer les éléments
json.forEach((item) => {
  const div = document.createElement("div");
  div.classList.add("projet"); /*donner une classe à la div*/
  $projets.appendChild(div);

  

  const img = document.createElement("img");
  img.src = `img/${sanitizeName(item.titre)}.svg`;
  div.appendChild(img);



  // const titre = document.createElement("h1");
  // titre.textContent = item.titre;
  // div.appendChild(titre);

  // // Ensure the parent div has relative positioning
  // div.style.position = "relative";


  // const categories = document.createElement("div");
  // categories.textContent = item.catégories;
  // div.appendChild(categories);

  // const description = document.createElement("p");
  // description.textContent = item.description;
  // div.appendChild(description);

  div.addEventListener("click", () => {
    const header = document.querySelector("header");
    header.classList.add("fixed");

    const projets = document.querySelector(".projets");
    projets.classList.add("fixed");

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    const wrap = document.createElement("div");
    wrap.classList.add("wrap");
    overlay.appendChild(wrap);

    const fiche = document.createElement("div");
    fiche.classList.add("fiche");
    wrap.appendChild(fiche);

    const close = document.createElement("div");
    close.textContent = "×";
    close.classList.add("close");
    overlay.appendChild(close);

    close.addEventListener("click", () => {
      gsap.to(overlay, {opacity: 0, duration: 1, onComplete: () => overlay.remove()});
      header.classList.remove("fixed");
      projets.classList.remove("fixed");
    });


    // const refresh = document.createElement("div");
    // refresh.textContent = "↻";
    // refresh.classList.add("refresh");

    // refresh.addEventListener("click", () => {
    //   location.reload();
    // });


    // // créer une div pour flouter l'arrière-plan du texte
    // const texte = document.createElement("div");
    // texte.classList.add("texte");
    // fiche.appendChild(texte);




    const img = document.createElement("img");
    img.src = `img/${sanitizeName(item.titre)}.svg`;
    img.classList.add("intro");
    fiche.appendChild(img);
    

    const titre = document.createElement("h1");
    titre.textContent = item.titre;
    fiche.appendChild(titre);
    

    const desc = document.createElement("div");
    desc.innerHTML = item.modale;
    desc.classList.add("description");
    fiche.appendChild(desc);
    


    if(item.images !== "") {
      const images = item.images.split(",");
      const gallery = document.createElement("div");
      gallery.classList.add("gallery");
      images.forEach((image) => {
        const ext = image.split('.').pop().toLowerCase();
        if (ext === 'mp4') {
          const video = document.createElement("video");
          video.src = `img/${sanitizeName(item.titre)}/${image}`;
          video.controls = true;
          gallery.appendChild(video);
          video.autoplay = true;
          video.loop = true;
          video.poster = `img/${sanitizeName(item.titre)}/${image.replace('.mp4', '.jpg')}`;
        } else {
          const img = document.createElement("img");
          img.src = `img/${sanitizeName(item.titre)}/${image}`;
          gallery.appendChild(img);
        }
      });
      fiche.appendChild(gallery);
    }
  

    gsap.from(fiche, {opacity: 0, duration: 0.4});
    gsap.from(overlay, {opacity: 0, duration: 0.4});
  });

});



  // gsap.registerPlugin(ScrollTrigger);

  //  gsap.set(".projet", { y: -600});

  // gsap.to(".projet", {
  //   scrollTrigger: {
  //     trigger: ".projets",
  //     start: '10% 0',
  //     end: '20% 30%',
  //     scrub: 1,
  //    markers: true,
  //     toogleActions: "restart pause reverse pause",
  //   },
  //   y:200,
  //   opacity: 1,
  //   rotation:360,
  //   stagger: 2.5,

  // });


        
  gsap.registerPlugin(MotionPathPlugin)  // register the plugin (obligatoire)


  gsap.set('.item', {backgroundColor:(i)=> `hsl(${i*10*2}, 100%, 50%)`}); // pour changer la teinte de chaque carré
  // OU {backgroundColor:'#f00'}); // pour changer la couleur de tous les carrés

  const tlMotion = gsap.timeline(); // puis changer gsap.to(".item",{ etc...}) par tlMotion.to etc...
  tlMotion.to("img", {
      motionPath: {
          // path: "M201 191C47 205.8 3.5 370.5 1 451H950C1041.6 -200.2 866.833 -4 768 175.5C632.8 471.1 491.667 378.333 438 295C423.167 254.167 355 176.2 201 191Z",
            path: `M0 0 H${window.innerWidth-85} V${window.innerHeight-80} H0 Z`, // Dynamically adjusts to fit the screen dimensions
          // autoRotate: true, // pour que les carrés tournent dans le sens du tracé
          alignOrigin: [0.5, 0.5], // pour que les carrés soient bien alignés sur le tracé
          curviness: 2,
          align: "self",
          justify: "self",
          
      },
     
      stagger:{
          each: 1,
          from: "random",
          // amount: 2,
          repeat: -1,
          
      },
      ease: "linear",
      duration: 36,
      
  });

      // Start the animation
      tlMotion.play();

    // Event listener pr recharger auto la page quand on change sa taille
    window.addEventListener("resize", () => {
      location.reload();
    });

    // Add event listeners to stop on hover and resume on mouse leave
    document.querySelectorAll("img").forEach((img) => {
      img.addEventListener("mouseenter", () => {
        gsap.to(tlMotion, { timeScale: 0, duration: 1 });
      });
      img.addEventListener("mouseleave", () => {
        gsap.to(tlMotion, { timeScale: 1, duration: 1 });
      });
      img.addEventListener("mouseleave", () => tlMotion.play());
    });


    

    gsap.registerPlugin(Draggable) 
    // Draggable.create("img");

    // img.addEventListener("drag", () => {
    //   gsap.to(img, { scale: 10, duration: 1 });
    // });
    


    Draggable.create("img", {
      onPress() { // 🟢
        gsap.to(this.target, {
          scale: 2,
          duration: 0.3,
          ease: "power2.out" // retour en douceur
        });
      },
      onRelease() { // 🔴
        gsap.to(this.target, {
          scale: 4,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)" // 🟢 effet rebond
        });
      }
    });


