import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { fetchDocument  } from "tripledoc";

class ElementView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object},
      shape: {type: Object},
      url: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "element view"
    this.debug = true
    this.config = {}
    this.url = ""
    this.shape = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    <a href="${this.url}" target="_blank">${this.url}</a>
    <ul id="proplist">
    <li>click on an item in the list to see the details</li>
    </ul>


    <div ?hidden = "${!this.debug}">
    <hr>
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    shape :
    <pre> ${JSON.stringify(this.shape, undefined, 2)}</pre><br>
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
    this.init()
  }

  shouldUpdate(changedProperties) {
    let app = this
    changedProperties.forEach(async function(oldValue, propName) {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
      if(propName == "url"){
        await app.init()
      }
    });
    return changedProperties.has('url');
  }

  async init(){


    if (this.url != undefined && this.url.length > 0){
      let proplist = this.shadowRoot.getElementById("proplist")
      proplist.innerHTML = "<li>Loading Element</li>"
      const doc = await fetchDocument(this.url);
      /* 2. Read the Subject representing the current user's profile: */
      const subj = doc.getSubject(this.url);
      //  console.log(subj)
      const st = doc.getStatements()
      console.log("statements", st)

      proplist.innerHTML = ""
      st.forEach((item, i) => {
        let li = document.createElement("LI")
        var textnode = document.createTextNode(this.localName(item.subject.id)+" -> "+this.localName(item.predicate.id)+" -> "+this.localName(item.object.id));         // Create a text node
        li.appendChild(textnode);                              // Append the text to <li>
        proplist.appendChild(li);

      });
    }
  }

  localName(strPromise){
    let str = `${strPromise}`
    if (str.charAt(str.length - 1) == '/') {
  str = str.substr(0, str.length - 1);
}
    var ln = str.substring(str.lastIndexOf('#')+1);
    ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
    return ln
  }

  configChanged(config){
    this.config = config
    console.log(this.config)
  }

}

customElements.define('element-view', ElementView);
