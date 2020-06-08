import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { fetchDocument  } from "tripledoc";

class ElementView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      url: {type: String},
      elementName: {type: String},
      propListHide: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.name = "element view"
    this.url = ""
    this.elementName = ""
    this.propListHide = true
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    <h3><a href="${this.url}" target="_blank">${this.elementName}</a>
    <button class="btn btn-primary far fa-eye" @click="${this.toggleProplist}"></button></h3>
    <ul id="proplist" class="list-group" ?hidden="${this.propListHide}">
    <!--  <li>click on an item in the list to see the details</li>-->
    </ul>
    `;
  }

  toggleProplist(){
    this.propListHide = !this.propListHide
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
    return changedProperties.has('url') || changedProperties.has('propListHide');
  }

  async init(){
    if (this.url != undefined && this.url.length > 0){
      let proplist = this.shadowRoot.getElementById("proplist")
      proplist.innerHTML = "<li>Loading Element</li>"
      this.elementName = decodeURI(this.url.split("/").slice(-2)[0])

      const doc = await fetchDocument(this.url);
      /* 2. Read the Subject representing the current user's profile: */
      const subj = doc.getSubject(this.url);
      //  console.log(subj)
      const st = doc.getStatements()
      console.log("statements", st)

      proplist.innerHTML = ""
      st.forEach((item, i) => {
        let li = document.createElement("LI")
        li.classList.add('list-group-item');

        if (item.subject.id != this.url){
          let s = document.createElement("SPAN")
          li.appendChild(s);
          var s_text= document.createTextNode(this.localName(item.subject.id)+" -> ");
          s.appendChild(s_text);
        }

        let p = document.createElement("SPAN")
        li.appendChild(p);
        var p_text= document.createTextNode(this.localName(item.predicate.id)+" -> ");
        p.appendChild(p_text);

        let o = document.createElement("SPAN")
        li.appendChild(o);
        var o_text= document.createTextNode(this.localName(item.object.id));

        if (item.object.id.startsWith("http")){
          o_text = document.createElement("A")
          var t = document.createTextNode(this.localName(item.object.id));
          o_text.setAttribute("href", item.object.id);
          o_text.setAttribute("target", "_blank");
          o_text.appendChild(t);
        }
        o.appendChild(o_text);
        
        proplist.appendChild(li);

      });
    }
  }

  localName(strPromise){
    let str = `${strPromise}`
    let ln = ""
    if (str.startsWith('"')) {
      ln = str
    }else{
      if (str.endsWith("/")) str = str.slice(0, -1)
      if(str.endsWith("/index.ttl#this")) str = str.slice(0, -15)
      if(str.endsWith("#me")) str = str.split("/")[2].split('.')[0];
      ln = str.substring(str.lastIndexOf('#')+1);
      ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
    }
    return decodeURI(ln)
  }

}

customElements.define('element-view', ElementView);
