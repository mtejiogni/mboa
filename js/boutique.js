localStorage.removeItem("panier");
/*
===================================
DECLARATION DES VARIABLES
====================================
*/
let DATAS_PRODUITS= null;
const produits= document.querySelector("#produits");
const nb_articles= document.querySelector("#nb_articles");
const btn_panier= document.querySelector("#btn_panier");
const modal_commande= document.querySelector("#modal_commande");
const liste_produits= document.querySelector("#liste_produits");
const total_commande= document.querySelector("#total_commande");
const btn_valider= document.querySelector("#btn_valider");
const confirmation= document.querySelector("#confirmation");



/*
===================================
QUELQUES FONCTIONS UTILES
====================================
*/

// Chargement des produits depuis le ficher json
async function chargerProduits() {
    try {
        const response= await fetch("data/produits.json");

        if(!response.ok) {
            throw new Error("Fichier data/produits.json introuvable");
        }

        const datas= await response.json();
        return datas;
    }
    catch(erreur) {
        console.error(erreur);
        produits.innerHTML= `
            <p class="danger">
                Impossible de charger les produits.
            </p>
        `;
    }
}

// Afficher les produits
function afficherProduits(liste) {
    if(liste == null || liste.length == 0) {
        produits.innerHTML= `
            <p class="message">
                <i class="fa-solid fa-magnifying-glass"></i>
                Aucun produit trouvé.
            </p>
        `;
    }
    else {
        produits.innerHTML= "";
        for(let i= 0; i< liste.length; i++) {
            const produit= liste[i];
            const html= `
                <div class="produit">
                    <div class="produit_icon" data-action="detail" data-id="${produit.id}">
                        <i class="${produit.icon}"></i>
                    </div>
                    <div class="produit_texte">
                        <span class="produit_categorie">${produit.categorie}</span>
                        <h3 data-action="detail" data-id="${produit.id}">${produit.nom}</h3>
                        <p class="produit_unite">${produit.unite}</p>
                        <p class="produit_prix">${produit.prix} FCFA</p>
                        <div class="produit_footer">
                            <div class="produit_qte" data-stock="${produit.stock}">
                                <span data-action="moins" data-id="${produit.id}">-</span>
                                <b class="produit_qtecommande">1</b>
                                <span data-action="plus" data-id="${produit.id}">+</span>
                            </div>
                            <button data-action="ajouter" data-id="${produit.id}">
                                <i class="fa-solid fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            produits.innerHTML += html;
        }
    }
}

// Retrouve un produit à partir de son id
function rechercheProduit(id, liste) {
    return liste.find(function (val) {
        return val.id == id
    });
}


// Supprime un produit d'une liste a partir de son id
function supprimerProduit(id, liste) {
    return liste.filter(function (val) {
        return val.id != id
    });
}



// Initialiser le panier
function initPanier() {
    const panier= localStorage.getItem("panier");
    liste_produits.innerHTML= "";

    if(panier != null) {
        nb_articles.classList.remove('hide');
        let liste= JSON.parse(panier);
        nb_articles.textContent= liste.length;

        let total= 0;
        for(let i= 0; i< liste.length; i++) {
            const produit= liste[i];
            liste_produits.innerHTML += `
                <tr data-id="${produit.id}" class="ligne_produit">
                    <td>${produit.nom}</td>
                    <td>${produit.prix}</td>
                    <td>${produit.qte}</td>
                    <td>${produit.prix * produit.qte}</td>
                    <td class="options">
                        <span data-id="${produit.id}" class="delete">
                            <i class="fa fa-trash"></i>
                        </span>
                    </td>
                </tr>
            `;
            total= total + (produit.prix * produit.qte);
        }
        total_commande.textContent= `TOTAL : ${total} FCFA`;
    }
    else {
        nb_articles.textContent= 0;
        nb_articles.classList.add('hide');
    }
}


// Ajouter un produit dans le panier
function ajoutProduitPanier(produit) {
    const panier= localStorage.getItem("panier");

    if(panier != null) {
        let liste= JSON.parse(panier);
        let data= rechercheProduit(produit.id, liste);
        if(data == null) {
            liste.push(produit);
            localStorage.setItem("panier", JSON.stringify(liste));
        }
        else {
            alert("Ce produit se trouve déjà dans le panier.");
        }
    }
    else {
        let liste= [produit];
        localStorage.setItem("panier", JSON.stringify(liste));
    }

    initPanier();
}



// Supprimer un produit dans le panier
function supprimerProduitPanier(id) {
    const panier = localStorage.getItem("panier");
    if (panier == null) { return; }

    let liste = JSON.parse(panier);
    liste = supprimerProduit(id, liste);

    console.log(liste);

    if (liste.length == 0) {
        localStorage.removeItem("panier");
    }
    else {
        localStorage.setItem("panier", JSON.stringify(liste));
    }

    initPanier();
}







/*
===================================
CHARGEMENT DES PRODUITS
====================================
*/
async function initBoutique() {
    DATAS_PRODUITS= await chargerProduits();
    console.log(DATAS_PRODUITS);
    afficherProduits(DATAS_PRODUITS);
}
initBoutique();
initPanier();




/*
===================================
GESTION DES EVENEMENTS
====================================
*/
produits.addEventListener("click", function(e) {
    const element= e.target.closest('[data-action]');
    
    if(element.matches('[data-action="moins"]')) {
        const bloc= element.parentNode.querySelector('b');
        if(parseInt(bloc.textContent) > 1) {
            bloc.textContent= parseInt(bloc.textContent) - 1;
        } 
    }

    if(element.matches('[data-action="plus"]')) {
        const bloc= element.parentNode.querySelector('b');
        const stock= element.parentNode.dataset.stock;
        if(parseInt(bloc.textContent) < stock) {
            bloc.textContent= parseInt(bloc.textContent) + 1;
        } 
    }


    if(element.matches('[data-action="ajouter"]')) {
        const id= element.dataset.id;
        const qte= parseInt(element.parentNode.querySelector(".produit_qtecommande").textContent);
        let produit= rechercheProduit(id, DATAS_PRODUITS);

        if(produit != null) {
            produit.qte= qte;
            ajoutProduitPanier(produit);
        }
        else {
            alert("Ce produit se trouve déjà dans le panier");
        }
    }
});




btn_panier.addEventListener("click", function(e) {
    initPanier();
    if(nb_articles.classList.contains('hide')) {
        alert("Aucun article dans le panier");
    }
    else {
        modal_commande.classList.remove("hide");
    }
});



modal_commande.addEventListener("click", function(e) {
    e.preventDefault();

    if(e.target.closest('#modal_fermer') != null) {
        modal_commande.classList.add("hide");
    }


    if(e.target.closest('.delete') != null) {
        const ligne= e.target.closest('.ligne_produit');
        const id= ligne.dataset.id;
        ligne.remove();
        supprimerProduitPanier(id);
    }


    if(e.target.closest('#btn_valider') != null) {
        confirmation.classList.remove('hide');
        confirmation.textContent= "Votre commande a été validée avec succès";

        setTimeout(function() {
            confirmation.classList.add('hide');
            modal_commande.classList.add("hide");
        }, 5000);
    }
});