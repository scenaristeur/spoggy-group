import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class CercleView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Cercle"
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
    <b>Une structure organique</b><br>
    https://labdsurlholacracy.com/bande-dessinee-holacracy#page-146-147<br>


En holacratie, on appelle Cercle l'unité structurelle de base.
Ce n'est pas un groupe de personnes, c'est une entité structurelle de base, une cellule vivante<br>
Chaque cercle a une membrane différenciant l'intérieur et l'extérieur et permettant l'échange.<br>
Chaque cercle reste aligné vers la raison d'être de l'organisation. Il est autonome
en terme de gouvernance, mais pas en terme de directionnalité. Dans le corps humain, une celule non alignée est appelée une cellule cancéreuse.<br>
Holarchie : structure naturelle de tous les corps vivants.<br>
Chaque niveau est appelé HOLON.<br>
Super-Cercle = cercle général de l'organisation. et sous-cercles, (Cercle formation, marketting...)<br>
Dans chaque cercle, on distingue des <b>rôles opérationnels définis en gouvernance</b> et
<b>des rôles structurels</b> qui n'ont pas vocation à effectuer de travail opérationnel.<br>
 <b>4 rôles structurels pour chaque cercle :</b><br>
 - facilitateur : election intra-cercle<br>
 - secretaire : election intra-cercle<br>
 - 1er Lien : affecté à une personne par le 1er Lien du SuperCercle<br>
 - 2nd Lien : election intra-cercle : Quand une tension émerge dans un sous cercle qui dépasse l'autorité de celui-ci, le 2nd lien s'empare de la tension
 et la remonte au SuperCercle pour la traiter, soit directement avec les rôles du SuperCercle,
 soit en l'apportant en réunion de triage ou de gouvernance du SuperCercle dont il est membre à part entière.
 Il porte la raison d'être de tout le sous-cercle lorsqu'il est dans le SuperCercle.<br>
<br>
Le 2nd lien est seulement un lien. <br>
Le 1er Lien est un lien ET un rôle à part entière. Le rôle de premier Lien est le plus proche de celui qu'on appelait "manager/chef".<br>
Le 1er Lien traite des redevabilité familières : Affecter les personnes aux rôles, allouer les ressources financières, définir les indicateurs et les affecter aux rôles,
coacher les personnes pour développer les compétences dans leurs rôles,
indiquer les priorités relatives du moment, et "Définir les stratégies"...<br>
Le 1er lien amène également les tensions provenant du SuperCercle qui concerne le sous-cercle
(vu comme un seul rôle du point de vue du SuperCercle) dans le sous-cercle.<br>
Pour l'être humain qui investit ce rôle de 1er Lien, il ne s'agit pas d'y passer plus de 10% de son temps.
L'être humain concerné est aussi affecté à d'autres rôles en fonction de ses compétences.<br>
https://labdsurlholacracy.com/bande-dessinee-holacracy#page-160-161<br>
En ce sens, vu du SuperCercle, Luc remplit tout le rôle "Coaching" (Un cercle est un rôle)<br>
Dans le sous-cercle "Coaching", Luc est le premier Lien et a probablement d'autres rôle opérationnels.
Mais en tant que 1er Lien, il n'a aucune activité opérationnelle.<br>
Il tient l'espace, il gère la membrane du cercle, il s'assure de la fluidité du travail au sein du cercle,
de la bonne adéquation des personnes au rôles et de la meilleure affectation des ressources. Tout cela au service du travail qui est à faire
pour que le cercle manifeste sa mission et remplisse ses redevabilités.<br>
Lorsqu'une activité est requise dans le Cercle par l'organisation et n'est pas encore définie dans la gouvernace, le 1er Lien la prend en charge.<br>
Il amène la tension en réunion de gouvernance pour apporter de la clarté.<br>
Le 1er Lien gère l'espace entre les rôles au sein de la membrane du cercle.
Il contribue ainsi activement à la différenciation continue du sous-cercle.
Il s'agit de différencier l'organisation et remembrer les rôles (c'est une
 des redevabilités du 1er Lien) Cette évolution constante est le signe de la
 vitalité de l'organisation. Lors des réunions de gouvernance,
 le 1er Lien créé et modifie les rôles en utilisant la raison d'être
 les domaines et les redevabilités.<br>
<br>



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

customElements.define('cercle-view', CercleView);
