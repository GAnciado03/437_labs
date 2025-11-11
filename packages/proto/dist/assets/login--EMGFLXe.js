import"./pages-rLHsPmH1.js";import{d as f,a as h}from"./mustang-CoNSrXZd.js";import{i as u,n as m,r as c,a as d,x as p,t as g}from"./state-BhiRui7X.js";var b=Object.defineProperty,y=Object.getOwnPropertyDescriptor,i=(s,e,a,t)=>{for(var r=t>1?void 0:t?y(e,a):e,n=s.length-1,l;n>=0;n--)(l=s[n])&&(r=(t?l(e,a,r):l(r))||r);return t&&r&&b(e,a,r),r};let o=class extends d{constructor(){super(...arguments),this.api="/auth/login",this.redirect="/",this.error=null,this.formData={},this.onSubmit=s=>{s.preventDefault(),this.canSubmit&&fetch(this.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200&&e.status!==201)throw new Error("Login failed");return e.json()}).then(e=>{try{if(localStorage.setItem("token",e.token),this.formData.username){const t=JSON.parse(localStorage.getItem("profile")||"{}");localStorage.setItem("profile",JSON.stringify({...t,username:this.formData.username}))}fetch("/api/me",{headers:{Authorization:`Bearer ${e.token}`}}).then(t=>t.ok?t.json():null).then(t=>{if(t){const r=JSON.parse(localStorage.getItem("profile")||"{}");localStorage.setItem("profile",JSON.stringify({...r,first:t.first,last:t.last}));try{Array.isArray(t.favPlayers)&&localStorage.setItem("favPlayers",JSON.stringify(t.favPlayers)),Array.isArray(t.favTeams)&&localStorage.setItem("favTeams",JSON.stringify(t.favTeams))}catch{}}}).catch(()=>{})}catch{}const a=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:e.token,redirect:this.redirect}]});this.dispatchEvent(a)}).catch(e=>{this.error=e?.message||String(e)})}}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}handleChange(s){const e=s.target,a=e?.name,t=e?.value??"",r=this.formData;switch(a){case"username":this.formData={...r,username:t};break;case"password":this.formData={...r,password:t};break}}render(){return p`
      <form @change=${this.handleChange} @submit=${this.onSubmit}>
        <label>
          <span>Username:</span>
          <input name="username" autocomplete="off" />
        </label>
        <label>
          <span>Password:</span>
          <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
        ${this.error?p`<div class="error">${this.error}</div>`:null}
      </form>
    `}};o.styles=u`
    :host { display: block; }
    form { display: grid; gap: .75rem; }
    label { display: grid; gap: .25rem; }
    input { padding: .5rem .6rem; border: 1px solid var(--color-border,#e5e7eb); border-radius: 8px; }
    button { padding: .6rem .9rem; border-radius: 8px; border: none; background: var(--color-accent,#4f46e5); color: white; font-weight: 600; }
    .error { color: #b91c1c; }
  `;i([m({type:String})],o.prototype,"api",2);i([m({type:String})],o.prototype,"redirect",2);i([c()],o.prototype,"error",2);i([c()],o.prototype,"formData",2);o=i([g("login-form")],o);f({"mu-auth":h.Provider});
