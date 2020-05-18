import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class CerclesView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      cercles: {type: Array},
      circlePopHide: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.name = "Cercles"
    this.circlePopHide = true
    this.cercles = ["Marketting", "Formation", "Support", "Ventes", "Developpement", "Intégration", "Exploitation", "Achats" ]
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid border border-info rounded mt-3">
    <h4>Cercles <i class=" btn fas fa-plus-circle" @click="${this.circleOpen}"></i></h4>
    <div style="max-height:30vh; width:100%; overflow: auto">
    <ul class="list-group">
    ${this.cercles.sort().map((c) =>
      html`
      <li class="list-group-item">
      ${c}
      </li>
      `
    )}
    </ul>
    </div>
    
    <pop-view name="CirclePop" parent ="${this.name}" .hide="${this.circlePopHide}">Load popUp</pop-view>
    `;
  }

  circleOpen(){
    this.circlePopHide = !this.circlePopHide
    console.log(this.circlePopHide)
  }


  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    console.log(this.agent)
    this.agent.receive = function(from, message) {
        console.log("messah",message)
      if (message.hasOwnProperty("action")){
        //  console.log(message)
        switch(message.action) {
          case "popupClose":
          app.circlePopHide = true
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

customElements.define('cercles-view', CerclesView);
