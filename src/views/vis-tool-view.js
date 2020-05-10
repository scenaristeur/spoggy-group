import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class VisToolView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      params: {type: Object},
      nodeTypes: {type: Array},
      nodeType: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "VisTool"
    this.debug = false
    this.params = {tool:"addNode", data: {}}
    this.nodeTypes = ["Organization", "People", "Group", "Service", "Role", "Graph"]
    this.nodeType = this.nodeTypes[0]
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container">
    nodeType: ${this.nodeType}
    <div id="editNode" ?hidden=${this.params.tool != "editNode"}>


    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <label class="input-group-text" for="nodeTypeSelect">Node Type</label>
    </div>
    <select id="nodeTypeSelect" class="custom-select"
    @change="${this.nodeTypeChanged}"> <!--multiple-->
    ${this.nodeTypes.map(n =>
      html`<option ?selected="${this.nodeType == n}" value="${n}">${n}</option>`
    )}
    </select>
    </div>

    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="label-label">Label / Name</span>
    </div>
    <input type="text" id="label"
    class="form-control"
    placeholder="Label"
    aria-label="Label"
    aria-describedby="label-label">
    </div>

    <div class="input-group">
    <div class="input-group-prepend">
    <span class="input-group-text">Purpose</span>
    </div>
    <textarea class="form-control"  id="purpose" aria-label="Purpose">
    ${this.params.data.purpose}
    </textarea>
    </div>




    <button class="btn btn-primary" @click="${this.valid}">OK</button>
    <button class="btn btn-primary" @click="${this.reset}">Reset</button>

    </div>

    <div id="addEdge" ?hidden=${this.params.tool != "addEdge"}>
    AE

    <button class="btn btn-primary" @click="${this.valid}">OK</button>
    <button class="btn btn-primary" @click="${this.reset}">Reset</button>
    </div>

    <div id="editEdge" ?hidden=${this.params.tool != "editEdge"}>
    EE

    <button class="btn btn-primary" @click="${this.valid}">OK</button>
    <button class="btn btn-primary" @click="${this.reset}">Reset</button>
    </div>


    </div>

    <div  class="col-sm-4" ?hidden="${!this.debug}">
    <hr>
    debug : ${this.debug}<br>
    params : ${JSON.stringify(this.params)}<br>
    </div>
    `;
  }

  valid(){
    console.log(this.params)
    let data = this.params.data
    data.label = this.shadowRoot.getElementById("label").value.trim()
    data.type = this.nodeType
    console.log(data)
    this.params.callback(data)

    this.params = {tool:"NoTool", data: {}}
  }

  reset(){
    console.log(this.params)

    this.params.callback()
    this.params = {tool:"NoTool", data: {}}
  }





  nodeTypeChanged(e){
    this.nodeType = e.target.value

  }

  changeTool(params){
    console.log(params)
    this.params = params
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
          case "changeTool":
          app.changeTool(message.params)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

}

customElements.define('vis-tool-view', VisToolView);
