import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class IndicateursView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      indicateurs: {type: Array}
    };
  }

  constructor() {
    super();
    this.name = "Indicateurs"
    this.indicateurs = [{name: "Nombre d'inscrits", value: 3}, {name: "Temps réponse support", value: 4, unite: "j" }]
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid border border-info rounded mt-3">
    <h4>Indicateurs <i class="fas fa-plus-circle"></i></h4>
    <div style="max-height:30vh; width:100%; overflow: auto">
    <ul class="list-group">
    ${this.indicateurs.map((i) =>
      html`
      <li class="list-group-item">
      ${i.name} (${i.unite})
      <span class="badge badge-primary badge-pill">${i.value}</span>
      </li>
      `
    )}
    </ul>
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

customElements.define('indicateurs-view', IndicateursView);
