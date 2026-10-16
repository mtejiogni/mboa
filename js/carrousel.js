const carrousel= document.querySelector("#carrousel");


/*
=============================
DECLARATION DES DONNEES
=============================
*/
const datas_slides= [
    {
        titre: "Le goût du pays, livré chez vous",
        description: "Epices, cafés, miel, pagnes et soins naturels, sélectionnés auprès des producteurs locaux."
    },
    {
        titre: "Le café des hauts plateaux",
        description: "Arabica et robusta torréfiés avec soin, pour bien commencer chaque journée."
    },
    {
        titre: "Payez par Mobile Money",
        description: "Réglez vos achats par MTN Mobile Money ou Orange Money et faites-vous livrer en 48 heures."
    }
]

carrousel.innerHTML= "";
for(let i= 0; i< datas_slides.length; i++) {
    const data= datas_slides[i];
    carrousel.innerHTML += `
        <div class="slide" style="background-image: url('images/slide${i+1}.jpg');">
            <div class="slide_container">
                <div class="slide_text">
                    <h2>${data.titre}</h2>
                    <p>${data.description}</p>
                    <div class="buttons"> 
                        <a href="#">En Savoir +</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

carrousel.innerHTML += `
    <!-- Boutions d'options du slides -->
    <div class="slide_options">
        <span class="slide_left">
            <i class="fa-solid fa-chevron-left"></i>
        </span>

        <span class="slide_right">
            <i class="fa-solid fa-chevron-right"></i>
        </span>
    </div>
`; 







/*
=============================
DECLARATION DES VARIABLES
=============================
*/
const slides= document.querySelectorAll("#carrousel .slide");
const slide_left= document.querySelector("#carrousel .slide_left");
const slide_right= document.querySelector("#carrousel .slide_right");

// contient l'indice du slide actuellement affiché
let slide_courant= 0;