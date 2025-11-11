import"./pages-rLHsPmH1.js";import{d as c,a as h}from"./mustang-CoNSrXZd.js";import{i as u,n as p,r as d,a as f,x as m,t as b}from"./state-BhiRui7X.js";var g=Object.defineProperty,v=Object.getOwnPropertyDescriptor,l=(s,r,t,a)=>{for(var e=a>1?void 0:a?v(r,t):r,i=s.length-1,n;i>=0;i--)(n=s[i])&&(e=(a?n(r,t,e):n(e))||e);return a&&e&&g(r,t,e),e};let o=class extends f{constructor(){super(...arguments),this.api="/auth/register",this.redirect="/",this.error=null,this.formData={},this.onSubmit=s=>{if(s.preventDefault(),!this.canSubmit){this.error="Please complete all fields";return}const r={username:this.formData.username,password:this.formData.password};fetch(this.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}).then(t=>{if(t.status!==201)throw new Error("Registration failed");return t.json()}).then(t=>{try{localStorage.setItem("token",t.token);const{first:e,last:i,username:n}=this.formData;localStorage.setItem("profile",JSON.stringify({first:e,last:i,username:n})),fetch("/api/me",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify({first:e,last:i})}).catch(()=>{})}catch{}const a=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:t.token,redirect:this.redirect}]});this.dispatchEvent(a)}).catch(t=>{this.error=t?.message||String(t)})}}get canSubmit(){const{first:s,last:r,username:t,password:a,confirm:e}=this.formData;return!!(this.api&&s&&r&&t&&a&&e&&a===e)}handleChange(s){const r=s.target,t=r?.name,a=r?.value??"";this.formData={...this.formData,[t]:a}}render(){const s=this.formData.password&&this.formData.confirm&&this.formData.password!==this.formData.confirm;return m`
      <form @change=${this.handleChange} @submit=${this.onSubmit}>
        <div class="row">
          <label>
            <span>First Name:</span>
            <input name="first" autocomplete="given-name" />
          </label>
          <label>
            <span>Last Name:</span>
            <input name="last" autocomplete="family-name" />
          </label>
        </div>
        <label>
          <span>Username:</span>
          <input name="username" autocomplete="off" />
        </label>
        <div class="row">
          <label>
            <span>Password:</span>
            <input type="password" name="password" />
          </label>
          <label>
            <span>Confirm Password:</span>
            <input type="password" name="confirm" />
          </label>
        </div>
        ${s?m`<div class="error">Passwords do not match</div>`:null}
        <button type="submit" ?disabled=${!this.canSubmit}>Register</button>
        ${this.error?m`<div class="error">${this.error}</div>`:null}
      </form>
    `}};o.styles=u`
    :host { display: block; }
    form { display: grid; gap: .75rem; }
    label { display: grid; gap: .25rem; }
    input { padding: .5rem .6rem; border: 1px solid var(--color-border,#e5e7eb); border-radius: 8px; }
    button { padding: .6rem 1rem; border-radius: 8px; border: none; background: var(--color-accent,#4f46e5); color: white; font-weight: 600; }
    .row { display: grid; gap: .75rem; grid-template-columns: 1fr 1fr; }
    .error { color: #b91c1c; }
  `;l([p({type:String})],o.prototype,"api",2);l([p({type:String})],o.prototype,"redirect",2);l([d()],o.prototype,"error",2);l([d()],o.prototype,"formData",2);o=l([b("register-form")],o);c({"mu-auth":h.Provider});
