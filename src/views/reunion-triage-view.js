import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class ReunionTriageView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Reunion Triage"
    this.debug = true
    this.config = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    Hello <b>${this.name}</b> from app-element
    </div>


    <div ?hidden = "${!this.debug}">

En réunion de triage, les acteurs travaille DANS l'organisation
sur les sujets concrets qu'ils doivent faire avancer.<br>
Ce n'est pas pourtant une réunion opérationnelle ordinaire.<br>
Elle ne se substitue pas d'ailleurs aux réunions de travail habituelles.
Elle les complète et le rend plus efficaces.<br>
<br>
C'est un moment spécifique construit autour de quelques concepts clé : <br>
- Projet<br>
- Action<br>
- Triage<br>
- Cockpit<br>
<br>
<br>
<b>PROJET</b><br>
Dans orga classique, un projet est une "aventure" s'étalant sur plusieurs années.
Et personne ne saura jamais dire si elle est vraiment terminée. <br>
En holacracy un projet peut durer quelques jours semaines, mois, mais pas années.
Il se définit par un résultat attendu précis, ce qui permet de savoir à chaque instant si le projet est terminé ou pas.<br>
exemple de projet : "le nouveau système de facturation est en place"<br>
<br>
<b>La définition du projet, c'est un ensemble d'actions pour arriver à un résultat attendu.</b><br>
<br>
<b>ACTION</b><br>
C'est un prochain pas visible physiquement pour faire avancer quelque chose.<br>
Un projet est constitué de plusieurs actions mais on n'est pas obligé de toutes les déterminer à l'avance.<br>
<b>L'important en Holacratie, c'est d'identifier précisement à chaque nouveau pas
la "Prochaine action", celle qui fera avancer le travail.</b><br>
<br>
<b>TRIAGE</b><br>
La réunion de triage répond à un cahier des charges précis: <br>
BUT : remonter les données sur l'activité, synchroniser l'équipe & lever les obstacles qui empêchent le travail d'avancer. <br>
Résultats : prochaines actions & projets. <br>
<br>
Ce n'est pas un espace pour travailler, mais pour fluidifier le travail du cercle e levant tous les obstacles.<br>
 = micro diagnostic aux urgence ou gare de triage où aucun train ne doit rester bloqué.<br>
 <br>
 L'exigence de transparence et de fluidité impose de donner à cette réunion un cadre très précis et un support formalisé : le COCKPIT.<br><br>

 <b>COCKPIT</b><br>
 Chaque équipe partage un cockpit qui présente de façon visuelle et transparente les informations utiles, sous forme de : <br>
 - checklists : il ne suffit pas de savoir qu'il faut faire une chose pour la faire.<br>
 - indicateurs : donner une photographie de l'activité et des tendances. Les différents rôles qui se voient affecter un indicateur le mettent à jour à une fréquence définie.<br>
 - projets : concrets, courts, précis dans le résultat attendu. Chaque projet est affecté à un rôle.<br>
 Le cockpit ainsi constitué soutient les préambules de la réunion de triage.<br>
<br>
<b>PROCESSUS DE LA REUNION DE TRIAGE</b><br>
1. Tour d'inclusion : identique au tour d'inclusion de la réunion de gouvernance.<br>
2. Préambules : On balaye systématiquement les éléments du cockpit<br>
 - checklist? fait? pas fait ? sans commentaire ni justification.
   Pas de contrôle, mais faire face à la réalité sans ménagement<br>
   - indicateurs reportés pour suivre les tendances (nombres d'inscrits sur un programme...)<br>
   - projets : il ne s'agit pas de "faire un point". "possible : rien de nouveau ! ne veut pas dire que l'on a rien fait".<br>
   Un projet a plusieurs stauts possibles : <br>
   -- en cours : une prochaine-action est prévue.<br>
   -- en attente : projet bloqué, en attente de quelque chose d'un autre rôle ou de l'extérieur.<br>
   -- terminé.<br>
   -- reporté, pour plus tard.<br>
   <b>Les préambules donne de la visibilité, permettent la synchronisation, et font remonter les tensions qui vont nourir l'ordre du jour.<br>


3. Etablissement de l'ordre du jour. : même principe que la réunion de gouvernance : tension en 1 ou 2 mots. <br>
4. Traitement point par point.<br>
 "Quelle est la tension et dans quel rôle tu parles ?"<br>
 "Dans quel rôle tu parles et à quel rôle tu t'adresse ? "<br>
->"Quel est ton besoin ?"<br>
-> "Qui a l'autorité sur ce besoin?<br>
-> voir les redevabilités des rôles<br>
-> "Qui est affecté au rôle concerné ?"<br>
-> "Quelle serait la prochaine action à identifier pour ce rôle?"<br>
-> Creation d'un nouveau projet ?<br>
-> secrétaire saisit le nouveau projet ou la prochaine-action.<br>
--> rôle prend en charge le projet.<br>
ou --> bref tour de table pour profiter des idées et points de vue sur ce projet.<br>
ou --> organiser un espace de travail spécifique sur le sujet. "Qui veut participer?"<br>
Si aucun rôle n'est définit pour traiter le point,une prochaine-action sera d'apporter cette tension (création du rôle) en réunion de gouvernance.<br>
<br>
Tous les points sont traités dans le temps de la réunion de triage jusqu'au tour de clôture. le Facilitateur y veille.<br>
Une réunion de triage va vite. Personne ne doit ressortir avec un sujet encore bloquant.
Les personnes absentes peuvent se voir attribuer dans leurs rôles des projets et des actions.<br>
Cette efficacité est sous la responsabilité du facilitateur, rôle primordial.<br>
Mais les réunions de triage vont vite parce qu'elles bénéficient d'une structure sous-jacente extrêmement claire, grace au travail sur la gouvernance :
on sait toujours précisement qui peut et doit traiter quoi.
5. Tour de Clotûre.<br>
<br>
<br>
L'holacratie articule deux systèmes d'autorité : Autocratie & recherche de consensus.<br>
Pour l'execution chaque acteur peut dans le périmètre de ses rôles décider en parfait autocrate parce que c'est le plus rapide.
Et les dérives de l'autocratie en confiant le système de définition des autorités à un processus de gouvernance participatif.<br>
L'intelligence collective est centrée sur l'organisation et pas sur l'execution qu'elle risquerait de freiner.<br>
Quand ce contexte est en place, la réunion de triage peut jouer efficacement son rôle :
synchroniser, fluidifier et dépasser tous les obstacles.<br>




 <br>







    <hr>
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    config :
    <pre> ${JSON.stringify(this.config, undefined, 2)}</pre><br>
    </div>


    `;
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    console.log(this.agent)
    this.agent.receive = function(from, message) {
      //  console.log("messah",message)
      if (message.hasOwnProperty("action")){
        //  console.log(message)
        switch(message.action) {
          case "configChanged":
          app.configChanged(message.config)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  configChanged(config){
    this.config = config
    console.log(this.config)
  }

}

customElements.define('reunion-triage-view', ReunionTriageView);
