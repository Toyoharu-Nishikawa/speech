/*******************************************************************/
/* region_5(P,T,g,u,v,h,s,Cp,w)                                    */
/* Gibbs_5(pai, tau, G0, Gp, Gpp, Gt, Gtt, Gpt)                    */
/*******************************************************************/

// region 5 based on Eq.(32) of IAPWS-IF97
"use strict"

  const R   = 0.461526  //gas constant in in kJ/kgK

  const J = [];
  const an = [];
  const II = [];
  const JJ = [];
  const bn = [];
 
  J[ 1]=  0  ;  an[ 1]=  -0.13179983674201e+2  ;
  J[ 2]=  1  ;  an[ 2]=   0.68540841634434e+1  ;
  J[ 3]= -3  ;  an[ 3]=  -0.24805148933466e-1  ;
  J[ 4]= -2  ;  an[ 4]=   0.36901534980333e+0  ;
  J[ 5]= -1  ;  an[ 5]=  -0.31161318213925e+1  ;
  J[ 6]=  2  ;  an[ 6]=  -0.32961626538917e+0  ;
  
  II[ 1]=  1  ;  JJ[ 1]=  0  ;  bn[ 1]=  -0.12563183589592e-3  ;
  II[ 2]=  1  ;  JJ[ 2]=  1  ;  bn[ 2]=   0.21774678714571e-2  ;
  II[ 3]=  1  ;  JJ[ 3]=  3  ;  bn[ 3]=  -0.45942820899910e-2  ;
  II[ 4]=  2  ;  JJ[ 4]=  9  ;  bn[ 4]=  -0.39724828359569e-5  ;
  II[ 5]=  3  ;  JJ[ 5]=  3  ;  bn[ 5]=   0.12919228289784e-6  ;
 
export function region_5(P, T){
  
  if(P<=0.0 || T<=0.0){
    throw new RangeError("function region5 P<=0 T<=0 in IF97_5.mjs")
  }
  const pai = P;
  const tau = 1000 / T;
  
  const { G0, Gp, Gpp, Gt, Gtt, Gpt} = Gibbs_5(pai, tau)

  const g  = G0 * R * T;
  const u  = (tau * Gt - pai * Gp) * R * T
  const v  = pai * Gp * R * T / (P * 1e+3)
  const h  = tau * Gt * R * T;
  const s  = (tau * Gt - G0) * R;
  const cp = -tau * tau * Gtt * R;
  const tmp = Gp - tau * Gpt
  const tmp2 = tmp * tmp
  const kappa = Gp / (pai * (tmp2 /(tau * tau * Gtt) - Gpp)) 
  const w2 = Gp * Gp / (tmp2 /(tau * tau * Gtt) - Gpp) * R * T * 1e+3
  const w  = w2 <0 ? 0 : Math.sqrt(w2)

  const state = {
    g: g,
    u: u,
    v: v,
    P: P,
    T: T,
    h: h,
    s: s,
    cp: cp,
    w: w,
    k: kappa,
    MM: 5,
  }

  return state 
}


export const Gibbs_5 = (pai, tau) => {
  
  let G0 = 0.0
  let Gp = 0.0
  let Gpp= 0.0
  let Gt = 0.0
  let Gtt= 0.0
  let Gpt= 0.0

  const pai2 = pai*pai
  const tau2 = tau*tau

  const paiPow = []
  const tauPow = []
  const tau2Pow = []
  for(let i=1;i<=5;i++){
    paiPow[i] = Math.pow(pai,II[i])
    tauPow[i] = Math.pow(tau,JJ[i])
  }
  for(let i=1;i<=6;i++){
    tau2Pow[i] = Math.pow(tau,J[i])
  }

  /*first calculate residual part*/
  for(let i=1;i<=5;i++){
    G0 +=  bn[i]*paiPow[i]*tauPow[i]
    Gp +=  bn[i]*II[i]*paiPow[i]/pai*tauPow[i]
  }
  for(let i=4;i<=5;i++){
    Gpp +=  bn[i]*II[i]*(II[i]-1)*paiPow[i]/pai2*tauPow[i]
  }
  for(let i=2;i<=5;i++){
    Gt += bn[i]*paiPow[i]*JJ[i]*tauPow[i]/tau;
    Gpt+= bn[i]*II[i]*paiPow[i]/pai*JJ[i]*tauPow[i]/tau
  }
  for(let i=3;i<=5;i++){
    Gtt += bn[i]*paiPow[i]*JJ[i]*(JJ[i]-1)*tauPow[i]/tau2
  }

  /*second calculate second term of ideal gas part */
  for(let i=1;i<=6;i++){
    G0  +=  an[i]*tau2Pow[i]
    Gt  +=  an[i]*J[i]*tau2Pow[i]/tau
    Gtt +=  an[i]*J[i]*(J[i]-1)*tau2Pow[i]/tau2
  }

  /*finally add first term of ideal gas part*/
  if(pai<=0.0){
    throw new RangeError("function Gibbs_5 pai<=0 in IF97_5.mjs")
  }
  G0  += Math.log(pai)
  Gp  += 1.0/pai
  Gpp -= 1.0/(pai*pai)
  
  const Gibbs = {
    G0 : G0,
    Gp :Gp,
    Gpp:Gpp,
    Gt :Gt,
    Gtt:Gtt,
    Gpt:Gpt,
  }
  return Gibbs 
}
