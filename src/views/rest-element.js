import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';



class RestElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Rest"
    this.debug = true
    this.config = {}
    const rest = new SolidRest([
      new SolidLocalStorage(),
      //  new SolidFileStorage()
    ])
    console.log(rest)
    this.runStorage( "/test-folder/test-file.ttl","<> a <#test>." ).then( ()=>{
      this.runRest( "/test-folder/test-file.ttl","<> a <#test>." )
    })
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    Hello <b>${this.name}</b> from app-element
    </div>
    <hr>
    <div id="results"></div>
    <hr>
    <div ?hidden = "${!this.debug}">
    <hr>
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    config :
    <pre> ${JSON.stringify(this.config, undefined, 2)}</pre><br>
    </div>


    `;
  }


  /* This runs using src/localStorage directly
  */
  async runStorage(file,text){
    const storage = new SolidLocalStorage()
    let response = await storage.putResource( file,{body:text} )
    response = await storage.getResource( file )
    this.show(await response)
  }

  /* This runs using src/localStorage via transpiled version of src/rest
  */
  async runRest(file,text){
    file = "app://ls"+file
    const rest = new SolidRest([ new SolidLocalStorage() ])
    let response = await rest.fetch( file,{method:"PUT",body:text} )
    response = await rest.fetch( file )
    this.show(response.status+","+await response.text())
  }

  show(msg){
    let display = this.shadowRoot.getElementById("results")
    display.innerHTML = display.innerHTML + `<p>${msg}</p>`
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

customElements.define('rest-element', RestElement);
