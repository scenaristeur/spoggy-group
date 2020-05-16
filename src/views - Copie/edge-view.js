import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class EdgeView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      edge: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Edge"
    this.debug = false
    this.edge = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    ${Object.entries(this.edge).map(([key, value], i) =>
      html`
      <div class="input-group mb-3">
      <div class="input-group-prepend">
      <span class="input-group-text" id="${key}">${key}</span>
      </div>
      <input type="text"   class="form-control" placeholder="${key}" aria-label="${key}"
      aria-describedby="${key}"
      key="${key}"
      .value="${value}"
      @change="${this.change}">
      </div>
      `
    )}
    <hr>
    </div>


    <div ?hidden = "${!this.debug}">
    <hr>
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    edge :
    <pre> ${JSON.stringify(this.edge, undefined, 2)}</pre><br>
    </div>


    `;
  }

  change(e){
    let key = e.target.getAttribute("key")
    let value = e.target.value.trim()
  //  console.log("change",key, value)
    this.edge[key] = value
    console.log(this.edge)
    this.agent.send("Vis", {action: "edgeUpdate", edge: this.edge})
  }

  /*  input(e){
  <!--  @input="${this.input}"-->
  let key = e.target.getAttribute("key")
  let value = e.target.value.trim()
  console.log("input",key, value)
  console.log(this.node)
}*/

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

customElements.define('edge-view', EdgeView);
