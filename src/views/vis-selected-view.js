import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class VisSelectedView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      selected: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "VisSelected"
    this.debug = true
    this.selected = {nodes:[], edges: []}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">

    ${this.selected.nodes.map(n =>
      html`- node : ${n}<br>`
    )}
    ${this.selected.edges.map(e =>
      html`- edge : ${e}<br>`
    )}
    </div>

    <div ?hidden = "${!this.debug}">
    <hr>
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    selected :
    <pre>${JSON.stringify(this.selected, undefined, 2)}</pre><br>
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

customElements.define('vis-selected-view', VisSelectedView);
